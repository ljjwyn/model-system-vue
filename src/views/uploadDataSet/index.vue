<template>
  <el-row style="margin-top: 20px">
    <el-col :span="22" :offset="1">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>数据集管理</span>
        </div>
        <el-table
          :data="dataSetList"
          border
          style="width: 100%">
          <el-table-column
            prop="id"
            label="ID"
            width="40">
          </el-table-column>
          <el-table-column
            prop="dataSetName"
            label="数据集名"
            width="140">
          </el-table-column>
          <el-table-column
            prop="dataSetCatalog"
            label="数据集类型"
            width="130">
          </el-table-column>
          <el-table-column
            prop="dataSetDescription"
            label="任务描述">
          </el-table-column>
          <el-table-column
            label="创建时间"
            prop="createTime"
            width="170">
            <template slot-scope="scope">{{scope.row.createTime| dateYMDHMSFormat}}</template>
          </el-table-column>
          <el-table-column label="操作" width="150">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                @click="handlePreview(scope.$index, scope.row)">查看</el-button>
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      <el-card class="box-card" style="margin-top: 10px; margin-bottom: 10px">
        <div slot="header" class="clearfix">
          <span>数据集预览</span>
        </div>
        <el-tabs v-model="activeName">
          <el-tab-pane label="数据集预览" name="first">
            <label style="color: blue"><strong style="color: black">选中的数据集是：</strong>{{selectDataSetName}}</label>
            <el-col :span="24" style="margin-top: 10px">
              <label>选择预览文件</label>
              <el-select @change="getSubFileContents" style="margin-left: 5px" v-model="dataSubFileValue" placeholder="请选择数据集">
                <el-option
                  v-for="item in dataSetSubFileList"
                  :key="item"
                  :label="item"
                  :value="item">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="16" style="margin-top: 10px">
              <el-input type="textarea" placeholder="选中的文件内容预览" rows="7"  v-model="dataSubFileContent"></el-input>
            </el-col>
          </el-tab-pane>
          <el-tab-pane label="数据集上传" name="second">
            <el-col :span="12">
              <div>
                <label style="color: red">数据集名称*</label>
                <el-input placeholder="输入数据集名称" style="width: 200px"  v-model="uploadDataSetName"></el-input>
              </div>
              <div style="margin-top: 10px">
                <label>数据集类型</label>
                <el-select style="margin-left: 5px" v-model="selectCatalog" placeholder="请选择数据集">
                  <el-option
                    v-for="item in catalogList"
                    :key="item"
                    :label="item"
                    :value="item">
                  </el-option>
                </el-select>
              </div>
              <el-input style="margin-top: 10px;width: 80%" type="textarea" placeholder="数据集描述" rows="3"  v-model="uploadDataSetDescribe"></el-input>
            </el-col>
            <el-col :span="12">
              <label>训练数据集</label>
              <el-tag closable style="margin-top: 5px">
                上传文件顺序：1、训练集。2、标签集。3、测试集（可选）。4、验证集（可选）
              </el-tag>
              <el-upload
                ref="upload"
                style="width: 200px;margin-top: 5px"
                class="upload-demo"
                action="http://127.0.0.1:8080/webAgorithm/multiUpload"
                :on-preview="handlePreviewUpload"
                :on-remove="handleRemoveUpload"
                :on-progress="uploadFileProcess"
                :before-remove="beforeRemoveUpload"
                multiple
                :limit="4"
                :file-list="fileList"
                :http-request="uploadFile"
                :on-exceed="handleExceedUpload"
                :auto-upload="false"
              >
                <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
                <div slot="tip" class="el-upload__tip">只能上传文本文件，且不超过10M</div>
              </el-upload>
              <!-- 进度条 -->
              <el-progress v-if="progressFlag" :percentage="percentage"></el-progress>
            </el-col>
          </el-tab-pane>
        </el-tabs>

      </el-card>
    </el-col>
  </el-row>
</template>

