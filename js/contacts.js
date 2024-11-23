let contacts = [];

/**
 * Function to initialize contacts.
 * @returns {Promise<void>}
 */
async function initContacts() {
    await loadContacts();
    generateSideBar();
    showContacts();
}

/**
 * Function to display contacts.
 */
function showContacts() {
    const contactContent = document.getElementById('new-contacts');
    contactContent.innerHTML = '';
    const { sortedFirstLetters, firstLettersMap } = generateFirstLetters();

    sortedFirstLetters.forEach(letter => {
        const contactIndices = firstLettersMap.get(letter);
        if (contactIndices) {
            addFirstLetter(contactContent, letter);
            addSeparateContactsDiv(contactContent, contactIndices);
            addContacts(contactContent, contactIndices);
        }
    });
}

/**
 * Function to add the first letter to the contact list.
 * @param {HTMLElement} contactContent - The element where the letter is added.
 * @param {string} letter - The letter to be added.
 */
function addFirstLetter(contactContent, letter) {
    contactContent.innerHTML += `<div class="first-letter">${letter}</div>`;
}

/**
 * Function to add a separate contact div.
 * @param {HTMLElement} contactContent - The element where the div is added.
 * @param {number[]} contactIndices - The indices of contacts belonging to the separate div.
 */
function addSeparateContactsDiv(contactContent, contactIndices) {
    const divId = `div-separate-contacts-${contactIndices[0]}`;
    contactContent.innerHTML += `<div class="separate-contacts" id="${divId}"></div>`;
}

/**
 * Function to add contacts to the contact list.
 * @param {HTMLElement} contactContent - The element where contacts are added.
 * @param {number[]} contactIndices - The indices of contacts to be added.
 */
function addContacts(contactContent, contactIndices) {
    contactIndices.forEach(index => {
        const contact = contacts[index];
        const id = `contact-icon-${index}`;
        const randomColor = contact.color;
        const initials = generateInitials(contact.name);

        contactContent.innerHTML += contactContentTemplate(contact, index, randomColor, initials, id);

        const element = document.getElementById(id);
        element.style.backgroundColor = randomColor;

    });
}

/**
 * Function to create the HTML template for a contact.
 * @param {Object} contact - The contact.
 * @param {number} index - The index of the contact.
 * @param {string} randomColor - The random background color of the contact.
 * @param {string} initials - The initials of the contact.
 * @param {string} id - The ID of the contact element.
 * @returns {string} - The HTML template for the contact.
 */
function contactContentTemplate(contact, index, randomColor, initials, id) {
    return /*html*/ `<div class="new-contact-box" onclick="openContact('${contact['name']}', '${contact['email']}', '${index}', '${randomColor}')">
        <span class="small-contact-icon" id="${id}">${initials}</span>
        <div>
            <div class="name">${contact['name']}</div>
            <div class="email">${contact['email']}</div>
        </div>
    </div>`;
}

/**
 * Function to check if the screen is wide.
 * @returns {boolean} - True if the screen is wide, otherwise false.
 */
function isWideScreen() {
    return window.innerWidth <= 750;
}

function isHeightScreen() {
    return window.innerHeight <= 600;
}

/**
 * Function to toggle the display of contacts on mobile devices.
 * @param {boolean} showContacts - True to display contacts, otherwise false.
 */
function toggleContactsMobile(showContacts) {
    let hideContacts = document.getElementById('contact-menu');
    let contactsBox = document.getElementById('contacts-box');
    let mobileContactIcon = document.getElementById('add-button-mobile');
    mobileContactIcon.classList.remove('d-none');

    if (showContacts) {
        hideContacts.classList.add('d-none');
        contactsBox.classList.add('d-block');
    } else {
        hideContacts.classList.remove('d-none');
        contactsBox.classList.remove('d-block');
        document.querySelectorAll('.new-contact-box').forEach(contact => contact.classList.remove('selected-contact'));
    }
}

