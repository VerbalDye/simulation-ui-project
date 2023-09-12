<template>
    <div id="warning-modal">
            <slot></slot>
    </div>
</template>

<script>
export default {
    // data() {
    //     return {}
    // },
    name: 'WarningModal',
    props: ['display'],
    // methods: {
    //     abortLoadProtection() {
    //         let warningEl = document.getElementById('warning-modal');
    //         warningEl.classList.remove("display");
    //     }
    // },
    watch: {
        display: function (newVal, oldVal) {
            let warningEl = document.getElementById('warning-modal');
            if (newVal) {
                warningEl.classList.add("display");
            } else {
                warningEl.classList.remove("display");
            }
        }
    }
}
</script>

<style>
#warning-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    display: none;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 1001;
    background-color: rgba(0, 0, 0, 0.5);
    color: var(--white);
    text-align: center;
}

#warning-modal.display {
    display: flex;
}

</style>