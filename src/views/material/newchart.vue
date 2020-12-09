<template>
<div class="root">
    <el-row :gutter="20">
      <el-col :span="6">
        <div id="c1"></div>
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
.c1 {
  width: 48px;
  height: 27px;
}
</style>