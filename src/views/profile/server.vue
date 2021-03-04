<template>
  <el-row style="margin: 20px">
    <el-col :span="22" :offset="1">
      <el-card  class="box-card" style="margin-top: 10px;">
        <div slot="header" class="clearfix">
          <span>微服务列表</span>
        </div>
        <el-table
          :data="tableData"
          style="width: 100%"
          :row-class-name="tableRowClassName">
          <el-table-column
            prop="name"
            label="微服务名称"
            width="180">
          </el-table-column>
          <el-table-column
            prop="ip"
            label="微服务发布ip"
            width="180">
          </el-table-column>
          <el-table-column
            prop="port"
            label="端口">
          </el-table-column>
          <el-table-column
            prop="state"
            label="状态">
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="handleEdit(scope.$index, scope.row)">查看</el-button>
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)">重启</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </el-col>
  </el-row>
</template>

<style>
.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}
</style>

<script>
export default {
  methods: {
    tableRowClassName({row, rowIndex}) {
      console.log("row", row);
      if (row.state === "正常"){
        return 'success-row';
      }else if (row.state === "警告"){
        return 'warning-row';
      }else {
        return 'danger-row';
      }
    },
    handleEdit(index, row) {
      console.log(index, row);
    },
    handleDelete(index, row) {
      console.log(index, row);
    }
  },
  data() {
    return {
      tableData: [{
        ip: '10.0.0.201',
        name: '数据爬取微服务后端系统',
        port: '3003',
        state: '正常'
      }, {
        ip: '10.0.0.202',
        name: '标注微服务Python后端',
        port: '3002',
        state: '正常'
      }, {
        ip: '10.0.0.203',
        name: '图谱构建微服务Pyhton后端',
        port: '3001',
        state: '警告'
      }, {
        ip: '10.0.0.203',
        name: '图谱构建微服务Java后端',
        port: '8081',
        state: '正常'
      }]
    }
  },

}
</script>