/**
 * Changes the background color of the selected contact and highlights it.
 *
 * @param {number} i - The index of the contact to be selected.
 */
function changeBackground(i) {
    const selectedContact = document.querySelector(`#contact-icon-${i}`);
    if (selectedContact) {
        document.querySelectorAll('.new-contact-box').forEach(contact => contact.classList.remove('selected-contact'));
        selectedContact.parentElement.classList.add('selected-contact');
    }
}

/**
 * Function to open a contact dialog.
 * @param {string} contactName - The name of the contact.
 * @param {string} contactEmail - The email address of the contact.
 * @param {number} i - The index of the contact.
 * @param {string} randomColor - The random background color of the contact.
 */
function openContact(contactName, contactEmail, i, randomColor) {
    changeBackground(i);
    let showContact = document.getElementById('show-contact');
    const initials = generateInitials(contactName);
    showContact.innerHTML = '';
    showContact.innerHTML = showContactTemplate(contactName, contactEmail, i, randomColor, initials);
    showContact.classList.add('slide-contact-info');
    document.getElementById('change-color-icon').innerHTML = /*html*/ `<div class="big-contact-icon" id="color-icon-change-${i}"></div>`
    const bigContactIcon = document.getElementById(`big-contact-icon-${i}`);
    bigContactIcon.style.backgroundColor = randomColor;
    const element = document.getElementById(`contact-icon-${i}`);
    if (isWideScreen() || isHeightScreen())
        element.onclick = toggleContactsMobile(showContacts);
    document.getElementById('add-button-mobile').classList.add('d-none');
    document.getElementById('edit-input-fields').innerHTML = editContactTemplate(i);      
}

/**
 * Generates an HTML template for editing a contact.
 *
 * @param {number} i - The index of the contact.
 * @returns {string} - The HTML template for editing a contact.
 */
function editContactTemplate(i) {
    return /*html*/ `<form onsubmit="editContact(${i})">
        <input required class="input person-icon" type="text" id="edit-name" placeholder="Name" pattern="[A-Za-zÄäÖöÜüß ]+" maxlength="23">
        <input required class="input email-icon" type="email" id="edit-email" placeholder="Email" maxlength="23">
        <input required class="input phone-icon" type="tel" id="edit-phone" placeholder="Phone" pattern="[0-9+\s ]*" maxlength="24">
        <div class="overlay-buttons">
            <div onclick="deleteContact()" class="delete-button">
                Delete
            </div>
            <button class="save-button" type="submit">
                Save <img src="../assets/img/check.svg" alt="checkmark-image">
            </button>
        </div>
    </form>`
}

/**
 * Generates the HTML template for displaying contact information.
 *
 * @param {string} contactName - The name of the contact.
 * @param {string} contactEmail - The email address of the contact.
 * @param {number} i - The index of the contact.
 * @param {string} randomColor - The random background color for the contact.
 * @param {string} initials - The initials of the contact's name.
 * @returns {string} - The HTML template for the contact information.
 */
function showContactTemplate(contactName, contactEmail, i, randomColor, initials) {
    return /*html*/ `<div class="flex-box"><span class="big-contact-icon margin-left" id="big-contact-icon-${i}">${initials}</span>
    <div class="flex-box-contact"><div class="name-contact">${contactName}</div><div class="edit-box"><div class="edit-image" onclick="showOverlayEdit('${i}', '${randomColor}', '${initials}')">
    </div><div class="delete-image" onclick="deleteContact(${i})"></div>
    </div></div></div><p class="contact-info">Contact Information</p><div class="landscape-flex"><div><b class="email-headline">Email</b><p class="email margin-left">${contactEmail}</p></div>
    <div><b class="margin-left">Phone</b><p class="margin-left">${contacts[i]['phone']}</p></div></div>`;
}

/**
 * Adds a new contact to the contacts list and updates the UI.
 */
