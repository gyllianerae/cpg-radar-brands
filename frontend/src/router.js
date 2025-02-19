// frontend/src/router.js
import { createRouter, createWebHistory } from 'vue-router';
import BrandForm from './components/BrandForm.vue';
import EditBrandForm from './components/EditBrandForm.vue';
import DeleteBrand from './components/DeleteBrand.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: BrandForm, // Start with the form to add a brand
  },
  {
    path: '/edit/:brandId',
    name: 'EditBrand',
    component: EditBrandForm,
    props: true,
  },
  {
    path: '/delete/:brandId',
    name: 'DeleteBrand',
    component: DeleteBrand,
    props: true,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
