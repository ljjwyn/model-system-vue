<template>
  <div id="container1"></div>
</template>

<script>
  import { Line } from '@antv/g2plot';

  export default {
    name: 'linePlotLoss',
    props: {
      processDataLoss:{
        type:Array,
        default: () => {
          return []
        }
      }
    },
    data(){
      return{
        line: null
      }
    },
    watch:{
      'processDataLoss':{
        handler (newName, oldName) {
          console.log('processDataLoss change', newName);
          this.line.changeData(newName);
        }
      }
    },
    mounted(){
      console.log("processDataLoss",this.processDataLoss);
      this.line = new Line('container1', {
        //data:this.lineData,
        data:this.processDataLoss,
        padding: 'auto',
        xField: 'batchId',
        yField: 'loss',
        xAxis: {
          tickCount: 5,
        },
        // slider: {
        //   start: 0.1,
        //   end: 0.5,
        // },
      });

      this.line.render();
    }
  }
</script>

<style scoped>

</style>
