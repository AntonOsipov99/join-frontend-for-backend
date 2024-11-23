
//------------------------------------------------------------------------------//
//----------------------initialize first Steps for the Page---------------------//
//------------------------------------------------------------------------------//

/**
 * initialize first Steps for the Page
 */
function init() {
    loadUsersFromLocalStorage();
    loadLoakalUser();
    playAnimation();
}


//------------------------------------------------------------------------------//
//----------------------load remind User from local Storage---------------------//
//------------------------------------------------------------------------------//

/**
 * load remind User from local Storage
 */
function loadLoakalUser() {
    if (lokalUsers.length > 0) {
        document.getElementById('email_log_in').value = lokalUsers[0]['email'];
        document.getElementById('password1_input').value = lokalUsers[0]['password'];
        document.getElementById('check_btn').src = '../assets/img/checkbuttonchecked.svg';
    }
}


//------------------------------------------------------------------------------//
//---------------------------Log In for User and Guest--------------------------//
//------------------------------------------------------------------------------//

/**
 * Log In for User and Guest
 * @async
 * @param {string} guest 
 * @returns 
 */
async function logIn(guest) {
    let email = document.getElementById('email_log_in');
    let password1 = document.getElementById('password1_input');
    let users = JSON.parse(await getItem('users'));
    if (guest == 'guest@guest.com') {
        window.location.href = 'summary.html?msg=Welcome-to-Join,Guest';
    } else {
        let user = users.find(u => u.email == email.value && u.password == password1.value);
        if (user) {
            window.location.href = `summary.html?msg=Welcome-to-Join,${user.name}`;            
        } else {
            wrongEnter(users, email.value, password1.value);
            return
        }
    }
}


//------------------------------------------------------------------------------//
//-----------------------------Change Event Listener----------------------------//
//------------------------------------------------------------------------------//

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


//------------------------------------------------------------------------------//
//------------------------Changes the hook for the form-------------------------//
//------------------------------------------------------------------------------//

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


//------------------------------------------------------------------------------//
//-----------------------------Show the worng Input-----------------------------//
//------------------------------------------------------------------------------//

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


//------------------------------------------------------------------------------//
//-----------------------------Reset the worng Input----------------------------//
//------------------------------------------------------------------------------//

/**
 * Reset the worng Input
 * @param {string} id 
 */
function resetWrongEnter(id) {
    if (id) {
        document.getElementById(id).classList.remove('log-in-wrong');
    }
}


//------------------------------------------------------------------------------//
//-------------------------Change Img for Password Input------------------------//
//------------------------------------------------------------------------------//

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

//------------------------------------------------------------------------------//
//--------------Change Img for Password Input and Show the Password-------------//
//------------------------------------------------------------------------------//


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


//------------------------------------------------------------------------------//
//-------------Change Img for Password Input and hide the Password--------------//
//------------------------------------------------------------------------------//

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



//------------------------------------------------------------------------------//
//---------------------------------Reset Inputs---------------------------------//
//------------------------------------------------------------------------------//

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

//---------------------------------------//
//------------play Keyframes-------------//
//---------------------------------------//

/**
 * play Keyframes
 */
function playAnimation() {
    let logo = document.getElementById('join_logo');
    let startscreenLogo = document.getElementById('startscreen_logo');
    startscreenLogo.style.animation = 'reduceBackground 1s ease-in-out forwards'
    logo.style.animation = 'reduceLogo 1s ease-in-out forwards';
}