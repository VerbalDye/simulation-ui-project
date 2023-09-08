<template>
    <div id="loading-modal">
        <div class="loading-animation">
            <div class="lds-roller">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
        </div>
        <div v-if="showCancelButton" class="abort-info">
            <p>Hmm... Seem like this is taking a long time. If you would like to regain control of the site, click abort
                below. Note: This can cause significant problems for the experiment you are attempting to create. It is
                recommended to restart the experiment creation process if you are forced to abort.</p>
            <button @click="abortLoadProtection">Abort</button>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            showCancelButton: false,
            timeoutID: null
        }
    },
    name: 'LoadingModal',
    props: ['display', 'estimatedLoadingTime'],
    methods: {
        abortLoadProtection() {
            let loadingEl = document.getElementById('loading-modal');
            loadingEl.classList.remove("display");
        }
    },
    watch: {
        display: function (newVal, oldVal) {
            let loadingEl = document.getElementById('loading-modal');
            if (newVal) {
                loadingEl.classList.add("display");
            } else {
                loadingEl.classList.remove("display");
                clearTimeout(this.timeoutID);
                this.showCancelButton = false;
            }
            this.timeoutID = setTimeout(() => {
                this.showCancelButton = true;
            }, this.estimatedLoadingTime);
        }
    }
}
</script>

<style>
#loading-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    display: none;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    background-color: rgba(0, 0, 0, 0.5);
}

.abort-info {
    width: 50vw;
    margin: 20px;
}

.abort-info p {
    color: var(--white);
}

#loading-modal.display {
    display: flex;
}

/* .loading-animation {

} */

#loading-modal .lds-roller {
    display: inline-block;
    position: relative;
    width: 80px;
    height: 80px;
}

#loading-modal .lds-roller div {
    animation: lds-roller 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
    transform-origin: 40px 40px;
}

#loading-modal .lds-roller div:after {
    content: " ";
    display: block;
    position: absolute;
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: var(--white);
    margin: -4px 0 0 -4px;
}

#loading-modal .lds-roller div:nth-child(1) {
    animation-delay: -0.036s;
}

#loading-modal .lds-roller div:nth-child(1):after {
    top: 63px;
    left: 63px;
}

#loading-modal .lds-roller div:nth-child(2) {
    animation-delay: -0.072s;
}

#loading-modal .lds-roller div:nth-child(2):after {
    top: 68px;
    left: 56px;
}

#loading-modal .lds-roller div:nth-child(3) {
    animation-delay: -0.108s;
}

#loading-modal .lds-roller div:nth-child(3):after {
    top: 71px;
    left: 48px;
}

#loading-modal .lds-roller div:nth-child(4) {
    animation-delay: -0.144s;
}

#loading-modal .lds-roller div:nth-child(4):after {
    top: 72px;
    left: 40px;
}

#loading-modal .lds-roller div:nth-child(5) {
    animation-delay: -0.18s;
}

#loading-modal .lds-roller div:nth-child(5):after {
    top: 71px;
    left: 32px;
}

#loading-modal .lds-roller div:nth-child(6) {
    animation-delay: -0.216s;
}

#loading-modal .lds-roller div:nth-child(6):after {
    top: 68px;
    left: 24px;
}

#loading-modal .lds-roller div:nth-child(7) {
    animation-delay: -0.252s;
}

#loading-modal .lds-roller div:nth-child(7):after {
    top: 63px;
    left: 17px;
}

#loading-modal .lds-roller div:nth-child(8) {
    animation-delay: -0.288s;
}

#loading-modal .lds-roller div:nth-child(8):after {
    top: 56px;
    left: 12px;
}

@keyframes lds-roller {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

</style>