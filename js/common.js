// axios请求拦截器
axios.interceptors.request.use(config => {
  config.baseURL = 'https://hmajax.itheima.net/';
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = token; // 有token就加上token
  }
  return config;
});


// axios响应拦截器
axios.interceptors.response.use(response => {
  if (response.config.url !== 'dashboard') {
    showToast(response.data.message); // message提示
  }
  console.log(response, '响应数据');
  return response.data;
}, err => {
  // 请求失败
  if (err.response.status === 401) {
    showToast('请重新登录');
    localStorage.removeItem('token');
    toRoute('./login.html', 1500); // 跳转
  } else {
    showToast(err.response.data.message);
  }
  return Promise.reject(err);
})


// 跳转页面(参数url: 跳转地址, time: 延迟时间)
function toRoute(url, time = 1000) {
  setTimeout(() => {
    location.href = url;
  }, time)
}


// message提示
function showToast(message) {
  const toastDom = document.querySelector('.toast'); // 获取toast元素
  document.querySelector('.toast-body').innerText = message; // 设置提示内容
  const toast = new bootstrap.Toast(toastDom); // 创建toast
  toast.show(); // 显示toast
};


// 登录注册
async function loginAndRegister(event, url = 'login' || 'register') {
  // 收集fome 数据
  const formDom = document.querySelector('.form');
  const data = serialize(formDom, { empty: true, hash: true });

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

  // 发起请求
  const { data: { token, username: uname } } = await axios.post(url, data);
  if (token) {
    // 存储token 和 用户名
    localStorage.setItem('token', token);
    localStorage.setItem('username', uname);
    toRoute('./index.html', 1500);
  }
}


// 获取仪表盘数据
async function getDashboard() {
  const { data: { overview } } = await axios.get('dashboard');  // 获取数据
  // 渲染数据
  console.log(overview);
  Object.keys(overview).forEach(key => {
    console.log(key, overview[key]);
    document.querySelector(`.${key}`).innerText = overview[key];
  })
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
  toRoute('./login.html', 1500);
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