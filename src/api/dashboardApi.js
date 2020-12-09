import request from '@/utils/request'
const baseUrl = "http://127.0.0.1:8080/webAgorithm/";
const pythonUrl = "http://127.0.0.1:3002/";

// 获得访问量
export const getVisitorCount = () =>
  request({
    url: baseUrl+'dashboard/visitorcount',
    headers : {
      'Content-Type' : 'application/json',
    },
    method: "GET"
  });
