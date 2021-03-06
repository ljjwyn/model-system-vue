import request from '@/utils/request'
import axios from 'axios'
import {pythonUrl, baseUrl} from './axiosApi'

// 获得已建模模型列表
export function getTableData() {
  return request({
    url: baseUrl+'modelbuildrecord/getallmodelrecordvue',
    method: 'get',
  })
}
// 获得选中模型的超参数信息
export const preRunModel = requestData =>
  request({
    url: baseUrl+'modelconfig/getaconfig',
    headers : {
      'Content-Type' : 'application/json',
    },
    method: "post",
    data: requestData
  });
// 预加载模型
export const loadModel = requestData =>
  request({
    url: pythonUrl+'startpredictmodel',
    headers : {
      'Content-Type' : 'application/json',
    },
    method: "POST",
    data: requestData
  });
// 停止模型
export const stopTheModel = data =>
  request({
    url: pythonUrl+'stopmodel',
    headers : {
      'Content-Type' : 'application/json',
    },
    method: "POST",
    data:{'threadName': data}
  });
// 分析知识图谱类的模型
export const showKnowledgeGraph = requestData =>
  request({
    url: pythonUrl+'getentitys',
    headers : {
      'Content-Type' : 'application/json',
    },
    method: "POST",
    data: requestData
  });
// 基础模型的输入预测
export const predictModelInput = requestData =>
  request({
    url: pythonUrl+'predictinputs',
    headers : {
      'Content-Type' : 'application/json',
    },
    method: "POST",
    data: requestData
  });

// 获取命名实体识别模型使用的类别列表用以前端展示
export const getNERLabels = requestData =>
  request({
    url: pythonUrl+'loadnerclass',
    headers : {
      'Content-Type' : 'application/json',
    },
    method: "POST",
    data: {"dataSetName": requestData}
  });

// 获取模型建模过程的详情
export const getModelBuildRecord = uid =>
  request({
    url: pythonUrl+'getbuildrecord',
    headers : {
      'Content-Type' : 'application/json',
    },
    method: "POST",
    data: {"uid": uid}
  });
