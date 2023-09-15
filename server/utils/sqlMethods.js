const { Sequelize } = require('sequelize');

const copyFromModel = async function (target) {
    let TargetModel = target.model;
    let associations = target.associations;
    let dbTargetData = await TargetModel.findOne({
        where: target.primaryKey,
        attributes: target.attributes
    });
    let newData = dbTargetData.dataValues;
    let changeKeys = Object.keys(target.changes);
    changeKeys.forEach(key => {
        newData[key] = target.changes[key];
    });
    let dbNewModelData = await TargetModel.create(newData);
    let promises = []
    for (let i = 0; i < associations.length; i++) {
        promises.push(
            new Promise(resolve => {
                let AssociationModel = associations[i].model
                console.log(AssociationModel);
                AssociationModel.findAll({
                    where: associations[i].foreignKey,
                    // where: { experiment_id: 3 },
                    attributes: associations[i].attributes
                })
                    .then(async dbTargetAssociationData => {
                        let key = Object.keys(associations[i].foreignKey)[0];
                        let newAssociations = [];
                        for (let item of dbTargetAssociationData) {
                            let newAssociation = item.dataValues;
                            newAssociation[key] = dbNewModelData[key];
                            newAssociations.push(newAssociation)
                        }
                        await AssociationModel.bulkCreate(newAssociations);
                        resolve();
                    })
            })
        )
    }
    await Promise.allSettled(promises);
    return dbNewModelData;
}

let targets = {
    model: "ExperimentAsset",
    experiment_id: 3,
    changes: {
        asset_id: { 57: 143, 43: 180, 36: 142 },
        iteration_number: 1
    },
    attributes: ['experiment_id']
}

const updateExperimentAssociation = async function (target) {
    let TargetModel = target.model;
    let dbTargetData = await TargetModel.findAll({
        where: {
            experiment_id: target.experiment_id
        },
        attributes: target.attributes
    });
    let changeKeys = Object.keys(target.changes);
    let newData = dbTargetData.map(e => {
        let obj = { ...e.dataValues };
        changeKeys.forEach(key => {
            if (typeof (target.changes[key]) == 'object') {
                if (target.changes[key][e[key]]) {
                    obj[key] = target.changes[key][e[key]]
                }
            } else {
                obj[key] = target.changes[key];
            }
        });
        return obj;
    });
    return await TargetModel.bulkCreate(newData);
}

const getWhere = function (whereInfo, target) {
    let where = {}
    whereInfo.fields.forEach((field, index) => {
        if (field.name.isArray()) {
            where[Sequelize.Op.or] = [];
            field.name.forEach((entry, i) => {
                let value;
                if (whereInfo.inputs[index].type == 'value') {
                    value = whereInfo.inputs[index].value
                } else {
                    value = target[whereInfo.inputs[index].value]
                }
                where[Sequelize.Op.or].push({
                    [entry]: value
                })
            })
        } else {
            if (whereInfo.inputs[index].type == 'value') {
                where[field.name] = whereInfo.inputs[index].value;
            } else {
                where[field.name] = inputs[index];
                value = target[whereInfo.inputs[index].value]
            }
        }
    })
    console.log(where);
    return where;
}

const copyFromMany = async function (target) {
    let TargetModel = target.model;
    let associations = target.associations;
    let dbTargetData = await TargetModel.findAll({
        where: {
            [target.primaryKey]: {
                [Sequelize.Op.in]: target.targets
            }
        },
        attributes: target.attributes
    })
    console.log(dbTargetData);
    let changeKeys = Object.keys(target.changes);
    let newData = dbTargetData.map(e => {
        let obj = { ...e.dataValues };
        changeKeys.forEach(key => {
            obj[key] = target.changes[key];
        });
        return obj
    });
    let dbNewModelData = await TargetModel.bulkCreate(newData);
    let newModelData = dbNewModelData.map(e => e.dataValues);
    let promises = []
    for (let i = 0; i < associations.length; i++) {
        promises.push(
            new Promise(async resolve => {
                let AssociationModel = associations[i].model
                let innerPromises = [];
                let key = Object.keys(associations[i].foreignKey)[0];
                for (let j = 0; j < target.targets.length; j++) {
                    innerPromises.push(
                        new Promise(innerResolve => {
                            AssociationModel.findAll({
                                where: getWhere(target.associations[i].where, newModelData[j]),
                                attributes: associations[i].attributes
                            })
                                .then(async dbTargetAssociationData => {
                                    let newAssociations = [];
                                    for (let item of dbTargetAssociationData) {
                                        let newAssociation = item.dataValues;
                                        newAssociation[key] = dbNewModelData[key];
                                        newAssociations.push(newAssociation)
                                    }
                                    await AssociationModel.bulkCreate(newAssociations);
                                    let innerAssociationPromises = [];
                                    if (target.associations[i].associations) {
                                        for (let innerAssociation of target.associations[i].associations) {
                                            innerAssociationPromises.push(
                                                updateExperimentAssociation(innerAssociation)
                                            )
                                        }
                                    }
                                    await Promise.allSettled(innerAssociationPromises);
                                    innerResolve();
                                })
                        })
                    )
                }
                await Promise.allSettled(innerPromises);
                resolve();
            })
        )
    }
    await Promise.allSettled(promises);
    return dbNewModelData;
}

module.exports = { copyFromModel, copyFromMany, updateExperimentAssociation };