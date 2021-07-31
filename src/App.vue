<template>
    <div id="app">
        <el-container class="app-out-pannel">
            <el-header class="sys-header">一张图项目系统</el-header>
            <el-container class="app-content-pannel">
                <el-aside width="200px" class="sys-menu">左侧菜单</el-aside>
                <el-main class="sys-content">
                    <Mapview />
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script>
import Mapview from './components/common/Mapview';

export default {
    name: 'App',
    components: {
        Mapview,
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
    background-color: #409eff;
    line-height: 60px;
    color: #fff;
    font-size: 20px;
}
.sys-menu {
    background-color: #c0c4cc;
}
.sys-content {
    padding: 5px !important;
}
</style>
