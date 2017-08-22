<template>
    <div>
        <Breadcrumb class="breadcrumb">
            <Breadcrumb-item href="/">Home</Breadcrumb-item>
            <Breadcrumb-item href="/permission">权限</Breadcrumb-item>
            <Breadcrumb-item>权限列表</Breadcrumb-item>
        </Breadcrumb>
        <Button type="success" class="createButton"  @click="createNew">创建</Button>
        <Input v-model="value" class="search" placeholder="请输入..." icon="ios-search" style="width: 300px"></Input>
        <Table stripe border :highlight-row=true  :columns="columns7" :data="data6"></Table>
        <Page @on-change="changePage" :total="totalNum" :current="currentNum" :page-size="pageSize" show-total style="margin-top: 10px"></Page>

        <Modal v-model="modal3" >
            <p slot="header" style="color:cornflowerblue;text-align:center">
                <Icon type="information-circled"></Icon>
                <span>操作</span>
            </p>
            <div style="text-align:center">
                <Form ref="myValidate" :model="myValidate" :rules="myRuleValidate" :label-width="80">
                    <Form-item label="权限名" prop="name">
                        <Input v-model="myValidate.name" placeholder="权限名(拼音,字母,数字,下划线)"></Input>
                    </Form-item>
                    <Form-item label="权限别名" prop="displayName">
                        <Input v-model="myValidate.displayName" placeholder="权限别名"></Input>
                    </Form-item>
                    <Form-item label="描述" prop="description">
                        <Input v-model="myValidate.description" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入描述..."></Input>
                    </Form-item>
                </Form>
            </div>
            <div slot="footer">
                <Button type="info" size="large" long :loading="modal3_loading" @click="submitForm('myValidate')">点击确定</Button>
            </div>
        </Modal>

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
                        title: 'ID',
                        key: 'id',
                    },
                    {
                        title: '权限别名',
                        key: 'displayName',
                    },
                    {
                        title: '权限名',
                        key: 'name',
                    },
                    {
                        title: '描述',
                        key: 'description',
                        ellipsis:true,
                        height:'30px',
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
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type:  'primary',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px',
                                        marginBottom: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.editId = params.row.id;
                                            this.doType = 'update';
                                            this.edit(params.row.id);
                                        }
                                    }
                                }, '修改'),
                                h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px',
                                        marginBottom: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.modal6 = true;
                                            this.deleteId = params.row.id
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


                toType: 'store',

                editId: '',
                modal3: false,
                modal3_loading: false,
                myValidate: {
                    name:'',
                    displayName:'',
                    description: ''
                },
                myRuleValidate: {
                    name: [
                        {required: true, message: '权限名不能为空', trigger: 'blur'},
                        {max: 30, message: '权限名长度超出', trigger: 'blur'}
                    ],
                    displayName: [
                        {required: true, message: '权限别名不能为空', trigger: 'blur'},
                        {max: 30, message: '权限别名长度超出', trigger: 'blur'}
                    ],
                    description: [
                        {max: 150, message: '描述过长', trigger: 'blur'}
                    ]
                },

                deleteId: '',
                modal6: false,
                loading: false
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
                this.modal3 = true;
                this.modal3_loading = false;
                this.doType = 'store';
                this.myValidate.name = '';
                this.myValidate.displayName = '';
                this.myValidate.description = '';
            },
            edit (id) {
                this.modal3 = true;

                util.ajax({
                    url: '/console/permission/' + id,
                    method: 'get',
                    headers: {
                        'x-auth-token': this.token,
                    }
                }).then((res) => {
                    if (res.data.code == 0) {
                        this.myValidate.name = res.data.data.name;
                        this.myValidate.displayName = res.data.data.displayName;
                        this.myValidate.level = res.data.data.level;
                        this.myValidate.description = res.data.data.description;
                    } else {
                        this.$Message.error(res.data.message);
                    }
                }).catch((error) => {
                    console.log(error)
                })
            },
            submitForm (form) {
                this.modal3_loading = true;
                var that = this;
                this.$refs[form].validate((valid) => {
                    if (valid) {
                        var name = that.myValidate.name;
                        var displayName = that.myValidate.displayName;
                        var description = that.myValidate.description;
                        this.storeOrUpdate(name,displayName,description);
                    } else {
                        this.modal3_loading = false;
                    }
                })

            },
            storeOrUpdate (name,displayName,description) {
                var doType = this.doType;

                if (doType == 'update') {
                    var id = this.editId;
                    var url = '/console/permission/' + id;
                    var method = 'put'
                } else {
                    var url = '/console/permission';
                    var method = 'post';
                }

                util.ajax({
                    url: url,
                    method: method,
                    headers: {
                        'x-auth-token': this.token,
                    },
                    data: {
                        name: name,
                        displayName: displayName,
                        description: description
                    }
                }).then((res) => {
                    if (res.data.code == 0) {
                        this.modal3_loading = false;
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
            asyncOK () {
                var deleteId = this.deleteId;
                var that = this;
                if (deleteId == '') {
                    this.$Message.error('未知错误!请检查代码')
                    return true;
                }

                util.ajax.delete('console/permission/' + deleteId,{
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
            myPage (page = 1) {
                var that = this;
                util.ajax.get('/console/permission',{
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
