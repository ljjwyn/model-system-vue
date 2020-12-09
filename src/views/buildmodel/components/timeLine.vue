<template>
  <div class="block" style="overflow:auto;height: 400px">
    <el-timeline
      style="padding: 5px"
      :reverse="true"
    >
      <el-timeline-item
        v-for="(activity, index) in processContents"
        :key="index"
        :icon="activity.icon"
        :type="activity.type"
        :color="activity.color"
        :size="activity.size"
        :timestamp="activity.timestamp">
        {{activity.content}}
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script>
  export default {
    name: 'timeLine',
    data() {
      return {

      };
    },
    props: {
      processContents:{
        type:Array,
        default: () => {
          return []
        }
      }
    },
    watch:{
      'processContents':{
        handler (newName, oldName) {
          console.log('processContents change', newName);
          this.processContents[this.processContents.length-1]['size'] = 'large';
          this.processContents[this.processContents.length-1]['type'] = 'primary';
          this.processContents[this.processContents.length-1]['icon'] = 'el-icon-success';
        }
      }
    },
  }
</script>

<style scoped>

</style>
