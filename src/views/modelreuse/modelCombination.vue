<template>
  <el-row style="margin-top: 20px;margin-left: 10px">
    <el-col :span="22" :offset="1">

    </el-col>
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
          <Kanban :key="2" :list="list2" :group="group" class="kanban working" header-text="Level1" />
          <i style="font-size:30px" class="el-icon-right"></i>
          <Kanban :key="3" :list="list3" :group="group" class="kanban done" header-text="Level2" />
        </div>
        <el-button v-on:click="showList" type="primary" round style="margin: 5px">确认组合</el-button>
      </el-card>

    </el-col>
    <el-col :span="12" style="margin: 10px">

    </el-col>
  </el-row>

</template>
<script>
import Kanban from '@/components/Kanban'
import { getTableData} from "@/api/test.js";
import {getModelListByType,getSavaModelId} from '@/api/model'
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
      typeList:["文本分类","命名实体识别","关系抽取"],
      modelList:[],
      list1: [
        // { name: '文本分类', id: 1 },
        // { name: 'BiLSTM+CRF', id: 2 },
        // { name: 'BERT+FC', id: 3 },
        // { name: 'BERT+CNN', id: 4 }
      ],
      list2: [
      ],
      list3: [
      ]
    }
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
    }

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

