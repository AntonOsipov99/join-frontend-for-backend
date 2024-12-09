/**
 * Register User
 * @async
 */
async function signUp() {
    const { name, email, password1, password2 } = declareVariablesToSignUp();
    resetReportText();
    users = [];
    if (password1.value != password2.value) {
        document.getElementById('password1').classList.add('log-in-wrong');
        document.getElementById('password2').classList.add('log-in-wrong');
    } else if (password1.value == password2.value) {
        users.push({
            name: name.value,
            email: email.value.toLowerCase(),
            password: password1.value,
            repeated_password: password2.value
        })
        await registerUser();
    }
    document.getElementById('sign_up_btn').disabled = false;
}

function resetFormAndToggleToStartPage() {
    const signUpSuccesfully = document.getElementById('sign_up_succesfully');
    signUpSuccesfully.classList.remove('d-none')
    signUpSuccesfully.style.animation = 'signUpSuccesfull 125ms ease-in-out forwards'
    resetForm('signup', email, password1, password2, name);
    setTimeout(function () { window.location.href = '../index.html' }, 800)
}

function resetReportText() {
    document.getElementById('password1').classList.remove('log-in-wrong');
    document.getElementById('password2').classList.remove('log-in-wrong');
    document.getElementById('email').classList.remove('log-in-wrong');
    document.getElementById('name').classList.remove('log-in-wrong');
}

async function registerUser() {
    const response = await fetch("http://127.0.0.1:8000/join/auth/registration/", {
        method: "post",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: users[0].name,
            email: users[0].email,
            password: users[0].password,
            repeated_password: users[0].repeated_password
        })
    });
    const data = await response.json();
    if (!response.ok || data.email || data.username) {
        if (data.email) {
            document.getElementById('email').classList.add('log-in-wrong');
        }
        if (data.username) {
            document.getElementById('name').classList.add('log-in-wrong');
        }
    } else {
        resetFormAndToggleToStartPage();
    }
}

function declareVariablesToSignUp() {
    document.getElementById('sign_up_btn').disabled = true;
    return {
        name: document.getElementById('name_sign_up'),
        email: document.getElementById('email_sign_up'),
        password1: document.getElementById('password1_input'),
        password2: document.getElementById('password2_input'),
    };
}

/**
 * Check Btn vor Sign Up
 * @param {string} check 
 */
function checkBtnSignUp(check) {
    let signUpCheckBtn = document.getElementById('checkbox_container');
    if (check == 'nonecheck') {
        signUpCheckBtn.innerHTML = '<img id="check_btn" src="../assets/img/checkbuttonchecked.svg" onclick="checkBtnSignUp(`checked`)">';
    } else {
        signUpCheckBtn.innerHTML = '<input id="input_checkbox_none_checked" required type="checkbox" class="form-check-input" onclick="checkBtnSignUp(`nonecheck`)">';
    }
}

window.onload = function () {
    localStorage.setItem('notVisible', 'false');
}

document.getElementById('privacy-policy').addEventListener('click', function (event) {
    event.preventDefault();
    localStorage.setItem('notVisible', true);
    window.location.href = './privacy_policy.html';
});