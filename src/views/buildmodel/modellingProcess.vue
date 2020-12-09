<template>
  <el-row>
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
          <span>建模流程监控</span>
        </div>
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
          <el-button  style="padding: 10px;margin: 10px" type="primary" round @click="goModelManagement">模型管理</el-button>
        </el-card>

        <div>
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
            <el-card class="box-card" align-center style="margin-top: 10px">
              <el-progress :percentage="modellingProcess" :status="modellingProcessStatus"></el-progress>
            </el-card>
          </el-col>
          <el-col :span="12" style="padding: 5px">
            <el-card class="box-card" align-center style="margin: 10px">
              <div slot="header" class="clearfix">
                <span>建模进度(准确率)</span>
              </div>
              <time-line :processContents="processAccContents"></time-line>
            </el-card>
          </el-col>
          <el-col :span="12" style="padding: 5px">
            <el-card class="box-card" align-center style="margin: 10px">
              <div slot="header" class="clearfix">
                <span>建模进度(损失)</span>
              </div>
              <time-line :processContents="processLossContents"></time-line>
            </el-card>
          </el-col>
        </div>


      </el-card>
    </el-col>
  </el-row>
</template>

<script>
  import MdInput from '@/components/MDinput'
  import linePlot from './components/linePlot'
  import linePlotLoss from './components/linePlotLoss'
  import timeLine from './components/timeLine'
  import  Stomp from 'stompjs';
  import SockJS from "sockjs-client";

  export const MQTT_SERVICE = 'ws://localhost:15674/stomp' // mqtt服务地址
  export const MQTT_USERNAME = 'root' // mqtt连接用户名
  export const MQTT_PASSWORD = 'root' // mqtt连接密码

  export default {
    name: 'modellingProcess',
    components:{
      linePlot,
      linePlotLoss,
      timeLine
    },
    data(){
      return{
        buildActive:3,
        client: null,//Stomp.client(MQTT_SERVICE)
        processData:[],
        processDataLoss:[],
        processAccContents:[],
        processLossContents:[],
        modellingProcess:0,
        modellingProcessStatus:null
      }
    },
    computed:{
      dataSetType(){
        return this.$route.params.dataSetType
      },
      taskUid(){
        return this.$route.params.taskUid
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
      if(this.taskUid!==undefined) this.connect();
      else this.$message.info('taskUid为空，若进行测试模式请查看下头的TODO！');
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
        const topic = "/queue/modelProcess_"+this.taskUid;
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
        //凑timeline的入参格式
        this.modellingProcess = message.process;
        if(message.process===100){
          this.modellingProcessStatus = 'success';
          let contentAcc = '建模完成。准确率：'+message.train_acc;
          let contentLoss = '建模完成。损失：'+message.loss;
          let timeAcc = message.time;
          let tempMapAcc = {
            content: contentAcc,
            timestamp: timeAcc
          };
          let tempMapLoss = {
            content: contentLoss,
            timestamp: timeAcc
          };
          this.processAccContents.push(tempMapAcc);
          this.processLossContents.push(tempMapLoss);
          this.$alert('建模完成！', '提示', {
            confirmButtonText: '确定',
          });
        }else {
          this.processData.push(message);
          this.processDataLoss.push(message);
          let contentAcc = '模型迭代第：'+message.batchId+'轮。准确率：'+message.train_acc;
          let contentLoss = '模型迭代第：'+message.batchId+'轮。损失：'+message.loss;
          let timeAcc = message.time;
          let tempMapAcc = {
            content: contentAcc,
            timestamp: timeAcc
          };
          let tempMapLoss = {
            content: contentLoss,
            timestamp: timeAcc
          };
          this.processAccContents.push(tempMapAcc);
          this.processLossContents.push(tempMapLoss);
        }

      },
      //连接
      connect:function(){
        let ws = new SockJS('http://localhost:15674/stomp');
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

      testData() {
        //this.processData.push(121);
      },

    }

  }

</script>

<style scoped>

</style>
