<template>


  <el-row :gutter="20" style="margin-top:50px;">
    <aside style="margin: 50px">这个页面是测试websocket的功能测试界面，后端有支持</aside>
    <el-col :span="6" style="margin: 10px">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>Material Design 的input</span>
        </div>
        <div style="height:100px;">
          <el-form :model="demo" :rules="demoRules">
            <el-form-item prop="title">
              <md-input v-model="demo.title" icon="el-icon-search" name="title" placeholder="输入标题">
                标题
              </md-input>
            </el-form-item>
          </el-form>
        </div>
      </el-card>
    </el-col>
    <el-col :span="16" style="margin: 10px">
      <el-card class="box-card" align-center>
        <div slot="header" class="clearfix">
          <span>websocket发送</span>
        </div>
        <el-button style="padding: 5px" type="primary" round @click="startWebSocket">验证</el-button>
        <el-input v-model="input" style="width: 60%"></el-input>
        <el-button style="padding: 5px" type="primary" round @click="sendMessage">发送</el-button>
      </el-card>
    </el-col>
    <el-col :span="22">
      <gauge></gauge>
    </el-col>
  </el-row>
</template>

<script>
  import MdInput from '@/components/MDinput'
  import gauge from '../buildmodel/components/gauge'

  export default {
    name: 'modellingProcess',
    components: {
      MdInput,
      gauge
    },
    data:function() {
      return{
        input:'',
        isLogin:false,
        ws:undefined,
        demo:{
          title:''
        },
        demoRules:undefined

      }
    },
    beforeRouteLeave(to, form, next) {
      console.log('刷新或关闭')
      next()
    },
    methods:{

      startWebSocket(){

        if ("WebSocket" in window)
        {
          let ws = undefined;
          this.ws= ws = new WebSocket("ws://127.0.0.1:3002/websocket");


          // 连接建立后的回调函数
          ws.onopen = function()
          {
            console.log("startWebSocket ws",ws);
            // Web Socket 已连接上，使用 send() 方法发送数据
            ws.send("admin:123456");
            alert("正在发送：admin:123456");
          };

          // 接收到服务器消息后的回调函数
          ws.onmessage = function (evt)
          {
            var received_msg = evt.data;
            alert("收到消息："+received_msg);

          };

          // 绑定回调函数与js函数在同一个作用域中，使得回调可以出发vue js域中的变量变化。
          // let func2 = function func3(val) {
          //   //在此处即可同时使用websocket的数据和data数据，method函数
          //   if (val.indexOf("sorry") == -1) {
          //     this.ws.send("2");
          //     this.isNewMessage=true;
          //     console.log("this.isNewMessage",this.isNewMessage);
          //     let resJson = eval("("+val+")");
          //     if(resJson.code!==301){
          //       alert("收到消息："+val);
          //     }
          //   }
          // }
          // let func1 = func2.bind(this)


          // 连接关闭后的回调函数
          ws.onclose = function()
          {
            // 关闭 websocket
            alert("连接已关闭...");
          };
        }
        else
        {
          // 浏览器不支持 WebSocket
          alert("您的浏览器不支持 WebSocket!");
        }
      },
      sendMessage(){
        // 连接建立后的回调函数
        console.log("sendMessage isLogin1",this.isLogin);
        console.log("sendMessage this.ws",this.ws);

        // Web Socket 已连接上，使用 send() 方法发送数据
        this.ws.send(this.input);
        //alert("正在发送：admin:123456");

      }

    }

  }

</script>

<style scoped>

</style>
