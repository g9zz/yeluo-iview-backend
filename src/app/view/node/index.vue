<template>
    <div>
        <Breadcrumb class="breadcrumb">
            <Breadcrumb-item href="/">Home</Breadcrumb-item>
            <Breadcrumb-item href="/post">节点</Breadcrumb-item>
            <Breadcrumb-item>节点列表</Breadcrumb-item>
        </Breadcrumb>
        <Button type="success" class="createButton" @click="createNew">创建</Button>
        <Input v-model="value" class="search" placeholder="请输入..." icon="ios-search" style="width: 300px"></Input>
        <Table stripe border :highlight-row=true  :columns="columns7" :data="data6"></Table>

        <Modal v-model="modal3" >
            <p slot="header" style="color:cornflowerblue;text-align:center">
                <Icon type="information-circled"></Icon>
                <span>操作</span>
            </p>
            <div style="text-align:center">
                <Form ref="myValidate" :model="myValidate" :rules="myRuleValidate" :label-width="80">
                    <Form-item label="节点名" prop="name">
                        <Input v-model="myValidate.name" placeholder="节点名"></Input>
                    </Form-item>
                    <Form-item label="节点别名" prop="displayName">
                        <Input v-model="myValidate.displayName" placeholder="节点别名"></Input>
                    </Form-item>
                    <Form-item label="父节点" prop="node">
                        <Select v-model="myValidate.node"  placeholder="请选择父节点" filterable>
                            <Option :value="0" :key="0" selected>顶节点</Option>
                            <Option  v-for="item in mySelect" :value="item.hid" >{{ item.displayName }}</Option>
                        </Select>
                    </Form-item>
                    <Form-item label="权重" prop="weight">
                        <Input-number :max="101" :min="0" v-model="myValidate.weight"></Input-number>
                    </Form-item>
                    <Form-item label="描述" prop="description">
                        <Input v-model="myValidate.description" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入描述..."></Input>
                    </Form-item>
                </Form>
            </div>
            <div slot="footer">
                <Button type="info" size="large" long :loading="modal3_loading" @click="submitForm('myValidate')">确认添加</Button>
            </div>
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
                        title: '别名',
                        key: 'displayName',
                    },
                    {
                        title: '节点名',
                        key: 'name',
                    },
                    {
                        title: '显示',
                        key: 'isShow',
                        render: (h,params) => {
                            return params.row.verified == 'false' ? '否' : '是';
                        }
                    },
                    {
                        title: '描述',
                        key: 'description',
                    },
                    {
                        title: '等级',
                        key: 'level',
                    },
                    {
                        title: '权重',
                        key: 'weight',
                    },
                    {
                        title: '贴子数',
                        key: 'postCount'
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
//                                        disabled: true
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.doType = 'update';
                                            this.updateHid = params.row.hid;
                                            this.updateNode(params.row.hid)
                                        }
                                    }
                                }, '修改'),
                                h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small',
//                                        disabled: true
                                    },
                                    on: {
                                        click: () => {
                                            this.modal6 = true;
                                            this.deleteHid = params.row.hid
                                        }
                                    }
                                }, '删除')
                            ]);
                        }
                    }
                ],
                data6: [],
                value: null,

                doType:'store',
                updateHid: '',

                mySelect: [],
                modal3: false,
                modal3_loading: false,
                myValidate: {
                    name: '',
                    displayName: '',
                    node: 0,
                    weight: 0,
                    description: ''
                },
                myRuleValidate: {
                    name: [
                        { required: true, message: '节点名不能为空',trigger: 'blur' },
                        {max : 30,message: '节点名长度超出',trigger: 'blur'}
                    ],
                    displayName: [
                        { required: true, message: '节点别名不能为空',trigger: 'blur' },
                        {max : 30,message: '节点别名长度超出',trigger: 'blur'}
                    ],
                    weight: [
                        { type: 'number', max : 101,message: '权重数字超出',trigger: 'blur'}
                    ],
                    description: [
                        {max : 150,message: '描述过长',trigger: 'blur'}
                    ]
                }
            };
        },

        mounted() {
            this.nodeList();
            this.getNode();
            this.getToken();
        },

        methods: {
            getToken () {
                this.token =  window.localStorage.getItem('token')
            },
            createNew () {
                this.modal3 = true;
                this.doType = 'store';
                this.updateHid = '';
                this.myValidate.name = '';
                this.myValidate.displayName = '';
                this.myValidate.node = 0;
                this.myValidate.weight = 0;
                this.myValidate.description = '';
            },
            updateNode (hid) {
                this.modal3 = true;
                util.ajax({
                    url: '/console/node/' + hid,
                    method: 'get',
                    headers: {
                        "x-auth-token": this.token
                    }
                })
                    .then((res) => {
                        if (res.data.code == 0) {
                            this.myValidate.name = res.data.data.name;
                            this.myValidate.displayName = res.data.data.displayName;
                            this.myValidate.node = res.data.data.parentHid;
                            this.myValidate.weight = res.data.data.weight;
                            this.myValidate.description = res.data.data.description;
                        } else {
                            this.$Message.error(res.data.message);
                        }

                    })
                    .catch((error) => {
                        console.log(error)
                    })
            },
            submitForm (form) {
                var that = this;
                this.$refs[form].validate((valid) => {
                    if (valid) {
                        var name = that.myValidate.name;
                        var displayName = that.myValidate.displayName;
                        var parentHid = that.myValidate.node;
                        var weight = that.myValidate.weight;
                        var description = that.myValidate.description;
                        this.storeOrUpdate(name,displayName,parentHid,weight,description);
                    }
                })
            },
            storeOrUpdate (name,displayName,parentHid,weight,description) {
                var doType = this.doType;

                if (doType == 'store') {
                    var url = '/console/node';
                    var method = 'post';
                } else {
                    var hid = this.updateHid;
                    var url = '/console/node/' + hid;
                    var method = 'put';
                }

                util.ajax({
                    url: url,
                    method: method,
                    headers: {
                        "x-auth-token": this.token
                    },
                    data: {
                        name: name,
                        displayName: displayName,
                        parentHid: parentHid,
                        weight: weight,
                        description: description
                    }
                })
                    .then((res) => {
                        if (res.data.code == 0) {
                            setTimeout(() => {
                                this.$Message.success(res.data.message)
                            },2000)
                            this.$router.go(0)
                        } else {
                            this.$Message.error(res.data.message)
                        }
                    })
                    .catch((error) => {
                        console.log(error);
                    })
            },
            getNode () {
                util.ajax({
                    url: '/node',
                    method: 'get',
                })
                    .then((res) => {
                        console.log(res.data)
                        if (res.data.code == 0) {
                            this.data6 = res.data.data;
                        }
                    })
                    .catch((error) => {
                        console.log(error)
                    })
            },
            nodeList () {
                util.ajax.get('/node',{
                    headers: {
                        'x-auth-token': this.token,
                    },
                })
                    .then((res) => {
                        console.log('节点列表:',res.data.data)
                        this.mySelect = res.data.data
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
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
    .search{
        margin-bottom: 10px;
        margin-top: 10px;
        float: right;
    }
</style>
