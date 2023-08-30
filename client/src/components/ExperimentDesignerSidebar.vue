<template>
    <div id="designer-sidebar">
            <ol>
                <li>Scenario Selection</li>
                <li>Experiment Configuration</li>
                <li>Inputs Definition & Review</li>
                <li>Experiment Parameters</li>
                <li>Simulation Run</li>
                <li>Results Review</li>
                <li>Results Save & Export</li>
            </ol>
        </div>
</template>

<script>
    export default {
        name: "ExperimentDesignerSidebar",
        props: ['currentPage'],
        methods: {
            displayCurrentPage() {
                const sidebarElements = Array.from(document.querySelector('#designer-sidebar ol').children);
                sidebarElements.forEach((element, index) => {
                    if(index < this.currentPage) {
                        element.classList.remove("incomplete");
                        element.classList.remove("current");
                        element.classList.add("complete");
                    } else if (index == this.currentPage) {
                        element.classList.remove("incomplete");
                        element.classList.remove("complete");
                        element.classList.add("current");
                    } else {
                        element.classList.remove("complete");
                        element.classList.remove("current");
                        element.classList.add("incomplete");
                    }
                })
            }
        },
        mounted() {
            this.displayCurrentPage();
        }
    }
</script>

<style>
#designer-sidebar {
    height: 100vh;
    border-right: 1px solid var(--black);
    transition: all 0.4s;
    box-shadow: 3px 0 5px rgba(0, 0, 0, 0.3);
    background-color: var(--secondary-gray);
    z-index: -1;
    position: sticky;
    top: 0;
}

#designer-sidebar ol {
    padding: 20px 10px 20px 50px;
    list-style: none;
    counter-reset: options-counter;
}

#designer-sidebar ol li {
    padding: 10px;
    counter-increment: options-counter;
    position: relative;
    border-radius: 7px;
    text-transform: uppercase;
    font-size: 15px;
}

#designer-sidebar ol li::before {
    content: counter(options-counter);
    position: absolute;
    --size: 28px;
    left: calc(-1 * var(--size) - 5px);
    line-height: var(--size);
    width: var(--size);
    height: var(--size);
    top: 3px;
    border-radius: 50%;
    text-align: center;
}

.complete {
    color: var(--secondary-green);
}

.complete::before {
    color: var(--secondary-gray);
    border: 2px solid var(--secondary-green);
    background-color: var(--secondary-green);
}

.current {
    color: var(--tertiary-blue);
}

.current::before {
    color: var(--secondary-gray);
    border: 2px solid var(--tertiary-blue);
    background-color: var(--tertiary-blue);
}

.incomplete {
    color: var(--tertiary-gray);
}

.incomplete::before {
    color: var(--tertiary-gray);
    border: 2px solid var(--tertiary-gray);
    background-color: rgba(0,0,0,0);
}

</style>