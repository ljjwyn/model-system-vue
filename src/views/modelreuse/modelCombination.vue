<template>
  <el-row style="margin-top: 20px;margin-left: 10px">
    <el-col :span="22" :offset="1">
      <el-card style="margin-top: 10px">
        <div slot="header" class="clearfix">
          <span>模型组合配置</span>
        </div>
        <el-select @change="getModelList" style="padding: 10px" v-model="selectIndex" filterable clearable placeholder="请选择任务类型">
          <el-option
            v-for="(item,index) in typeList"
            :key="item"
            :label="item"
            :value="index">
          </el-option>
        </el-select>
        <el-select @change="getBuildedModel" style="padding: 10px" v-model="selectModelIndex" filterable clearable placeholder="请选择算法">
          <el-option
            v-for="(item,index) in modelList"
            :key="item.modelName"
            :label="item.modelName"
            :value="index">
          </el-option>
        </el-select>
        <div class="components-container board">
          <Kanban :key="1" :list="list1" :group="group" class="kanban todo" header-text="已构建模型" />
          <i style="font-size:30px" class="el-icon-d-arrow-right"></i>
          <Kanban :key="2" :list="list2" :group="group" class="kanban working" header-text="模型组一" />
          <i style="font-size:30px" class="el-icon-right"></i>
          <Kanban :key="3" :list="list3" :group="group" class="kanban done" header-text="模型组二" />
        </div>
        <el-button v-on:click="showList" type="primary" round style="margin: 5px">确认组合</el-button>
      </el-card>
    </el-col>
    <el-col :span="22" :offset="1">
      <el-card style="margin-top: 10px">
        <div slot="header" class="clearfix">
          <span>待预测文件配置</span>
        </div>
        <el-col id="inputPredict" :span="14" style="padding: 10px">
          <el-card style="margin-top: 10px">
            <label>获取方式</label>
            <el-select v-model="selectInputType" @change="getInputType"  placeholder="请选择待预测数据获取方式">
              <el-option
                v-for="(item,index) in inputTypeList"
                :key="item"
                :label="item"
                :value="index">
              </el-option>
            </el-select>
            <el-card style="margin: 10px" v-show="inputShow" class="box-card">
              <div slot="header" class="clearfix">
                <span>输入待预测文本</span>
              </div>
              <el-input
                type="textarea"
                :rows="6"
                placeholder="请输入待预测文本"
                v-model="predictInputContents">
              </el-input>
              <el-button v-on:click="confirmInput" type="primary" plain style="margin: 5px">开始预测</el-button>
              <el-button v-on:click="deleteAllInput" type="primary" plain style="margin: 5px">清空</el-button>
            </el-card>
            <el-card style="margin: 10px" v-show="uploadShow" class="box-card">
              <div slot="header" class="clearfix">
                <span>上传待预测文本</span>
              </div>
              <el-input placeholder="请输入文件名" v-model="predictFileName" style="width: 70%" :readonly="isUpload">
                <template slot="prepend">待预测文本<label style="color: red">*</label></template>
              </el-input>
              <el-upload
                style="margin: 10px"
                class="upload-demo"
                drag
                :disabled="isFileName"
                :action="uploadUrl"
                :data="uploadDataSetName"
                :before-upload="beforeUpload"
              >
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将待预测文本文件拖到此处，或<em>点击上传</em></div>
                <div class="el-upload__tip" slot="tip">请上传文本文件，且大小不超过10MB</div>
              </el-upload>
            </el-card>
          </el-card>
        </el-col>
        <el-col :span="10" style="padding: 10px">
          <el-card style="margin-top: 10px">
            <strong style="margin: 10px">模型简述</strong>
            <div v-if="predictConfigMap.models.length >= 2">
              <el-tag style="margin: 5px" ><strong>模型组合方式: </strong><label style="color: red">{{modelCombineType}}</label></el-tag><br>
              <el-tag style="margin: 5px" ><strong>模型一: </strong><el-button @click="showMoreInfo(0)" type="text">{{predictConfigMap.models[0].modelName}}</el-button></el-tag><br>
              <el-tag style="margin: 5px" ><strong>模型一任务类型: </strong><label style="color: red">{{predictConfigMap.models[0].modelType}}</label></el-tag><br>
              <el-tag style="margin: 5px" ><strong>模型二: </strong><el-button @click="showMoreInfo(1)" type="text">{{predictConfigMap.models[1].modelName}}</el-button></el-tag><br>
              <el-tag style="margin: 5px" ><strong>模型二任务类型: </strong><label style="color: red">{{predictConfigMap.models[1].modelType}}</label></el-tag><br>
              <el-tag style="margin: 5px" ><strong>待预测文件名: </strong><label style="color: red">{{predictFileName}}</label></el-tag>
            </div>
          </el-card>

        </el-col>

      </el-card>
    </el-col>
    <el-col v-show="isShowKnowledge" :span="15" :offset="1" style="margin: 10px">
      <el-card  class="box-card" style="margin-top: 10px;margin-left: 10px;height:700px;width:1000px;">
        <div slot="header" class="clearfix">
          <span>关系图谱</span>
          <el-button style="float: right; padding: 3px 0" type="text">图谱详情</el-button>
        </div>
        <div id="container" style="height:700px;width:1000px;"></div>
      </el-card>
    </el-col>
  </el-row>

