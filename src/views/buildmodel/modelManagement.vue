<template>
  <el-row>
    <el-col :span="22" :offset="1" >
      <el-card class="box-card" align-center style="margin-top: 10px">
        <div slot="header" class="clearfix">
          <span>模型管理</span>
        </div>
        <el-table
          :data="modelList"
          height="400"
          stripe
          :default-sort = "{prop: 'startTime', order: 'descending'}"
          style="width: 100%">
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="模型UID">
                  <span>{{ props.row.modelUid }}</span>
                </el-form-item>
                <el-form-item label="模型名称">
                  <span>{{ props.row.modelName }}</span>
                </el-form-item>
                <el-form-item label="模型描述">
                  <span>{{ props.row.modelDescription }}</span>
                </el-form-item>
                <el-form-item label="模型创建时间">
                  <template slot-scope="scope">{{props.row.startTime| dateYMDHMSFormat}}</template>
                  <!--<span>{{ props.row.startDate }}</span>-->
                </el-form-item>
                <el-form-item label="模型完成时间">
                  <span>{{ props.row.endTime }}</span>
                </el-form-item>
                <el-form-item label="模型超参数ID">
                  <span>{{ props.row.modelConfId }}</span>
                </el-form-item>
                <el-form-item label="基础模型ID">
                  <span>{{ props.row.basicModelId }}</span>
                </el-form-item>
                <el-form-item label="模型建模进度%">
                  <span>{{ props.row.buildingProcess }}</span>
                </el-form-item>
                <el-form-item label="模型测试准确率%">
                  <span>{{ props.row.modelTestAccuracy }}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column
            label="模型UID"
            :show-overflow-tooltip="true"
            prop="modelUid">
          </el-table-column>
          <el-table-column
            label="模型名称"
            width="120px"
            prop="modelName">
          </el-table-column>
          <el-table-column
            label="模型描述"
            :show-overflow-tooltip="true"
            prop="modelDescription">
          </el-table-column>
          <el-table-column
            label="创建时间"
            sortable
            prop="startTime">
            <template slot-scope="scope">{{scope.row.startTime| dateYMDHMSFormat}}</template>
          </el-table-column>
          <el-table-column
            label="模型进度%"
            width="150px"
            prop="buildingProcess">
            <template slot-scope="scope">
              <el-progress :text-inside="true" :stroke-width="16" :status="scope.row.successStatue" :percentage="scope.row.buildingProcess"></el-progress>
            </template>
          </el-table-column>
          <el-table-column
            label="模型评估%"
            width="100px"
            prop="modelTestAccuracy">
          </el-table-column>
          <el-table-column label="操作" width="220px">
            <template slot-scope="scope">
              <el-button
                v-if="scope.row.successStatue!=='success'"
                size="mini"
                type="warning"
                @click="handleEdit(scope.$index, scope.row)">进度</el-button>
              <el-button
                v-if="scope.row.modelTestAccuracy===0"
                size="mini"
                type="success"
                @click="handleModelTest(scope.$index, scope.row)">评估</el-button>
              <el-button
                size="mini"
                @click="getModelInformation(scope.$index, scope.row)">详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </el-col>
    <el-col :span="22" :offset="1" style="margin-bottom: 10px;margin-top:10px" >
      <el-tabs type="border-card" v-model="activeName">

        <el-tab-pane name="first">
          <span slot="label"><i class="el-icon-set-up"></i> 模型详细信息</span>
          <el-card class="box-card" align-center v-if="selectModel">
            <el-col :span="10" style="margin: 10px">
              <el-tag><strong>模型Uid: </strong>{{selectModel.modelUid}}</el-tag><br/>
              <el-tag style="margin-top: 5px">模型名称: <strong style="color: red">{{selectModel.modelName}}</strong></el-tag><br/>
              <el-tag style="margin-top: 5px">模型描述: <strong style="color: red">{{selectModel.modelDescription}}</strong></el-tag><br/>
              <el-tag style="margin-top: 5px">建模开始时间: <strong style="color: red">{{selectModel.startTime}}</strong></el-tag><br/>
              <el-tag style="margin-top: 5px">建模完成时间: <strong style="color: red">{{selectModel.endTime}}</strong></el-tag><br/>
              <el-tag style="margin-top: 5px">生产模型名称: <strong style="color: red">{{selectModel.saveModelName}}</strong></el-tag><br/>
            </el-col>
            <div style="margin-top: 50px">
              <el-col :span="6">
                <strong>模型进度</strong>
                <el-progress type="circle" :percentage="selectModel.buildingProcess" :status="selectModel.isSuccess"></el-progress>
              </el-col>
              <el-col :span="6">
                <strong>模型测试准确率</strong>
                <el-progress type="circle" :percentage="selectModel.modelTestAccuracy"></el-progress>
              </el-col>
            </div>

          </el-card>
          <el-card v-else>
            <strong>请选择一个模型查看详情！</strong>
          </el-card>
        </el-tab-pane>

        <el-tab-pane name="second">
          <span slot="label"><i class="el-icon-set-up"></i> 模型建模信息</span>
          <el-col :span="24" style="padding: 5px">
            <el-tag>选中模型为：{{selectModelName}}</el-tag>
          </el-col>
          <strong v-if="processAccContents.length===0" style="color:red">选择的模型没有建模进度记录，无法查看！</strong>
          <div v-else>
            <el-col :span="12" style="padding: 5px">
              <el-card class="box-card" align-center style="margin-top: 10px">
                <div slot="header" class="clearfix">
                  <span>模型训练准确率</span>
                </div>
                <line-plot :processData="processData" style="margin: 10px"></line-plot>
              </el-card>
            </el-col>
            <el-col :span="12" style="padding: 5px">
              <el-card class="box-card" align-center style="margin-top: 10px">
                <div slot="header" class="clearfix">
                  <span>模型训练损失</span>
                </div>
                <line-plot-loss :processDataLoss="processDataLoss" style="margin: 10px"></line-plot-loss>
              </el-card>
            </el-col>
            <el-col :span="22" :offset="1">
              <el-card class="box-card" align-center style="margin: 10px">
                <div slot="header" class="clearfix">
                  <span>建模进度详情</span>
                </div>
                <time-line :processContents="processAccContents"></time-line>
              </el-card>
            </el-col>
          </div>
        </el-tab-pane>

        <el-tab-pane name="third">
          <span slot="label"><i class="el-icon-set-up"></i> 模型参数信息</span>
          <el-table
            :data="parameterTableData"
            stripe
            highlight-current-row
            style="width: 80%;margin: auto">
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
                <el-input style="width: 65%" disabled v-model="scope.row.parameterValue" ></el-input>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-col>
  </el-row>
