<template>
    <div>
        <Breadcrumb class="breadcrumb">
            <Breadcrumb-item href="/">Home</Breadcrumb-item>
            <Breadcrumb-item href="/reply">回复</Breadcrumb-item>
            <Breadcrumb-item>回复列表</Breadcrumb-item>
        </Breadcrumb>
        <Button type="success" class="createButton" disabled @click="createNew">创建</Button>
        <Input v-model="value" class="search" placeholder="请输入..." icon="ios-search" style="width: 300px"></Input>
        <Table stripe border :highlight-row=true  :columns="columns7" :data="data6"></Table>
        <Page @on-change="changePage" :total="totalNum" :current="currentNum" :page-size="pageSize" show-total style="margin-top: 10px"></Page>

        <Modal
                v-model="modal6"
                :loading="loading"
                @on-ok="asyncOK">
            <p slot="header" style="color:#f60;text-align:center">
                <Icon type="information-circled"></Icon>
                <span>删除确认</span>
            </p>
            <p>确认删除?删除后不可恢复!请谨慎操作!!!</p>
        </Modal>

    </div>
</template>
<script>
    import util from '../../../libs/util.js';
    var dateFormat = require('dateformat');
    export default {
        data () {
            return {
                token: '',

                columns7: [
                    {
                        title: 'HID',
                        key: 'hid',
                    },
                    {
                        title: '帖子标题',
                        key: 'title',
                        render: (h,params) => {
                            return params.row.post.title
                        }
                    },
                    {
                        title: '回复者',
                        key: 'user',
                        render: (h,params) => {
                            return params.row.user.name
                        }
                    },
                    {
                        title: '回复内容',
                        key: 'content',
                        ellipsis:true,
                        height:'30px',
                    },
                    {
                        title: '状态',
                        key: 'isBlocked',
                        render: (h,params) => {
                            return params.row.isBlocked == 'yes' ? 'blocked' : '正常';
                        }
                    },
                    {
                        title: '创建时间',
                        key: 'createdAt',
                        render: (h,params) => {
                            return dateFormat(new Date(params.row.createdAt), "yyyy-mm-dd HH:MM:ss");
                        }
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 150,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: params.row.isBlocked == 'yes' ? 'primary' : 'error',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.edit(params.row.hid);
                                        }
                                    }
                                }, params.row.isBlocked == 'yes' ? 'unBlock' : 'Block')
                            ]);
                        }
                    }
                ],
                data6: [],
                totalNum:0,
                pageSize:0,
                currentNum:1,
                value:'',
                modal6: false,
                loading: true,
            };
        },

        mounted() {
            this.getToken();
            this.myPage();
        },

        methods: {
            getToken () {
                this.token =  window.localStorage.getItem('token')
            },
            createNew () {

            },
            edit (hid) {
                util.ajax({
                    url: '/console/reply/' + hid + '/block',
                    method: 'post',
                    headers: {
                        'x-auth-token': this.token,
                    }
                }).then((res) => {
                    if (res.data.code == 0) {
                        this.$router.go(0)
                    } else {
                        this.$Message.error(res.data.message);
                    }
                }).catch((error) => {
                    console.log(error)
                })
            },
            changePage (page) {
                this.myPage(page);
            },
            asyncOK () {},
            myPage (page = 1) {
                var that = this;
                util.ajax.get('/console/reply',{
                    headers: {
                        'x-auth-token': that.token,
                    },
                    params: {
//                        limit:2,
                        'page':page
                    }
                }).then((res) => {
                    this.totalNum = res.data.pager.entities;
                    this.pageSize = +res.data.pager.limit;
                    this.data6 = res.data.data;
                }).catch(function (error) {
                    console.log(error);
                });
            },
        }
    };
</script>
<style scoped>
    .breadcrumb{
        margin: 10px;
    }
    .createButton{
        margin-bottom: 10px;
        margin-top: 10px;
    }
    .search{
        margin-bottom: 10px;
        margin-top: 10px;
        float: right;
    }
</style>
