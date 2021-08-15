<template>
    <div class="result-table-view" v-show="this.$store.getters._getDefaultQueryResultVisible">
        <div class="result-table-header">
            <span>空间查询结果</span>
            <i class="el-icon-close" @click="closeResultQueryPannel"></i>
        </div>
        <div class="result-table-content">
            <el-table :data="this.$store.getters._getDefaultQueryResult" height="250" style="width: 100%">
                <el-table-column prop="key" label="序号"> </el-table-column>
                <el-table-column prop="name" label="站名"> </el-table-column>
                <el-table-column prop="type" label="类型"> </el-table-column>
                <el-table-column prop="tieluju" label="铁路局"> </el-table-column>
                <el-table-column prop="address" label="地址"> </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ResultTable',
    methods: {
        closeResultQueryPannel() {
            const currentVisible = this.$store.getters._getDefaultQueryResultVisible;
            this.$store.commit('_setDefaultQueryResultVisible', !currentVisible);
        },
    },
};
</script>

<style>
.result-table-view {
    position: absolute;
    padding: 0 15px;
    height: 300px;
    width: 600px;
    bottom: 15px;
    left: 15px;
    background-color: #fff;
}
.result-table-header {
    width: 100%;
    height: 35px;
    border-bottom: 1px solid #e4e7ed;
    padding: 0 5px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
}
.result-table-header > span {
    line-height: 35px;
    font-size: 16px;
    font-weight: 600;
}
.result-table-header > i {
    line-height: 35px;
    cursor: pointer;
}
.result-table-content {
    width: 100%;
    height: calc(100% - 35px);
}
</style>