<script>
  import {getDataSetList,getSubFile,getSubFileContent
    ,preProcessDataSet,uploadFile,insertIntoDB} from '@/api/datasetmanagementApi';
  import axios from 'axios';
  export default {
    name: 'index',
    data() {
      return {
        dataSetList:[],
        activeName:'first',
        dataSetSubFileList:[],
        selectDataSetName:'',
        dataSubFileContent:'',
        catalogList:['数值分类','文本分类','命名实体识别','关系抽取'],
        selectCatalog:'',
        uploadDataSetDescribe:'',
        uploadDataSetName:'',
        uploadData: {
          fieldData: {
            id: '', // 机构id,
          }
        },
        fileList:[],  // upload多文件数组
        fileData: '',  // 文件上传数据（多文件合一)
        progressFlag:true,
        percentage:0,
      }
    },
    mounted:function(){
      getDataSetList().then(res=>{
        console.log("getDataSetList res",res);
        this.dataSetList = res;
      },error=>{

      })
    },
    methods:{
      handleDelete(index, row){
        console.log("handleDelete index",index);
        console.log("handleDelete row",row);
      },
      handlePreview(index, row){
        console.log("handleDelete index",index);
        console.log("handleDelete row",row);
        this.selectDataSetName = row.dataSetName;
        getSubFile(this.selectDataSetName).then(res=>{
          console.log("getSubFile res",res);
          this.dataSetSubFileList = res.dataSetList;
        },error => {
          console.log("getSubFile error", error);
        })

      },
      getSubFileContents(value){
        console.log("getSubFileContents value", value);
        getSubFileContent(this.selectDataSetName,value).then(res=>{
          console.log("getSubFileContent res",res);
          this.dataSubFileContent = res.contents;
        },error => {

        })
      },
      //文件长传相关
      handleRemoveUpload(file, fileList) {
        console.log(file, fileList);
      },
      handlePreviewUpload(file) {
        console.log("handlePreviewUpload", file);
      },
      handleExceedUpload(files, fileList) {
        this.$message.warning(`当前限制选择 4 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
      beforeRemoveUpload(file, fileList) {
        return this.$confirm(`确定移除 ${ file.name }？`);
      },
      submitUpload() {
        const isLt100M = this.fileList.every(file => file.size / 1024 / 1024 < 10);
        if (!isLt100M) {
          this.$message.error('请检查，上传文件大小不能超过10MB!');
        } else {
          this.fileData = new FormData();  // new formData对象
          this.$refs.upload.submit();  // 提交调用uploadFile函数
          this.fileData.append('datasetname', this.uploadDataSetName);  // 添加机构id

          // 为了自定义进度条这个接口不用了。
          // uploadFile(this.fileData).then(response =>{
          //   console.log("uploadFile response",response)
          // });

          // 为了监控上传进度自定义axios作为http接口，这里主要是为了监测进度
          // 基于XMLRequest的onUploadProgress属性。自定义进度条
          const fn = this.uploadProgress; // 我们自己处理上传进度的函数
          axios({
            method: 'post',
            url: 'http://127.0.0.1:8080/webAgorithm/multiUpload',
            headers: {
              'Content-Type': 'multipart/form-data'
            },
            data: this.fileData,
            onUploadProgress: fn, // `onUploadProgress` 允许为上传处理进度事件
          }).then(res=>{
            console.log("axios res",res);

            // 调用insert接口在文件上传成功后将上传的数据集的信息添加在数据库中
            let requestMap={
              "dataSetName":this.uploadDataSetName,
              "dataSetCatalog":this.selectCatalog,
              "dataSetDescription":this.uploadDataSetDescribe
            }
            insertIntoDB(requestMap).then(res=>{
              console.log("insertIntoDB res",res);
              this.$message.success('文件上传成功！');
            },error => {
              this.$message.error('文件上传失败，错误信息！',error);
            })
          });

        }
      },
      uploadProgress(progressEvent){
        /*
           * progressEvent.loaded :已上传量
           * progressEvent.total :上传的总大小
          */
        const p = Math.floor((progressEvent.loaded / progressEvent.total) * 100);
        this.percentage = p;
        console.log("uploadProgress percentage", this.percentage);
      },
      // 上传文件
      uploadFile(file) {
        this.fileData.append('files', file.file);  // append增加数据
      },
      // 这个函数禁用了
      uploadFileProcess(event, file, fileList) {
        this.loadProgress = parseInt(event.percent); // 动态获取文件上传进度
        if (this.loadProgress >= 100) {
          this.loadProgress = 100
          setTimeout( () => {this.progressFlag = false}, 1000) // 一秒后关闭进度条
        }
      },
    }
  }
</script>

<style scoped>

</style>
