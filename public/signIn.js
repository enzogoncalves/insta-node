const password = document.querySelector('#password');
const verify_password = document.querySelector('#verify_password');
const age_input = document.querySelector('#age');
const message_error = document.querySelector('.message_error');
const btn_create = document.querySelector("#create_account")

verify_password.addEventListener('keyup', () => {
    verifyPassword()
})

btn_create.addEventListener('click', () => {
    verifyPassword()
    isAge()
})

age_input.addEventListener('input', (e) => {
    btn_create.disabled = false;
    console.log(e)
})

function verifyPassword() {
    if(verify_password.value !== password.value) {
        message_error.textContent = "A senha não é a mesma";
        btn_create.disabled = true;
    } else {
        message_error.textContent = "";
        btn_create.disabled = false;
    }
}

function realAge(fullAge) {
    let age = 0;
    const year = new Date().getFullYear();            
    const month = new Date().getMonth() + 1;            
    const day = new Date().getDate();

    const ageYear = fullAge.slice(0, 4);
    const ageMonth = fullAge.slice(5, 7);
    const ageDay = fullAge.slice(8, 11)


    if(ageMonth < month) {
        age = year - ageYear
    }  else if(ageMonth == month && ageDay <= day) {
        age = year - ageYear
    } else {
        age = year - ageYear - 1
    }

    return age;
}

function isAge() {
    if(realAge(age_input.value) >= 120 && realAge(age_input.value) <= 12) {
        confirm("Idade não aceita");
        btn_create.disabled = true;
    }
}
