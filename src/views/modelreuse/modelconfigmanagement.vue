<template>
  <el-row style="margin-top: 20px">
    <el-col :span="22" :offset="1">
      <el-card align-center class="box-card">
        <el-col :span="24" style="margin-bottom: 10px">
          <label>模型配置列表</label>
          <el-select style="margin-left: 5px" v-model="selectedConfig" filterable clearable placeholder="请选择配置集">
            <el-option
              v-for="(item,index) in modelConfigList"
              :key="item.modelName"
              :label="item.modelName"
              :value="index">
            </el-option>
          </el-select>
          <el-button size="small" style="margin-left: 5px" type="primary" round @click="editConfig(selectedConfig)">查看</el-button>
          <el-button size="small" type="success" @click="setAsDefaultConfig" round>设为默认参数</el-button>
          <el-button size="small" type="primary" @click="ModelConstruct" round :loading="constructLoading">结构展示</el-button>
        </el-col>
        <el-col :span="20" style="margin-bottom: 10px" v-show="showConfigTabs">
          <el-divider></el-divider>
          <strong>配置tabs</strong>
          <el-col style="margin-top: 5px" v-if="modelConfigList[0]">
            <el-tag><strong>配置UID: </strong>{{modelConfigList[selectedConfig].uid}}</el-tag>
            <el-tag type="success"><strong>任务类型: </strong>{{modelConfigList[selectedConfig].modelType}}</el-tag>
            <el-tag @click="ModelConstruct" type="danger"><strong>基础模型编号: </strong>{{modelConfigList[selectedConfig].basicModelId}}</el-tag>
          </el-col>
        </el-col>
      </el-card>
    </el-col>
    <el-col v-loading="constructLoading" :span="22" :offset="1" style="margin-top: 10px">
      <el-card align-center class="box-card">
        <div slot="header" class="clearfix">
          <span>配置详情</span>
        </div>
        <el-button type="primary" size="small" :disabled="isEdit"  @click="updateNewConfig">保存配置</el-button>
        <el-tabs style="" v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="配置设置" name="first">
            <el-form ref="form" :model="modelConfigForm" label-width="80px">
              <el-form-item label="参数名称">
                <el-input :disabled="isEdit" v-model="modelConfigForm.configName" style="width: 200px"></el-input>
              </el-form-item>
              <el-form-item label="数据集">
                <el-select :disabled="isEdit" style="margin-left: 5px" v-model="selectedDataSet" clearable placeholder="请选择数据集">
                  <el-option
                    v-for="item in dataSetList"
                    :key="item"
                    :label="item"
                    :value="item">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="配置描述">
                <el-input :disabled="isEdit" type="textarea" style="width: 65%" v-model="modelConfigForm.configDescribe"></el-input>
              </el-form-item>
              <el-button style="margin-left: 5px" type="primary" round @click="lockInput()">{{lockButton}}</el-button>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="配置详情" name="second">
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
            <el-button style="margin-left: 5px" type="primary" round @click="lockTable()">{{lockTableButton}}</el-button>
          </el-tab-pane>
          <el-tab-pane label="基础模型信息" name="third">
            <el-col :span="14">
              <el-form ref="form" :model="basicModel" label-width="80px">
                <el-form-item label="模型ID">
                  <el-input readonly v-model="basicModel.id" style="width: 200px"></el-input>
                </el-form-item>
                <el-form-item label="模型名">
                  <el-input readonly v-model="basicModel.modelName" style="width: 200px"></el-input>
                </el-form-item>
                <el-form-item label="模型类别">
                  <el-input readonly v-model="basicModel.modelCatalog" style="width: 200px"></el-input>
                </el-form-item>
                <el-form-item label="绑定参数">
                  <el-input readonly v-model="basicModel.modelDefaultConf" style="width: 200px"></el-input>
                </el-form-item>
                <el-form-item label="模型描述">
                  <el-input readonly type="textarea" style="width: 80%" v-model="basicModel.modelDec"></el-input>
                </el-form-item>
              </el-form>
            </el-col>
            <el-col :span="10">
              <el-input readonly type="textarea" rows="15" v-model="modelConstruct"></el-input>
            </el-col>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
  import {getModelConfList,getDataSetType,insertNewConfig,
    getModelConstruct,setAsInit,searchBasicModel} from '@/api/modelConfigApi';
  import {deepClone} from '@/utils/index'
  export default {
    name: 'modelconfigmanagement',
    data(){
      return{
        ceshi:'李佳洁无敌',
        modelConfigList:[],
        selectedConfig:0,
        modelConfigForm:{
          "configName":'',
          "configDescribe":'',
          "configDataSet":''
        },
        selectedDataSet:'',
        showConfigTabs:false,
        dataSetList:[],
        activeName: 'first',
        isEdit:true,
        lockButton:'解锁',
        parameterTableData:[],
        isTableLock:true,
        lockTableButton:'解锁',
        basicModel:{},
        modelConstruct:'',
        constructLoading:false,
      }
    },
    mounted:function(){
      getModelConfList().then(res=>{
        console.log("getModelConfList res",res);
        this.modelConfigList = res;
      },error=>{

      })
    },
    methods:{
      editConfig(index){
        //还原上一波修改的参数
        this.activeName='first';
        this.isEdit=true;
        this.lockButton='解锁';
        this.parameterTableData=[];
        this.isTableLock=true;
        this.lockTableButton='解锁';
        this.showConfigTabs=false;

        console.log("editConfig index",index);
        this.showConfigTabs = true;
        this.modelConfigForm.configName=this.modelConfigList[index].modelName;
        this.modelConfigForm.configDescribe=this.modelConfigList[index].configDescription;
        this.modelConfigForm.configDataSet=this.selectedDataSet=this.modelConfigList[index].dataSetName;
        let parameterMap=eval("("+this.modelConfigList[index].modelConfMap+")");
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
        console.log("editConfig parameterTableData",this.parameterTableData);
        getDataSetType(this.modelConfigList[index].modelType).then(res=>{
          console.log("getDataSetType res",res);
          this.dataSetList = res;
        },error => {

        })
      },
      handleClick(tab, event) {
        console.log(tab, event);
      },
      lockInput(){
        if(this.isEdit===true){
          this.isEdit=false;
          this.lockButton="锁定";
          console.log("lockInput isEdit true=>false");
        }else {
          this.isEdit=true;
          this.lockButton="解锁";
          console.log("lockInput isEdit false=>true");
        }
      },
      lockTable(){
        console.log("lockTable", this.parameterTableData);
        if(this.isTableLock===true){
          this.isTableLock=false;
          this.lockTableButton="锁定";
          console.log("lockTable isTableLock true=>false");
        }else {
          this.isTableLock=true;
          this.lockTableButton="解锁";
          console.log("lockTable isTableLock false=>true");
        }
      },
      buildRequestMap(){
        let selectConfigItem = deepClone(this.modelConfigList[this.selectedConfig]);
        selectConfigItem.modelName=this.modelConfigForm.configName;
        selectConfigItem.dataSetName=this.selectedDataSet;
        selectConfigItem.configDescription=this.modelConfigForm.configDescribe;
        let configMap = {};
        console.log("updateNewConfig parameterTableData",this.parameterTableData);
        for(let tempMap in this.parameterTableData){
          console.log("updateNewConfig tempMap",tempMap);
          let key = this.parameterTableData[tempMap].parameterName;
          let value = this.parameterTableData[tempMap].parameterValue;
          configMap[key]=value;
        }
        console.log("updateNewConfig selectedDataSet",this.selectedDataSet);
        console.log("updateNewConfig configMap",configMap);
        selectConfigItem.modelConfMap=JSON.stringify(configMap);
        console.log("updateNewConfig selectConfigItem",selectConfigItem);
        return selectConfigItem;
      },
      updateNewConfig(){
        let requestMap = this.buildRequestMap();
        //TODO 模型配置的入参前端校验可以搞一下。
        if(requestMap.modelName===''){
          this.$message({
            type: 'error',
            message: '创建失败!配置名为空!'
          });
        }else {
          this.$confirm('新建模型配置, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            insertNewConfig(requestMap).then(res=>{
              console.log("updateNewConfig res", res);
              this.$message({
                type: 'success',
                message: '创建成功!新配置UID:'+res.confUid
              });
            }, error=>{
              this.$message({
                type: 'error',
                message: '创建失败!后端系统错误!'
              });
              console.log("updateNewConfig error", error);
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消创建'
            });
          });
        }

      },
      setAsDefaultConfig(){
        let requestMap = deepClone(this.modelConfigList[this.selectedConfig]);
        this.$confirm('设置为模型默认参数, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          setAsInit(requestMap.uid,requestMap.basicModelId).then(res=>{
            console.log("setAsDefaultConfig res", res);
            this.$message({
              type: 'success',
              message: '更新为默认配置！'
            });
          }, error=>{
            this.$message({
              type: 'error',
              message: '更新失败!后端系统错误!'
            });
            console.log("setAsDefaultConfig error", error);
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消更新'
          });
        });
      },
      ModelConstruct(){
        this.constructLoading=true;
        let requestMap = deepClone(this.modelConfigList[this.selectedConfig]);
        this.$confirm('基于模型配置查询模型结构, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          searchBasicModel(requestMap.basicModelId).then(res=>{
            console.log("searchBasicModel res",res);
            this.basicModel=deepClone(res);
          },error => {
            console.log("searchBasicModel error",error);
          })
          getModelConstruct(requestMap).then(res=>{
            console.log("ModelConstruct res", res);
            this.modelConstruct = res.construct;
            this.activeName='third';
            this.constructLoading=false;
            this.$message({
              type: 'success',
              message: '模型结构查询成功！'
            });
          }, error=>{
            this.$message({
              type: 'error',
              message: '查询失败!后端系统错误!'
            });
            console.log("setAsDefaultConfig error", error);
          })
        }).catch(() => {
          this.constructLoading=false;
          this.$message({
            type: 'info',
            message: '已取消查询'
          });
        });
      }

    }
  }
</script>

<style scoped>

</style>
