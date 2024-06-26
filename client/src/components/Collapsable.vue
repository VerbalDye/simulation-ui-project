<template>
    <div :id="'collapsable-component-' + name" class="collapse-component">
        <div :id="'collapsable-header-' + name" class="flex-between collapsable-header">
            <div class="flex-left align-center">
            <h3 v-if="heading" class="space">{{ title }}</h3>
            <h2 v-else class="space">{{ title }}</h2>
            <div v-if="tbd" class="tbd">TBD</div>
            </div>
            <button class="collapse-button" @click="handleCollapse"><i class="bi bi-plus-circle-fill"
                    :id="'collapsable-icon-' + name"></i></button>
        </div>
        <div :id="'collapsable-' + name" class="collapsable">
            <slot></slot>
            <div class="flex-right">
                <button v-if="back" @click="goToCollapsable(back)">Back</button>
                <button v-if="next" @click="goToCollapsable(next)">Next</button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            collapsed: true,
            firstRender: true,
        }
    },
    name: 'Collapsable',
    props: ['title', 'name', 'back', 'next', 'defaultOpen', 'heading', 'reset', 'tbd'],
    emits: ['toggle-collapse'],
    methods: {
        handleCollapse() {
            this.collapsed = !this.collapsed;
            this.renderCollapse();
        },
        renderCollapse() {
            const iconEl = document.getElementById('collapsable-icon-' + this.name);
            const collapsableEl = document.getElementById('collapsable-' + this.name);
            if (this.collapsed) {
                iconEl.classList.remove("bi-dash-circle-fill");
                iconEl.classList.add("bi-plus-circle-fill");
                collapsableEl.classList.remove("open");
            } else {
                iconEl.classList.remove("bi-plus-circle-fill");
                iconEl.classList.add("bi-dash-circle-fill");
                collapsableEl.classList.add("open");
            }
        },
        goToCollapsable(targetName) {
            let openCollapsables = document.querySelectorAll(".open");
            let currentTarget = document.getElementById('collapsable-' + targetName);
            openCollapsables.forEach(collapsable => {
                this.handleToggleCollapse(collapsable.id.split('collapsable-')[1], false);
            });
            while (currentTarget) {
                if (currentTarget.classList.contains("collapse-component")) {
                    this.handleToggleCollapse(currentTarget.id.split('collapsable-component-')[1], true);
                }
                currentTarget = currentTarget.parentElement;
            }
            let top = document.getElementById('collapsable-component-' + targetName).offsetTop;
            window.scrollTo({ top: top, left: 0, behavior: 'smooth' });
        },
        handleToggleCollapse(name, open) {
            this.$emit('toggle-collapse', { name: name, open: open });
        },
    },
    mounted() {
        this.collapsed = this.defaultOpen && true;
        this.handleCollapse();
    },
    watch: {
        reset: function (newVal, oldVal) {
            if (this.firstRender) {
                this.firstRender = false;
            } else {
                this.collapsed = !newVal.open;
                this.renderCollapse();
            }
        },
    }
}
</script>

<style>
.collapse-component .collapse-button {
    background-color: transparent;
    color: var(--black);
    padding: 10px;
    margin: 0;
}

.collapse-component .collapse-button:active {
    color: var(--white);
    background-color: var(--secondary-blue);
}

.collapse-component .collapsable-header {
    border-bottom: 1px solid var(--black);
    font-weight: normal;
    padding: 10px;
    align-items: center;
}

.collapse-component .collapsable {
    /* padding: 20px; */
    height: 0px;
    overflow: hidden;
    transition: all 0.5s;
}

/* .collapse-component .collapsed {
    height: 0;
    padding: 0;
} */

.collapse-component .open {
    height: auto;
    padding: 20px;
}

.tbd {
    border: solid 1px var(--black);
    background-color: var(--secondary-blue);
    color: var(--white);
    padding: 8px;
    border-radius: 10px;
}
</style>