/**
 * Generates the side bar content dynamically based on the user's information.
 */
function generateSideBar() {
    let userName = getUserName();
    notVisible = localStorage.getItem('notVisible') === 'true';
    return new Promise(resolve => {
        let menu = document.getElementById('content');
        menu.innerHTML = /*html*/ `
    <nav>
        <img src="../assets/img/Capa 2.svg" class="logo">
        <div class="nav-flex-box">
            <div class="flex-box-mobile">
                ${notVisible ? '' : `
                <a href="./summary.html?msg=Welcome-to-Join,${userName}" class="nav-sub summary-background"><img src="../assets/img/Icons.svg">Summary</a>
                <a href="./add_task.html?msg=Welcome-to-Join,${userName}" class="nav-sub add-task-background"><img src="../assets/img/Icons (1).svg">Add Task</a>
                <a href="./board.html?msg=Welcome-to-Join,${userName}" class="nav-sub board-background"><img src="../assets/img/Icons (2).svg">Board</a>
                <a href="./contacts.html?msg=Welcome-to-Join,${userName}" class="nav-sub contacts-background"><img src="../assets/img/Icons (3).svg">Contacts</a>
                `}
            </div>
            <div class="nav-bottom">
                <a href="./privacy_policy.html?msg=Welcome-to-Join,${userName}" class="nav-bottom-a privacy-policy-background">Privacy Policy</a>
                <a href="./legal_notice.html?msg=Welcome-to-Join,${userName}" class="nav-bottom-a legal-notice-background">Legal Notice</a>
            </div>
        </div>
    </nav>`;
        generateHeader(menu, userName);
        resolve();
    });
}

function logOut() {
    localStorage.removeItem("authToken");
    window.location.href = '../index.html';
}

/**
 * Generates the header content dynamically based on the user's information.
 *
 * @param {HTMLElement} menu - The menu element where the header will be appended.
 * @param {string} userName - The name of the user.
 */
function generateHeader(menu, userName) {
    let userInitial = getInitials(userName)
    menu.innerHTML += /*html*/ `
        <header>
            <div class="logo-mobile"></div>
            <span class="header-text">Kanban Project Management Tool</span>
            ${notVisible ? '' : ` <div class="header-icons">
                <a href="./help.html?msg=Welcome-to-Join,${userName}"><img src="../assets/img/help.svg" class="help-icon"></a>
                <div class="group-icon" onclick="showTemplatePopUp()">
                    <span>${userInitial}</span>
                </div>
            </div> `}
            <div id="template_menu_pop_up" class="template-menu-pop-up-bg d-none" onclick="hideTemplatePopUp()">
                <div class="template-menu-pop-up">
                    <a href="./privacy_policy.html?msg=Welcome-to-Join,${userName}" class="nav-bottom-a privacy-policy-background">Privacy
                        Policy</a>
                    <a href="./legal_notice.html?msg=Welcome-to-Join,${userName}" class="nav-bottom-a legal-notice-background">Legal
                        Notice</a>
                    <span class="nav-bottom-a log-out-background" onclick="logOut()">Log out</span>
                </div>
            </div>
        </header>`;
}

/**
 * Extracts and returns the initials from the given user name.
 *
 * @param {string} userName - The full name of the user.
 * @returns {string} The user's initials.
 */
function getInitials(userName) {
    let [firstName, lastName] = userName.split(' ');
    let firstInitial = firstName[0];
    if (lastName) {
        let lastInitial = lastName[0];
        return `${firstInitial}${lastInitial}`;
    } else {
        return `${firstInitial}`;
    }

}

/**
 * Displays the template pop-up menu.
 */
function showTemplatePopUp() {
    let menuPopUp = document.getElementById('template_menu_pop_up');
    menuPopUp.classList.remove('d-none')
}

/**
 * Hides the template pop-up menu.
 */
function hideTemplatePopUp() {
    let menuPopUp = document.getElementById('template_menu_pop_up');
    menuPopUp.classList.add('d-none')
}

/**
 * Listens for the 'wheel' event on the document and prevents the default behavior
 * if the Ctrl (Control) or Meta (Command) key is pressed, effectively preventing
 * zooming when scrolling.
 *
 * @param {WheelEvent} event - The 'wheel' event object.
 *
 */
document.addEventListener('wheel', function (event) {
    if (event.ctrlKey === true || event.metaKey === true) {
        event.preventDefault();
    }
}, { passive: false });
