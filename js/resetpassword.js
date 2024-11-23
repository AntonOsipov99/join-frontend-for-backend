//------------------------------------------------------------------------------//
//---------------------------------Reset Password-------------------------------//
//------------------------------------------------------------------------------//

/**
 * Reset Password
 * @async
 */
async function resetPassword() {
    let password1 = document.getElementById('password1_input');
    let password2 = document.getElementById('password2_input');
    let resetPasswordSuccesfully = document.getElementById('reset_password_succesfully');
    let users = JSON.parse(await getItem('users'));
    const urlParams = new URLSearchParams(window.location.search);
    const msg = urlParams.get('msg');
    if (password1.value == password2.value) {
        let user = users.find(u => u.email === msg.toLowerCase());
        user.password = password1.value;
        setItem('users', JSON.stringify(users));
        resetPasswordSuccesfully.classList.remove('d-none');
        resetPasswordSuccesfully.style.animation = 'signUpSuccesfull 125ms ease-in-out forwards';
        setTimeout(function () { window.location.href = `forgotmypassword.html?msg=${msg}` }, 800);
    } else if (password1.value != password2.value) {
        document.getElementById('password2').classList.add('log-in-wrong');
    }
}