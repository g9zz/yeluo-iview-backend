<template>
    <div>
        <Breadcrumb class="breadcrumb">
            <Breadcrumb-item href="/">Home</Breadcrumb-item>
            <Breadcrumb-item href="/post">帖子</Breadcrumb-item>
            <Breadcrumb-item>帖子列表</Breadcrumb-item>
        </Breadcrumb>
        <Button type="success" class="createButton" @click="createNew">创建</Button>
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
                        title: '作者',
                        key: 'user',
                        render: (h,params) => {
                            return params.row.user.name
                        }
                    },
                    {
                        title: '标题',
                        key: 'title',
                    },
                    {
                        title: '内容',
                        key: 'content',
                        ellipsis:true,
                        height:'30px',
                    },
                    {
                        title: '分类',
                        key: 'node',
                        render: (h,params) => {
                            return params.row.node.displayName;
                        }
                    },
                    {
                        title: '阅读数',
                        key: 'viewCount',
                    },
                    {
                        title: '回复数',
                        key: 'replyCount',
                    },
                    {
                        title: '置顶',
                        key: 'isTop',
                        render: (h,params) => {
                            return params.row.isTop == 'no' ? '否' : '是';
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
                                        type: 'primary',
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
                                }, '修改'),
                                h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.modal6 = true;
                                            this.deleteHid = params.row.hid
//                                            this.remove(params.row.hid);
                                        }
                                    }
                                }, '删除')
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
                deleteHid: '',
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

            edit (hid) {
                this.$router.push('/post/store?hid=' + hid)
            },
            asyncOK () {
                var deleteHid = this.deleteHid;
                var that = this;
                if (deleteHid == '') {
                    this.$Message.error('未知错误!请检查代码')
                    return true;
                }

                util.ajax.delete('console/post/' + deleteHid,{
                    headers: {
                        'x-auth-token': that.token,
                    }
                }).then((res) => {
                    if (res.data.code == 0) {
                        setTimeout(() => {
                            this.$Message.success(res.data.message);
                            this.modal6 = false;
                        }, 2000);
                        setTimeout(() => {
                            this.$router.go(0)
                        }, 2000);
                    } else {
                        this.$Message.error(res.data.message)
                    }
                }).catch(function (error) {
                    console.log(error);
                });
            },
            createNew () {
              this.$router.push('/post/store')
            },
            changePage (page) {
                this.myPage(page);
            },
            myPage (page = 1) {
                var that = this;
                util.ajax.get('/console/post',{
                    headers: {
                        'x-auth-token': that.token,
                    },
                    params: {
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
