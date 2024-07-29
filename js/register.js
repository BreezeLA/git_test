// 注册点击事件
const registerElement = document.querySelector('#btn-register');
registerElement.addEventListener('click', async () => {
    // 收集fome 数据
    const formDom = document.querySelector('.form_register');
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
        // 发送请求
        const { data: { message } } = await axios.post('register', data);
        // 提示message结果
        showToast(message);
    } catch (error) {
        showToast(error.response.data.message);
    }
});