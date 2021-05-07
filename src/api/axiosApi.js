// TODO 这里将java后端迁移到mac这边开发，python以及其他的中间件还是给予tp的后端即108服务器
//const baseUrl = "/webAlgorithm/";
// http://192.168.31.108:8080/webAgorithm/
const baseUrl = "http://192.168.31.108:8081/webAgorithm/";
//const pythonUrl = "/pythonAlgorithm/";
const pythonUrl = "http://192.168.31.108:3002/";
//const pythonUrlScrapy = "/pythonUrlScrapy/";
const pythonUrlScrapy = "http://192.168.31.108:3003/";
//const stompUrl = "/stomp/"
const stompUrl = "http://192.168.31.108:15674/"
export {
  baseUrl,
  pythonUrl,
  stompUrl,
  pythonUrlScrapy
}
