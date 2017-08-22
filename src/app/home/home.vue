<style scoped>
    .layout{
        border: 1px solid #d7dde4;
        background: #edf0f3;
    }

    .layout-nav{
        width: 420px;
        margin: 0 auto;
    }
    .layout-assistant{
        width: 300px;
        margin: 0 auto;
        height: inherit;
    }
    .layout-breadcrumb{
        padding: 10px 15px 0;
    }
    .layout-content{
        min-height: 1200px;
        margin: 20px;
        overflow: hidden;
        background: #fff;
        border-radius: 4px;
        box-shadow: lightsteelblue;
        /*width: 90%;*/
    }
    .layout-content-main{
        padding: 10px;
    }
    .layout-copy{
        text-align: center;
        padding: 10px 0 20px;
        color: #9ea7b4;
    }
    .layout-sidebar{
        border-right-color: black;
        min-height: 1200px;
    }

    .logo{
        width: 100px;
        height: 30px;
        border-radius: 3px;
        float: left;
        position: relative;
        top: 20px;
        left: 20px;
    }
    .layout-header{
        height: 60px;
        background: #fff;
        box-shadow: 0 1px 1px rgba(0,0,0,.1);
    }

    .layout-ceiling-main a{
        color: #9ba7b5;
    }
    .layout-out {
        float: right;
        left: 90px;
        margin-right: 150px;
        font-size: 40px;
    }
</style>
<template>
    <div class="layout">
        <div class="layout-header">
            <div class="logo"> <span style="font-style: normal;font-size: 20px;color: greenyellow ">G9ZZ</span> </div>
            <div class="layout-out" >
                <a href="#" @click="myLogout"> <Icon type="power"></Icon></a>
            </div>
        </div>
        <div class="layout-content">
            <Row>
                <i-col span="4" class="layout-sidebar">
                    <Menu  active-name="1-2" width="auto" :open-names="['1']" @on-select="handleSelect">
                        <Submenu name="1">
                            <template slot="title">
                                <Icon type="ios-book-outline"></Icon>
                                帖子
                            </template>
                            <Menu-item name="/post">列表</Menu-item>
                            <!--<Menu-item name="/store">创建</Menu-item>-->
                            <!--<Menu-item name="2-2">选项 2</Menu-item>-->
                        </Submenu>
                        <Submenu name="2">
                            <template slot="title">
                                <Icon type="person"></Icon>
                                用户
                            </template>
                            <Menu-item name="/user">用户列表</Menu-item>
                        </Submenu>
                        <Submenu name="3">
                            <template slot="title">
                                <Icon type="social-buffer-outline"></Icon>
                                节点
                            </template>
                            <Menu-item name="/node">列表</Menu-item>
                        </Submenu>
                        <Submenu name="4">
                            <template slot="title">
                                <Icon type="ios-paw"></Icon>
                                回复
                            </template>
                            <Menu-item name="/reply">列表</Menu-item>
                        </Submenu>
                        <Submenu name="5">
                            <template slot="title">
                                <Icon type="ios-people"></Icon>
                                角色
                            </template>
                            <Menu-item name="/role">列表</Menu-item>
                        </Submenu>
                        <Submenu name="5">
                            <template slot="title">
                                <Icon type="ios-cog"></Icon>
                                权限
                            </template>
                            <Menu-item name="/permission">列表</Menu-item>
                        </Submenu>
                    </Menu>

                </i-col>
                <i-col span="20">
                    <div class="layout-content-main">
                        <router-view></router-view>
                    </div>
                </i-col>
            </Row>
        </div>
        <div class="layout-copy">
            2011-2016 &copy; TalkingData
        </div>
    </div>
</template>

<script>
    import util from '../../libs/util.js';

    export default {
        name: 'home',

        mounted() {
        },

        methods: {

            handleSelect (name) {
                this.$router.push(name);
            },
            myLogout () {
                window.localStorage.removeItem('token');
                window.localStorage.removeItem('hid');
                this.$router.push('/login')
            }
        }
    };
</script>
