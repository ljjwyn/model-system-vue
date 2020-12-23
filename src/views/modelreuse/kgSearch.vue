<template>
<!--  <el-row style="margin-top: 20px">-->
<!--    <el-col :span="6">-->
<!--      <strong>cesji</strong>-->
<!--    </el-col>-->
<!--    <el-col :span="10">-->
<!--      -->
<!--    </el-col>-->
<!--  </el-row>-->
  <el-container style="height: 800px; border: 1px solid #eeeeee; margin: 15px">
<!--    <el-aside width="300px" style="background-color: rgb(250,250,250)">-->
<!--      -->
<!--    </el-aside>-->
    <el-card class="box-card"  style="width:400px;margin-right: 5px">
      <div slot="header" class="clearfix">
        <span>3D图谱检索</span>
        <div style="margin-top: 15px;">
          <el-input placeholder="请输入关键词" v-model="keywords" class="input-with-select">
            <el-select v-model="keywordsSelect" slot="prepend" placeholder="请选择" style="width: 80px">
              <el-option label="疾病" value="1"></el-option>
              <el-option label="药品" value="2"></el-option>
              <el-option label="检查" value="3"></el-option>
            </el-select>
            <el-button slot="append" @click="searchGraphData" icon="el-icon-search"></el-button>
          </el-input>
        </div>
      </div>
    </el-card>

    <el-container>
      <el-header style="text-align: right; font-size: 12px">
        <el-dropdown >
          <i class="el-icon-setting" style="margin-right: 20px"></i>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>查看</el-dropdown-item>
            <el-dropdown-item>新增</el-dropdown-item>
            <el-dropdown-item>删除</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <span>检索结果图谱</span>
      </el-header>

      <el-main >
        <graph3-d style="height: 700px" :graph3Data="graph3Data"></graph3-d>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import graph3D from './components/3Dgraph';
import {getKgGraphData} from '@/api/kgGraphApi'
export default {
  name: "kgSearch",
  components:{
    graph3D
  },
  data:function (){
    return{
      keywords:'',
      keywordsSelect:'疾病',
      graph3Data:{},
    }
  },
  mounted() {

  },
  methods:{
    searchGraphData(){
      getKgGraphData(this.keywords).then(res => {
        console.log("getKgGraphData", res);
        this.graph3Data = res;
      })
    }
  }
}
</script>

<style scoped>
.el-header {
  background-color: #B3C0D1;
  color: #333;
  line-height: 60px;
}

.el-aside {
  color: #333;
}
.el-select .el-input {
  width: 130px;
}
.input-with-select .el-input-group__prepend {
  background-color: #fff;
}
</style>
