import request from '@/utils/request'
import axios from 'axios'
import {pythonUrl, baseUrl} from './axiosApi'

// 获得配置的LIST
export const getModelConfList = () =>
  request({
    url: baseUrl+'modelconfig/getallconfig',
    headers : {
      'Content-Type' : 'application/json',
    },
    method: "GET"
  });

// 获取数据集的文件列表
export const getDataSetType = (data) =>
  request({
    url: baseUrl+'textDataSet/getdatasettype',
    headers : {
      'Content-Type' : 'application/json',
    },
    method: "POST",
    data:{"dataSetType":data}
  });

// 查看新增模型配置
export const insertNewConfig = (data) =>
  request({
    url: baseUrl+'modelconfig/insert',
    headers : {
      'Content-Type' : 'application/json',
    },
    method: "POST",
    data
  });

// 查看设置为默认模型
export const setAsInit = (confUid,modelId) =>
  request({
    url: baseUrl+'basicmodel/updateconf',
    headers : {
      'Content-Type' : 'application/json',
    },
    method: "POST",
    data:{
      "confUid":confUid,
      "modelId":modelId
    }
  });

// 查看模型结构
export const getModelConstruct = (data) =>
  request({
    url: pythonUrl+'getmodelconstruct',
    headers : {
      'Content-Type' : 'application/json',
    },
    method: "POST",
    data
  });

// 基于basicModelId查询模型基本信息
export const searchBasicModel = (data) =>
  request({
    url: baseUrl+'basicmodel/getmodelitem',
    headers : {
      'Content-Type' : 'application/json',
    },
    method: "POST",
    data:{"modelId":data}
  });

