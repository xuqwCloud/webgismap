import Vue from 'vue';
import VueRouter from 'vue-router';
import DataVisual from './../pages/DataVisual';
import OneMap from './../pages/OneMap';

Vue.use(VueRouter);

export default new VueRouter({
    routes: [
        {
            path: '/',
            component: DataVisual,
        },
        {
            path: '/onemap',
            component: OneMap,
        },
    ],
    mode: 'history'
});