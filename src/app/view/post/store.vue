<template>
    <div>
        <Breadcrumb class="breadcrumb">
            <Breadcrumb-item href="/">Home</Breadcrumb-item>
            <Breadcrumb-item href="/post">帖子</Breadcrumb-item>
            <Breadcrumb-item>创建帖子</Breadcrumb-item>
        </Breadcrumb>
        <Form :model="formItem" ref="formItem"  :label-width="80" :rules="ruleValidate" class="myForm">
            <Form-item label="标题" prop="title">
                <Input v-model="formItem.title"  placeholder="请输入"></Input>
            </Form-item>
            <Form-item label="节点" prop="node">
                <Select v-model="formItem.node"  placeholder="请选择节点" filterable>
                    <Option  v-for="item in mySelect" :value="item.hid" >{{ item.displayName }}</Option>
                </Select>
            </Form-item>
            <Form-item label="置顶">
                <Radio-group v-model="formItem.isTop">
                    <Radio label="yes">是</Radio>
                    <Radio label="no">否</Radio>
                </Radio-group>
            </Form-item>
            <Form-item label="文本域">
                <Input v-model="formItem.textarea" type="textarea" :autosize="{minRows: 20,maxRows: 50}" placeholder="推荐使用markdown语法"></Input>
            </Form-item>

            <Form-item>
                <Button type="primary"  @click="handleSubmit('formItem')">提交</Button>
                <Button type="ghost" style="margin-left: 8px">取消</Button>
            </Form-item>
        </Form>
    </div>
</template>
<script>
    import util from '../../../libs/util.js';

    //    var dateFormat = require('dateformat');
    export default {
        data () {
            return {
                token: '',

                formItem: {
                    title: '',
                    node: '',
                    isTop: 'no',
                    slider: [20, 50],
                    textarea: '',
                    pageType: 'store'
                },
                mySelect: [],
                ruleValidate: {
                    title: [
                        { required: true, message: '标题不能为空',trigger: 'blur' },
                        {max: 50, message: '超出最大长度',trigger: 'blur'}
                    ],
                    node: [
                        {required: true, message: '请选择一个节点', trigger: 'blur'}
                    ]
                }
            }
        },
        mounted() {
            this.getToken();
            this.nodeList();
            var hid = this.$route.query.hid;
            if (hid) {
                this.pageType = 'update';
                this.getPost(hid);
            }
        },
        methods: {
            getToken () {
                this.token =  window.localStorage.getItem('token')
            },

            getPost (hid) {
                util.ajax.get('/console/post/' + hid,{
                    headers: {
                        'x-auth-token': this.token,
                    }
                })
                    .then((res) => {
                        if (res.data.code == 0) {
//                            console.log(res.data);
                            this.formItem.title = res.data.data.title;
                            this.formItem.node = res.data.data.node.hid;
                            this.formItem.textarea = res.data.data.bodyOriginal;
                            this.formItem.isTop = res.data.data.isTop;
                        } else {
                            this.$Message.error(res.data.message)
                        }
                    })
                    .catch(function (error) {
                        this.$Message.error(error)
                        console.log(error);
                    });
            },


            handleSubmit (name) {
                var that = this;
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        var title = that.formItem.title;
                        var node = that.formItem.node;
                        var content = that.formItem.textarea;
                        var isTop = that.formItem.isTop;
                        this.submitForm(title,node,content,isTop);
                    } else {
//                        this.$Message.error('表单验证失败!');
                    }
                })
            },
            submitForm (title,nodeHid,content,isTop) {
                var pageType = this.pageType;
                if (pageType == 'update') {
                    var hid = this.$route.query.hid;
                    var url = '/console/post/' + hid;
                    var method = 'put';
                } else {
                    var url = '/console/post/';
                    var method = 'post';
                }

              util.ajax({
                  url: url,
                  method: method,
                  headers: {
                      'x-auth-token': this.token,
                  },
                  data: {
                      title: title,
                      nodeHid: nodeHid,
                      content: content,
                      isTop: isTop
                  }
              })
              .then((res) => {
                  if (res.data.code != 0) {
                      this.$Message.error(res.data.message);
                  } else {
                      this.$Message.success(res.data.message);
                      setTimeout(() => {
                          this.$router.push('/post')
                      },2000)
                  }

                  console.log('提交返回的结果:',res.data.data);
              })
              .catch(function (error) {
                  console.log(error);
              });
            },


//            selectValue () {
//              console.log(this.formItem.node)
//            },
            nodeList () {
                util.ajax.get('/console/node',{
                    headers: {
                        'x-auth-token': this.token,
                    },
                })
                    .then((res) => {
                        console.log(res.data.data);
                        this.mySelect = res.data.data
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            }
        }

    }
</script>
<style scoped>
    .breadcrumb{
        margin: 10px;
    }
    .myForm{
        width: 70%;
        margin-top: 20px;
    }


</style>