async function addNewContact(event) {
    event.preventDefault();
    const nameInput = document.getElementById('add-name');
    const emailInput = document.getElementById('add-email');
    let phoneInput = document.getElementById('add-phone');
    const name = nameInput.value;
    const email = emailInput.value;
    let phone = phoneInput.value;
    const randomColor = getRandomColor();
    const newContact = createContact(name, email, phone, randomColor);
    addContactAndUpdateUI(newContact);
    await saveContacts();
}

/**
 * Validates a contact's name.
 *
 * @param {string} name - The name to be validated.
 * @returns {boolean} - True if the name is valid; otherwise, false.
 */
function validateName(name) {
    if (!/^[A-Za-z\s\-ÄÜÖäüö]+$/.test(name)) {
        alert("Name should contain only letters, spaces, hyphens, and umlauts.");
        return false;
    }
    return true;
}

/**
 * Validates a contact's email address.
 *
 * @param {string} email - The email address to be validated.
 * @returns {boolean} - True if the email address is valid; otherwise, false.
 */
function validateEmail(email) {
    if (!email || email.indexOf('@') === -1) {
        alert("A valid email address is needed.");
        return false;
    }
    return true;
}

/**
 * Validates a contact's phone number.
 *
 * @param {string} phone - The phone number to be validated.
 * @returns {boolean} - True if the phone number is valid; otherwise, false.
 */
function validatePhone(phone) {
    if (!/^\+?\d+(\s\d+)*$/.test(phone)) {
        alert("Phone number should contain digits with optional spaces and can start with '+'.");
        return false;
    }
    return true;
}

/**
 * Creates a new contact object.
 *
 * @param {string} name - The name of the contact.
 * @param {string} email - The email address of the contact.
 * @param {string} phone - The phone number of the contact.
 * @param {string} color - The background color of the contact.
 * @returns {object} - The new contact object.
 */
function createContact(name, email, phone, color) {
    return { "name": name, "email": email, "phone": phone, "color": color };
}

/**
 * Adds a contact to the contacts list and updates the UI.
 *
 * @param {object} contact - The contact object to be added.
 */
function addContactAndUpdateUI(contact) {
    contacts.push(contact);
    sortContacts();
    generateFirstLettersAndUpdateSidebar();
    toggleOverlay();
    emptyInput();
}

/**
 * Generates the first letters of contact names and updates the sidebar with them.
 * Also, generates the sidebar content and displays contacts.
 */
function generateFirstLettersAndUpdateSidebar() {
    generateFirstLetters().sortedFirstLetters.forEach((letter, index) => {
        const letterElement = document.getElementById(`first-letter-${index}`);
        if (letterElement) {
            letterElement.innerHTML = `${letter}<div class="separate-contacts"></div>`;
        }
    });

    generateSideBar();
    showContacts();
}

/**
 * Clears the input fields for adding a new contact.
 */
function emptyInput() {
    document.getElementById('add-name').value = '';
    document.getElementById('add-email').value = '';
    document.getElementById('add-phone').value = '';
}

/**
 * Edits an existing contact with the provided index.
 *
 * @param {number} i - The index of the contact to be edited.
 */
async function editContact(i) {
    if (i < 0 || i >= contacts.length) return alert('Ungültiger Index');
    const editNameInput = document.getElementById('edit-name');
    const editEmailInput = document.getElementById('edit-email');
    const editPhoneInput = document.getElementById('edit-phone');
    const editName = editNameInput.value;
    const editEmail = editEmailInput.value;
    const editPhone = editPhoneInput.value;
    const currentColor = contacts[i].color;
    contacts[i] = createContact(editName, editEmail, editPhone, currentColor);
    generateSideBar();
    showContacts();
    hideOverlayEdit();
    openContact(contacts[i].name, contacts[i].email, i, currentColor);
    await saveContacts();
}

/**
 * Validates a phone number, checking for invalid characters and the '+' prefix.
 *
 * @param {string} phone - The phone number to be validated.
 * @returns {boolean} - True if the phone number is valid; otherwise, false.
 */
