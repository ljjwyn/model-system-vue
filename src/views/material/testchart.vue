<template>
<div class="echarts">
    <el-row :gutter="20">
      <el-col :span="12">
        <div id="ci"></div>
      </el-col>
      <el-col :span="6">
        <div id="ci"></div>
      </el-col>
      <el-col :span="6">
        <div id="ci"></div>
      </el-col>
      <el-col :span="6">
        <div id="ci"></div>
      </el-col>
    </el-row>
</div>
</template>

<script>
import { Bar } from '@antv/g2plot';

export default {
    data() {
        return {
        bardata:[
        { year: '1951 年', sales: 38 },
        { year: '1952 年', sales: 52 },
        { year: '1956 年', sales: 61 },
        { year: '1957 年', sales: 145 },
        { year: '1958 年', sales: 48 }
        ],
        lineDatas:[
            { year: '1991', value: 3 },
            { year: '1992', value: 4 },
            { year: '1993', value: 3.5 },
            { year: '1994', value: 5 },
            { year: '1995', value: 4.9 },
            { year: '1996', value: 6 },
            { year: '1997', value: 7 },
            { year: '1998', value: 9 },
            { year: '1999', value: 13 },
        ]
    }
    },
    mounted() {
        this.barplot().render();
    },
    methods: {
        barplot(){
            return new Bar(document.getElementById("ci"), {
            data:this.bardata,
            xField: 'sales',
            yField: 'year',
            colorField: 'year'
            });
        }
    }
};
</script>

<style lang="scss" scoped>
.echarts {
  background: #fff;
  margin: 10px 20px 0;
  h3 {
    font-size: 24px;
    text-align: center;
    padding: 60px 0 0 0;
  }
}
</style>