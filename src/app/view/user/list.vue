<template>
    <div>
        <Breadcrumb class="breadcrumb">
            <Breadcrumb-item href="/">Home</Breadcrumb-item>
            <Breadcrumb-item href="/user">用户</Breadcrumb-item>
            <Breadcrumb-item>用户列表</Breadcrumb-item>
        </Breadcrumb>
        <Button type="success" class="createButton" @click="createNew">创建</Button>
        <Table stripe border :highlight-row=true  :columns="columns7" :data="data6"></Table>
        <Page @on-change="changePage" :total="totalNum" :current="currentNum" :page-size="pageSize" show-total style="margin-top: 10px"></Page>

        <Modal v-model="modal3" >
            <p slot="header" style="color:cornflowerblue;text-align:center">
                <Icon type="information-circled"></Icon>
                <span>添加新用户</span>
            </p>
            <div style="text-align:center">
                <Form ref="myValidate" :model="myValidate" :rules="myRuleValidate" :label-width="80">
                    <Form-item label="用户名" prop="name">
                        <Input v-model="myValidate.name" placeholder="用户名"></Input>
                    </Form-item>
                    <Form-item label="邮箱" prop="email">
                        <Input v-model="myValidate.email" placeholder="邮箱"></Input>
                    </Form-item>
                    <Form-item label="密码" prop="password">
                        <Input v-model="myValidate.password" placeholder="密码"></Input>
                    </Form-item>
                    <Form-item label="邀请码" prop="inviteCode">
                        <Input v-model="myValidate.inviteCode" placeholder="邀请码"></Input>
                    </Form-item>
                </Form>
            </div>
            <div slot="footer">
                <Button type="info" size="large" long :loading="modal3_loading" @click="submitForm('myValidate')">确认添加</Button>
            </div>
        </Modal>

        <Modal
                v-model="modal6"
                :loading="loading"
                @on-ok="asyncOK">
            <p slot="header" style="color:#f60;text-align:center">
                <Icon type="information-circled"></Icon>
                <span>分配角色</span>
            </p>

            <Form :model="formItem" ref="formItem"  :label-width="80" :rules="roleValidate" class="myForm">
                <Select v-model="formItem.mySelect"  placeholder="请选择节点" filterable>
                    <Option  v-for="item in roleList" :value="item.id" >{{ item.displayName }}</Option>
                </Select>
            </Form>

        </Modal>

    </div>
