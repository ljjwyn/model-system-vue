<template>
  <el-row style="padding: 15px">
    <el-col :span="24" style="margin: 10px"><div class="grid-content bg-purple-dark">
      <el-steps :active="active" finish-status="success">
        <el-step title="上传预测数据集" description="上传用于批量验证的数据集"></el-step>
        <el-step title="选择模型" description="根据数据集的任务类型选择预测用的模型"></el-step>
        <el-step title="开始批量验证" description="后台启动模型进行批量验证"></el-step>
        <el-step title="下载结果" description="下载批量验证结果数据集"></el-step>
      </el-steps>
    </div>
      <el-divider></el-divider>
    </el-col>
    <el-card>
      <div slot="header" class="clearfix">
        <span>预测文件上传</span>
      </div>

      <el-col :span="12" style="padding: 10px">
        <div>
          <label style="color: red">数据集名称*</label>
          <el-input placeholder="输入数据集名称" style="width: 200px"  v-model="uploadDataSetName"></el-input>
        </div>
        <div style="margin-top: 10px">
          <label style="color: red">数据集类型*</label>
          <el-select style="margin-left: 5px" v-model="selectCatalog" placeholder="请选择数据集">
            <el-option
              v-for="item in catalogList"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </div>
        <el-input style="margin-top: 10px;width: 80%" type="textarea" placeholder="数据集描述" rows="3"  v-model="uploadDataSetDescribe"></el-input>
      </el-col>
      <el-col :span="12" style="padding: 10px">
        <label>预测数据集</label>
        <el-tag closable style="margin-top: 5px">
          请单独长传预测数据集一个文件。请务必填写文件的基本信息
        </el-tag>
         <el-upload
          ref="upload"
          style="width: 200px;margin-top: 5px"
          class="upload-demo"
          :action="uploadUrl"
          :on-preview="handlePreviewUpload"
          :on-remove="handleRemoveUpload"
          :on-progress="uploadFileProcess"
          :before-remove="beforeRemoveUpload"
          multiple
          :limit="1"
          :file-list="fileList"
          :http-request="uploadFile"
          :on-exceed="handleExceedUpload"
          :auto-upload="false"
        >
          <el-button :disabled="isDataSetName" slot="trigger" size="small" type="primary">选取文件</el-button>
          <el-button :disabled="isDataSetName" style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
          <div slot="tip" class="el-upload__tip">只能上传文本文件，且不超过10M</div>
        </el-upload>
        <!-- 进度条 -->
        <el-progress v-if="progressFlag" :percentage="percentage"></el-progress>
      </el-col>
    </el-card>
    <el-card style="margin-top: 10px">
      <div slot="header" class="clearfix">
        <span>模型配置与预测</span>
      </div>
      <el-col v-if="isUploadFile===false" :span="12" style="padding: 10px">
        <aside style="padding: 20px">请选择数据集类型</aside>
      </el-col>
      <el-col v-else :span="12">
        <el-tag><strong>taskUid: </strong>{{taskUid}}</el-tag><br/>
        <el-tag style="margin-top: 5px">选择的数据集类型是: <strong style="color: red">{{selectCatalog}}</strong></el-tag><br/>
        <el-tag style="margin-top: 5px">根据您选择的数据集类型为您筛选出: <strong style="color: red">{{modelCount}}</strong>个模型</el-tag>
        <el-col style="margin-top: 5px" >
          <el-col style="margin-top: 5px">
            <label>选择模型</label>
            <el-select @change="getBuildedModel" style="padding: 10px" v-model="selectIndex" filterable clearable placeholder="请选择模型">
              <el-option
                v-for="(item,index) in modelList"
                :key="item.modelName"
                :label="item.modelName"
                :value="index">
              </el-option>
            </el-select>
          </el-col>
          <el-col style="margin-top: 5px">
            <label>选择模型</label>
            <el-select @change="startPredict" style="padding: 10px" v-model="selectModelIndex" filterable clearable placeholder="请选择模型">
              <el-option
                v-for="(item,index) in modelBuildRecordList"
                :key="item.saveModelName"
                :label="item.saveModelName"
                :value="index">
              </el-option>
            </el-select>
          </el-col>
          <el-button style="margin: 5px" @click="confirmModel"  size="small" type="primary">确认</el-button>
        </el-col>
      </el-col>
      <el-col :span="12">
        <el-col v-if="modelBuildRecordList[selectModelIndex]" style="padding: 10px">
          <strong>模型简述</strong>
          <el-tag style="margin: 5px" ><strong>模型ID: </strong>{{modelBuildRecordList[selectModelIndex].modelUid}}</el-tag>
          <el-tag style="margin: 5px" type="danger"><strong>模型名称: </strong>{{modelBuildRecordList[selectModelIndex].modelName}}</el-tag>
          <el-tag style="margin: 5px" type="info"><strong>模型创建时间: </strong>{{modelBuildRecordList[selectModelIndex].startTime}}</el-tag>
          <el-tag style="margin: 5px" type="success"><strong>模型完成时间: </strong>{{modelBuildRecordList[selectModelIndex].endTime}}</el-tag>
          <el-tag style="margin: 5px" type="danger"><strong>模型描述: </strong>{{modelBuildRecordList[selectModelIndex].modelDescription}}</el-tag><br/>
          <el-button style="margin: 5px" @click="showMoreInfo" size="small"  type="primary">了解更多</el-button><br/>
        </el-col>
        <el-col v-else style="padding: 10px">
          <aside style="padding: 20px">选择模型后展示模型的基本信息</aside>
        </el-col>
      </el-col>
    </el-card>
    <el-col :span="24">

      <el-card class="box-card" align-center style="margin: 10px">
        <el-col v-if="modelBuildRecordList[selectModelIndex]" :span="18" style="padding: 5px">
          <el-card class="box-card" align-center style="margin: 10px">
            <div slot="header" class="clearfix">
              <span>预测结果预览</span>
            </div>
            <time-line :processContents="processTestContents"></time-line>
          </el-card>
        </el-col>
        <el-col v-if="modelBuildRecordList[selectModelIndex]" :span="4" style="padding: 5px">
          <el-card class="box-card" align-center style="margin: 10px">
            <div slot="header" class="clearfix">
              <span>预测进度</span>
            </div>
            <el-progress type="dashboard" :percentage="percent" :color="colors"></el-progress>
          </el-card>
        </el-col>
        <el-col v-else style="padding: 10px">
          <aside style="padding: 20px">开始预测展示具体详情</aside>
        </el-col>
        <el-col  :span="12" style="padding: 5px">
          <el-card class="box-card" align-center style="margin: 10px">
            <div slot="header" class="clearfix">
              <span>标签比例</span>
            </div>
            <div id="container"></div>
          </el-card>
        </el-col>
        <el-col :span="12" style="padding: 5px">
          <el-card class="box-card" align-center style="margin: 10px">
            <div slot="header" class="clearfix">
              <span>标签比例</span>
            </div>
            <div id="rose"></div>
          </el-card>
        </el-col>
        <el-col :span="12" style="padding: 5px">
          <el-card class="box-card" align-center style="margin: 10px">
            <div slot="header" class="clearfix">
              <span>下载预测文件</span>
            </div>
            <el-tag>文件名：{{outputFileName}}</el-tag>
            <el-button type="success" round :disabled="isNotFinished" size="small" @click="downloadFile">下载</el-button>
          </el-card>
        </el-col>

      </el-card>

    </el-col>


  </el-row>
