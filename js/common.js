axios.defaults.baseURL = 'https://hmajax.itheima.net/';

// 请求拦截器
axios.interceptors.request.use(config => {
  // 获取token
  const token = localStorage.getItem('token');
  // 判断token是否存在
  if (token) {
    // 如果存在，设置token
    config.headers.Authorization = token;
  }
  return config;
}, err => Promise.reject(err));

// 跳转到首页
function toRoute(url, time = 1000) {
  setTimeout(() => {
    location.href = url;
  }, time)
}

// message提示
function showToast(message) {
  // 获取toast元素
  const toastDom = document.querySelector('.toast');
  // 设置提示内容
  document.querySelector('.toast-body').innerText = message;
  // 创建toast
  const toast = new bootstrap.Toast(toastDom);
  // 显示toast
  toast.show();
};


// 登录注册
async function loginAndRegister(event, url = 'login' || 'register') {
  // 收集fome 数据
  const formDom = document.querySelector('.form');
  const data = serialize(formDom, { empty: true, hash: true });
  console.log(data);

  // 长度校验
  const { username, password } = data;
  if (username.length < 6 || username.length > 16) {
    showToast('用户名长度不能小于6位, 大于16位');
    return;
  }
  if (password.length < 6 || password.length > 16) {
    showToast('密码长度不能小于6位, 大于16位');
    return;
  }

  try {
    // 发送请求并解构出数据
    const { data: { message, data: { token, username } } } = await axios.post(url, data);
    // message提示
    showToast(message);

    if (token) {
      // 存储token 和 用户名
      localStorage.setItem('token', token);
      localStorage.setItem('username', username);

      // 跳转页面(参数延迟单位毫秒)
      // toRoute('./index.html', 1500);
    }
  } catch (error) {
    showToast(error.response.data.message);
  }
}


// 获取仪表盘数据
async function getDashboard() {
  try {
    // {config,data,headers,request,status,statusText,}  
    const { data: { data: { overview } } } = await axios({
      method: "GET",
      url: 'dashboard',
      // headers: { Authorization: 'breeze_test' }
    })

    // 渲染数据
    console.log(overview);
    Object.keys(overview).forEach(key => {
      console.log(key, overview[key]);
      document.querySelector(`.${key}`).innerText = overview[key];
    })

  } catch (error) {
    // token无效
    if (error.response.status === 401) {
      showToast('请重新登录');
      // 清除token
      console.log('退出登录');
      localStorage.removeItem('token');
      // 跳转页面(参数延迟单位毫秒)
      // toRoute('./login.html', 1500);
    }
  }
}


// 登录状态检测
async function checkLogin() {
  if (localStorage.getItem('token')) {
    // 获取仪表盘数据(token无效会退出登录)
    getDashboard();
    return;
  }

  showToast('用户未登录');
  // 跳转页面(参数延迟单位毫秒)
  // toRoute('./login.html', 1500);
}


// 用户名渲染
function renderUsername() {
  const username = localStorage.getItem('username') || '未登录';
  console.log(username);
  document.querySelector('#user').innerText = username;
};


// 提出登录
function logout() {
  // 删除本地存储的用户名和token
  localStorage.removeItem('username');
  localStorage.removeItem('token');
  location.href = './login.html';
}