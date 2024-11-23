//------------------------------------------------------------------------------//
//--------------------------Show send E-Mail succesfull-------------------------//
//------------------------------------------------------------------------------//

/**
 * Show send E-Mail succesfull
 * @async
 */
async function sendMail() {
    let forgotPasswordSuccesfully = document.getElementById('forgot_password_succesfully');
    let forgotPasswordEmail = document.getElementById('email_password_forgot');
    let users = JSON.parse(await getItem('users'));
    let user = users.find(u => u.email == forgotPasswordEmail.value.toLowerCase())
    if (user) {
        forgotPasswordSuccesfully.classList.remove('d-none');
        forgotPasswordSuccesfully.style.animation = 'signUpSuccesfull 125ms ease-in-out forwards';
        setTimeout(function () { window.location.href = 'index.html' }, 800)
    } else {
        let email = document.getElementById('email');
        email.classList.add('log-in-wrong');
        console.log('User nicht gefunden');
    }
}


//------------------------------------------------------------------------------//
//----------------------------Send E-Mail at Address----------------------------//
//------------------------------------------------------------------------------//

/**
 * Send E-Mail at Address
 * @async
 */
async function sendEmail() {
    let email = document.getElementById('email_password_forgot').value;
    let users = JSON.parse(await getItem('users'));
    let user = users.find(u => u.email == email.toLowerCase())
    if (user == undefined) {
        document.getElementById('email').classList.add('log-in-wrong');
    } else {
        let username = user.name;
        let xhr = new XMLHttpRequest();
        xhr.open('POST', 'https://jan-horstmann.developerakademie.net/join_gruppenarbeit/sendmail.php', true);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200)
                console.log(xhr.responseText);
        }
        xhr.send('email=' + email + '&username=' + username);
        sendMail();
    }
}

