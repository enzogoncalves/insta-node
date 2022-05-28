const password = document.querySelector('#password');
const verify_password = document.querySelector('#verify_password');
const message_error = document.querySelector('.message_error');
const btn_create = document.querySelector("#create_account")

verify_password.addEventListener('keyup', () => {
    if(verify_password.value == password.value) {
        btn_create.disabled = false;
    }
})

btn_create.addEventListener('click', () => {
    if(verify_password.value !== password.value) {
        message_error.textContent = "A senha não é a mesma";
        btn_create.disabled = true;
    } else {
        btn_create.disabled = false;
    }
})