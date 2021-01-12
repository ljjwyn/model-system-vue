<template>
  <el-row>
    <el-col :span="24" style="margin-top: 20px;margin-left: 10px"><div class="grid-content bg-purple-dark">
      <el-steps :active="active" finish-status="success">
        <el-step title="选择模型" description="选择一个已训练完成模型并加载超参数"></el-step>
        <el-step title="预加载模型" description="通过模型名与超参数加载模型并预热"></el-step>
        <el-step title="输入待测试内容" description="在文本框输入待预测内容"></el-step>
        <el-step title="预测" description="获得并可视化预测结果"></el-step>
      </el-steps>
    </div>
      <el-divider><i class="el-icon-lollipop"></i></el-divider>
    </el-col>

    <div style="margin-left: 20px">

      选择模型：
      <el-select style="margin-top: 10px;margin-left: 20px" v-model="value" clearable filterable placeholder="请选择">
        <el-option
          v-for="(item,index) in modelList"
          :key="index"
          :label="item.modelName"
          :value="index"
        >
        </el-option>
      </el-select>
      <el-button v-on:click="test" type="primary" round>确认模型</el-button>
      <el-button v-show="isShowTap" v-on:click="showConfig" type="text">模型配置详情</el-button>
    </div>
    <el-divider><i class="el-icon-apple"></i></el-divider>

    <el-row :gutter="24" v-show="isShowTap" v-loading="isStartAnalysis">
      <el-col :span="14"><div class="grid-content bg-purple">
        <div style="margin-left: 20px">
          模型详情：
          <el-tag
            style="width: auto;margin: 5px"
            v-for="tag in setTaps"
            :key="tag.name"
            closable
            :type="tag.type">
            {{tag.name}}
          </el-tag>
        </div>
        <div style="margin-top: 10px;margin-left: 20px">
          <el-button
            v-show="isShowTap"
            slot="reference"
            type="primary"
            icon="el-icon-s-marketing"
            v-on:click="loadAModel"
            :loading="isLoading"
            :disabled="!isBasicModel"
          >预加载模型</el-button>
          <el-button
            v-show="isShowTap"
            slot="reference"
            type="warning"
            icon="el-icon-circle-close"
            v-on:click="stopModel"
            :disabled="!isBasicModel"
          >停止模型</el-button>
        </div>
      </div></el-col>
      <el-col :span="10">
        <div class="grid-content bg-purple">
        <el-upload
          class="upload-demo"
          drag
          :disabled="isBasicModel"
          action="http://127.0.0.1:8080/webAgorithm/uploadtest"
          :data="uploadDataSetName"
          :before-upload="beforeUpload"
          multiple>
          <i class="el-icon-upload"></i>
          <input type="text" class="form-control" name="datasetname" style="display:none;" id="dataSetName"/>
          <div class="el-upload__text">将测试数据集拖到此处，或<em>点击上传</em></div>
          <div class="el-upload__tip" slot="tip">只能上传测试文件，且不超过10M</div>
        </el-upload>
        <el-button style="margin-top: 5px" :disabled="isBasicModel" v-on:click="startAnalysis" type="primary" round icon="el-icon-s-promotion">分析</el-button>
        <el-button style="margin-top: 5px" :disabled="isBasicModel" v-on:click="destroyPlot" type="warning" round icon="el-icon-delete-solid
