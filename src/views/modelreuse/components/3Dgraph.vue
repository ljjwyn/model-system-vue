<template>
 <div id="graph3d" ></div>
</template>

<script>
import ForceGraph3D from '3d-force-graph';
import {getKgGraphData} from '@/api/kgGraphApi';
import SpriteText from 'three-spritetext';


export default {
  name: "graph3D",
  data(){
    return{
      graphData:{"links":[{"source":0,"target":1,"val":"发病机制","value":4},
          {"source":1,"target":2,"val":"营养不良，低蛋白饮食可导致胰腺萎缩、纤维化及结石形成。","value":31},
          {"source":0,"target":3,"val":"ICD-10","value":6},{"source":3,"target":4,"val":"K85.9","value":5},
          {"source":0,"target":5,"val":"病因","value":2},{"source":5,"target":6,"val":"药物和毒素","value":5},
          {"source":5,"target":7,"val":"内分泌和代谢性疾病","value":9},{"source":0,"target":8,"val":"相关导致","value":4},
          {"source":8,"target":9,"val":"系统性红斑狼疮","value":7},{"source":8,"target":10,"val":"炎症性肠病","value":5},
          {"source":8,"target":11,"val":"川崎病","value":3},{"source":8,"target":12,"val":"敏性紫癜","value":4},
          {"source":8,"target":13,"val":"溶血性尿毒综合征","value":8}],"nodes":[{"group":1,"id":0,"name":"坏死性胰腺炎"},
          {"group":2,"id":1,"name":""},{"group":2,"id":2,"name":"营养不良，低蛋白饮食可导致胰腺萎缩、纤维化及结石形成。"},
          {"group":3,"id":3,"name":""},{"group":3,"id":4,"name":"K85.9"},{"group":4,"id":5,"name":""},
          {"group":4,"id":6,"name":"药物和毒素"},{"group":4,"id":7,"name":"内分泌和代谢性疾病"},{"group":5,"id":8,"name":""},
          {"group":5,"id":9,"name":"系统性红斑狼疮"},{"group":5,"id":10,"name":"炎症性肠病"},
          {"group":5,"id":11,"name":"川崎病"},{"group":5,"id":12,"name":"敏性紫癜"},
          {"group":5,"id":13,"name":"溶血性尿毒综合征"}]},
      elem:undefined,
      Graph:undefined,
    }
  },
  props: {
    graph3Data:{
      type:Object,
      default: () => {
        return {"links":[],"nodes":[]}
      }
    }
  },
  watch:{
    'graph3Data':{
      handler (newName, oldName) {
        console.log('processData change', newName);
        this.load3Dgraph()
        this.Graph.graphData(newName);
      }
    }
  },
  mounted() {

  },
  methods:{
    load3Dgraph(){
      // let myGraph = ForceGraph3D();
      let WIDTH = document.getElementById('graph3d').clientWidth;
      let HEIGHT = document.getElementById('graph3d').clientHeight;
      const elem = document.getElementById('graph3d');
      this.Graph = ForceGraph3D()
      (elem)
        .nodeLabel('name')
        .nodeAutoColorBy('group')
        .linkAutoColorBy(d => this.graph3Data.nodes[d.target].group)
        .graphData(this.graph3Data)
        .linkThreeObjectExtend(true)
        .linkWidth(0.75)
        .width(WIDTH)
        .height(HEIGHT)
        .linkThreeObject(link => {
          const sprite = new SpriteText(`${link.val}`);
          sprite.color = link.color;
          sprite.textHeight = 2.5;
          return sprite;
        })
        .linkPositionUpdate((sprite, { start, end }) => {
          const middlePos = Object.assign(...['x', 'y', 'z'].map(c => ({
            [c]: start[c] + (end[c] - start[c]) / 2 // calc middle point
          })));
          Object.assign(sprite.position, middlePos);
        })
        .onNodeHover(node => elem.style.cursor = node ? 'pointer' : null)
        .onNodeClick(node => {
          const distance = 40;
          const distRatio = 1 + distance/Math.hypot(node.x, node.y, node.z);
          this.Graph.cameraPosition(
            { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio }, // new position
            node, // lookAt ({ x, y, z })
            3000  // ms transition duration
          );
        });
      this.Graph.numDimensions(3);
      this.Graph.d3Force('charge').strength(-100);
    }

  }
}
</script>

<style scoped>

</style>
