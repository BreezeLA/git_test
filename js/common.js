axios.defaults.baseURL = 'https://hmajax.itheima.net/api/';

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