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
    <el-col :span="24">
      <el-tabs type="border-card" style="width: 95%;margin-left: 20px;margin-top: 20px">
        <el-tab-pane>
          <span slot="label"><i class="el-icon-date"></i> 任务配置</span>
          <el-form ref="form" :model="form" label-width="80px">
            <el-form-item label="任务名称" style="width: 40%">
              <el-input v-model="form.taskName"></el-input>
            </el-form-item>
            <el-form-item label="任务描述">
              <el-input type="textarea" v-model="form.taskDesc" style="width: 60%"></el-input>
            </el-form-item>
            <el-form-item label="任务类型">
              <el-select v-model="form.taskType" placeholder="请选择任务类型">
                <el-option label="建模" value="modeling"></el-option>
                <el-option label="预测" value="predict"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="任务ID" style="width: 40%">
              <el-input v-model="form.uid" readonly placeholder="创建任务后自动生成"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit">立即创建</el-button>
              <el-button @click="reset">重置</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="任务列表">
          <el-table
            :data="taskList"
            height="400"
            :default-sort = "{prop: 'startDate', order: 'descending'}"
            style="width: 100%">
            <el-table-column type="expand">
              <template slot-scope="props">
                <el-form label-position="left" inline class="demo-table-expand">
                  <el-form-item label="任务UID">
                    <span>{{ props.row.uid }}</span>
                  </el-form-item>
                  <el-form-item label="任务名称">
                    <span>{{ props.row.taskName }}</span>
                  </el-form-item>
                  <el-form-item label="任务描述">
                    <span>{{ props.row.taskDescription }}</span>
                  </el-form-item>
                  <el-form-item label="任务创建时间">
                    <template slot-scope="scope">{{props.row.startDate| dateYMDHMSFormat}}</template>
                    <!--<span>{{ props.row.startDate }}</span>-->
                  </el-form-item>
                  <el-form-item label="任务完成时间">
                    <span>{{ props.row.endDate }}</span>
                  </el-form-item>
                  <el-form-item label="任务数据集名(可选)">
                    <span>{{ props.row.databaseName }}</span>
                  </el-form-item>
                  <el-form-item label="任务数据表名(可选)">
                    <span>{{ props.row.dataSetTableName }}</span>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>

            <el-table-column
              label="任务UID"
              prop="uid">
            </el-table-column>
            <el-table-column
              label="任务名称"
              prop="taskName">
            </el-table-column>
            <el-table-column
              label="任务描述"
              prop="taskDescription">
            </el-table-column>
            <el-table-column
              label="创建时间"
              sortable
              prop="startDate">
              <template slot-scope="scope">{{scope.row.startDate| dateYMDHMSFormat}}</template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  @click="handleEdit(scope.$index, scope.row)">详情</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-col>
  </el-row>



</template>

<script>
  import {getTaskList,createTask} from '@/api/model'
  export default {
    name: 'taskmanagement',
    data() {
      return{
        buildActive:0,
        form: {
          uid: '',
          taskName: '',
          taskDesc: '',
          taskType: ''
        },
        taskList:[],
        loading: false,
      }
    },
    mounted: function(){
      getTaskList().then(res=>{
        console.log("res",res);
        this.taskList = res;
        console.log("taskList",this.taskList);
      },error => {

      })
    },
    methods:{
      handleEdit(index,row){
        console.log("index",index);
      },
      onSubmit(){
        if(this.form.taskName.trim()===''){
          this.$message.error('未输入任务名称');
        }else {
          this.$confirm('确认创建新任务！是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'success'
          }).then(() => {
            this.form.taskName=this.form.taskName.trim();
            createTask(this.form).then(res=>{
              console.log("res",res);
              console.log("form",this.form);
              this.$message({
                type: 'success',
                message: '生成UID：'+res.taskId+' 跳转中!'
              });
              this.loading=true;
              this.timer = setTimeout(()=>{   //设置延迟执行
                console.log('ok');
                this.$router.push({name:'datasetmanagement',params:{taskUid:res.taskId}});
              },2000);
            },error => {
              console.log("error",error);
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          });
        }
      },
      reset(){
        this.form={
          uid: '',
          taskName: '',
          taskDescribe: '',
          taskType: ''
        }
      }
    }
  }
</script>

<style scoped>
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
</style>
