<template>
  <el-row>
    <el-col :span="24" style="padding: 20px">
      <div class="grid-content bg-purple-dark">
      <el-steps :active="active" finish-status="success">
        <el-step title="设置种子关键字" description="填写一些关键字组合为种子URL"></el-step>
        <el-step title="启动爬虫" description="配置爬虫完成启动爬虫"></el-step>
        <el-step title="展示实时进度" description="展示爬虫爬取的实时进度"></el-step>
        <el-step title="结束" description="爬取完成或提前终止"></el-step>
      </el-steps>
      </div>
      <el-divider></el-divider>
    </el-col>
    <el-col :span="11" style="margin: 10px">
      <el-card class="box-card" align-center>
        <div slot="header" class="clearfix">
          <span>爬虫系统关键词配置</span>
        </div>
        <el-form :model="keyWordsForm" ref="keyWordsForm" label-width="100px" class="demo-dynamic">
          <el-form-item
            v-for="(keyWord, index) in keyWordsForm.keyWord"
            :label="'关键词' + index"
            :key="keyWord.key"
            :prop="'keyWord.' + index + '.value'"
            :rules="{
      required: true, message: '关键词不能为空', trigger: 'blur'
    }"
          >
            <el-input :disabled="isSubmit" v-model="keyWord.value" style="width: 70%"></el-input>
            <el-button @click.prevent="removeDomain(keyWord)" size="small">删除</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm()">提交</el-button>
            <el-button @click="addDomain">新增关键词</el-button>
            <el-button @click="resetForm('keyWordsForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </el-col>
    <el-col :span="12" style="margin: 10px">
      <el-card class="box-card" align-center>
        <div slot="header" class="clearfix">
          <span>爬取进度展示</span>
        </div>
        <el-button-group>
          <el-button type="primary" icon="el-icon-video-play" @click="startScrapy">启动</el-button>
          <el-button type="primary" icon="el-icon-circle-close" @click="stopScrapy">停止</el-button>
          <el-button type="primary" icon="el-icon-refresh-right" @click="reset">重置</el-button>
        </el-button-group>
        <time-line :processContents="processTestContents" style="margin: 20px"></time-line>
      </el-card>
    </el-col>

  </el-row>

</template>

<script>
import {setRootWords, startCrawl, stopCrawl} from "@/api/scrapyApi";
import {stompUrl} from "@/api/axiosApi";
import  Stomp from 'stompjs';
import SockJS from "sockjs-client";
import timeLine from '../buildmodel/components/timeLine'

export const MQTT_USERNAME = 'root' // mqtt连接用户名
export const MQTT_PASSWORD = 'root' // mqtt连接密码

export default {
  name: "scrapy",
  components: {
    timeLine,
  },
  data:function (){
    return{
      active:0,
      keyWordsForm: {
        keyWord: [{
          value: ''
        }]
      },
      taskUid:undefined,
      isSubmit:false,

      processTestContents:[],
    }
  },
  methods: {
    submitForm() {
      console.log("submitForm formName", this.keyWordsForm);
      let rootWordsList = this.keyWordsForm.keyWord;
      setRootWords(rootWordsList).then(res => {
        this.taskUid=res.uid;
        this.active = 1;
        console.log("setRootWords uid",this.taskUid);
        this.isSubmit=true;
        this.$message.info("成功设置爬取关键词，返回的UID："+this.taskUid);
        this.connect();
      })
    },
    resetForm(formName) {
      this.active=0;
      this.$refs[formName].resetFields();
    },
    removeDomain(item) {
      let index = this.keyWordsForm.keyWord.indexOf(item)
      if (index !== -1) {
        this.keyWordsForm.keyWord.splice(index, 1)
      }
    },
    addDomain() {
      this.keyWordsForm.keyWord.push({
        value: '',
        key: Date.now()
      });
    },

    onConnected:function(){
      //订阅的频道

      const topic = "/queue/scrapyCrawl_"+this.taskUid;
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
      let timeLineMap = {
        content:'论文编号：'+message.count+',论文标题：'
          +message.title+';DOI:'+message.DOI+';摘要:'+message.abstract,
        timestamp: message.time
      }
      this.processTestContents.push(timeLineMap);
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

    startScrapy(){
      this.$confirm('是否开始爬取', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'success'
      }).then(() => {
        startCrawl().then(res => {
          this.active=2;
          this.$message({
            type: 'info',
            message: '开始爬取'
          });
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    stopScrapy(){
      this.$confirm('是否停止爬取', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'success'
      }).then(() => {
        stopCrawl().then(res => {
          this.active = 3;
          this.$message({
            type: 'info',
            message: '终止爬取，稍后停止'
          });
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    reset(){

    }
  }
}
</script>

<style scoped>

</style>
