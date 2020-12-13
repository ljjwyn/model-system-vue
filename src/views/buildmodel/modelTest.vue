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
          <span>模型测试</span>
        </div>
        <el-col :span="12" style="padding: 5px">
          <el-card class="box-card" align-center style="margin-top: 10px">
            <div slot="header" class="clearfix">
              <span>模型基本信息</span>
            </div>
            <div v-if="taskUid">
              <el-tag><strong>taskUid: </strong>{{taskUid}}</el-tag><br/>
              <el-tag style="margin-top: 5px">模型类型: <strong style="color: red">{{dataSetType}}</strong></el-tag><br/>
              <el-tag style="margin-top: 5px">模型名: <strong style="color: red">{{setModelName}}</strong></el-tag><br/>
              <el-tag style="margin-top: 5px">模型描述: <strong style="color: red">{{setModelDescribe}}</strong></el-tag><br/>
              <el-tag style="margin-top: 5px">使用的基础模型名: <strong style="color: red">{{modelName}}</strong></el-tag><br/>
            </div>
            <div v-else="taskUid">
              <aside style="padding: 20px">Debug状态，未正确跳转，如想建模请从任务管理开始！</aside>
            </div>
          </el-card>
        </el-col>

        <el-col :span="12" style="padding: 5px">
          <el-card class="box-card" align-center style="margin-top: 10px">
            <div slot="header" class="clearfix">
              <span>批次测试准确率</span>
            </div>
            <gauge :percent="percent" style="margin: 10px"></gauge>
          </el-card>
        </el-col>

        <el-col :span="12" style="padding: 5px">
          <el-card class="box-card" align-center style="margin-top: 10px">
            <div slot="header" class="clearfix">
              <span>批次测试阶梯图</span>
            </div>
            <line-plot-test :processData="processData" style="margin: 10px"></line-plot-test>
          </el-card>
        </el-col>

        <el-col :span="12" style="padding: 5px">
          <el-card class="box-card" align-center style="margin: 10px">
            <div slot="header" class="clearfix">
              <span>预测批次详情</span>
            </div>
            <time-line :processContents="processTestContents"></time-line>
          </el-card>
        </el-col>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
  import linePlotTest from './components/linePlotTest'
  import timeLine from './components/timeLine'
  import gauge from './components/gauge'
  import  Stomp from 'stompjs';
  import SockJS from "sockjs-client";
  import {modelTest,getModelTestConfig, modelTestRE} from '@/api/model'
  import {stompUrl} from "@/api/axiosApi"

  export const MQTT_USERNAME = 'root' // mqtt连接用户名
  export const MQTT_PASSWORD = 'root' // mqtt连接密码

  export default {
    name: 'modelTest',
    components:{
      linePlotTest,
      timeLine,
      gauge
    },
    data:function() {
      return{
        buildActive:4,
        client: null,
        processTestContents:[],
        processData:[],
        percent:0,
      }
    },
    computed:{
      dataSetType(){
        return this.$route.params.dataSetType
      },
      taskUid(){

        return this.$route.params.taskUid
        //return '34324';
      },
      setModelName(){
        return this.$route.params.setModelName
      },
      setModelDescribe(){
        return this.$route.params.setModelDescribe
      },
      modelName(){
        return this.$route.params.modelName
      }
    },
    mounted(){
      if(this.taskUid!==undefined) {this.connect(); this.startTest()}
      else this.$message.info('taskUid为空，若进行测试模式请查看下头的TODO！');
      //TODO 测试界面展示，记得及时注释掉
      //TODO 测试界面，设置一个假的uid
      // this.connect();
    },
    beforeRouteLeave(to, form, next) {
      if(this.taskUid!==undefined){
        this.client.disconnect();
        console.log('消息队列接口已关闭');
      }
      console.log('监听标签页变化');
      next()
    },
    methods:{
      onConnected:function(){
        //订阅的频道

        const topic = "/queue/modelTestProcess_"+this.taskUid;
        //TODO 打开下面这个注释可以结合python端的rabbitmq test程序测试stomp接口
        // const topic = "/queue/modelProcessTest";
        console.log("onConnected topic", topic);
        this.client.subscribe(topic,this.responseCallback,this.onFailed);

      },
      onFailed:function(msg){
        console.log("MQ Failed:" + msg);
      },
      //成功时的回调函数
      responseCallback:function(msg){
        //接收消息的处理
        let message = eval("("+msg.body+")")
        console.log("MQ msg=>", message);
        if (message.flag === 0){
          this.percent = message.accuracy
          let tempMap1 = {
            "batchId": message.batchId,
            "value": message.total,
            "key": '总条目数'
          };
          let tempMap2 = {
            "batchId": message.batchId,
            "value": message.correct,
            "key": '预测正确条目数'
          }
          this.processData.push(tempMap1);
          this.processData.push(tempMap2);

          //凑timeline的入参格式
          let timeLineMap = {
            content:'批次预测准确句子数：'+message.correct+',句子总数：'
              +message.total+'批次准确率'+message.accuracy * 10+'%',
            timestamp: message.time
          }
          this.processTestContents.push(timeLineMap);
        }else {
          this.percent = message.accuracy+10;
          this.$message.info('测试完成');
          let timeLineMap = {
            content:'测试结束！总预测准确率'+message.accuracy * 10+'%',
            timestamp: message.time
          }
          this.processTestContents.push(timeLineMap);

          this.$confirm('模型评估完成，总准确率'+message.accuracy * 10+'%，是否跳转到模型管理', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'success'
          }).then(() => {
            this.timer = setTimeout(()=>{   //设置延迟执行
              console.log('跳转模型管理');
              this.$router.push({
                name:'modelmanagement'});
            },2000);
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          });
        }


      },
      //连接
      connect:function(){
        let ws = new SockJS(stompUrl+'stomp');
        this.client=Stomp.over(ws);
        // SockJS does not support heart-beat: disable heart-beats
        this.client.heartbeat.outgoing = 0;
        this.client.heartbeat.incoming = 0;
        const headers = {
          login: MQTT_USERNAME,
          password: MQTT_PASSWORD
        };
        this.client.connect(MQTT_USERNAME, MQTT_PASSWORD, this.onConnected,this.onFailed,'/');
      },

      goModelManagement(){
        this.$router.push({
          name:'modelmanagement'});
      },

      startTest() {
        getModelTestConfig(this.taskUid).then(res => {
          console.log("getModelTestConfig res", res);
          // 编号小于5，使用第一套接口，主要是文本分类与命名实体识别的测试
          if (res.algorithm<=5){
            modelTest(res).then(res => {
              console.log("modelTest res", res);
            },error => {
              console.log("modelTest error", error);
            })
          // 编号大于5，使用第二套接口，面向关系抽取模型的测试。
          }else if(res.algorithm > 5){
            modelTestRE(res).then(res => {
              console.log("modelTestRE res", res);
            }, error => {
              console.log("modelTestRE error", error);
            })
          }
        },error => {
          console.log("getModelTestConfig error", error);
        })
      },

    }
  }
</script>

<style scoped>

</style>
