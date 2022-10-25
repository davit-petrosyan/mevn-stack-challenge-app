import Vue from 'vue';
import VueRouter from 'vue-router';
import HomeComponent from "../components/HomeComponent";
import PageNotFound from "../components/PageNotFound";

Vue.use(VueRouter);
const routes = [
    { path: '/', component: HomeComponent },
    { path: '*', component: PageNotFound }
];
export const router = new VueRouter({
    mode: 'history',
    routes
});