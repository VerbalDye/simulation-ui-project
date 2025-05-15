<template>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css">
    <nav id="admin-sidebar-nav">
        <ul>
            <li class="sidebar-header"><router-link to="/admin/equipment"><i class="bi bi-wrench"></i><div class="sidebar-text">Equipment</div></router-link></li>
            <li class="sidebar-header"><router-link to="/admin/account-management"><i class="bi bi-person-fill"></i><div class="sidebar-text">User Management</div></router-link></li>
            <li class="sidebar-header"><router-link to="/admin/process-time"><i class="bi bi-stopwatch-fill"></i><div class="sidebar-text">Processing Times</div></router-link></li>
            <li class="sidebar-header"><router-link to="/admin/job"><i class="bi bi-briefcase-fill"></i><div class="sidebar-text">Job Management</div></router-link></li>
            <li class="sidebar-header"><router-link to="/admin/route-task"><i class="bi bi-bezier2"></i><div class="sidebar-text">Route and Task</div></router-link></li>
            <li class="sidebar-header"><router-link to="/admin/core"><i class="bi bi-tools"></i><div class="sidebar-text">Core</div></router-link></li>
            <li class="sidebar-header"><router-link to="/admin/hours-of-operation"><i class="bi bi-clock-fill"></i><div class="sidebar-text">Hours of Operation</div></router-link></li>
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
        // formatSidebar() {
        //     let departmentItems = document.querySelectorAll(".sidebar-departments-item");
        //     let scheduleItems = document.querySelectorAll(".sidebar-schedules-item");
        //     let headerItems = document.querySelectorAll(".sidebar-header");
        //     if(this.currentPage.includes("departments")) {
        //         departmentItems.forEach(item => {
        //             item.style.display = "block";
        //         })
        //         scheduleItems.forEach(item => {
        //             item.style.display = "none";
        //         })
        //     } else if(this.currentPage.includes("schedules")) {
        //         departmentItems.forEach(item => {
        //             item.style.display = "none";
        //         })
        //         scheduleItems.forEach(item => {
        //             item.style.display = "block";
        //         })
        //     } else {
        //         departmentItems.forEach(item => {
        //             item.style.display = "none";
        //         })
        //         scheduleItems.forEach(item => {
        //             item.style.display = "none";
        //         })
        //     }
        //     let allItems = Array.from(departmentItems).concat(Array.from(scheduleItems), Array.from(headerItems));
        //     allItems.forEach(item => {
        //         if (this.currentPage.includes(item.firstChild.pathname) && item.firstChild.pathname != "/") {
        //             item.style.backgroundColor = "var(--white)";
        //             item.style.color = "var(--tertiary-blue)";
        //         } else {
        //             item.style.backgroundColor = "none";
        //             item.style.color = "var(--white)";
        //         }
        //     })
        // }
    },
    mounted() {
        this.getCurrentPage();
        // this.formatSidebar();
    }
}
</script>

<style>
#admin-sidebar-nav {
    height: 100vh;
    border-right: 1px solid var(--black);
    font-size: 18px;
    transition: all 0.4s;
    box-shadow: 3px 0 5px rgba(0, 0, 0, 0.3);
    background-color: var(--secondary-blue);
    color: var(--white);
    position: sticky;
    top: 0;
}
#admin-sidebar-nav ul {
    list-style-type: none;
}
#admin-sidebar-nav li {
    border-radius: 10px;
    margin: 5px;
}
#admin-sidebar-nav li:hover {
    background-color: rgba(0, 0, 0, 0.2);
}
#admin-sidebar-nav a {
    display: inline-block;
    width: 100%;
    height: 100%;
    padding: 10px;
    text-decoration: none;
    color: inherit;
    white-space: nowrap;
}
#admin-sidebar-nav i {
    margin: 0 10px;
}
#admin-sidebar-nav .sidebar-header {
    font-size: 32px;
}
.sidebar-departments-item, .sidebar-schedules-item {
    display: none;
}
.sidebar-text {
    display: none;
    font-weight: normal;
}
#admin-sidebar-nav:hover .sidebar-text {
    display: inline-block;
}
</style>