import Vue from 'vue';
import VueRouter from 'vue-router';
import HomeComponent from "../components/HomeComponent";
import PageNotFount from "../components/PageNotFount";

Vue.use(VueRouter);
const routes = [
    { path: '/', component: HomeComponent },
    { path: '*', component: PageNotFount }
];
export const router = new VueRouter({
    mode: 'history',
    routes
});