">销毁</el-button>
      </div>
      </el-col>
    </el-row>

    <el-divider><i class="el-icon-pear"></i></el-divider>

    <el-row :gutter="24" v-show="isShowModelInput" style="margin-top: 10px;margin-left: 10px;margin-right: 10px">
      <el-col :span="12">
        <el-input
          type="textarea"
          :autosize="{ minRows: 6, maxRows: 6}"
          placeholder="请输入待预测的内容"
          v-model="modelInput">
        </el-input>
        <el-button
          style="margin-top: 5px"
          type="primary"
          icon="el-icon-magic-stick"
          v-on:click="predictInput"
          :loading="predictInputIsLoading"
        >预测</el-button>
        <el-button
          style="margin-top: 5px"
          type="success"
          icon="el-icon-magic-stick"
          v-on:click="reInput"
        >重置</el-button>
      </el-col>
      <el-col :span="12">
        <el-input
          type="textarea"
          :autosize="{ minRows: 6, maxRows: 6}"
          placeholder="模型输出"
          v-model="modelOutput"
          readonly
        >
        </el-input>
      </el-col>
    </el-row>

    <el-divider><i class="el-icon-basketball"></i></el-divider>

    <el-row v-show="isShowPlot" :gutter="24" style="margin-top: 10px;margin-left: 10px;margin-right: 10px">
      <el-col :span="8">
        选择句子：
        <el-select v-model="valueSentence" clearable placeholder="请选择">
          <el-option
            v-for="(item,index) in sentenceNum"
            :key="index"
            :label="item.sentenceIndex"
            :value="index"
          >
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="12">
        <el-tag>选择的句子：{{selectSentence}}</el-tag>
      </el-col>

    </el-row>

    <el-row v-show="isShowPlot" :gutter="24" style="margin-top: 10px;margin-left: 10px;margin-right: 10px">
      <el-col :span="12">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>预测标签比例饼图</span>
            <el-button style="float: right; padding: 3px 0" type="text">详情</el-button>
          </div>
          <div class="text item">
            <div id="rosePie"></div>
          </div>
        </el-card>
      </el-col>
      <el-card  class="box-card">
        <div slot="header" class="clearfix">
          <span>词云</span>
          <el-button style="float: right; padding: 3px 0" type="text">词云详情</el-button>
        </div>
        <div class="text item">
          <div id="wordCloudDom"></div>
        </div>
      </el-card>
    </el-row>
    <el-row v-show="isNERResShow" :span="24" style="margin-top: 10px;margin-left: 10px;margin-right: 10px">
      <el-col :span="6" style="margin-top: 10px;margin-left: 10px">
        NER识别标签说明：
        <el-tabs
          v-for="label in nerLabelList"
          :style="label.color"
        >
          {{ label.label }}:{{ label.name }}
        </el-tabs>
      </el-col>
      <el-col :span="10" style="margin-top:10px">
        模型分析结果：
        <div v-for="num in nerNumList" style="margin-top:5px">
          <el-tag>
            <label v-for="(char,index) in charList[num]" :style="colorList[num][index]">{{char}}</label>
          </el-tag>
        </div>
      </el-col>
    </el-row>

    <el-divider><i class="el-icon-grape"></i></el-divider>

    <el-card v-show="isShowKnowledge" class="box-card" style="margin-top: 10px;margin-left: 10px;width:600px; height:500px;">
      <div slot="header" class="clearfix">
        <span>关系图谱</span>
        <el-button style="float: right; padding: 3px 0" type="text">图谱详情</el-button>
      </div>
      <div class="text item">
        <div id="container" style="width:600px; height:600px;"></div>
      </div>
    </el-card>
    <el-divider><i class="el-icon-baseball"></i></el-divider>


  </el-row>
</template>

