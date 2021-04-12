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
            <el-card :body-style="{ padding: '0px' }" style="height: 400px">
              <img :src="item.imgUrl" class="image">
              <div style="padding: 14px">
                <strong>{{item.tagName}}</strong><br>
                <span style="font-size: small">{{item.describe}}</span>
                <div class="bottom clearfix">
                  <el-button type="text" class="button" @click="goRoute(item)">跳转</el-button>
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
  import {getSession} from "@/api/dashboardApi";

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
          {"imgUrl":'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3492539347,752220665&fm=26&gp=0.jpg',
            "tagName":'知识图谱数据集标注系统',
            "describe":'对爬取的数据进行人工/半人工线上标注并提供标注图谱的相关服务',
            //TODO 这里的标注系统的地址是写死的注意替换。
            "url":'http://192.168.43.7:8080/labelsystem/login.html'},
          {"imgUrl":'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=140170663,186220355&fm=26&gp=0.jpg',
            "tagName":'算法云平台',
            "describe":'基于标注平台数据集的在线建模、模型管理、模型复用云平台（本站）',
            "url":'http://127.0.0.1:8080'},
          {"imgUrl":'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3336814203,3537041036&fm=26&gp=0.jpg',
            "tagName":'M&D社区',
            "describe":'依托算法云平台的数据集、模型共享以及技术交流平台',
            "url":'http://127.0.0.1:8080'},
          {"imgUrl":'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1277730282,3978004016&fm=26&gp=0.jpg',
            "tagName":'数据收集平台',
            "describe":'基于可控、可视化爬虫的数据收集平台',
            "url":'http://localhost:9528/#/scrapy'}
        ],
        tokenUid:undefined,
      };
    },
    mounted() {
      this.getSessionId();
    },
    methods:{
      handleSetLineChartData(type) {
        this.lineChartData = lineChartData[type]
      },
      goRoute(item){
        console.log("goRoute item",item);
        if (item.tagName === "知识图谱数据集标注系统") window.open(item.url+"?tokenUid="+this.tokenUid,'_blank');
        else window.open(item.url,'_blank');
      },
      getSessionId(){
        getSession().then(res => {
          console.log("getsession", res);
          this.tokenUid = res.tokenUid;
          if(res.code===200) this.$message.info(res.message);
          else this.$message.info("用户未登录，跳转到系统还需登录");
        })
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
