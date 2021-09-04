<template>
    <div id="app">
        <el-container class="app-out-pannel">
            <el-header class="sys-header">
                <span>一张图项目系统</span>
                <div class="user-info">
                    <i class="el-icon-user"></i>
                    <span>当前用户：</span>
                    <span @click="handleUserLogin">{{ username }}</span>
                </div>
            </el-header>
            <el-container class="app-content-pannel">
                <el-aside class="sys-menu">
                    <el-menu
                        default-active="1"
                        class="el-menu-vertical-demo"
                        @select="handleMenuSelect"
                        background-color="#545c64"
                        text-color="#fff"
                        active-text-color="#ffd04b"
                        :collapse="true"
                    >
                        <el-menu-item index="1">
                            <i class="el-icon-monitor"></i>
                            <span slot="title">首页大屏</span>
                        </el-menu-item>
                        <el-menu-item index="2">
                            <i class="el-icon-picture-outline"></i>
                            <span slot="title">一张图</span>
                        </el-menu-item>
                    </el-menu>
                </el-aside>
                <el-main class="sys-content">
                    <router-view></router-view>
                </el-main>
            </el-container>
        </el-container>
        <el-dialog title="用户登录/注册" :visible.sync="loginDialogVisible" width="30%">
            <div class="login-content">
                <div class="login-content-login" v-show="!loginSwitch">
                    <p>用户名：</p>
                    <el-input placeholder="请输入用户名" v-model="userNameInput" clearable> </el-input>
                    <p>密码：</p>
                    <el-input placeholder="请输入密码" v-model="userPsdInput" show-password></el-input>
                </div>
                <div class="login-content-insert" v-show="loginSwitch">
                    <p>用户名：</p>
                    <el-input placeholder="请输入用户名" v-model="userNameInput_insert" clearable> </el-input>
                    <p>密码：</p>
                    <el-input placeholder="请输入密码" v-model="userPsdInput_insert" clearable> </el-input>
                    <p>手机号：</p>
                    <el-input placeholder="请输入手机号" v-model="userPhoneInput_insert" clearable> </el-input>
                    <p>邮箱：</p>
                    <el-input placeholder="请输入邮箱" v-model="userEmailInput_insert" clearable> </el-input>
                </div>
            </div>
            <br />
            <el-switch v-model="loginSwitch" active-text="注册" inactive-text="登录"> </el-switch>
            <span slot="footer" class="dialog-footer">
                <el-button @click="loginDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="userLogin">{{ loginSwitch ? '注册' : '登录' }}</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import axios from 'axios';
import qs from 'qs';

export default {
    name: 'App',
    components: {},
    data() {
        return {
            username: '未登录',
            loginDialogVisible: false,
            userNameInput: '',
            userPsdInput: '',
            loginSwitch: false,
            userNameInput_insert: '',
            userPsdInput_insert: '',
            userPhoneInput_insert: '',
            userEmailInput_insert: '',
        };
    },
    methods: {
        handleMenuSelect(index) {
            if (index === '1') {
                //跳转到首页大屏
                this.$router.push('/');
            } else if (index === '2') {
                //跳转到一张图
                this.$router.push('/onemap');
            }
        },
        //用户登录界面弹出
        handleUserLogin() {
            this.loginDialogVisible = true;
        },
        //用户登录
        userLogin() {
            const _self = this;
            if (!_self.loginSwitch) {
                //用户登录
                const name = _self.userNameInput;
                const psd = _self.userPsdInput;
                axios
                    .get('http://localhost:3001/user/get', {
                        params: {
                            name,
                        },
                    })
                    .then(function (response) {
                        if (response.data.status === 'success') {
                            const password = response.data.data[0].psd;
                            if (password === psd) {
                                _self.$message({
                                    message: '恭喜你，登陆成功',
                                    type: 'success',
                                });
                                _self.username = response.data.data[0].name;
                                _self.loginDialogVisible = false;
                            } else {
                                _self.$message.error('登录失败，用户名或密码错误');
                            }
                        }
                    })
                    .catch(function (error) {
                        _self.loginDialogVisible = false;
                        console.log(error);
                    });
            } else {
                //用户注册
                const name = _self.userNameInput_insert;
                const psd = _self.userPsdInput_insert;
                const phone = _self.userPhoneInput_insert;
                const email = _self.userEmailInput_insert;
                if (!name || !psd) {
                    _self.$message({
                        message: '请填写用户名或密码',
                        type: 'warning',
                    });
                    return;
                }
                axios
                    .post(
                        'http://localhost:3001/user/insert',
                        qs.stringify({
                            name,
                            psd,
                            phone,
                            email,
                        }),
                    )
                    .then(function (response) {
                        if (response.data.status === 'success') {
                            _self.$message({
                                message: '用户注册成功，请登录',
                                type: 'success',
                            });
                        } else {
                            _self.$message.error('用户注册失败');
                        }
                    })
                    .catch(function (error) {
                        _self.loginDialogVisible = false;
                        console.log(error);
                    });
            }
        },
    },
};
</script>

<style>
html,
body,
#app {
    position: relative;
    width: 100%;
    height: 100%;
    margin: 0;
}
.app-out-pannel,
.app-content-pannel {
    height: 100%;
}
.sys-header {
    background-color: #32373e;
    line-height: 60px;
    color: #fff;
    font-size: 20px;
    font-weight: 600;
    display: flex;
    justify-content: space-between;
}
.sys-menu {
    background-color: #545c64;
    width: 64px !important;
    overflow: hidden !important;
}
.sys-content {
    padding: 5px !important;
}

.morescreen-view {
    width: 100%;
    height: 820px;
}
.user-info {
    font-size: 15px;
}
.user-info > span:last-child:hover {
    color: #409eff;
    cursor: pointer;
}
.login-content {
}
</style>
