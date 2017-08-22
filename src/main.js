import Vue from 'vue';
import iView from 'iview';
import VueRouter from 'vue-router';
import Routers from './router';

import Util from './libs/util';
import App from './app.vue';
import 'iview/dist/styles/iview.css';


Vue.use(VueRouter);


Vue.use(iView);



// 路由配置
const RouterConfig = {
    mode: 'history',
    routes: Routers
};
const router = new VueRouter(RouterConfig);

router.beforeEach((to, from, next) => {
    iView.LoadingBar.start();
    Util.title(to.meta.title);

    if (to.matched.some(r => r.meta.requireAuth)) {
        let token =  window.localStorage.getItem('token')
        if (token) {
            next();
        } else {
            next({
                path: '/login',
                query: {redirect: to.fullPath}
            })
        }
    } else {
        next();
    }
});

router.afterEach(() => {
    iView.LoadingBar.finish();
    window.scrollTo(0, 0);
});



new Vue({
    el: '#app',
    router: router,
    render: h => h(App)
});