<template>
    <el-row>
      <el-col :span="24">
        <el-steps :active="buildActive" align-center style="margin-top: 20px" finish-status="success">
          <el-step title="任务管理" description="配置并新建一个建模任务"></el-step>
          <el-step title="设置训练集" description="选择建模训练数据集"></el-step>
          <el-step title="配置模型信息" description="设置模型基本信息及其配套参数"></el-step>
          <el-step title="数据建模" description="开始建模并展示建模进度"></el-step>
          <el-step title="模型测试" description="测试与分析构建的模型"></el-step>
        </el-steps>
      </el-col>
      <el-col :span="22" :offset="1">
        <el-card class="box-card" align-center style="margin-top: 10px">
          <div slot="header" class="clearfix">
            <span>数据集管理</span>
            <el-button style="float: right; padding: 3px 0" type="text">管理</el-button>
          </div>
          <el-tag><strong>taskUid: </strong>{{taskUid}}</el-tag>
          <el-tabs type="border-card" style="margin-top: 5px">
            <el-tab-pane>
              <span slot="label"><i class="el-icon-date"></i> 文本数据集</span>
              <el-col :span="24">
                <label>选择数据集</label>
                <el-select style="margin-left: 5px" v-model="value" filterable clearable placeholder="请选择数据集">
                  <el-option
                    v-for="(item,index) in dataSetList"
                    :key="item.dataSetName"
                    :label="item.dataSetName"
                    :value="index">
                  </el-option>
                </el-select>
                <el-button style="margin-left: 5px" type="primary" round @click="loadDataSet(value)">加载</el-button>
              </el-col>
              <el-col :span="24" v-if="dataSetList[value]" style="margin-top: 10px" v-show="dataSetTapShow">
                <el-tag style="margin: 5px"><strong>数据集名称: </strong>{{dataSetList[value].dataSetName}}</el-tag>
                <el-tag style="margin: 5px" type="success"><strong>数据集类别: </strong>{{dataSetList[value].dataSetCatalog}}</el-tag>
                <el-tag style="margin: 5px" type="info"><strong>数据集路径: </strong>{{dataSetList[value].dataSetPath}}</el-tag>
                <el-tag style="margin: 5px" type="danger"><strong>数据集描述: </strong>{{dataSetList[value].dataSetDescription}}</el-tag>
              </el-col>
              <el-col :span="24" style="margin-top: 10px">
                <label>选择预览文件</label>
                <el-select @change="getSubFileContents" style="margin-left: 5px" v-model="dataSubFileValue" placeholder="请选择数据集">
                  <el-option
                    v-for="item in dataSetSubFileList"
                    :key="item"
                    :label="item"
                    :value="item">
                  </el-option>
                </el-select>
              </el-col>
              <el-col :span="16" style="margin-top: 10px">
                <el-input type="textarea" placeholder="选中的文件内容预览" rows="6"  v-model="dataSubFileContent"></el-input>
              </el-col>
              <el-col :span="24" style="margin-top: 10px">
                <label>预处理构造方式</label>
                <el-select style="margin-left: 5px" v-model="preProcess" placeholder="请选择">
                  <el-option
                    v-for="(item,index) in preProcessList"
                    :key="item"
                    :label="item"
                    :value="index">
                  </el-option>
                </el-select>
                <el-button style="margin-left: 5px" type="primary" round @click="preProcessing">处理</el-button>
              </el-col>
              <el-col style="margin-top: 20px">
                <el-col :span="24">
                  <label>这是<strong style="color: red" v-if="dataSetList[value]">{{dataSetList[value].dataSetCatalog}}</strong>任务，基于<strong style="color: red">{{preProcessList[preProcess]}}</strong>实例化加载</label>
                </el-col>
                <el-col :span="10" style="margin-top:10px">
                  <el-card class="box-card">
                    <div slot="header" class="clearfix">
                      <span>标签信息</span>
                    </div>
                    <div class="text item">
                      <el-input type="textarea" placeholder="标签信息预览" rows="5"  v-model="labelContents"></el-input>
                    </div>
                  </el-card>
                </el-col>
                <el-col :span="13" style="margin-left: 10px;margin-top:10px">
                  <el-card class="box-card">
                    <div slot="header" class="clearfix">
                      <span>实例化数据集预览</span>
                    </div>
                    <div class="text item">
                      <el-input type="textarea" placeholder="实例化数据集预览" rows="5"  v-model="preProcessContents"></el-input>
                    </div>
                  </el-card>
                </el-col>
                <el-button style="margin-left: 5px;margin-top: 10px" type="primary" round @click="nextStep" :disabled="!isAllFinish">下一步</el-button>
              </el-col>

            </el-tab-pane>
            <el-tab-pane label="SQL数据集">SQL数据集</el-tab-pane>
            <el-tab-pane label="图片数据集">图片数据集</el-tab-pane>
            <el-tab-pane label="其他数据集">其他数据集</el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
</template>

<script>
  import {getDataSetList,getSubFile,getSubFileContent
    ,preProcessDataSet} from '@/api/datasetmanagementApi';
  import store from '@/store';
  import { MessageBox } from 'element-ui';
  export default {
    name: 'datasatmanagement',
    data(){
      return{
        buildActive:1,
        dataSetList:[],
        value: '',
        dataSetSubFileList:'',
        dataSetTapShow:false,
        dataSubFileValue:'',
        dataSubFileContent:'',
        preProcessList:["数据集预构建","BERT预训练模型构建"],
        preProcess:'',
        labelContents:'',
        preProcessContents:'',
        isAllFinish:false,
      }
    },
    mounted:function(){
      getDataSetList().then(res=>{
        console.log("getDataSetList res", res);
        this.dataSetList = res;
      },error => {
        console.log("getDataSetList error", error);
      })
    },
    computed:{
      taskUid() {
        return this.$route.params.taskUid
      }
    },
    methods:{
      goBack(){},
      loadDataSet(){
        console.log("loadDataSet value",this.value);
        getSubFile(this.dataSetList[this.value].dataSetName).then(res=>{
          console.log("getSubFile res",res);
          this.dataSetSubFileList = res.dataSetList;
          this.dataSetTapShow=true;
        },error => {
          console.log("getSubFile error", error);
        })
      },
      getSubFileContents(value){
        console.log("getSubFileContents value", value);
        getSubFileContent(this.dataSetList[this.value].dataSetName,value).then(res=>{
          console.log("getSubFileContent res",res);
          this.dataSubFileContent = res.contents;
        },error => {

        })
      },
      preProcessing(){
        console.log("preProcess",this.preProcess);
        preProcessDataSet(this.dataSetList[this.value].dataSetName,
          this.dataSetList[this.value].dataSetCatalog,
          this.preProcess
        ).then(res=>{
          console.log("preProcessDataSet res",res);
          this.labelContents = res.labelstr;
          this.preProcessContents=res.dataSetClass;
          this.isAllFinish = true;
        },error => {

        })
      },
      nextStep(){
        this.$confirm('确认选中'+this.dataSetList[this.value].dataSetName+'数据集！是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'success'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '跳转至模型选择与配置界面，请稍后!'
          });
          this.timer = setTimeout(()=>{   //设置延迟执行
            console.log('ok');
            this.$router.push({
              name:'modellingConfig',params:{
                taskUid:this.taskUid,
                dataSetType:this.dataSetList[this.value].dataSetCatalog,
                dataSetName:this.dataSetList[this.value].dataSetName,
              }});
          },2000);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      }
    }
  }
</script>

<style scoped>

</style>
