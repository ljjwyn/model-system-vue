<template>
  <div id="container"></div>
</template>

<script>
  import { Line } from '@antv/g2plot';

  export default {
    name: 'linePlot',
    props: {
      processData:{
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
      'processData':{
        handler (newName, oldName) {
          console.log('processData change', newName);
          this.line.changeData(newName);
          }
        }
    },
    mounted(){
      console.log("processData",this.processData);
      this.line = new Line('container', {
        //data:this.lineData,
        data:this.processData,
        padding: 'auto',
        xField: 'batchId',
        yField: 'train_acc',
        xAxis: {
          tickCount: 5,
        },
        slider: {
          start: 0.1,
          end: 0.5,
        },
      });

      this.line.render();
    }
  }
</script>

<style scoped>

</style>
