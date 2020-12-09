<template>
  <el-row class="tags-cont">
    <svg-icon class="svg" @click="deltaXleft" icon-class="left" />
    <el-scrollbar
      ref="scrollContainer"
      :vertical="false"
      class="scroll-container"
      @wheel.native.prevent="handleScroll"
    >
      <slot />
    </el-scrollbar>
    <svg-icon @click="deltaXright" class="svg" icon-class="right" />
    <el-dropdown class="tags-right" @command="handleCommand">
      <span class="el-dropdown-link">
        更多操作<i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="refresh">刷新</el-dropdown-item>
        <el-dropdown-item command="close">关闭</el-dropdown-item>
        <el-dropdown-item command="closeTag">关闭其他</el-dropdown-item>
        <el-dropdown-item command="closeAll">关闭全部</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </el-row>
</template>

<script>
const tagAndTagSpacing = 4; // tagAndTagSpacing

export default {
  name: "ScrollPane",
  data() {
    return {
      left: 0,
      selectedTag: ""
    };
  },
  computed: {
    scrollWrapper() {
      return this.$refs.scrollContainer.$refs.wrap;
    },
    ingSelected() {
      return this.$store.state.tagsView.selectedTag;
    }
  },
  beforeRouteUpdate(to, from, next) {
    console.log(to);
    next();
  },
  methods: {
    isActive(route) {
      return route.path === this.$route.path;
    },
    handleCommand(command) {
      if (command == "refresh") {
        this.$parent.refreshSelectedTag(this.ingSelected);
      }
      if (command == "close") {
        console.log(this.ingSelected);
        this.$parent.closeSelectedTag(this.ingSelected);
      }
      if (command == "closeTag") {
        this.$parent.closeOthersTags(this.ingSelected);
      }
      if (command == "closeAll") {
        this.$parent.closeAllTags(this.ingSelected);
      }
    },
    handleScroll(e) {
      const eventDelta = e.wheelDelta || -e.deltaY * 40;
      const $scrollWrapper = this.scrollWrapper;
      $scrollWrapper.scrollLeft = $scrollWrapper.scrollLeft + eventDelta / 4;
    },
    deltaXleft() {
      const $scrollWrapper = this.scrollWrapper;
      let leftScoll = $scrollWrapper.scrollWidth;
      let timer = setInterval(() => {
        leftScoll = parseInt(leftScoll / 10);
        if (leftScoll <= 0) {
          clearInterval(timer);
          $scrollWrapper.scrollLeft = leftScoll;
        }
      }, 15);
    },
    deltaXright(e) {
      const $scrollWrapper = this.scrollWrapper;
      let left = 1;
      let leftScoll = $scrollWrapper.scrollWidth;
      let timer = setInterval(() => {
        left = left * 10;
        if (leftScoll <= left) {
          clearInterval(timer);
          $scrollWrapper.scrollLeft = left;
        }
      }, 15);
    },
    moveToTarget(currentTag) {
      const $container = this.$refs.scrollContainer.$el;
      const $containerWidth = $container.offsetWidth;
      const $scrollWrapper = this.scrollWrapper;
      const tagList = this.$parent.$refs.tag;

      let firstTag = null;
      let lastTag = null;

      // find first tag and last tag
      if (tagList.length > 0) {
        firstTag = tagList[0];
        lastTag = tagList[tagList.length - 1];
      }

      if (firstTag === currentTag) {
        $scrollWrapper.scrollLeft = 0;
      } else if (lastTag === currentTag) {
        $scrollWrapper.scrollLeft =
          $scrollWrapper.scrollWidth - $containerWidth;
      } else {
        // find preTag and nextTag
        const currentIndex = tagList.findIndex(item => item === currentTag);
        const prevTag = tagList[currentIndex - 1];
        const nextTag = tagList[currentIndex + 1];

        // the tag's offsetLeft after of nextTag
        const afterNextTagOffsetLeft =
          nextTag.$el.offsetLeft + nextTag.$el.offsetWidth + tagAndTagSpacing;

        // the tag's offsetLeft before of prevTag
        const beforePrevTagOffsetLeft =
          prevTag.$el.offsetLeft - tagAndTagSpacing;

        if (
          afterNextTagOffsetLeft >
          $scrollWrapper.scrollLeft + $containerWidth
        ) {
          $scrollWrapper.scrollLeft = afterNextTagOffsetLeft - $containerWidth;
        } else if (beforePrevTagOffsetLeft < $scrollWrapper.scrollLeft) {
          $scrollWrapper.scrollLeft = beforePrevTagOffsetLeft;
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.tags-cont {
  padding: 0 20px;
  display: flex;
  align-items: center;
  width: 100%;
  .svg {
    width: 30px;
    cursor: pointer;
    position: relative;
    top: 2px;
  }
  .tags-right {
    width: 100px;
    text-align: right;
  }
}
.scroll-container {
  white-space: nowrap;
  position: relative;
  overflow: hidden;
  transition: 0.5s;
  width: calc(100% - 100px);
  /deep/ {
    .el-scrollbar__bar {
      bottom: 0px;
    }
    .el-scrollbar__wrap {
    }
  }
}
</style>
