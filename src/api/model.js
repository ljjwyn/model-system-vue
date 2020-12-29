import request from '@/utils/request'
import axios from 'axios'
import {pythonUrl, baseUrl} from './axiosApi'

// 获得建模task的list
export const getTaskList = () =>
  request({
    url: baseUrl+'taskManagement/getalltask',
    headers : {
      'Content-Type' : 'application/json',
    },
    method: "GET"
  });

// 创建任务
export const createTask = (data) =>
  request({
    url: baseUrl+'taskManagement/insert',
    headers : {
      'Content-Type' : 'application/json',
    },
    method: "POST",
    data
  });

// 根据任务类型获取可用模型列表
export const getModelListByType = (data) =>
  request({
    url: baseUrl+'basicmodel/getmodelid',
    headers : {
      'Content-Type' : 'application/json',
    },
    method: "POST",
    data:{"modelCatalog":data}
  });

// 创建一个新的建模任务
export const buildANewModelRecord = (data) =>
  request({
    url: baseUrl+'modelbuildrecord/insert',
    headers : {
      'Content-Type' : 'application/json',
    },
    method: "POST",
    data
  });

// 调用python端接口，开始构建模型
export const startModelling = (data) =>
  request({
    url: pythonUrl+'startalgorithm',
    headers : {
      'Content-Type' : 'application/json',
    },
    method: "POST",
    data
  });

// 调用java端接口，获取用于模型测试的相关参数
export const getModelTestConfig = (data) =>
  request({
    url: baseUrl+'modelbuildrecord/premodeltest',
    headers : {
      'Content-Type' : 'application/json',
    },
    method: "POST",
    data:{"modelUid":data}
  });

// 调用python端接口，测试模型
export const modelTest = (data) =>
  request({
    url: pythonUrl+'modeltestaccuracy',
    headers : {
      'Content-Type' : 'application/json',
    },
    method: "POST",
    data
  });

// 调用python端接口，测试模型,关系抽取模型
export const modelTestRE = (data) =>
  request({
    url: pythonUrl+'retestaccuracy',
    headers : {
      'Content-Type' : 'application/json',
    },
    method: "POST",
    data
  });


// 根据basicmodelid获取符合的模型
export const getSavaModelId = (data) =>
  request({
    url: baseUrl+'modelbuildrecord/getsavemodelname',
    headers : {
      'Content-Type' : 'application/json',
    },
    method: "POST",
    data:{"modelBasicId": data}
  });

// 根据modelUid获取模型记录
export const getAModelRecord = (data) =>
  request({
    url: baseUrl+'modelbuildrecord/getmodelrecord',
    headers : {
      'Content-Type' : 'application/json',
    },
    method: "POST",
    data:{"modelUid": data}
  });


