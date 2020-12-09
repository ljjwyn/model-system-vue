<template>
  <el-table :data="tableData" style="width: 100%">
    <el-table-column prop="date" label="日期" width="180"></el-table-column>
    <el-table-column prop="name" label="姓名" width="180"></el-table-column>
    <el-table-column prop="address" label="地址"></el-table-column>
  </el-table>


</template>

<script>
import { getTableData } from "@/api/test.js";
import gauge from '../buildmodel/components/gauge'

export default {
  components:{
    gauge
  },
  data() {
    return {
      tableData: []
    };
  },
  mounted: function() {
    // 网络请求统一处理
    getTableData().then(res => {
      console.log("api tableData :", res);
      //this.tableData = res.data;
    },err=>{
      console.log("err :", err);
    });
  },
  methods: {}
};
</script>

<style>
</style>
