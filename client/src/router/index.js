import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '../views/Dashboards.vue'

import auth from '../utils/auth'

const routes = [
  {
    path: '/',
    name: 'dashboard',
    component: DashboardView,
    meta: { requiresAuth: true }
  },
  {
    path: '/welcome',
    name: 'welcome',
    component: () => import('../views/LandingPage.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/create-account',
    name: 'create-account',
    component: () => import('../views/CreateAccount.vue'),
    meta: { requiresAdmin: true }
  },
  {
    path: '/account',
    name: 'account',
    component: () => import('../views/Account.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/equipment',
    name: 'equipment',
    component: () => import('../views/Equipment.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/departments',
    name: 'departments',
    component: () => import('../views/Departments.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/departments/manufacturing',
    name: 'manufacturing',
    component: () => import('../views/Manufacturing.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/departments/engineering',
    name: 'engineering',
    component: () => import('../views/Engineering.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/departments/maintenance',
    name: 'maintenance',
    component: () => import('../views/Maintenance.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/departments/quality',
    name: 'quality',
    component: () => import('../views/Quality.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/departments/supply-chain',
    name: 'supply-chain',
    component: () => import('../views/SupplyChain.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/departments/safety',
    name: 'safety',
    component: () => import('../views/Safety.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/departments/sales-customer-service',
    name: 'sales-customer-service',
    component: () => import('../views/SalesCustomerService.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/departments/r-d',
    name: 'r-d',
    component: () => import('../views/RD.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/departments/hr',
    name: 'hr',
    component: () => import('../views/HumanResources.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/schedules',
    name: 'schedules',
    component: () => import('../views/Schedules.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/schedules/production',
    name: 'production',
    component: () => import('../views/Production.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/schedules/labor',
    name: 'labor',
    component: () => import('../views/Labor.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/schedules/maintenance',
    name: 'maintenance-schedule',
    component: () => import('../views/MaintenanceSchedule.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/experiments',
    name: 'experiments',
    component: () => import('../views/ExperimentLanding.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/experiments/search',
    name: 'experiment-search',
    component: () => import('../views/ExperimentSearch.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/experiments/design',
    name: 'experiment-design',
    component: () => import('../views/ExperimentDesigner.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/experiments/design/scenario',
    name: 'ed-scenario',
    component: () => import('../views/EDScenarioSelector.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/experiments/design/experiment-configuration/:id',
    name: 'ed-experiment-configuration',
    component: () => import('../views/EDExperimentConfiguration.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/experiments/design/inputs/:id',
    name: 'ed-inputs',
    component: () => import('../views/EDInputsReview.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/experiments/design/experiment-parameters/:id',
    name: 'ed-experiment-parameters',
    component: () => import('../views/EDExperimentParameters.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/experiments/design/simulation-start/:id',
    name: 'ed-simulation-start',
    component: () => import('../views/EDSimulationRun.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/experiments/design/results-review/:id',
    name: 'ed-results-review',
    component: () => import('../views/EDResultsReview.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/experiments/design/results-export/:id',
    name: 'ed-results-export',
    component: () => import('../views/EDResultsExport.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/experiments/:id',
    name: 'experiment',
    component: () => import('../views/Experiment.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'page-not-found',
    component: () => import('../views/PageNotFound.vue'),
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from) => {
    if (to.meta.requiresAuth && !auth.isLoggedIn()) {
        console.log(from);
        return {
            path: '/login',
            query: { redirect: encodeURIComponent(to.fullPath) }
        }
    } else if (to.meta.requiresAdmin && !auth.isAdmin()) {
        return {
            path: '/'
        }
    }
})

export default router;