</template>

<script>
import {baseUrl, stompUrl} from "@/api/axiosApi";
import axios from "axios";
import {getModelListByType, getSavaModelId, getModelTestConfig, predictFile} from '@/api/model'
import {downloadPredictFile, insertIntoDB} from "@/api/datasetmanagementApi";
import {insertAPredictDataSet} from "@/api/predictDataSetApi";
import Stomp from "_stompjs@2.3.3@stompjs";
import SockJS from "sockjs-client";
import timeLine from '../buildmodel/components/timeLine'
import { Pie, Radar } from '@antv/g2plot';

export const MQTT_USERNAME = 'root' // mqtt连接用户名
export const MQTT_PASSWORD = 'root' // mqtt连接密码

export default {
  name: "modelPredict",
  components:{
    timeLine
  },
  data:function (){
    return{
      uploadUrl:baseUrl+'uploadpredict',
      uploadDataSetName:undefined,
      catalogList:['数值分类','文本分类','命名实体识别','关系抽取'],
      selectCatalog:undefined,
      uploadDataSetDescribe:undefined,
      progressFlag:true,
      percentage:0,
      fileList:[],  // upload多文件数组
      fileData: '',  // 文件上传数据（多文件合一)
      active:0,
      modelList:[],
      modelCount:0,
      selectIndex:undefined,
      modelBuildRecordList:[],
      selectModelIndex:[],
      isDataSetName:true,
      isUploadFile:false,
      processTestContents:[],
      percent: 0,
      outputFileName: undefined,
      colors: [
        {color: '#f56c6c', percentage: 20},
        {color: '#e6a23c', percentage: 40},
        {color: '#5cb87a', percentage: 60},
        {color: '#1989fa', percentage: 80},
        {color: '#6f7ad3', percentage: 100}
      ],
      piePlot:undefined,
      pieData :[],

      rosePlot:undefined,
      //图表测试用数据
      roseData:[
        { type: '分类一', value: 27 },
        { type: '分类二', value: 25 },
        { type: '分类三', value: 18 },
        { type: '分类四', value: 15 },
        { type: '分类五', value: 10 },
        { type: '其他', value: 5 },
      ],

      isNotFinished:true,
    }
  },
  computed:{
    taskUid(){
      // return this.$route.params.taskUid
      return "initTest0106";
    }
  },
  watch:{
    'uploadDataSetName':{
      handler (newName, oldName) {
        console.log('uploadDataSetName change', newName);
        if (newName !== ''){
          this.isDataSetName=false;
        }else {
          this.isDataSetName=true;
        }
      }
    }
  },
  mounted() {
    if(this.taskUid!==undefined) {this.connect();}
    else this.$message.info('taskUid为空，若进行测试模式请查看下头的TODO！');
    console.log("taskUid", this.taskUid);
    this.piePlot = new Pie('container', {
      appendPadding: 10,
      data:[],
      angleField: 'value',
      colorField: 'type',
      radius: 0.75,
      label: {
        type: 'spider',
        labelHeight: 28,
        content: '{name}\n{percentage}',
      },
      interactions: [{ type: 'element-selected' }, { type: 'element-active' }],
    });
    this.piePlot.render();

    const data = [
      { name: 'G2', star: 10178 },
      { name: 'G6', star: 7077 },
      { name: 'F2', star: 7345 },
      { name: 'L7', star: 2029 },
      { name: 'X6', star: 298 },
      { name: 'AVA', star: 806 },
    ];

    this.rosePlot = new Radar('rose', {
      data: data.map((d) => ({ ...d, star: Math.log(d.star) })),
      xField: 'name',
      yField: 'star',
      meta: {
        star: {
          alias: 'star 数量',
          min: 0,
          nice: true,
          formatter: (v) => Number(v).toFixed(2),
        },
      },
      xAxis: {
        tickLine: null,
      },
      yAxis: {
        label: false,
        grid: {
          alternateColor: 'rgba(0, 0, 0, 0.04)',
        },
      },
      // 开启辅助点
      point: {
        size: 2,
      },
      area: {},
    });
    this.rosePlot.render();


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


    //文件长传相关
    handleRemoveUpload(file, fileList) {
      console.log(file, fileList);
    },
    handlePreviewUpload(file) {
      console.log("handlePreviewUpload", file);
    },
    handleExceedUpload(files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    beforeRemoveUpload(file, fileList) {
      return this.$confirm(`确定移除 ${ file.name }？`);
    },
    submitUpload() {
      const isLt100M = this.fileList.every(file => file.size / 1024 / 1024 < 10);
      if (!isLt100M) {
        this.$message.error('请检查，上传文件大小不能超过10MB!');
      } else {
        this.fileData = new FormData();  // new formData对象
        this.$refs.upload.submit();  // 提交调用uploadFile函数
        this.fileData.append('datasetname', this.uploadDataSetName);  // 添加机构id

        // 为了自定义进度条这个接口不用了。
        // uploadFile(this.fileData).then(response =>{
        //   console.log("uploadFile response",response)
        // });

        // 为了监控上传进度自定义axios作为http接口，这里主要是为了监测进度
        // 基于XMLRequest的onUploadProgress属性。自定义进度条
        const fn = this.uploadProgress; // 我们自己处理上传进度的函数
        axios({
          method: 'post',
          //url: 'http://127.0.0.1:8080/webAgorithm/multiUpload',
          url: this.uploadUrl,
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          data: this.fileData,
          onUploadProgress: fn, // `onUploadProgress` 允许为上传处理进度事件
        }).then(res=>{
          console.log("axios res",res);
          // 确保文件已将上传成功
          if (res.data.code===200){
            // 调用insert接口在文件上传成功后将上传的数据集的信息添加在数据库中
            getModelListByType(this.selectCatalog).then(res => {
              console.log("getModelListByType res",res);
              this.isUploadFile=true;
              this.modelList = res;
              this.modelCount = this.modelList.length;
            })
          }

        });

      }
    },
    uploadProgress(progressEvent){
      /*
         * progressEvent.loaded :已上传量
         * progressEvent.total :上传的总大小
        */
      const p = Math.floor((progressEvent.loaded / progressEvent.total) * 100);
      this.percentage = p;
      console.log("uploadProgress percentage", this.percentage);
    },
    // 上传文件
    uploadFile(file) {
      this.fileData.append('files', file.file);  // append增加数据
    },
    // 这个函数禁用了
    uploadFileProcess(event, file, fileList) {
      this.loadProgress = parseInt(event.percent); // 动态获取文件上传进度
      if (this.loadProgress >= 100) {
        this.loadProgress = 100
        setTimeout( () => {this.progressFlag = false}, 1000) // 一秒后关闭进度条
      }
    },

    getBuildedModel(){
      console.log("getBuildedModel selectIndex", this.selectIndex);
      let modelBasicId = this.modelList[this.selectIndex].id;
      getSavaModelId(modelBasicId).then(res => {
        this.modelBuildRecordList = res.modelBuildRecordList;
      })
    },
    startPredict(){
      console.log("startPredict", this.selectModelIndex);
    },
    showMoreInfo(){
      const { href } = this.$router.resolve({
        path:'/modelManagement',
        query: {
          predictSelectModel: this.modelBuildRecordList[this.selectModelIndex].modelUid
        }
      });
      console.log("href",href);
      window.open(href, "_blank");
    },
    confirmModel(){
      if (this.uploadDataSetDescribe===''){
        this.uploadDataSetDescribe = "数据集名称为"+this.uploadDataSetName+"的数据集，这个数据集类型为"+this.selectCatalog
      }
      this.outputFileName = this.taskUid.substring(0,4)+"_"+this.uploadDataSetName
      let requestMap={
        "taskUid":this.taskUid,
        "dataSetName":this.uploadDataSetName,
        "useModelName":this.modelBuildRecordList[this.selectModelIndex].saveModelName,
        "dataSetDescription":this.uploadDataSetDescribe,
        "outputFileName": this.outputFileName
      }
      console.log("requestMap",requestMap);
      insertAPredictDataSet(requestMap).then(res => {
        console.log("insertAPredictDataSet res", res);
        let modelUid = this.modelBuildRecordList[this.selectModelIndex].modelUid;
        getModelTestConfig(modelUid).then(res => {
          res['predictFileName'] = this.uploadDataSetName;
          res['taskUid'] = this.taskUid;
          predictFile(res).then(res => {
            console.log("predictFile res", res);
          })
        })
      })
    },

    // stomp相关函数
    onConnected:function(){
      //订阅的频道

      const topic = "/queue/modelPredictProcess_"+this.taskUid;
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
      if (message.process !== 100){
        this.percent = message.process
        //凑timeline的入参格式l
        let timeLineMap = {}
        if (message.taskType === 'textClassify'){
          timeLineMap = {
            content:'id:'+message.id+'预测句子：'+message.sentence+',预测标签为：'
              +message.predictLabel,
            timestamp: message.time
          }
        }else {
          timeLineMap = {
            content:'id:'+message.id+';预测句子：'+message.sentence+'\n预测标签为：'
              +message.predictLabel,
            timestamp: message.time
          }
        }

        this.processTestContents.push(timeLineMap);

        let labelProportion = message.labelProportion;
        console.log("labelProportion", labelProportion)
        let labelProportionMap=new Map(Object.entries(labelProportion));

        if(this.percent%10===0){
          let pieData = [];
          let radarData = [];
          for(let [key, value] of labelProportionMap){
            pieData.push({
              'type': key,
              'value': value
            })
            radarData.push({
              'name':key,
              'star':value
            })
          }
          this.piePlot.changeData(pieData);
          this.rosePlot.changeData(radarData);
        }

      }else {
        this.isNotFinished=false;
        this.percent = 100
        this.$message({
          type: 'info',
          message: '建模完成'
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

    downloadFile(){
      this.$notify({
        message: '正在下载~',
        type: 'success'
      })
      const a = document.createElement('a')
      a.href = baseUrl+'/download?predictFileName=' + this.outputFileName
      console.log('a.href=', a.href)
      a.click()
    }
  }
}
</script>

<style scoped>

</style>
