<template>
  <div id="container"></div>
</template>

<script>
  import { Line } from '@antv/g2plot';
  import { Chart } from '@antv/g2';

  export default {
    name: 'linePlotTest',
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
        line: null,

      }
    },
    watch:{
      'processData':{
        handler (newName, oldName) {
          console.log('processData Test change', newName);
          this.line.changeData(newName);
        }
      }
    },
    mounted(){
      console.log("processData",this.processData);
      this.line = new Line('container', {
        data:this.processData,
        xField: 'batchId',
        yField: 'value',
        seriesField: 'key',
        shape: 'hvh',
      });

      this.line.render();
      // this.line = new Chart({
      //   container: 'container',
      //   autoFit: true,
      //   height: 500,
      // });
      // this.line.data(this.processData);
      // this.line.scale('batchId', {
      //   range: [0, 1],
      // });
      // this.line.scale('value', {
      //   nice: true,
      // });
      //
      // this.line.tooltip({
      //   showCrosshairs: true,
      // });
      //
      // this.line
      //   .line()
      //   .position('batchId*value')
      //   .shape('hv')
      //   .color('key');
      //
      // this.line.render();


    }
  }
</script>

<style scoped>

</style>
