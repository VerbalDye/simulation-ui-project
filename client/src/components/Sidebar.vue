<template>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css">
    <nav id="sidebar-nav">
        <ul>
            <li class="sidebar-header"><router-link :style="{pointerEvents: 'none'}" to="/"><i class="bi bi-speedometer"></i><div class="sidebar-text">Dashboards</div></router-link></li>
            <li class="sidebar-header"><router-link :style="{pointerEvents: 'none'}" to="/departments"><i class="bi bi-buildings-fill"></i><div class="sidebar-text">Departments</div></router-link></li>
            <li class="sidebar-departments-item"><router-link :style="{pointerEvents: 'none'}" to="/departments/manufacturing"><i class="bi bi-stopwatch-fill"></i><div class="sidebar-text">Manufacturing</div></router-link></li>
            <li class="sidebar-departments-item"><router-link :style="{pointerEvents: 'none'}" to="/departments/engineering"><i class="bi bi-gear-fill"></i><div class="sidebar-text">Engineering</div></router-link></li>
            <li class="sidebar-departments-item"><router-link :style="{pointerEvents: 'none'}" to="/departments/maintenance"><i class="bi bi-bandaid-fill"></i><div class="sidebar-text">Maintenance</div></router-link></li>
            <li class="sidebar-departments-item"><router-link :style="{pointerEvents: 'none'}" to="/departments/quality"><i class="bi bi-clipboard2-heart-fill"></i><div class="sidebar-text">Quality</div></router-link></li>
            <li class="sidebar-departments-item"><router-link :style="{pointerEvents: 'none'}" to="/departments/supply-chain"><i class="bi bi-truck"></i><div class="sidebar-text">Supply Chain</div></router-link></li>
            <li class="sidebar-departments-item"><router-link :style="{pointerEvents: 'none'}" to="/departments/safety"><i class="bi bi-cone-striped"></i><div class="sidebar-text">Safety</div></router-link></li>
            <li class="sidebar-departments-item"><router-link :style="{pointerEvents: 'none'}" to="/departments/sales-customer-service"><i class="bi bi-briefcase-fill"></i><div class="sidebar-text">Sales & Customer Service</div></router-link></li>
            <li class="sidebar-departments-item"><router-link :style="{pointerEvents: 'none'}" to="/departments/r-d"><i class="bi bi-moisture"></i><div class="sidebar-text">Reaserch & Development (R&D)</div></router-link></li>
            <li class="sidebar-departments-item"><router-link :style="{pointerEvents: 'none'}" to="/departments/hr"><i class="bi bi-file-person-fill"></i><div class="sidebar-text">Human Resources (HR)</div></router-link></li>
            <li class="sidebar-header"><router-link :style="{pointerEvents: 'none'}" to="/schedules"><i class="bi bi-table"></i><div class="sidebar-text">Schedules</div></router-link></li>
            <li class="sidebar-schedules-item"><router-link :style="{pointerEvents: 'none'}" to="/schedules/production"><i class="bi bi-box2-fill"></i><div class="sidebar-text">Production</div></router-link></li>
            <li class="sidebar-schedules-item"><router-link :style="{pointerEvents: 'none'}" to="/schedules/labor"><i class="bi bi-person-workspace"></i><div class="sidebar-text">Labor</div></router-link></li>
            <li class="sidebar-schedules-item"><router-link :style="{pointerEvents: 'none'}" to="/schedules/maintenance"><i class="bi bi-bandaid-fill"></i><div class="sidebar-text">Maintenance</div></router-link></li>
            <li class="sidebar-header"><router-link to="/experiments"><i class="bi bi-wrench-adjustable"></i><div class="sidebar-text">Experiments</div></router-link></li>
        </ul>
    </nav>
</template>

<script>
export default {
    data() {
        return {
            currentPage: ''
        }
    },
    name: 'Sidebar',
    methods: {
        getCurrentPage() {
            this.currentPage = document.location.pathname;
        },
        formatSidebar() {
            let departmentItems = document.querySelectorAll(".sidebar-departments-item");
            let scheduleItems = document.querySelectorAll(".sidebar-schedules-item");
            let headerItems = document.querySelectorAll(".sidebar-header");
            if(this.currentPage.includes("departments")) {
                departmentItems.forEach(item => {
                    item.style.display = "block";
                })
                scheduleItems.forEach(item => {
                    item.style.display = "none";
                })
            } else if(this.currentPage.includes("schedules")) {
                departmentItems.forEach(item => {
                    item.style.display = "none";
                })
                scheduleItems.forEach(item => {
                    item.style.display = "block";
                })
            } else {
                departmentItems.forEach(item => {
                    item.style.display = "none";
                })
                scheduleItems.forEach(item => {
                    item.style.display = "none";
                })
            }
            let allItems = Array.from(departmentItems).concat(Array.from(scheduleItems), Array.from(headerItems));
            allItems.forEach(item => {
                if (this.currentPage.includes(item.firstChild.pathname) && item.firstChild.pathname != "/") {
                    item.style.backgroundColor = "var(--white)";
                    item.style.color = "var(--tertiary-blue)";
                } else {
                    item.style.backgroundColor = "none";
                    item.style.color = "var(--white)";
                }
            })
        }
    },
    mounted() {
        this.getCurrentPage();
        this.formatSidebar();
    }
}
</script>

<style>
#sidebar-nav {
    height: 100vh;
    border-right: 1px solid var(--black);
    font-size: 18px;
    transition: all 0.4s;
    box-shadow: 3px 0 5px rgba(0, 0, 0, 0.3);
    background-color: var(--tertiary-blue);
    color: var(--white);
    position: sticky;
    top: 0;
}
#sidebar-nav ul {
    list-style-type: none;
}
#sidebar-nav li {
    border-radius: 10px;
    margin: 5px;
}
#sidebar-nav li:hover {
    background-color: rgba(0, 0, 0, 0.2);
}
#sidebar-nav a {
    display: inline-block;
    width: 100%;
    height: 100%;
    padding: 10px;
    text-decoration: none;
    color: inherit;
    white-space: nowrap;
}
#sidebar-nav i {
    margin: 0 10px;
}
#sidebar-nav .sidebar-header {
    font-size: 32px;
}
.sidebar-departments-item, .sidebar-schedules-item {
    display: none;
}
.sidebar-text {
    display: none;
    font-weight: normal;
}
#sidebar-nav:hover .sidebar-text {
    display: inline-block;
}
</style>