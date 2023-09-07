<template>
    <div :id="'collapsable-component-' + name" class="collapse-component">
        <div :id="'collapsable-header-' + name" class="flex-between collapsable-header">
            <h3 v-if="heading">{{ title }}</h3>
            <h2 v-else>{{ title }}</h2>
            <button class="collapse-button" @click="handleCollapse"><i
                    class="bi bi-plus-circle-fill" :id="'collapsable-icon-' + name"></i></button>
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
            collapsed: true
        }
    },
    name: 'Collapsable',
    props: ['title', 'name', 'back', 'next', 'defaultOpen', 'heading'],
    emits: [],
    methods: {
        handleCollapse() {
            const iconEl = document.getElementById('collapsable-icon-' + this.name);
            const collapsableEl = document.getElementById('collapsable-' + this.name);
            if (this.collapsed) {
                iconEl.classList.remove("bi-plus-circle-fill");
                iconEl.classList.add("bi-dash-circle-fill");
                collapsableEl.classList.add("open");
                this.collapsed = false;
            } else {
                iconEl.classList.remove("bi-dash-circle-fill");
                iconEl.classList.add("bi-plus-circle-fill");
                collapsableEl.classList.remove("open");
                this.collapsed = true;
            }
        },
        goToCollapsable(targetName) {
            let openCollapsables = document.querySelectorAll(".open");
            let currentTarget = document.getElementById('collapsable-' + targetName);
            openCollapsables.forEach(collapsable => {
                let icon = document.getElementById('collapsable-icon-' + collapsable.id.split('collapsable-')[1])
                icon.classList.remove("bi-dash-circle-fill");
                icon.classList.add("bi-plus-circle-fill");
                collapsable.classList.remove("open");
            });
            while (currentTarget) {
                if (currentTarget.classList.contains("collapsable")) {
                    let currentIcon = document.getElementById('collapsable-icon-' + currentTarget.id.split('collapsable-')[1])
                    currentTarget.classList.add("open");
                    currentIcon.classList.remove("bi-plus-circle-fill");
                    currentIcon.classList.add("bi-dash-circle-fill");
                }
                currentTarget = currentTarget.parentElement;
            }
            let top = document.getElementById('collapsable-component-' + targetName).offsetTop;
            window.scrollTo({ top: top, left: 0, behavior: 'smooth' });
        },
    },
    mounted() {
        this.collapsed = this.defaultOpen && true;
        this.handleCollapse();
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
</style>