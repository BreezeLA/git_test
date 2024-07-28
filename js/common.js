// axios基地址
// baseURL 将自动加在url的前面  除非url是一个绝对的url

/* 
 axios({
  url:"/login"
 })

 axios({
  url:'/register'
 })


*/

axios.defaults.baseURL = 'http://ajax-api.itheima.net'


// 添加请求拦截器 --请求发送之前
axios.interceptors.request.use(function (config) {
  // console.log("发送请求之前")
  // 在发送请求之前做些什么  请求头携带token
  // 统一设置token
  const token = localStorage.getItem('user-token')
  // console.log(config.headers,"config")
  if(token){
    config.headers['Authorization'] = token
  }
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});

// 添加响应拦截器  数据响应回来之后 
// 处理token失效  数据剥离
axios.interceptors.response.use(function (response) {
  // 2xx 范围内的状态码都会触发该函数。
  // 对响应数据做点什么   数据剥离
  // 剥离data属性---修改数据的使用(登录注册 首页)
  // console.log(response,0)
  return response.data;
}, function (error) {
  console.dir(error)
  if(error.response.status === 401){
    // 1.删除本地缓存中的信息
    localStorage.removeItem('user-name')
    localStorage.removeItem('user-token')

    tip('请重新登录')

    // 返回登录页
    setTimeout(()=>{
      location.href = './login.html'
    })

  }
  // 超出 2xx 范围的状态码都会触发该函数。
  // 对响应错误做点什么   处理token失效
  return Promise.reject(error);
});


// 提示
function tip(msg){
  const toastDom = document.querySelector("#myToast")
  const toast = new bootstrap.Toast(toastDom)
  // 修改内容并显示
  document.querySelector('.toast-body').innerHTML = msg
  toast.show()
}

// tip(123)


// 抽取校验函数 (判断是否登录)
// 访问首页  已登录 ---进入首页    未登录---提示用户--跳转到登录页面

function checkLogin(){
  const token = localStorage.getItem('user-token')
  console.log(token,"token")  
  // token 为null 说明没有
  if(token ===null){
    tip("请先登录")
    setTimeout(()=>{
    location.href="login.html"
    },1000)
  }
}

// 渲染用户名
function renderUserName(){
  // 读取并渲染用户名
  const username = localStorage.getItem('user-name')
  console.log(username)
  document.querySelector("#user").innerText =username
}

// 退出登录
/* 
 退出登录函数----绑定点击事件 ---删除用户名和token
*/

function registerLogout(){
   document.querySelector('#logout').addEventListener('click',function(){
    //  清除用户名和token
    localStorage.removeItem('user-name')
    localStorage.removeItem('user-token')
    // 跳转到登录页面
    location.href='./login.html'
   })
}

// 首页--数据统计
// 调用接口---渲染数据
async function getData(){
  // 读取本地缓存中的token
  const token = localStorage.getItem('user-token')
  // 调用接口
 let res = await axios({
    url:"/dashboard",
    // 请求头中携带token
    // headers:{
    //   Authorization:token
    // }
  })
  console.log(res,"数据")
  // 通过解构方式  简化数据取值
  const {overview,groupData,provinceData,salaryData,year  } = res.data

  //  渲染数据
  Object.keys(overview).forEach(key=>{
    document.querySelector(`.${key}`).innerText = overview[key]
  })

  // 薪资走势
  renderYearSalary(year)
  //薪资分布
  renderSalary(salaryData)
  // 班级每组薪资
  renderGroupSalary(groupData)
  // 男女薪资分布
  renderGenderSalary(salaryData)
  // 籍贯分布
  renderPrivince(provinceData)
}