function validatePhone(phone) {
    // Überprüfe, ob die Telefonnummer ungültige Zeichen (Buchstaben) enthält oder nicht mit '+' beginnt
    if (!/^\+?\d+(\s\d+)*$/.test(phone)) {
        alert("Phone number should start with '+' and contain only digits with optional spaces.");
        return false;
    }
    return true;
}

/**
 * Shows or hides the overlay for adding contacts.
 *
 * @param {boolean} show - If true, the overlay is shown; if false, it is hidden.
 */
function toggleOverlay(show = false) {
    let overlay = document.getElementById('overlay-add-contact');
    if (show) {
        overlay.classList.add('show-overlay');
    } else {
        overlay.classList.remove('show-overlay');
    }
}

function toggleOverlayAddContact(show = false) {
    let overlay = document.getElementById('overlay-add-contact');
    if (show) {
        overlay.classList.add('show-overlay');
    } else {
        overlay.classList.remove('show-overlay');
        emptyInput();
    }
}

/**
 * Shows the overlay for editing a contact with the specified index.
 *
 * @param {number} i - The index of the contact to be edited.
 * @param {string} randomColor - The random background color for the contact.
 * @param {string} initials - The initials of the contact's name.
 */
function showOverlayEdit(i, randomColor, initials) {
    const bigContactIcon = document.getElementById(`color-icon-change-${i}`);
    bigContactIcon.innerHTML = initials;
    bigContactIcon.style.backgroundColor = randomColor;
    let overlay = document.getElementById('overlay-edit-contact');
    overlay.classList.add('show-overlay');
    showContactValue(i);
    const deleteButton = document.querySelector('.delete-button'); // Füge diese Zeile hinzu
    deleteButton.onclick = () => deleteContact(i); // Füge diese Zeile hinzu
}

/**
 * Populates the edit contact form with the details of the contact at the specified index.
 *
 * @param {number} i - The index of the contact to be displayed in the form.
 */
function showContactValue(i) {
    const selectedContact = contacts[i];
    const editNameInput = document.getElementById('edit-name');
    const editEmailInput = document.getElementById('edit-email');
    const editPhoneInput = document.getElementById('edit-phone');
    editNameInput.value = selectedContact.name;
    editEmailInput.value = selectedContact.email;
    editPhoneInput.value = selectedContact.phone;
}

/**
 * Hides the overlay for editing a contact.
 */
function hideOverlayEdit() {
    let overlay = document.getElementById('overlay-edit-contact');
    overlay.classList.remove('show-overlay');
}

/**
 * Deletes a contact with the specified index from the contacts list and updates the UI.
 *
 * @param {number} i - The index of the contact to be deleted.
 */
async function deleteContact(i) {
    contacts.splice(i, 1);
    generateSideBar();
    showContacts();
    document.getElementById('show-contact').innerHTML = '';
    hideOverlayEdit();
    if (isWideScreen() || isHeightScreen()) {
        toggleContactsMobile();
    }
    await saveContacts();
}

/**
 * Generates a random hexadecimal color code.
 *
 * @returns {string} A random hexadecimal color code.
 */
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';

    do {
        color = '#';
        for (let i = 0; i < 6; i++) {
            const randomLetter = letters[Math.floor(Math.random() * 16)];
            color += randomLetter;
        }
    } while (isTooLight(color));

    return color;
}

/**
 * Checks if a color is too light based on its brightness.
 *
 * @param {string} color - The hexadecimal color code to check.
 * @returns {boolean} True if the color is too light; otherwise, false.
 */
function isTooLight(color) {
    const hex = color.substring(1);
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return yiq > 128;
}

/**
 * Sorts the contacts array alphabetically by first name.
 */
function sortContacts() {
    contacts.sort((a, b) => {
        const firstNameA = a.name.split(' ')[0];
        const firstNameB = b.name.split(' ')[0];
        return firstNameA.localeCompare(firstNameB);
    });
}



