axios.defaults.baseURL = 'https://hmajax.itheima.net/';

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

    console.log(token.length);
    if (token) {
      // 存储token 和 用户名
      document.cookie = `token=${token}`;
      localStorage.setItem('username', username);

      // 跳转页面
      setTimeout(() => {
        location.href = './index.html';
      }, 1500);
    }
  } catch (error) {
    showToast(error.response.data.message);
  }
}

// 使用一个函数来发送异步请求验证Token
async function validateToken(token) {
  // 假设有一个API端点用于验证token
  const response = await fetch('/api/validateToken', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token }),
  });

  if (!response.ok) {
    throw new Error('Token验证失败');
  }

  return response.json(); // 假设返回包含token信息的JSON
}

// 登录状态检测
async function checkLogin() {
  try {
    // 获取cookie中的token(不包含'token=')
    const token = document.cookie.split(';').find((c) => c.trim().startsWith('token='));
    if (token) {
      showToast('用户已登录');
      return;
    }
    
    showToast('用户未登录');
    setTimeout(() => {
      location.href = './login.html';
    }, 3500);

    // 验证token的有效性
    // const tokenInfo = await validateToken(token);
    // if (!tokenInfo.valid) {
    //   // 如果token无效，重定向到登录页面
    //   location.href = './login.html';
    // } else {
    //   // 如果token有效，可以继续执行需要登录态的操作
    //   showToast('用户已登录');
    // }
  } catch (error) {
    // 捕获并处理可能的错误，例如网络问题或服务器错误
    console.error('检查登录状态时发生错误:', error.message);
    // 根据错误情况决定是否重定向到登录页面或显示错误信息
    location.href = './login.html';
  }
}

// 用户名渲染
function renderUsername() {
  const username = localStorage.getItem('username') || '未登录';
  console.log(username);
  document.querySelector('#user').innerText = username;
};

// 提出登录
function logout() {
  localStorage.removeItem('username');// 删除本地存储的用户名
  document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  location.href = './login.html';
}