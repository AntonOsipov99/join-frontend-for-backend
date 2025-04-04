/**
 * initialize first Steps for the Page
 */
function init() {
    playAnimation();
}

async function logIn() {
    document.getElementById('email').classList.remove('log-in-wrong');
    document.getElementById('password1').classList.remove('log-in-wrong');
    const email = document.getElementById('email_log_in').value;
    const password = document.getElementById('password1_input').value;
    const response = await fetch('http://127.0.0.1:8000/api/auth/login/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email,
            password
        })
    });
    const data = await response.json();
    if (response.ok) {
        const token = data.token;
        const username = data.username;
        localStorage.setItem('authToken', token);
        window.location.href = `html/summary.html?msg=Welcome-to-Join, ${username}`;
    } else {
        document.getElementById('password1').classList.add('log-in-wrong');
        document.getElementById('email_log_in').classList.add('log-in-email-wrong');
    }
}

async function registerGuest() {
    const response = await fetch("http://127.0.0.1:8000/api/auth/registration/", {
        method: "post",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: 'Guest',
            email: 'guest@email.com',
            password: 'parol',
            repeated_password: 'parol'
        })
    });
        await logInGuest();
}

async function logInGuest() {
    const email = 'guest@email.com';
    const password = 'parol';
    const response = await fetch('http://127.0.0.1:8000/api/auth/login/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email,
            password
        })
    });
    const data = await response.json();
    if (response.ok) {
        const token = data.token;
        const username = data.username;
        localStorage.setItem('authToken', token);
        window.location.href = `html/summary.html?msg=Welcome-to-Join, ${username}`;
    }
}


/**
 * Change Event Listener
 */
function saveHandler() {
    saveUserToLocalStorage();
}

function addClickHandler() {
    let log_in_btn = document.getElementById('log_in_btn');
    log_in_btn.addEventListener('click', saveHandler);
}

function removeClickHandler() {
    let log_in_btn = document.getElementById('log_in_btn');
    log_in_btn.removeEventListener('click', saveHandler);
}

/**
 * Changes the hook for the form
 */
function checkBtnLogIn() {
    let logInCheckBtn = document.getElementById('check_btn');
    if (logInCheckBtn.src.includes('checkbuttonchecked')) {
        logInCheckBtn.src = '../assets/img/checkbutton.svg';
        removeClickHandler();
        clearLocalStorage();
    } else {
        logInCheckBtn.src = '../assets/img/checkbuttonchecked.svg';
        addClickHandler();
    }
}

/**
 * Show the worng Input
 * @param {string} users 
 * @param {string} emailValue 
 * @param {string} passwordValue 
 */
function wrongEnter(users, emailValue, passwordValue) {
    let emailInput = document.getElementById('email')
    let passwordInput = document.getElementById('password1')
    let userEmailIndex = users.findIndex(u => u.email == emailValue.toLowerCase());
    if (userEmailIndex !== -1) {
        if (users[userEmailIndex].password != passwordValue) {
            document.getElementById('password1_input').value = "";
            passwordInput.classList.add('log-in-wrong');
        } else
            passwordInput.classList.remove('log-in-wrong');
        emailInput.classList.remove('log-in-wrong');
    } else {
        emailInput.classList.add('log-in-wrong');
        document.getElementById('password1_input').value = "";
        passwordInput.classList.remove('log-in-wrong');
    }
}

/**
 * Reset the worng Input
 * @param {string} id 
 */
function resetWrongEnter(id) {
    if (id) {
        document.getElementById(id).classList.remove('log-in-wrong');
    }
}

/**
 * Change Img for Password Input
 * @param {string} password 
 */
function showPasswordIcon(password) {
    let password1 = document.getElementById('input_icon_password1')
    let password2 = document.getElementById('input_icon_password2')
    let passwordIcon1 = document.getElementById('password1_icon');
    let passwordIcon2 = document.getElementById('password2_icon');
    if (password == 'password1' && passwordIcon1.src.endsWith('lock.svg'))
        password1.innerHTML = `<img onclick="showPassword('password1')" id="password1_icon" src="../assets/img/visibility_off.svg" alt="">`
    if (password == 'password2' && passwordIcon2.src.endsWith('lock.svg')) {
        password2.innerHTML = `<img onclick="showPassword('password2')" id="password2_icon" src="../assets/img/visibility_off.svg" alt="">`
    }
}

/**
 * Change Img for Password Input and Show the Password
 * @param {string} password 
 */
function showPassword(password) {
    let password1 = document.getElementById('input_icon_password1')
    let password2 = document.getElementById('input_icon_password2')
    if (password == 'password1') {
        password1.innerHTML = `<img onclick="hidePassword('password1')" id="password1_icon" src="../assets/img/visibility.svg" alt="">`
        document.getElementById('password1_input').type = "text";
    }
    if (password == 'password2') {
        password2.innerHTML = `<img onclick="hidePassword('password2')" id="password2_icon" src="../assets/img/visibility.svg" alt="">`
        document.getElementById('password2_input').type = "text";
    }
}

/**
 * Change Img for Password Input and hide the Password
 * @param {string} password 
 */
function hidePassword(password) {
    let password1 = document.getElementById('input_icon_password1')
    let password2 = document.getElementById('input_icon_password2')
    if (password == 'password1') {
        password1.innerHTML = `<img onclick="showPassword('password1')" id="password1_icon" src="../assets/img/visibility_off.svg" alt="">`
        document.getElementById('password1_input').type = "password";
    }
    if (password == 'password2') {
        password2.innerHTML = `<img onclick="showPassword('password2')" id="password2_icon" src="../assets/img/visibility_off.svg" alt="">`
        document.getElementById('password2_input').type = "password";
    }
}

/**
 * Reset Inputs
 * @param {string} id 
 * @param {string} email 
 * @param {string} password1 
 * @param {string} password2 
 * @param {string} name 
 */
function resetForm(id, email, password1, password2, name) {
    if (id == 'signup') {
        name.value = '';
        email.value = '';
        password1.value = '';
        password2.value = '';
    }
    if (id == 'login') {
        email.value = '';
        password1.value = '';
    }
}

/**
 * play Keyframes
 */
function playAnimation() {
    let logo = document.getElementById('join_logo');
    let startscreenLogo = document.getElementById('startscreen_logo');
    startscreenLogo.style.animation = 'reduceBackground 1s ease-in-out forwards'
    logo.style.animation = 'reduceLogo 1s ease-in-out forwards';
}