</template>
<script>
import Kanban from '@/components/Kanban'
import {getAModelRecordById, getModelListByType, getSavaModelId, inputPredictToFile} from '@/api/model'
import {baseUrl} from "@/api/axiosApi";
import {modelsPredict} from "@/api/modelsPredict";
import * as echarts from "_echarts@5.0.0@echarts";

export default {
  name: 'modelCombination',
  components: {
    Kanban
  },
  data() {
    return {
      group: 'mission',
      selectIndex:undefined,
      selectModelIndex:undefined,
      selectInputType:undefined,
      inputShow:true,
      uploadShow:false,
      isUpload:false,
      isShowKnowledge:false,
      typeList:["文本分类","命名实体识别","关系抽取"],
      inputTypeList:["输入","上传"],
      modelList:[],
      predictInputContents:undefined,
      predictFileName:"",
      isFileName:true,
      modelCombineType:"组合",
      uploadUrl:baseUrl+"uploadpredict",
      uploadDataSetName: {
        "datasetname":''
      },

      list1: [
        // { name: '文本分类', id: 1 },
        // { name: 'BiLSTM+CRF', id: 2 },
        // { name: 'BERT+FC', id: 3 },
        // { name: 'BERT+CNN', id: 4 }
      ],
      list2: [
      ],
      list3: [
      ],
      predictConfig:undefined,
      predictConfigMap:{
        combineType:0,
        taskUid:"ljjceshi",
        models:[],
      },

      // 知识图谱可视化参数
      myChart: null,
      chartData:[],
      chartLink:[],
      chartCategories:[]
    }
  },
  watch:{
    'predictFileName':{
      handler (newName, oldName) {
        console.log('predictFileName change', newName);
        if (newName !== ''){
          this.isFileName=false;
        }else {
          this.isFileName=true;
        }
      }
    },
    // 'predictConfigMap.models':{
    //   handler (newName, oldName) {
    //     console.log('predictConfigMap change', newName);
    //     if (newName.length >= 2){
    //       modelsPredict(this.predictConfigMap).then(res => {
    //         console.log("res",res);
    //         this.isShowKnowledge = true;
    //         let categoriesList = res.categories;
    //         let relationList = res.relationList;
    //         let entityList = res.entityList;
    //         this.chartLink=[];
    //         this.chartData=[];
    //         this.chartCategories=[];
    //         for(let index=0;index<categoriesList.length;index++){
    //           let tempMap={
    //             'name':categoriesList[index]
    //           };
    //           this.chartCategories.push(tempMap);
    //         }
    //         for(let index=0;index<entityList.length;index++){
    //           let tempMap={
    //             "name":entityList[index]["entity"],
    //             "des":entityList[index]["entity"],
    //             "symbolSize": 50,
    //             "category":entityList[index]["entity_type"]
    //           };
    //           this.chartData.push(tempMap);
    //         }
    //         for(let index=0;index<relationList.length;index++){
    //           let tempMap = {
    //             "source":relationList[index]["entity1"],
    //             "target":relationList[index]["entity2"],
    //             "name": relationList[index]["relation"],
    //             "des":relationList[index]["relation"]
    //           };
    //           this.chartLink.push(tempMap);
    //         }
    //         this.plotKnowledgeGraph();
    //       })
    //     }
    //   }
    // }
  },
  mounted() {
    // getTableData().then(res=>{
    //   let count = 1;
    //   for(let modelName of res.data) {
    //     this.list1.push({
    //       "name": modelName.modelName,
    //       "id": count
    //     })
    //     count++;
    //   }
    // })
  },
  methods: {
    showList(){
      console.log("list1",this.list1);
      console.log("list2",this.list2);
      console.log("list3",this.list3);
      document.getElementById("inputPredict").scrollIntoView();
      if (this.list2.length === 2 && this.list3.length === 0){
        console.log("并行组合预测模式");
        this.$message.success("并行组合预测模式");
        for (let item of this.list2){
          getAModelRecordById(item.index).then(res => {
            this.predictConfigMap.models.push(res.modelConfigMap);
          })
        }
        this.predictConfigMap.combineType = 0;
        this.modelCombineType = "并行组合";
        console.log("tempConfig", this.predictConfigMap);
      }else if (this.list2.length === 1 && this.list3.length === 1){
        console.log("串行(图谱构造)组合预测模式");
        this.$message.success("串行(图谱构造)组合预测模式");
        getAModelRecordById(this.list2[0].index).then(res => {
          this.predictConfigMap.models.push(res.modelConfigMap);
          getAModelRecordById(this.list3[0].index).then(res => {
            this.predictConfigMap.models.push(res.modelConfigMap);
          })
        })
        this.predictConfigMap.combineType = 1;
        this.modelCombineType = "串行组合";
        console.log("tempConfig", this.predictConfigMap);
      }else {
        console.log("暂不支持");
        this.$message.warning("暂不支持这种组合方式");
      }
    },

    showMoreInfo(index){
      const { href } = this.$router.resolve({
        path:'/modelManagement',
        query: {
          predictSelectModel: this.predictConfigMap.models[index].uid
        }
      });
      console.log("href",href);
      window.open(href, "_blank");
    },

    getInputType(){
      console.log("selectInputType",this.selectInputType);
      if(this.selectInputType === 0){
        this.inputShow=true;
        this.uploadShow=false;
      }else {
        this.inputShow=false;
        this.uploadShow=true;
      }
    },

    getModelList(){
      this.list1 = [];
      console.log("selectIndex",this.selectIndex);
      let typeName = this.typeList[this.selectIndex];
      getModelListByType(typeName).then(res => {
        console.log("getModelListByType res", res);
        this.modelList = res;
      })
    },
    getBuildedModel(){
      this.list1 = [];
      console.log("selectModelIndex",this.selectModelIndex);
      let modelId = this.modelList[this.selectModelIndex].id;
      let algorithmName = this.modelList[this.selectModelIndex].modelName;
      let typeName = this.typeList[this.selectIndex];
      getSavaModelId(modelId).then(res => {
        console.log("getbuildModelList res", res);
        for (let item of res.modelBuildRecordList) {
          this.list1.push({
            "name": item.modelName,
            "id": typeName+item.id,
            "index":item.id
          })
        }
      })
    },

    confirmInput(){
      inputPredictToFile(this.predictInputContents).then(res => {
        if(res.code === 200){
          modelsPredict(this.predictConfigMap).then(res => {
            console.log("res",res);
            this.isShowKnowledge = true;
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
          })
        }
      })
    },

    deleteAllInput(){

    },

    // 文件上传控件增加datasetname字段内容上传
    beforeUpload:function(file) {
      this.isUpload = true;
      this.uploadDataSetName.datasetname=this.predictFileName;
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
                fontSize: 10
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
  }
}
</script>
<style lang="scss">
.board {
  width: 1000px;
  margin-left: 20px;
  display: flex;
  justify-content: space-around;
  flex-direction: row;
  align-items: flex-start;
}
.kanban {
  &.todo {
    .board-column-header {
      background: #4A9FF9;
    }
  }
  &.working {
    .board-column-header {
      background: #f9944a;
    }
  }
  &.done {
    .board-column-header {
      background: #2ac06d;
    }
  }
}
</style>

