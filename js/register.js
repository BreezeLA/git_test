const registerElement = document.querySelector('#btn-register');
registerElement.addEventListener('click', () => {
    axios({
        url: 'register',
        method: 'post',
        data: {
            username: 'breeze',
            password: '123456'
        }
    })
});