</template>
<script>
    import util from '../../../libs/util.js';
    import expandRow from '../../../components/expand-row.vue';
    var dateFormat = require('dateformat');
    export default {
        components: { expandRow },
        data () {
            return {

                token: '',

                columns7: [
                    {
                        type: 'expand',
                        width: 50,
                        render: (h, params) => {
                            return h(expandRow, {
                                props: {
                                    row: params.row
                                }
                            })
                        }
                    },
                    {
                        title: 'HID',
                        key: 'hid',
                    },
                    {
                        title: '头像',
                        key: 'avatar',
                        columns: {
                            'width':'50px'
                        },
                        render: (h, params) => {
                            return h('div', [
                                h('img', {
                                    attrs: {
                                        src: params.row.avatar
                                    },
                                    style: {
                                        width: '30px',
                                        height: '30px'
                                    }
                                }),
                            ]);
                        }
                    },
                    {
                        title: '姓名',
                        key: 'name',
                    },
                    {
                        title: '邮箱',
                        key: 'email',
                    },
                    {
                        title: '验证',
                        key: 'verified',
                        render: (h,params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'info',
                                        size: 'small',
                                        disabled: params.row.verified == 'false' ? false : true,
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.verify(params.row.hid);
                                        }
                                    }
                                }, params.row.verified == 'false' ? '手动验证' : '已验证')
                            ]);
                        }
                    },
                    {
                        title: '状态',
                        key: 'status',
                        render: (h,params) => {
                            return params.row.status == 'activated' ? '正常' : '封禁';
                        }
                    },
                    {
                        title: '注册时间',
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
                                        size: 'small',
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.modal6 = true;
                                            this.formItem.mySelect = params.row.role && params.row.role[0] && params.row.role[0].id;
                                            this.attachHid = params.row.hid;
                                        }
                                    }
                                }, '配角'),
                                h('Button', {
                                    props: {
                                        type: params.row.status == 'activated' ? 'error' : 'warning',
                                        size: 'small',
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.closure(params.row.hid,params.row.status)
                                        }
                                    }
                                }, params.row.status == 'activated' ? '封禁' : '解禁')
                            ]);
                        }
                    }
                ],
                data6: [],
                totalNum:0,
                pageSize:0,
                currentNum:1,

                modal6: false,
                loading: false,
                roleList:'',
                formItem: {
                    mySelect:''
                },
                roleValidate: {
                    node: [
                        {required: true, message: '请选择一个节点', trigger: 'blur'}
                    ]
                },
                attachHid: '',


                modal3: false,
                modal3_loading: false,
                myValidate: {
                    name: '',
                    email: '',
                    password: '',
                    inviteCode: '',
                },
                myRuleValidate: {
                    name: [
                        { required: true, message: '用户名不能为空',trigger: 'blur' },
                        {max : 30,message: '用户名长度超出',trigger: 'blur'}
                    ],
                    email: [
                        {required: true, message: '邮箱不能为空',trigger: 'blur'},
                        { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
                    ],
                    password: [
                        {required: true,message: '密码不能为空', trigger: 'blur'},
                        {min: 6, message: '密码长度最小为6', trigger: 'blur'}
                    ]
                },

            };
        },

        mounted() {
            this.getToken();
            this.myPage();
            this.getRoleList();
        },

        methods: {
            getToken () {
                this.token =  window.localStorage.getItem('token')
            },
            createNew () {
                this.modal3 = true;
            },
            submitForm (form) {
                var that = this;
                this.$refs[form].validate((valid) => {
                    if (valid) {
                        var name = that.myValidate.name;
                        var email = that.myValidate.email;
                        var password = that.myValidate.password;
                        var inviteCode = that.myValidate.inviteCode;
                        this.createUser(name,email,password,inviteCode);
                    } else {
//                        this.$Message.error('表单验证失败!');
                    }
                })
            },
            //新建用户
            createUser (name,email,password,inviteCode) {
                util.ajax({
                    url : '/register',
                    method: 'post',
                    data: {
                        name: name,
                        email: email,
                        password: password,
                        invitedCode: inviteCode
                    }
                })
                    .then((res) => {
                        if (res.data.code == 0) {
                            this.$Message.success(res.data.message);
                            this.$router.go(0);
                        } else {
                            this.$Message.error(res.data.message);
                        }
                    })
                    .catch((error) => {
                        console.log(error);
                    })
            },
//           用户修改
            edit (hid) {
                this.$router.push('/user')
            },
//            分页跳转
            changePage (page) {
                this.myPage(page);
            },
//            分页
            myPage (page = 1) {
                util.ajax.get('/console/user',{
                    headers: {
                        'x-auth-token': this.token,
                    },
                    params: {
//                        'limit':2,
                        'page':page
                    }
                })
                    .then((res) => {
                        this.totalNum = res.data.pager.entities;
                        this.pageSize = +res.data.pager.limit;
                        this.data6 = res.data.data;
//                        this.formItem.mySelect = res && res.data && res.data.data && res.data.data.role && res.data.data.role[0] && res.data.data.role[0].name
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            },
//            获取角色列表
            getRoleList () {
                let url = '/console/role';
                let method = 'get';
                util.ajax({
                    url: url,
                    method: method,
                    headers: {
                        'x-auth-token' : this.token,
                    }
                }).then((res) => {
                    if (res.data.code == 0) {
                        this.roleList = res.data.data;
                    } else {
                        this.$Message.error(res.data.message);
                        return false;
                    }
                }).catch((error) => {
                    console.log(error)
                })
            },


            asyncOK () {
                this.loading = true;
                let  hid = this.attachHid;
                let roleId = this.formItem.mySelect;
                let url = '/console/user/' + hid + '/role/' + roleId
                util.ajax({
                    url: url,
                    method: 'post',
                    headers: {
                        'x-auth-token':this.token
                    }
                }).then((res) => {
                    if (res.data.code == 0) {
                        this.loading = false;
                        this.$router.go(0)
                    } else {
                        this.$Message.error(res.data.message)
                        this.loading = false;
                    }
                }).catch((error) => {
                    console.log(error)
                })
            },
//            手动验证
            verify (hid) {
                let url = '/console/user/' + hid + '/verify';
                let method = 'post';
                this.myAjax(url,method)
            },
//          封禁 或者解禁
            closure(hid,status) {
                let url = '/console/user/' + hid + '/closure';
                let method = 'post';
                let data = {
                    'status': status == 'closure' ? 'activated' : 'closure'
                }
                this.myAjax(url,method,data);
            },
//          公共请求
            myAjax(url,method,data = []) {
                util.ajax({
                    url: url,
                    method: method,
                    headers: {
                        'x-auth-token': this.token,
                    },
                    data: data
                }).then((res) => {
                    if (res.data.code == 0) {
                        this.$router.go(0);
                    } else {
                        this.$Message.error(res.data.message);
                        return false;
                    }
                }).catch((error) => {
                    console.log(error);
                })
            }


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
</style>
