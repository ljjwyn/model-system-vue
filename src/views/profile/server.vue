<template>
  <el-row style="margin: 20px">
    <el-col :span="22" :offset="1">
      <el-card  class="box-card" style="margin-top: 10px;">
        <div slot="header" class="clearfix">
          <span>微服务列表</span>
        </div>
        <el-table
          :data="serverData"
          style="width: 100%"
          :row-class-name="tableRowClassName">
          <el-table-column
            prop="serverName"
            label="微服务名称"
            width="200"
          >
          </el-table-column>
          <el-table-column
            prop="sourceIp"
            label="微服务发布ip"
          >
          </el-table-column>
          <el-table-column
            prop="sourcePort"
            label="端口">
          </el-table-column>
          <el-table-column
            prop="memoryShare"
            label="内存利用率">
          </el-table-column>
          <el-table-column
            prop="cpuUtilization"
            label="cpu利用率">
          </el-table-column>
          <el-table-column
            label="状态"
          >
            <template slot-scope="scope">
              <el-popover trigger="hover" placement="top">
                <p>状态: {{ scope.row.state }}</p>
                <div slot="reference" class="name-wrapper">
                  <el-tag size="medium">{{ scope.row.state }}</el-tag>
                </div>
              </el-popover>
            </template>
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
      if (row.state === "normal"){
        return 'success-row';
      }else if (row.state === "warning"){
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
      serverData:[
        {
          sourceIp:"10.0.0.201",
          sourcePort:"3003",
          memoryShare:0.81,
          cpuUtilization:0.03,
          state:"normal",
          timeStamp:"1614913430",
          serverName:"数据爬取微服务",
          beatCount:56
        },
        {
          sourceIp:"10.0.0.202",
          sourcePort:"3002",
          memoryShare:0.35,
          cpuUtilization:0.07,
          state:"normal",
          timeStamp:"1614913430",
          serverName:"标注微服务Python后端",
          beatCount:56
        },
        {
          sourceIp:"10.0.0.203",
          sourcePort:"3001",
          memoryShare:0.78,
          cpuUtilization:0.40,
          state:"warning",
          timeStamp:"1614913430",
          serverName:"图谱构建微服务Pyhton后端",
          beatCount:56
        },
        {
          sourceIp:"10.0.0.203",
          sourcePort:"8081",
          memoryShare:0.34,
          cpuUtilization:0.10,
          state:"normal",
          timeStamp:"1614913430",
          serverName:"图谱构建微服务Java后端",
          beatCount:56
        }
      ],
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
