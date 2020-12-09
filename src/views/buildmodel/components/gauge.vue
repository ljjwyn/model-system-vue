<template>
  <div id="containerGauge"></div>
</template>

<script>
  import { Chart, registerShape } from '@antv/g2';

  export default {
    name: 'gauge',
    data() {
      return {
        gauge: null,
        chart: null,
        newData:undefined,
      }
    },
    props: {
      percent: {
        type: Number,
        default: () => {
          return 0
        }
      }
    },
    watch: {
      'percent': {
        handler(newName, oldName) {
          console.log('percent Test change', newName);
          this.newData = newName;
        }
      }
    },
    mounted: function(){

      // 自定义Shape 部分
      registerShape('point', 'pointer', {
        draw(cfg, container) {
          const group = container.addGroup({});
          // 获取极坐标系下画布中心点
          const center = this.parsePoint({ x: 0, y: 0 });
          // 绘制指针
          group.addShape('line', {
            attrs: {
              x1: center.x,
              y1: center.y,
              x2: cfg.x,
              y2: cfg.y,
              stroke: cfg.color,
              lineWidth: 5,
              lineCap: 'round',
            },
          });
          group.addShape('circle', {
            attrs: {
              x: center.x,
              y: center.y,
              r: 9.75,
              stroke: cfg.color,
              lineWidth: 4.5,
              fill: '#fff',
            },
          });
          return group;
        },
      });

      const color = ['#0086FA', '#FFBF00', '#F5222D'];
      let chart = new Chart({
        container: 'containerGauge',
        autoFit: true,
        height: 300,
        length: 300,
        padding: [0, 0, 30, 0],
      });
      chart.data(this.creatData());

      chart.animate(false);

      chart.coordinate('polar', {
        startAngle: (-9 / 8) * Math.PI,
        endAngle: (1 / 8) * Math.PI,
        radius: 0.75,
      });
      chart.scale('value', {
        min: 0,
        max: 10,
        tickInterval: 1,
      });

      chart.axis('1', false);
      chart.axis('value', {
        line: null,
        label: {
          offset: -40,
          style: {
            fontSize: 18,
            fill: '#CBCBCB',
            textAlign: 'center',
            textBaseline: 'middle',
          },
        },
        tickLine: {
          length: -24,
        },
        grid: null,
      });
      chart.legend(false);
      chart.tooltip(false);
      chart
        .point()
        .position('value*1')
        .shape('pointer')
        .color('value', (val) => {
          if (val < 4) {
            return color[0];
          } else if (val <= 8) {
            return color[1];
          } else if (val <= 10) {
            return color[2];
          }
        });
      draw([{ value: 0.0 , flag: 1}]);
      const interval = setInterval(()=> {
        draw(this.creatData());
      }, 1000);

      let count = 0;
      function draw(data) {
        console.log("draw",data);
        if(data[0].flag===1){
          let val = data[0].value;
          if(val>10) {
            val = (val-10).toFixed(1);
            data[0].value = val;
            clearInterval(interval);
          }//停止
          const lineWidth = 25;
          chart.annotation().clear(true);
          // 绘制仪表盘背景
          chart.annotation().arc({
            top: false,
            start: [0, 1],
            end: [10, 1],
            style: {
              stroke: '#CBCBCB',
              lineWidth,
              lineDash: null,
            },
          });

          if (val >= 3.3) {
            chart.annotation().arc({
              start: [0, 1],
              end: [val, 1],
              style: {
                stroke: color[0],
                lineWidth,
                lineDash: null,
              },
            });
          }

          if (val >= 7) {
            chart.annotation().arc({
              start: [3.3, 1],
              end: [7, 1],
              style: {
                stroke: color[1],
                lineWidth,
                lineDash: null,
              },
            });
          }

          if (val > 7 && val <= 10) {
            chart.annotation().arc({
              start: [7, 1],
              end: [val, 1],
              style: {
                stroke: color[2],
                lineWidth,
                lineDash: null,
              },
            });
          }

          if (val > 3.3 && val <= 7) {
            chart.annotation().arc({
              start: [3.3, 1],
              end: [val, 1],
              style: {
                stroke: color[1],
                lineWidth,
                lineDash: null,
              },
            });
          }

          if (val < 3.3) {
            chart.annotation().arc({
              start: [0, 1],
              end: [val, 1],
              style: {
                stroke: color[0],
                lineWidth,
                lineDash: null,
              },
            });
          }

          // 绘制指标数字
          chart.annotation().text({
            position: ['50%', '85%'],
            content: '准确率',
            style: {
              fontSize: 20,
              fill: '#545454',
              textAlign: 'center',
            },
          });
          chart.annotation().text({
            position: ['50%', '90%'],
            content: `${val * 10} %`,
            style: {
              fontSize: 36,
              fill: '#545454',
              textAlign: 'center',
            },
            offsetY: 15,
          });
          chart.changeData(data);
        }else {
          if (count>20){
            clearInterval(interval);
            alert("20秒获取到测试数据，定时器停止。请检查后端")
            console.log('长时间为获取到测试数据，定时器停止。请检查后端')
          }
          count++;
          console.log('没有更新')
        }

      }

    },
    methods:{
      creatData() {
        const data = [];
        const val = 0.0;
        if (this.newData!==undefined) data.push({ value: +this.newData, flag: 1});
        else data.push({ value: +val , flag: 0});
        console.log('newName', this.newData);
        return data
      }
    }
  }
</script>

<style scoped>

</style>
