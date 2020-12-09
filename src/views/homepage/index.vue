<template>
    <el-row style="margin-top: 20px">
      <el-col :span="22" :offset="1" style="margin-top: 10px">
        <el-card>
          <panel-group @handleSetLineChartData="handleSetLineChartData" />
        </el-card>
      </el-col>
      <el-col :span="22" :offset="1" style="margin-top: 10px">
        <el-card class="box-card" style="padding: 10px">
          <div slot="header" class="clearfix">
            <span>相关链接</span>
          </div>
          <el-col :span="5" v-for="(item, index) in tagItemList" :offset="index > 0 ? 1 : 0">
            <el-card :body-style="{ padding: '0px' }">
              <img :src="item.imgUrl" class="image">
              <div style="padding: 14px;">
                <strong>{{item.tagName}}</strong><br>
                <span style="font-size: small">{{item.describe}}</span>
                <div class="bottom clearfix">
                  <el-button type="text" class="button">跳转</el-button>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-card>
      </el-col>
    </el-row>
</template>

<script>
  import PanelGroup from './PanelGroup'

  const lineChartData = {
    newVisitis: {
      expectedData: [100, 120, 161, 134, 105, 160, 165],
      actualData: [120, 82, 91, 154, 162, 140, 145]
    },
    messages: {
      expectedData: [200, 192, 120, 144, 160, 130, 140],
      actualData: [180, 160, 151, 106, 145, 150, 130]
    },
    purchases: {
      expectedData: [80, 100, 121, 104, 105, 90, 100],
      actualData: [120, 90, 100, 138, 142, 130, 130]
    },
    shoppings: {
      expectedData: [130, 140, 141, 142, 145, 150, 160],
      actualData: [120, 82, 91, 154, 162, 140, 130]
    }
  }

  export default {
    name: 'index',
    components: {
      PanelGroup
    },
    data() {
      return {
        currentDate: new Date(),
        tagItemList:[
          {"imgUrl":'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=2393018698,1106040952&fm=11&gp=0.jpg',
            "tagName":'知识图谱数据集标注系统',
            "describe":'对爬取的数据进行人工/半人工线上标注并提供标注图谱的相关服务',
            "url":'http://127.0.0.1:8080'},
          {"imgUrl":'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=140170663,186220355&fm=26&gp=0.jpg',
            "tagName":'算法云平台',
            "describe":'基于标注平台数据集的在线建模、模型管理、模型复用云平台（本站）',
            "url":'http://127.0.0.1:8080'},
          {"imgUrl":'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1605266662264&di=8c8ee722f57e5472a98820d4ea2b70d2&imgtype=0&src=http%3A%2F%2Ftm-image.tianyancha.com%2Ftm%2Fa54cde147a070a2f0f6bf832b9ec11e3.jpg',
            "tagName":'M&D社区',
            "describe":'依托算法云平台的数据集、模型共享以及技术交流平台',
            "url":'http://127.0.0.1:8080'},
          {"imgUrl":'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1277730282,3978004016&fm=26&gp=0.jpg',
            "tagName":'数据收集平台',
            "describe":'基于可控、可视化爬虫的数据收集平台',
            "url":'http://127.0.0.1:8080'}
        ]
      };
    },
    methods:{
      handleSetLineChartData(type) {
        this.lineChartData = lineChartData[type]
      }
    }
  }
</script>

<style scoped>
  .time {
    font-size: 13px;
    color: #999;
  }

  .bottom {
    margin-top: 13px;
    line-height: 12px;
  }

  .button {
    padding: 0;
    float: right;
  }

  .image {
    width: 100%;
    display: block;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both
  }
</style>
