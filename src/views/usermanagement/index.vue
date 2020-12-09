<template>
  <el-row style="margin-top: 20px">
    <el-col :span="6" style="margin-left: 10px">
      <el-divider>用户头像</el-divider>
      <center class="m-t-30">
      <div class="demo-image__preview">
        <el-image
          style="width: 100px; height: 100px"
          :src="form.url"
          :preview-src-list="srcList">
        </el-image>
      </div>
        <el-divider><i class="el-icon-mobile-phone"></i></el-divider>
      </center>
    </el-col>
    <el-col :span="16" style="margin-top: 30px">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="账号名">
          <el-input v-model="form.userAccount" style="width: 200px"></el-input>
        </el-form-item>
        <el-form-item label="用户权限">
          <el-select v-model="form.userToken" placeholder="请选择权限">
            <el-option label="管理员" value="admin-token"></el-option>
            <el-option label="用户" value="edit-token"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户密码">
          <el-input v-model="form.userPassword"></el-input>
        </el-form-item>
        <el-form-item label="用户描述">
          <el-input type="textarea" v-model="form.userDescribe"></el-input>
        </el-form-item>
        <el-form-item label="我的标签">
          <el-checkbox-group v-model="form.type">
            <el-checkbox label="前端大神" name="type"></el-checkbox>
            <el-checkbox label="后端大神" name="type"></el-checkbox>
            <el-checkbox label="运维大哥" name="type"></el-checkbox>
            <el-checkbox label="产品经理" name="type"></el-checkbox>
            <el-checkbox label="算法大师" name="type"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="onSubmit">更新</el-button>
          <el-button>取消</el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<script>
  import {userInformation} from '@/api/user';
  import store from '@/store'
  import { MessageBox } from 'element-ui'
  export default {
    name: 'index',
    data() {
      return {
        url: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
        srcList: [
          'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
        ],
        form: {
          userAccount: '',
          userPassword: '',
          userDescribe: '',
          userToken: '',
          type: [],
          url:'',
        }
      }
    },
    computed:{
      userAccount() {
        return this.$store.getters.userAccount
      }
    },
    mounted: function(){

      if(this.userAccount===undefined){
        console.log("this.userAccount null",this.userAccount);
        MessageBox.confirm('vuex被清空，请重新登录', 'Confirm logout', {
          confirmButtonText: 'Re-Login',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      userInformation({"userAccount":this.userAccount}).then(res=>{
        console.log("res",res);
        this.form.userAccount = res.data.userAccount;
        this.form.userToken = res.data.userToken;
        this.form.userDescribe = res.data.userDescribe;
        this.form.userPassword = res.data.userPassword;
        this.form.url = res.data.userImg;
        this.srcList=[];
        this.srcList.push(res.data.userImg);
        this.form.type = res.data.userType.split(";");

      },err=>{
        console.log("err",err);
      });
    },
    methods: {
      onSubmit() {
        console.log("userForm",this.form)
        console.log('submit!');
      }
    }
  }
</script>

<style scoped>

</style>
