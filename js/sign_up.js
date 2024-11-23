//------------------------------------------------------------------------------//
//---------------------------------Register User--------------------------------//
//------------------------------------------------------------------------------//

/**
 * Register User
 * @async
 */
async function signUp() {
    document.getElementById('sign_up_btn').disabled = true;
    let name = document.getElementById('name_sign_up');
    let email = document.getElementById('email_sign_up');
    let password1 = document.getElementById('password1_input');
    let password2 = document.getElementById('password2_input');
    let users = JSON.parse(await getItem('users'));
    let emailChecked = users.find(u => u.email == email.value.toLowerCase());
    let signUpSuccesfully = document.getElementById('sign_up_succesfully');
    if (!emailChecked) {
        if (password1.value == password2.value) {
            users.push({
                name: name.value,
                email: email.value.toLowerCase(),
                password: password1.value,
            })
            await setItem('users', JSON.stringify(users));
            signUpSuccesfully.classList.remove('d-none')
            signUpSuccesfully.style.animation = 'signUpSuccesfull 125ms ease-in-out forwards'
            resetForm('signup', email, password1, password2, name);
            setTimeout(function () { window.location.href = 'index.html' }, 800)
        } else if (password1.value != password2.value)
            document.getElementById('password2').classList.add('log-in-wrong');
    } else
        document.getElementById('email').classList.add('log-in-wrong');
    document.getElementById('sign_up_btn').disabled = false;
}


//------------------------------------------------------------------------------//
//-----------------------------Check Btn vor Sign Up----------------------------//
//------------------------------------------------------------------------------//

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