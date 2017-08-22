<template>
    <div class="layout">
        <Card  class="myCard" bordered>
            <Form ref="formInline" :model="formInline" :rules="ruleInline" style="margin-top: 20px;margin-right: 30px;margin-left: 30px" >
                <Form-item prop="user">
                    <Input type="text" v-model="formInline.user" placeholder="请输入用户名">
                    <Icon type="ios-person-outline" slot="prepend"></Icon>
                    </Input>
                </Form-item>
                <Form-item prop="password">
                    <Input type="password" v-model="formInline.password" placeholder="请输入密码">
                    <Icon type="ios-locked-outline" slot="prepend"></Icon>
                    </Input>
                </Form-item>
                <Form-item prop="captcha">
                    <img :src="captchaSrc" @click="changeCaptcha()" alt="图形验证码" style="height: 32px;margin-left: 10px;margin-right: 10px">

                    <Input type="text" v-model="formInline.captcha" placeholder="请输入验证码">
                    <Icon type="ios-ionic-outline" slot="prepend"></Icon>
                    </Input>
                </Form-item>

                <Form-item>
                    <Button type="primary" @click="handleSubmit('formInline')">登录</Button>
                </Form-item>
            </Form>
        </Card>

    </div>

</template>
<script>
    import util from '../../libs/util.js';

    export default {
        data () {
            return {
                formInline: {
                    user: '',
                    password: '',
                    captcha: ''
                },
                ruleInline: {
                    user: [
                        { required: true, message: '请填写用户名', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请填写密码', trigger: 'blur' },
                        { type: 'string', min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
                    ],
                    captcha: [
                        { required: true, message: '请填写验证码', trigger: 'blur' },
                    ]
                },

                text: '',
                captchaSrc:'',
            }
        },
        mounted (){
            this.makeId();
            this.captcha();
        },
        methods: {
            handleSubmit(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        let email =  this.formInline.user;
                        let password = this.formInline.password;
                        let capthcha = this.formInline.captcha;
                        let uuid = this.text
                        this.login(email,password,capthcha,uuid);
                    }
                })
            },
            login (email,password,captcha,uuid) {
                var url = '/login';
                util.ajax({
                    url:url,
                    method: 'post',
                    data: {
                        email: email,
                        password: password,
                        captcha: captcha,
                        "x-auth-uuid": uuid,
                    }
                }).then((res) => {
                    if (res.data.code == 200) {
                        console.log("登录成功",res.data.data.token);
                        window.localStorage.token = res.data.data.token;
                        window.localStorage.hid = res.data.data.hid;
                        this.$router.push('/post');
                    } else {
                        this.changeCaptcha();
                        this.$Message.error(res.data.message);
                    }
                }).catch((error) => {
                    console.log(error)
                })
            },
            captcha () {
                let uuid = this.text
                let url = util.url
                this.captchaSrc = url + '/captcha?uuid=' + uuid;
            },
            changeCaptcha() {
                this.makeId();
                let uuid = this.text
                let url = util.url
                this.captchaSrc = url + '/captcha?uuid=' + uuid;
            },
            makeId() {
                let text = "";
                let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

                for( let i=0; i < 10; i++ )
                    text += possible.charAt(Math.floor(Math.random() * possible.length));

                this.text = text;
            }
        }
    }
</script>
<style scoped>

    .myCard {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
    body{
        background-color: #008ead;
    }
</style>