</template>

<script>
import {getTableData, getModelBuildRecord, preRunModel} from '@/api/test'
  import linePlot from './components/linePlot'
  import linePlotLoss from './components/linePlotLoss'
  import timeLine from './components/timeLine'

  export default {
    name: 'modelManagement',
    components:{
      linePlot,
      linePlotLoss,
      timeLine
    },
    data:function f() {
      return{
        modelList:[{
          modelUid:'swqdw3213',
          modelName:'testModel',
          modelDescription:'测试模型',
          startTime:'2020-11-24 12:58:25',
          endTime:'2020-11-25 15:00:26',
          modelConfId:'bilstmSample',
          basicModelId:'5',
          buildingProcess:78
        }],
        successList:[],
        processData:[],
        processDataLoss:[],
        processAccContents:[],
        selectModelName:'',
        activeName:'first',
        selectModel:undefined,
        parameterTableData:[],
      }
    },
    mounted(){
      getTableData().then(res => {
        console.log("getTableData api tableData :", res);
        this.modelList = res.data;
        for(let index=0;index<this.modelList.length;index++){
          if(this.modelList[index].buildingProcess >= 100){
            this.modelList[index].successStatue = "success";
          }else {
            this.modelList[index].successStatue = "exception";
          }
        }
      },error => {
        console.log("getTableData error :", error);
        this.$message.error('请求现有模型列表异常！严重的故障哈！');
      })
    },
    methods: {
      handleEdit(index, row) {
        console.log("handleEdit index", index);
        console.log("handleEdit row", row);
        this.$confirm('跳转到建模监控界面！是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'success'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '跳转中!'
          });

          this.timer = setTimeout(()=>{   //设置延迟执行
            console.log('ok');
            this.$router.push({
              name:'modellingprocess',params:{
                taskUid:row.modelUid,
                dataSetType:'模型管理界面跳转，不展示这个参数',
                setModelName:row.modelName,
                setModelDescribe:row.modelDescription,
                modelName:row.basicModelId,
              }});
          },2000);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      handleModelTest(index, row){
        this.$confirm('进行模型评估！是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'success'
        }).then(() => {
          this.timer = setTimeout(()=>{   //设置延迟执行
            console.log('ok');
            this.$router.push({
              name:'modeltest',params:{
                taskUid:row.modelUid,
                dataSetType:'模型管理界面跳转，不展示这个参数',
                setModelName:row.modelName,
                setModelDescribe:row.modelDescription,
                modelName:row.basicModelId,
              }});
          },2000);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      getModelInformation(index, row){
        this.processData = [];
        this.processDataLoss = [];
        this.processAccContents = [];
        this.selectModelName = row.modelName;
        this.activeName = 'first'
        this.selectModel = row;
        this.getModelMoreInfo(row.modelConfId);
        if (row.buildingProcess===100) this.selectModel.isSuccess = 'success';
        else this.selectModel.isSuccess = 'exception';
        getModelBuildRecord(row.modelUid).then(res => {
          console.log("getModelBuildRecord res",res);
          let modelBuildProcess = res.modelBuildProcess;
          if(modelBuildProcess.length===0){
            this.$message.info("模型还未开始创建，或未保存建模记录");
          }else{
            this.processData = modelBuildProcess;
            this.processDataLoss = modelBuildProcess;
            for(let index=0;index<modelBuildProcess.length;index++){
              let contentAcc = '模型迭代第：'+modelBuildProcess[index].batchId
                +'轮; 训练集准确率 => '+modelBuildProcess[index].train_acc +'; 建模损失 => '+modelBuildProcess[index].loss;
              let timeAcc = modelBuildProcess[index].time;
              let tempMapAcc = {
                content: contentAcc,
                timestamp: timeAcc,
                size:'medium',
                type:'primary',
                icon:'el-icon-more'

              };
              this.processAccContents.push(tempMapAcc);
            }
          }
        })
      },
      getModelMoreInfo(modelConfigUid){
        this.parameterTableData=[];
        preRunModel({"configId":modelConfigUid}).then(
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
    },
  }
</script>

<style scoped>

</style>