<script>
  import { getTableData, preRunModel, loadModel, getNERLabels,
    stopTheModel, showKnowledgeGraph, predictModelInput } from "@/api/test.js";
  import { Rose, WordCloud, Pie } from "@antv/g2plot";
  import echarts from 'echarts'
  import axios from 'axios'; // 引入axios
  axios.defaults.withCredentials = true; // 允许携带cookie
  // import polar from '@/views/Echarts/polar';

  export default {
    data() {
      return {
        modelList: [],
        value: '',
        isShowTap: false,
        isLoading: false,
        isBasicModel: true,
        isStartAnalysis: false,
        isShowModelInput: false,
        predictInputIsLoading: false,
        modelName:'',
        modelUid:'',
        modelConfig:'',
        uploadDataSetName: {
          "datasetname":''
        },
        active:0,
        setTaps:[],
        modelInput:'',
        modelOutput:'',

        //启动多线程模型复用标识
        threadName:'',

        //NER展示参数
        nerNumList:[],
        charList:[],
        colorList:[],
        isNERResShow:false,
        currentColor:'',
        nerLabelList:[],


        // 可视化参数
        sentenceNum: [],
        selectSentence:'',
        valueSentence: '',
        predictOutputList: [],
        wordData: [],
        roseData: [],
        isRender: false,
        isShowPlot: false,
        wordPlot:'',
        piePlot:'',

        // 知识图谱可视化参数
        myChart: null,
        chartData:[],
        chartLink:[],
        chartCategories:[],
        isShowKnowledge:false,
      };
    },
    watch: {
      'modelInput':{
        handler (newName, oldName) {
          console.log('modelInput change', newName);
          if(newName!==''){
            this.active=3;
          }else {
            this.active=2;
          }
        }
      },
      'valueSentence':{
        handler (newName, oldName) {
          console.log('valueSentence change', newName);
          console.log('valueSentence oldName 1', oldName);
          if(newName>=0){
            if (this.isRender){
              this.wordPlot.destroy();
              this.piePlot.destroy();
            }
            this.roseData=[];
            this.wordData=[];
            console.log("this.predictOutputList[newName]", this.predictOutputList[newName]);
            this.selectSentence=this.predictOutputList[newName].sentence;
            let resLabels = this.predictOutputList[newName].labels;
            let resLabelScore = this.predictOutputList[newName].score;
            for(let index=0;index<resLabels.length;index++){
              let tempRoseData={
                'type': resLabels[index],
                'value': (resLabelScore[index]*100).toFixed(2)
              }
              let tempWordCloud={
                'id': index+1,
                'word': resLabels[index],
                'weight': (resLabelScore[index]*100).toFixed(2)
              }
              this.roseData.push(tempRoseData);
              this.wordData.push(tempWordCloud);
            }
            this.wordPlot=this.wordCloudPlot(this.wordData);
            this.piePlot=this.rosePlot(this.roseData);
            this.wordPlot.render();
            this.piePlot.render();
            this.isRender=true;
          }else {
            console.log('valueSentence change 没选句子');
          }
        }
      }
    },
    mounted: function() {
      // 网络请求统一处理
      getTableData().then(res => {
        console.log("api tableData :", res);
        this.modelList = res.data;
      },err=>{
        console.log("err :", err);
        this.$message.error('请求现有模型列表异常！严重的故障哈！');
        this.isShowTap=false;
      });
    },
    methods: {
      test: function () {
        if (this.value!==''){
          console.log("test",this.value);
          this.modelUid=this.modelList[this.value].modelUid;
          this.modelName=this.modelList[this.value].modelName;
          const h = this.$createElement;

          this.setTaps=[
            {name:'模型Uid：'+this.modelUid,type:''},
            {name:'模型名称：'+this.modelName,type:'success'},
            {name:'模型存储名称：'+this.modelList[this.value].saveModelName,type:'info'},
            {name:'模型生成时间：'+this.modelList[this.value].endTime,type:'warning'},
            {name:'模型描述：'+this.modelList[this.value].modelDescription,type:'success'},
          ];

          this.$notify({
            title: '模型详情',
            message: h('i', { style: 'color: teal;white-space: pre-line'}, '模型名称:'+this.modelName+'\n'+
              '模型描述:'+this.modelList[this.value].modelDescription+'\n'+
              '模型超参数名称:'+this.modelList[this.value].modelConfId+'\n'+
              '模型存储名称:'+this.modelList[this.value].saveModelName+'\n'+
              '模型开始训练时间:\n'+this.modelList[this.value].startTime+'\n'+
              '模型训练完成时间:\n'+this.modelList[this.value].endTime
            ),
            type: 'success'
          });

          //加载模型的配置信息
          preRunModel({"configId":this.modelList[this.value].modelConfId}).then(res => {
            console.log("modelConfig :", res);
            this.modelConfig = res;
            this.active=1;
            this.isShowTap=true;
          },err=>{
            this.$message.error('模型配置信息加载异常');
            console.log("err :", err);
          });

          // 可前端输入进行预测的模型序号在5以下。剩下的需要上传数据集！
          if(this.modelList[this.value].basicModelId<=5){
            this.isBasicModel=true;
            this.setTaps.push({
              name:'操作提示：选取模型为基础模型请点击预加载模型加载！测试数据在下方键入',type: 'danger'
            });
          }else {
            this.isBasicModel=false;
            this.setTaps.push({
              name:'操作提示：选取模型为知识图谱相关模型请右侧上传测试数据集！并点击分析',type: 'danger'
            });
          }
        }else {
          console.log("未选择模型啊！",this.value);
          this.isShowTap=false;
          this.isShowModelInput=false;
          this.$notify({
            title: '警告',
            message: '未选择模型，请在下拉框选一个模型！',
            type: 'warning'
          });
          this.active=0;
        }

      },
      showConfig:function() {
        const h = this.$createElement;
        this.$alert(h('i', { style: 'color: teal;white-space: pre-line'},
          '数据集名：'+this.modelConfig.dataSetName+'\n'+
          '参数描述：'+this.modelConfig.configDescription+'\n'+
          '配置详情：'+this.modelConfig.modelConfMap),
          '标题名称', {
          confirmButtonText: '确定',
          callback: action => {
            this.$message({
              type: 'info',
              message: `操作: ${ action }`
            });
          }
        });
      },
      loadAModel:function() {
        this.isLoading=true;
        let requestData= {
          "modelName":this.modelList[this.value].saveModelName,
          "dataSetName":this.modelConfig.dataSetName,
          "modelConfMap":this.modelConfig.modelConfMap,
          "algorithm":this.modelList[this.value].basicModelId
        }
        loadModel(requestData).then(res=>{
          console.log("loadModel res",res);
          this.threadName = res['threadName'];
          this.active=2;
          this.isShowModelInput=true;
          this.isLoading=false;
          this.$message.info('预热模型成功！');
        },error => {
          console.log("loadModel error",error);
          console.log("requestData",requestData);
          this.$message.error('加载模型错误');
          this.isShowModelInput=false;
          this.isLoading=false;
        })
      },
      stopModel:function() {
        stopTheModel(this.threadName).then(res=>{
          this.active=1;
          console.log("stop model success", res);
          if (res['code']===200){
            this.$message.info('停止模型成功');
            this.isShowModelInput=false;
            this.reInput();
          }else if(res['code']===400){
            this.$message.info('threadName错误');
          }else{
            this.$message.info('模型停止失败');
          }
        },error => {
          console.log("stop model error", error);
          this.$message.error('停止模型错误');
          this.isShowModelInput=false;
        })
      },
      // 获取图谱res
      startAnalysis:function() {
        let requestData = {
          "uid":this.modelList[this.value].modelUid,
          "modelName":this.modelList[this.value].saveModelName,
          "dataSetName":this.modelConfig.dataSetName,
          "modelConfMap":this.modelConfig.modelConfMap,
          "algorithm":this.modelList[this.value].basicModelId
        }
        this.isStartAnalysis=true;
        showKnowledgeGraph(requestData).then(res=>{
          console.log("startAnalysis res",res);
          this.isStartAnalysis=false;
          this.$message.info('知识图谱分析完成，生成预测图谱');
          this.active=2;
          let categoriesList = res.categories;
          let relationList = res.relationList;
          let entityList = res.entityList;
          this.chartLink=[];
          this.chartData=[];
          this.chartCategories=[];
          for(let index=0;index<categoriesList.length;index++){
            let tempMap={
              'name':categoriesList[index]
            };
            this.chartCategories.push(tempMap);
          }
          for(let index=0;index<entityList.length;index++){
            let tempMap={
              "name":entityList[index]["entity"],
              "des":entityList[index]["entity"],
              "symbolSize": 50,
              "category":entityList[index]["entity_type"]
            };
            this.chartData.push(tempMap);
          }
          for(let index=0;index<relationList.length;index++){
            let tempMap = {
              "source":relationList[index]["entity1"],
              "target":relationList[index]["entity2"],
              "name": relationList[index]["relation"],
              "des":relationList[index]["relation"]
            };
            this.chartLink.push(tempMap);
          }
          this.plotKnowledgeGraph();
        },error => {
          console.log("startAnalysis res error",error);
          this.$message.error('知识图谱分析后端错误');
          this.isStartAnalysis=false;
        })
      },
      predictInput:function() {
        this.predictInputIsLoading=true;
        this.modelOutput='';
        predictModelInput({'threadName':this.threadName,'sentence':this.modelInput}).then(res=>{
          console.log("predictInput res",res);
          this.predictInputIsLoading=false;
          let resultList=res.result;
          this.predictOutputList = res.result;

          if(resultList[0].taskType==="textClassify"){
            //TODO 根据句子标号选择一个句子哈。这里需要增加一个下拉框和一个句子展示标签以及一个render函数
            for (let index=0;index<resultList.length;index++){
              this.modelOutput+="预测标签："+resultList[index].predictLabel+'\n';
              let tempStr = '第'+(index+1)+'个句子';
              this.sentenceNum.push({"sentenceIndex":tempStr});
            }
            console.log("this.modelOutput",this.modelOutput);
            this.active=4;
            this.$message.info('预测完成');
            this.isShowPlot=true;
          }else if(resultList[0].taskType==="NER"){

            // 调用接口获取当前ner的数据集的标签
            getNERLabels(this.modelConfig.dataSetName).then(res => {
              console.log("getNERLabels res", res);
              this.nerLabelList = res.labelList;

              for(let index=0;index<this.nerLabelList.length;index++){
                if (this.nerLabelList[index]['label'].length===1)
                  this.nerLabelList[index]['color']="color:black";
                else this.nerLabelList[index]['color']="color:"+this.color16()
              }

              for (let index=0;index<resultList.length;index++){
                let tempList=resultList[index];
                let tempCharList=[];
                let tempColorList=[];
                for(let indexTemp=0;indexTemp<tempList.sentence.length;indexTemp++){
                  tempCharList.push(tempList.sentence[indexTemp]);
                  let tempLabel=tempList.labels[indexTemp];
                  if(tempLabel!=='O'){
                    let tempTempLabel=tempLabel.slice(-3);
                    console.log("getNERLabels tempTempLabel", tempTempLabel);

                    for(let index=0;index<this.nerLabelList.length;index++) {
                      if (tempTempLabel === this.nerLabelList[index]['label']) {
                        tempColorList.push(this.nerLabelList[index]['color']);
                      }
                    }
                  }else {
                    tempColorList.push("color:black");
                  }
                }
                console.log("tempCharList",tempCharList);
                console.log("tempColorList",tempColorList);
                this.charList.push(tempCharList);
                this.colorList.push(tempColorList);
                this.nerNumList.push(index);
                this.isNERResShow=true;
                this.active=4;
              }
            },error => {

            })

          }

        },error=>{
          console.log("predictInput error",error);
          this.active=3;
          this.predictInputIsLoading=false;
          this.isShowPlot=false;
          this.$message.info('预测失败，服务端异常');
        })
      },
      reInput:function() {
        this.modelOutput='';
        this.modelInput='';
        this.isShowPlot=false;
        this.roseData=[];
        this.wordData=[];
        this.sentenceNum=[];
        this.predictOutputList=[];
        this.selectSentence='';
        this.valueSentence='请选择～';
        if(this.isRender){
          this.wordPlot.destroy();
          this.piePlot.destroy();
          this.isRender=false;
        }
        this.nerNumList=[];
        this.charList=[];
        this.colorList=[];
        this.isNERResShow=false;
        this.currentColor='';
      },
      // 销毁上一个知识图谱
      destroyPlot:function(){
        this.isShowKnowledge=false;
        let dom = document.getElementById("container");
        echarts.init(dom).dispose();
        this.chartData=[];
        this.chartLink=[];
        this.chartCategories=[];
      },
      // 词云图
      wordCloudPlot(data) {
        let that = this;
        return new WordCloud(document.getElementById("wordCloudDom"), {
          width: 600,
          height: 400,
          data: data,
          //maskImage: 'https://gw.alipayobjects.com/mdn/rms_2274c3/afts/img/A*07tdTIOmvlYAAAAAAAAAAABkARQnAQ',
          wordStyle: {
            rotation: [-Math.PI / 2, Math.PI / 2],
            rotateRatio: 0.5,
            rotationSteps: 4,
            fontSize: [10, 50],
            gridSize: 30,
            color: (word, weight) => {
              return this.getRandomColor();
            },
            active: {
              shadowColor: '#333333',
              shadowBlur: 10,
            }
          },
          shape: 'cardioid',
          shuffle: false,
          backgroundColor: '#fff',
          tooltip: {
            visible: true,
          },
          selected: -1,
          onWordCloudClick(item, dimension, evt, fn) {
            that.$message({
              message: `点击了${item.word}`,
              type: "success"
            });
          }
        });
      },
      getRandomColor:function(){
        const arr = [
          '#5B8FF9',
          '#5AD8A6',
          '#5D7092',
          '#F6BD16',
          '#E8684A',
          '#6DC8EC',
          '#9270CA',
          '#FF9D4D',
          '#269A99',
          '#FF99C3',
        ];
        return arr[Math.floor(Math.random() * (arr.length - 1))];
      },
      // 玫瑰图
      rosePlot:function(data){
        return new Pie(document.getElementById("rosePie"), {
          forceFit: true,
          title: {
            visible: false,
            text: '',
          },
          description: {
            visible: true,
            text:
              '表现预测结果各个标签所占的比例',
          },
          radius: 0.8,
          data:data,
          angleField: 'value',
          colorField: 'type',
          label: {
            visible: false,
            type: 'inner',
          },
          });
      },

      // 文件上传控件增加datasetname字段内容上传
      beforeUpload:function(file) {
        this.uploadDataSetName.datasetname=this.modelConfig.dataSetName;
        console.log("uploadDataSetName.datasetname",this.uploadDataSetName.datasetname);
      },


      // 知识图谱plot函数
      plotKnowledgeGraph:function() {
        this.isShowKnowledge=true;
        let dom = document.getElementById("container");
        echarts.init(dom).dispose();
        this.myChart = echarts.init(dom);
        let option = {
          // 图的标题
          // title: {
          //   text: '预测集关系图谱'
          // },
          // 提示框的配置
          tooltip: {
            formatter: function (x) {
              return x.data.des;
            }
          },
          // 工具箱
          toolbox: {
            // 显示工具箱
            show: true,
            feature: {
              mark: {
                show: true
              },
              // 还原
              restore: {
                show: true
              },
              // 保存为图片
              saveAsImage: {
                show: true
              }
            }
          },
          legend: [{
            // selectedMode: 'single',
            data: this.chartCategories.map(function (a) {
              return a.name;
            })
          }],
          series: [{
            type: 'graph', // 类型:关系图
            layout: 'force', //图的布局，类型为力导图
            symbolSize: 40, // 调整节点的大小
            roam: true, // 是否开启鼠标缩放和平移漫游。默认不开启。如果只想要开启缩放或者平移,可以设置成 'scale' 或者 'move'。设置成 true 为都开启
            edgeSymbol: ['circle', 'arrow'],
            edgeSymbolSize: [2, 10],

            force: {
              repulsion: 2500,
              edgeLength: [10, 50]
            },
            draggable: true,
            lineStyle: {
              normal: {
                width: 2,
                color: '#4b565b',
              }
            },
            edgeLabel: {
              normal: {
                show: true,
                formatter: function (x) {
                  return x.data.name;
                },
                textStyle: {
                  fontSize: 20
                }
              }
            },
            label: {
              normal: {
                show: true,
                textStyle: {}
              }
            },

            // 数据
            data: this.chartData,
            links: this.chartLink,
            categories: this.chartCategories,
          }]
        };
        this.myChart.setOption(option);
        this.myChart.on('click', function (params) {
          console.log(params.data)//获取点击的头像的数据信息
        });
      },

      //TODO 这里的颜色会很丑且并不好用，建议之后替换随机函数
      color16(){
        let r = Math.floor(Math.random()*256);
        let g = Math.floor(Math.random()*256);
        let b = Math.floor(Math.random()*256);
        let color = '#'+r.toString(16)+g.toString(16)+b.toString(16);
        return color;
      }
    }
  };
</script>

<style scoped>

</style>
