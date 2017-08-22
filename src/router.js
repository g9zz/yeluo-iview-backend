import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from './app/home/home.vue'
import Test from './app/view/test/test.vue'
import Test2 from './app/view/test/test2.vue'
import Test3 from './app/view/test/test3.vue'
import PostList from './app/view/post/list.vue'
import PostStore from './app/view/post/store.vue'
import UserList from './app/view/user/list.vue'
import NodeList from './app/view/node/index.vue'
import ReplyList from './app/view/reply/index.vue'
import RoleList from './app/view/role/index.vue'
import PermissionList from './app/view/permission/index.vue'

Vue.use(VueRouter)

const routers = [
    {
        path: '/login',
        component: resolve => require(['./app/login/login.vue'], resolve),
    },
    {
        path: '/home',
        name: 'home',
        meta: {
            requireAuth: true,
        },
        component: (resolve) => require(['./views/index.vue'], resolve),
        children: [
            { path: 'test', component: Test, name: 'Test'},
            { path: 'test2', component: Test2, name: 'Test2'},
            { path: 'test3', component: Test3, name: 'Test3'}
        ]
    },{
        path: '/',
        component: Home,
        name: '导航一',
        meta: {
            requireAuth: true,
        },
        children: [
            { path: 'test', component: Test, name: 'Test'},
            { path: 'test2', component: Test2, name: 'Test2'},
            { path: 'test3', component: Test3, name: 'Test3'}
        ]
    },{
        path: '/',
        component: Home,
        name: '帖子',
        meta: {
            requireAuth: true,
        },
        children: [
            { path: '/post', component: PostList, name: 'list'},
            { path: '/post/store', component: PostStore, name: 'post_store'},
        ]
    },{
        path: '/',
        component: Home,
        name: '用户',
        meta: {
            requireAuth: true,
        },
        children: [
            { path: '/user', component: UserList, name: 'user_list'},
        ]
    },{
        path: '/',
        component: Home,
        name: '节点',
        meta: {
            requireAuth: true,
        },
        children: [
            { path: '/node', component: NodeList, name: 'node_list'},
        ]
    },{
        path: '/',
        component: Home,
        name: '回复',
        meta: {
            requireAuth: true,
        },
        children: [
            { path: '/reply', component: ReplyList, name: 'reply_list'},
        ]
    },{
        path: '/',
        component: Home,
        name: '角色',
        meta: {
            requireAuth: true,
        },
        children: [
            { path: '/role', component: RoleList, name: 'role_list'},
        ]
    },{
        path: '/',
        component: Home,
        name: '权限',
        meta: {
            requireAuth: true,
        },
        children: [
            { path: '/permission', component: PermissionList, name: 'permission_list'},
        ]
    }
];


export default routers;