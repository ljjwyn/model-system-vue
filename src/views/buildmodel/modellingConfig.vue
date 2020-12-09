<template>
  <el-row v-loading="loading">
    <el-col :span="24">
      <el-steps :active="buildActive" finish-status="success" align-center style="margin-top: 20px">
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
        </div>
        <el-tag><strong>taskUid: </strong>{{taskUid}}</el-tag><br/>
        <el-tag style="margin-top: 5px">选择的数据集类型是: <strong style="color: red">{{dataSetType}}</strong></el-tag><br/>
        <el-tag style="margin-top: 5px">根据您选择的数据集类型为您筛选出: <strong style="color: red">{{modelCount}}</strong>个模型</el-tag>
        <el-col style="margin-top: 5px" :span="24">
          <label>选择模型</label>
          <el-select @change="getModelMoreInfo" style="padding: 10px" v-model="selectIndex" filterable clearable placeholder="请选择数据集">
            <el-option
              v-for="(item,index) in modelList"
              :key="item.modelName"
              :label="item.modelName"
              :value="index">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="24" v-if="modelList[selectIndex]" style="padding: 10px" v-show="modelTapShow">
          <el-tag ><strong>模型名称: </strong>{{modelList[selectIndex].modelName}}</el-tag>
          <el-tag type="success"><strong>模型默认配置UID: </strong>{{modelList[selectIndex].modelDefaultConf}}</el-tag>
          <el-tag type="info"><strong>模型方法ID: </strong>{{modelList[selectIndex].methodId}}</el-tag>
          <el-tag type="danger"><strong>模型描述: </strong>{{modelList[selectIndex].modelDec}}</el-tag>
        </el-col>
      </el-card>
    </el-col>
    <el-col :span="22" :offset="1">
      <el-card class="box-card" align-center style="margin-top: 10px">
        <div slot="header" class="clearfix">
          <span>配置模型信息</span>
        </div>

        <el-tabs type="border-card" v-model="activeName" style="padding: 10px">
          <el-tab-pane name="first">
            <span slot="label"><i class="el-icon-set-up"></i> 模型基本信息</span>
            <el-form ref="form" :model="modelInformation" label-width="80px">
              <el-form-item label="模型名称" style="width: 40%">
                <el-input v-model="modelInformation.modelName"></el-input>
              </el-form-item>
              <el-form-item label="模型描述" style="width: 50%">
                <el-input v-model="modelInformation.modelDescribe" type="textarea" row="4"></el-input>
              </el-form-item>
            </el-form>
          </el-tab-pane>

          <el-tab-pane name="second">
            <span slot="label"><i class="el-icon-s-order"></i> 模型超参数</span>
            <el-table
              :data="parameterTableData"
              stripe
              highlight-current-row
              style="width: 80%">
              <el-table-column
                prop="id"
                label="序号"
                width="180">
              </el-table-column>
              <el-table-column
                prop="parameterName"
                label="参数名"
                width="180">
              </el-table-column>
              <el-table-column
                label="参数值">
                <template slot-scope="scope">
                  <el-input style="width: 65%" :disabled="isTableLock" v-model="scope.row.parameterValue" ></el-input>
                </template>
              </el-table-column>
            </el-table>
            <el-button style="margin-left: 5px" type="primary" round @click="lockTable">{{lockTableButton}}</el-button>
          </el-tab-pane>

        </el-tabs>

        <el-button  style="padding: 10px;margin: 10px" type="primary" round @click="startModelling">开始建模</el-button>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
  import {getModelListByType, buildANewModelRecord, startModelling} from '@/api/model'
  import {preRunModel} from '@/api/test'
  import {insertNewConfig} from '@/api/modelConfigApi'
  export default {
    name: 'modellingConfig',
    data(){
      return{
        loading:false,
        buildActive:2,
        modelCount:4,
        selectIndex:'',
        modelList:[],
        modelTapShow:false,
        modelInformation:{
          modelName:'',
          modelDescribe:'',
          modelConfigMap:''
        },
        parameterTableData:[],
        isTableLock:true,
        activeName:'first',
        lockTableButton:'解锁'
      }
    },
    computed:{
      dataSetType(){
        return this.$route.params.dataSetType
      },
      dataSetName(){
        return this.$route.params.dataSetName
      },
      taskUid(){
        return this.$route.params.taskUid
      }
    },
    mounted:function() {
      console.log("this.dataSetType",this.dataSetType);
      getModelListByType(this.dataSetType).then(res=>{
        console.log("getModelListByType res",res);
        this.modelList = res;
        this.modelCount = this.modelList.length;
      },error => {

      })
    },
    methods:{
      getModelMoreInfo(){
        this.parameterTableData=[];
        this.activeName = 'first';

        this.modelTapShow=true;
        preRunModel({"configId":this.modelList[this.selectIndex].modelDefaultConf}).then(
          res=>{
            let parameterMap=eval("("+res.modelConfMap+")");
            let count = 1;
            console.log("editConfig parameterMap",parameterMap);
            for (let key in parameterMap) {
              //parameterMap.forEach(function(value,key){
              console.log(parameterMap[key],key);
              let tempMap = {
                "id":count,
                "parameterName":key,
                "parameterValue":parameterMap[key]
              }
              this.parameterTableData.push(tempMap);
              count++;
            }
          },error => {
            console.log("preRunModel error",error);
          }
        )
      },
      lockTable(){
        if(this.isTableLock===true){
          this.isTableLock=false;
          this.lockTableButton='锁定'
        }else {
          this.isTableLock=true;
          this.lockTableButton='解锁'
        }
      },
      startModelling(){
        this.$confirm('开始建模并跳转到模型建模进程页面！是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'success'
        }).then(() => {
          let newConfigUid = '';
          console.log("startModelling");
          let newConfigMap = this.buildRequestMap();
          insertNewConfig(newConfigMap).then(res=>{
            console.log("insertNewConfig res",res);
            newConfigUid = res.confUid;

            let modelBuildRecord={
              "modelUid":this.taskUid,
              "modelName":this.modelInformation.modelName,
              "modelDescription":this.modelInformation.modelDescribe,
              "basicModelId":this.modelList[this.selectIndex].id.toString(),
              "modelConfId":newConfigUid
            };

            buildANewModelRecord(modelBuildRecord).then(res=>{
              console.log("buildANewModelRecord res",res);
              // 建模后端需要map型的入参，之前为了配合java端的后端string化了。这里变回来
              newConfigMap.modelConfMap = newConfigMap.modelConfJson;

              let startModelMap={
                "uid":this.taskUid,
                "method":this.modelList[this.selectIndex].methodId,
                "algorithm":this.modelList[this.selectIndex].id.toString(),
                "modelConfMap":newConfigMap,
                "saveModelName":res.saveModelName
              };
              startModelling(startModelMap).then(res=>{
                console.log("startModelling res",res);

                this.$message({
                  type: 'success',
                  message: '模型、配置各项参数设置成功，跳转至建模监控页面，请稍后!'
                });

                this.timer = setTimeout(()=>{   //设置延迟执行
                  console.log('ok');
                  this.$router.push({
                    name:'modellingprocess',params:{
                      taskUid:this.taskUid,
                      dataSetType:this.dataSetType,
                      setModelName:this.modelInformation.modelName,
                      setModelDescribe:this.modelInformation.modelDescribe,
                      modelName:this.modelList[this.selectIndex].modelName,
                    }});
                },2000);

              },error => {
                console.log("startModelling error",error);
              })


            },error => {
              console.log("buildANewModelRecord error",error);
            })

          },error => {
            console.log("insertNewConfig error",error);
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      buildRequestMap(){
        let selectConfigItem = {};
        console.log("buildRequestMap modelList", this.modelList[this.selectIndex]);
        selectConfigItem.modelName=this.modelInformation.modelName+"的配置";
        selectConfigItem.dataSetName=this.dataSetName;
        selectConfigItem.configDescription=this.modelInformation.modelDescribe+"的配套超参数";
        selectConfigItem.basicModelId=this.modelList[this.selectIndex].id;
        selectConfigItem.modelType=this.dataSetType;
        let configMap = {};
        console.log("updateNewConfig parameterTableData",this.parameterTableData);
        for(let tempMap in this.parameterTableData){
          let key = this.parameterTableData[tempMap].parameterName;
          let value = this.parameterTableData[tempMap].parameterValue;
          configMap[key]=value;
        }
        console.log("updateNewConfig selectedDataSet",this.selectedDataSet);
        console.log("updateNewConfig configMap",configMap);
        selectConfigItem.modelConfMap=JSON.stringify(configMap);
        selectConfigItem.modelConfJson=configMap;
        console.log("updateNewConfig selectConfigItem",selectConfigItem);
        return selectConfigItem;
      },
    }
  }
</script>

<style scoped>

</style>
