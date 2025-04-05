// /**
//  * Show send E-Mail succesfull
//  * @async
//  */
// async function sendMail() {
//     let forgotPasswordSuccesfully = document.getElementById('forgot_password_succesfully');
//     let forgotPasswordEmail = document.getElementById('email_password_forgot');
//     let users = JSON.parse(await getItem('users'));
//     let user = users.find(u => u.email == forgotPasswordEmail.value.toLowerCase())
//     if (user) {
//         forgotPasswordSuccesfully.classList.remove('d-none');
//         forgotPasswordSuccesfully.style.animation = 'signUpSuccesfull 125ms ease-in-out forwards';
//         setTimeout(function () { window.location.href = 'index.html' }, 800)
//     } else {
//         let email = document.getElementById('email');
//         email.classList.add('log-in-wrong');
//         console.log('User nicht gefunden');
//     }
// }

/**
 * Main function that orchestrates the password reset email process
 * @async
 */
async function sendEmail() {
    const email = document.getElementById('email_password_forgot').value;
    
    // First check if user exists
    const userData = await checkUserExists(email);
    if (!userData) return;
    
    // Get username and send the email
    const username = extractUsername(userData, email);
    sendPasswordResetEmail(email, username);
}

/**
 * Checks if a user exists in the system
 * @async
 * @param {string} email - User's email address
 * @returns {Object|null} User data or null if not found
 */
async function checkUserExists(email) {
    const response = await fetch('http://127.0.0.1:8000/api/auth/users/', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ email })
    });
    
    if (!response.ok) {
        document.getElementById('email').classList.add('log-in-wrong');
        return null;
    }
    
    return await response.json();
}

/**
 * Extracts username from user data or email
 * @param {Object} userData - User data from API
 * @param {string} email - User's email as fallback
 * @returns {string} Username for the email
 */
function extractUsername(userData, email) {
    return userData.username || email.split('@')[0];
}

/**
 * Sends the actual password reset email
 * @param {string} email - Recipient email address
 * @param {string} username - User's name for the email
 */
function sendPasswordResetEmail(email, username) {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://join.anton-osipov.de/sendmail.php', true);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    
    xhr.onreadystatechange = handleEmailResponse;
    
    const emailData = buildEmailRequestData(email, username);
    xhr.send(emailData);
}

/**
 * Builds the URL-encoded request data string
 * @param {string} email - User's email address
 * @param {string} username - User's name
 * @returns {string} URL-encoded data string
 */
function buildEmailRequestData(email, username) {
    return 'email=' + encodeURIComponent(email) + 
           '&username=' + encodeURIComponent(username);
}

/**
 * Handles the email sending response
 * @param {Event} event - XHR event object
 */
function handleEmailResponse() {
    if (this.readyState === 4 && this.status === 200) {
        console.log(this.responseText);
        // You could show a success message to the user here
    }
}