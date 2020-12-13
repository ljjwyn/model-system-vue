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
                @click="handleEdit(scope.$index, scope.row)">详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
  import {getTableData} from '@/api/test'

  export default {
    name: 'modelManagement',
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
      }
    },
  }
</script>

<style scoped>

</style>
