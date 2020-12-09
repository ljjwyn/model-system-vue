<template>
  <div class="social-signup-container">
    <h3>
      我的github：<a style="color:#409EFF;" target="_blank" href="https://github.com/ljjwyn">ljjwyn</a>
    </h3>
    <div class="sign-btn" @click="tencentHandleClick('https://jq.qq.com/?_wv=1027&k=MfdeOae1')">
      <span class="qq-svg-container"><svg-icon icon-class="qqGroup" class="icon" /></span>
    </div>
  </div>
</template>

<script>
// import openWindow from '@/utils/open-window'

export default {
  name: 'SocialSignin',
  methods: {
    tencentHandleClick(url) {
      window.open(url)
    }
  }
}
</script>

<style lang="scss" scoped>
  .social-signup-container {
    margin: 20px 0;
    .sign-btn {
      display: flex;
      justify-content: flex-start;
      cursor: pointer;
      margin-right:50px;
      align-items: center;
    }
    .icon {
      color: #fff;
      font-size:104px;
      margin-top: 8px;
    }
    .wx-svg-container,
    .qq-svg-container {
      display: inline-block;
      text-align: center;
      padding-top: 1px;
      border-radius: 4px;
      margin-bottom: 20px;
      margin-right: 5px;
    }
    .wx-svg-container {
      background-color: #24da70;
    }
    .qq-svg-container {
      //background-color: #6BA2D6;
    }
  }
</style>
