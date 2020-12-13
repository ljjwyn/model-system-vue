import request from '@/utils/request'
import axios from 'axios'
import {pythonUrl, baseUrl} from './axiosApi'

// 获得数据集的list
export const getDataSetList = () =>
  request({
    url: baseUrl+'textDataSet/getalldataset',
    headers : {
      'Content-Type' : 'application/json',
    },
    method: "GET"
  });

// 获取数据集的文件列表
export const getSubFile = (data) =>
  request({
    url: pythonUrl+'getsubfile',
    headers : {
      'Content-Type' : 'application/json',
    },
    method: "POST",
    data:{"dataSetName":data}
  });

// 查看文件的内容
export const getSubFileContent = (dataSetName,subFileName) =>
  request({
    url: pythonUrl+'getfilecontent',
    headers : {
      'Content-Type' : 'application/json',
    },
    method: "POST",
    data:{
      "dataSetName":dataSetName,
      "fileName":subFileName
    }
  });

// 数据集预处理
export const preProcessDataSet = (dataSetName,dataSetCatalog,ispretrainmodel) =>
  request({
    url: pythonUrl+'preprocessing',
    headers : {
      'Content-Type' : 'application/json',
    },
    method: "POST",
    data:{
      "dataSetName":dataSetName,
      "dataSetCatalog":dataSetCatalog,
      "ispretrainmodel":ispretrainmodel
    }
  });

//uploadDataSet的相关api 分割线
//TODO 为了实现自定义的进度条这个接口这个api被禁用了。
export const uploadFile = (data) =>
  request({
    url: baseUrl+'multiUpload',
    headers : {
      'Content-Type' : 'application/json',
    },
    method: "POST",
    data
  });

// 接口用来在数据集上传完成后将数据集的信息新增到数据库中
export const insertIntoDB = (data) =>
  request({
    url: baseUrl+'textDataSet/insert',
    headers : {
      'Content-Type' : 'application/json',
    },
    method: "POST",
    data
  });


// 一次性删除数据集的文件及其在数据库的记录
export const deleteAll = (data) =>
  request({
    url: baseUrl+'textDataSet/deleteall',
    headers : {
      'Content-Type' : 'application/json',
    },
    method: "POST",
    data:{"id": data}
  });




