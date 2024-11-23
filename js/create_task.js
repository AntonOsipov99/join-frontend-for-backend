/**
 * Generates a random color code that is not too light.
 * @returns {string} - The generated color code.
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
 * Checks if a given color is too light.
 * @param {string} color - The color code to be checked.
 * @returns {boolean} - True if the color is too light, false otherwise.
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
 * Creates a dropdown menu for selecting contacts to assign.
 */
function createContactDropdown() {
    let dropdown = document.getElementById('which_assigned_contact');
    dropdown.innerHTML = '';
    let defaultOption = document.createElement('option');
    defaultOption.value = 'Select contacts to assign';
    defaultOption.textContent = 'Select contacts to assign';
    dropdown.appendChild(defaultOption);
    dropdown.addEventListener('change', (event) => {
        removeOptionDropdownContacts(event);

    });
    createOptionDropdownContacts(dropdown);
}

/**
 * Removes the selected contact option from the dropdown and creates an assignee ball.
 * @param {Event} event - The change event.
 */
function removeOptionDropdownContacts(event) {
    const selectedOption = event.target.options[event.target.selectedIndex];
    if (selectedOption.value !== 'Select contacts to assign') {
        selectedOption.classList.add('d-none');
        createAssigneeBall(selectedOption.textContent, selectedOption.value);
    }
}

/**
 * Creates contact options in the dropdown menu.
 * @param {HTMLSelectElement} dropdown - The dropdown element.
 */
function createOptionDropdownContacts(dropdown) {
    contacts.forEach(contact => {
        let option = document.createElement('option');
        option.value = contact.name;
        option.textContent = contact.name;
        dropdown.appendChild(option);
    });
}

/**
 * Creates an assignee ball with the given contact information.
 * @param {string} contactName - The name of the contact.
 * @param {string} contactValue - The value of the contact.
 */
function createAssigneeBall(contactName, contactValue) {
    let assignedToList = document.getElementById('assignedToList');
    let assigneeContainer = document.createElement('div');
    assigneeContainer.classList.add('assigneeContainer');
    getInitalsFromContact(contactName, contactValue, assigneeContainer);
    let backgroundColor = getRandomColor();
    assigneeContainer.style.backgroundColor = backgroundColor;
    assigneeContainer.addEventListener('click', () => {
        assigneeContainer.remove();
        removeAssigneeContainer(contactValue);
    });
    eventListenerMouseOver(assigneeContainer);
    eventListenerMouseOut(assigneeContainer);
    assignedToList.appendChild(assigneeContainer);
}

/**
 * Gets initials from the contact name and sets them in the assignee container.
 * @param {string} contactName - The name of the contact.
 * @param {string} contactValue - The value of the contact.
 * @param {HTMLElement} assigneeContainer - The container for the assignee ball.
 */
function getInitalsFromContact(contactName, contactValue, assigneeContainer) {
    let [firstName, lastName] = contactName.split(' ');
    assigneeContainer.innerHTML = `${firstName.charAt(0)}${lastName ? lastName.charAt(0) : ''}`;
    assigneeContainer.setAttribute('data-contact-value', contactValue);
}

/**
 * Removes the assignee container and shows the corresponding contact option in the dropdown.
 * @param {string} contactValue - The value of the contact.
 */
function removeAssigneeContainer(contactValue) {
    let option = Array.from(document.getElementById('which_assigned_contact').options)
        .find(opt => opt.value === contactValue);
    if (option) {
        option.classList.remove('d-none');
    }
}

/**
 * Sets a title attribute for the assignee container on mouseover.
 * @param {HTMLElement} assigneeContainer - The assignee container element.
 */
function eventListenerMouseOver(assigneeContainer) {
    assigneeContainer.addEventListener('mouseover', (event) => {
        const contactValue = event.target.getAttribute('data-contact-value');
        event.target.setAttribute('title', `${contactValue}`);
    });
}

/**
 * Removes the title attribute on mouseout for the assignee container.
 * @param {HTMLElement} assigneeContainer - The assignee container element.
 */
function eventListenerMouseOut(assigneeContainer) {
    assigneeContainer.addEventListener('mouseout', (event) => {
        event.target.removeAttribute('title');
    });
}

/**
 * Checks if the arrays related to creation time have at least one entry.
 * @returns {boolean} - True if there is at least one entry, false otherwise.
 */
function checkCreatedAt() {
    const mustHaveArrays = [
        createdAtArray,
    ];
    for (const array of mustHaveArrays) {
        if (array.length === 0) {
            showNotification();
            return false;
        }
    }
    return true;
}

/**
 * Checks if the arrays related to titles and descriptions contain at least one letter.
 * @returns {boolean} - True if there is at least one letter, false otherwise.
 */
function checkMustHaveEntriesText() {
    const mustHaveArrays = [
        titlesArray,
        descriptionsArray,
    ];
    for (const array of mustHaveArrays) {
        if (!containsLetter(array)) {
            showSecondNotification();
            return false;
        }
    }
    return true;
}

/**
 * Checks if an array contains at least one letter.
 * @param {Array} array - The array to be checked.
 * @returns {boolean} - True if there is at least one letter, false otherwise.
 */
function containsLetter(array) {
    for (const item of array) {
        if (/[a-zA-Z]/.test(item)) {
            return true;
        }
    }
    return false;
}

/**
 * Redirects to the board page with a welcome message.
 */
function redirectToBoard() {
    let userName = getUserName();
    const link = `./board.html?msg=Welcomme to Join, ${userName}`;
    window.location.href = link;
}


/**
 * Adds a new subtask to the list.
 */
function addSubtask() {
    const subtaskInput = document.getElementById('subtaskInput');
    const subtaskText = subtaskInput.value.trim();
    if (subtaskText !== '') {
        const subtaskId = generateUniqueID();
        addToSubtaskArrays(subtaskText, subtaskId);
        createSubtaskListItem(subtaskText);
        resetSubtaskInput(subtaskInput);
    }
}

/**
 * Adds the first subtask to the list if the input is not empty.
 * Generates a unique ID for the subtask, creates a list item,
 * and resets the subtask input field.
 */
function addFirstSubtask() {
    const subtaskInput = document.getElementById('subtaskInput');
    const subtaskText = subtaskInput.value.trim();
    if (subtaskText !== '') {
        const subtaskId = generateUniqueID();
        createSubtaskListItem(subtaskText);
        resetSubtaskInput(subtaskInput);
    }
}

/**
 * Adds subtask information to global arrays.
 * @param {string} subtaskText - The text of the subtask.
 * @param {string} subtaskId - The ID of the subtask.
 */
function addToSubtaskArrays(subtaskText, subtaskId) {
    subtaskTextsArray.push(subtaskText);
    subtaskIdsArray.push(subtaskId);
}

/**
 * Creates and styles a new subtask list item.
 * @param {string} subtaskId - The ID of the subtask.
 * @param {string} subtaskText - The text of the subtask.
 */
function createSubtaskListItem(subtaskText) {
    const subtaskList = document.getElementById('subtaskList');
    const listItem = document.createElement('li');
    listItem.classList.add('subtask-item');
    const listElementId = generateUniqueID();
    listItem.id = listElementId;
    const checkbox = createCheckbox();
    const editIcon = createIcon('edit');
    const deleteIcon = createIcon('delete');
    styleListItem(listItem);
    createAppendChildElement(listItem, editIcon, deleteIcon, subtaskList, subtaskText, checkbox, listElementId);
}

/**
 * Creates a checkbox element.
 * @returns {HTMLInputElement} - The created checkbox element.
 */
function createCheckbox() {
    const checkbox = document.createElement('input');
    styleCheckbox(checkbox);
    return checkbox;
}

/**
 * Creates an icon element.
 * @param {string} type - The type of icon ('edit' or 'delete').
 * @returns {HTMLDivElement} - The created icon element.
 */
function createIcon(type) {
    const icon = document.createElement('div');
    type === 'edit' ? styleEditIcon(icon) : styleDeleteIcon(icon);
    return icon;
}

/**
 * Resets the subtask input field.
 * @param {HTMLInputElement} subtaskInput - The subtask input field.
 */
function resetSubtaskInput(subtaskInput) {
    subtaskInput.value = '';
}

/**
 * Creates a list item with specified text and styling.
 * @param {HTMLLIElement} listItem - The list item element to be modified.
 * @param {string} subtaskText - The text content of the list item.
 * @param {string} listElementId - The ID to be assigned to the list item.
 */
function createListItem(listItem, subtaskText, listElementId) {
    listItem.classList.add('subtask-item');
    listItem.id = listElementId;
    listItem.textContent = subtaskText;
}

/**
 * Builds and styles an edit icon element.
 * @param {HTMLDivElement} editIcon - The edit icon element to be modified.
 */
function buildEditIcon(editIcon) {
    editIcon.classList.add('pencil_icon_div');
    editIcon.innerHTML = `<img class="addSubTaskIcons icon pencil" src="../assets/img/pencil-32.png" alt="" onclick="editSubtask(event)">`;
}

/**
 * Builds and styles a delete icon element.
 * @param {HTMLDivElement} deleteIcon - The delete icon element to be modified.
 */
function buildDeleteIcon(deleteIcon) {
    deleteIcon.classList.add('delete_icon_div');
    deleteIcon.innerHTML = `<img class="addSubTaskIcons icon delete" src="../assets/img/delete-32.png" alt="" onclick="deleteSubtask(event)">`;
}

/**
 * Creates and appends child elements to a list item, adding it to the specified subtask list.
 * @param {HTMLLIElement} listItem - The list item element to be appended.
 * @param {HTMLDivElement} editIcon - The edit icon element to be appended.
 * @param {HTMLDivElement} deleteIcon - The delete icon element to be appended.
 * @param {HTMLUListElement} subtaskList - The parent subtask list element.
 * @param {string} subtaskText - The text content of the list item.
 * @param {HTMLInputElement} checkbox - The checkbox element to be appended.
 * @param {string} listElementId - The ID of the list item.
 */
function createAppendChildElement(listItem, editIcon, deleteIcon, subtaskList, subtaskText, checkbox, listElementId) {
    listItem.appendChild(checkbox);
    listItem.appendChild(document.createTextNode(subtaskText));
    listItem.appendChild(editIcon);
    listItem.appendChild(deleteIcon);
    subtaskList.appendChild(listItem);
    subtasksArray.push({ id: listElementId, text: subtaskText });
    subtaskIdsArray.push();
}

/**
 * Edits a subtask by replacing its text content with an input field.
 * @param {Event} event - The triggering event.
 */
function editSubtask(event) {
    const subtaskItem = event.target.closest('.subtask-item');
    const subtaskText = subtaskItem.textContent.trim();
    if (subtaskItem.classList.contains('lineThrough'))
        subtaskItem.classList.remove('lineThrough');
    const inputField = document.createElement('input');
    const checkmarkIcon = document.createElement('img');
    inputField.type = 'text';
    inputField.value = subtaskText;
    createCheckMarkIcon(inputField, subtaskItem, checkmarkIcon);
    subtaskItem.innerHTML = '';
    subtaskItem.appendChild(inputField);
    subtaskItem.appendChild(checkmarkIcon);
    inputField.focus();
}

/**
 * Creates a checkmark icon element for applying changes to a subtask.
 * @param {HTMLInputElement} inputField - The input field for editing the subtask text.
 * @param {HTMLLIElement} subtaskItem - The parent subtask list item element.
 * @param {HTMLImageElement} checkmarkIcon - The checkmark icon element to be created.
 */
function createCheckMarkIcon(inputField, subtaskItem, checkmarkIcon) {
    checkmarkIcon.classList.add('addSubTaskIcons', 'icon', 'checkmark');
    checkmarkIcon.src = '../assets/img/check-mark-3-32.png';
    checkmarkIcon.alt = 'Apply Changes';
    checkmarkIcon.onclick = applyChanges;
    checkmarkIcon.addEventListener('click', () => {
        const editedText = inputField.value.trim();
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.classList.add('subtask-checkbox');
        subtaskItem.innerHTML = '';
        subtaskItem.appendChild(checkbox);
        subtaskItem.appendChild(document.createTextNode(editedText));
        subtaskItem.appendChild(createIcon('edit'));
        subtaskItem.appendChild(createIcon('delete'));
    });
}

/**
 * Applies changes to a subtask by updating its text content.
 * @param {Event} event - The triggering event.
 */
function applyChanges(event) {
    const subtaskItem = event.target.closest('.subtask-item');
    if (subtaskItem) {
        subtaskItem.removeChild(event.target);
        const editIcon = document.createElement('div');
        buildEditIcon(editIcon)
        subtaskItem.appendChild(editIcon);
        const deleteIcon = document.createElement('div');
        buildDeleteIcon(deleteIcon)
        subtaskItem.appendChild(deleteIcon);
    }
}

/**
 * Adds attributes to an icon element based on the provided path.
 * @param {HTMLImageElement} icon - The icon element to be modified.
 * @param {string} path - The path for the icon source.
 */
function addAttributesForIcons(icon, path) {
    icon.classList.add('addSubTaskIcons', 'icon', `${path}`);
    icon.src = `../assets/img/${path}-32.png`;
    icon.alt = '';
    icon.onclick = editSubtask;
}

/**
 * Deletes a subtask by removing its parent list item element.
 * @param {Event} event - The triggering event.
 */
function deleteSubtask(event) {
    const subtaskItem = event.target.closest('.subtask-item');
    subtaskItem.remove();
    subtaskTextsArray = [];
    subtaskIdsArray = [];
}

/**
 * Handles the button click for priority selection, updating the UI based on the selected priority.
 * @param {string} prio - The priority value ('urgent', 'medium', or 'low').
 */
function handlePrioButtonClick(prio) {
    priorityArray = [];
    const normalButtonId = `normal_${prio}_btn`;
    const clickedButtonId = `clicked_${prio}_btn`;
    if (selectedPrioButton === prio) {
        selectedPrioButton = null;
        styleToPrevButton(clickedButtonId, normalButtonId);
    } else {
        if (selectedPrioButton)
            prevButton(selectedPrioButton);
        selectedPrioButton = prio;
        styleToPrevButton(normalButtonId, clickedButtonId);
        priorityArray.push(prio);
    }
}

/**
 * Styles the specified button to the previous state by hiding the clicked button and showing the normal button.
 * @param {string} addToButton - The ID of the button to be shown.
 * @param {string} removeFromButton - The ID of the button to be hidden.
 */
function styleToPrevButton(addToButton, removeFromButton) {
    document.getElementById(addToButton).classList.add('d-none');
    document.getElementById(removeFromButton).classList.remove('d-none');
}

/**
 * Resets the styling of the previously selected priority button by showing the normal button and hiding the clicked button.
 * @param {string} selectedPrioButton - The priority value of the previously selected button.
 */
function prevButton(selectedPrioButton) {
    const prevNormalButtonId = `normal_${selectedPrioButton}_btn`;
    const prevClickedButtonId = `clicked_${selectedPrioButton}_btn`;
    document.getElementById(prevNormalButtonId).classList.remove('d-none');
    document.getElementById(prevClickedButtonId).classList.add('d-none');
}

/**
 * Styles the list item for the subtask in the board overlay.
 * @param {HTMLLIElement} listItem - List item element for the subtask.
 * @param {string} subtaskText - Text content of the subtask.
 */
function styleListItem(listItem) {
    listItem.classList.add('subtask-item');
    const listElementId = generateUniqueID();
    listItem.id = listElementId;
    return listItem;
}

/**
 * Styles the edit icon for the subtask in the board overlay.
 * @param {HTMLDivElement} editIcon - Edit icon element for the subtask.
 */
function styleEditIcon(editIcon) {
    editIcon.classList.add('pencil_icon_div');
    editIcon.innerHTML = `<img class="addSubTaskIcons icon pencil" src="../assets/img/pencil-32.png" alt="" onclick="editSubtask(event)">`;
}

/**
 * Styles the delete icon for the subtask in the board overlay.
 * @param {HTMLDivElement} deleteIcon - Delete icon element for the subtask.
 */
function styleDeleteIcon(deleteIcon) {
    deleteIcon.classList.add('delete_icon_div');
    deleteIcon.innerHTML = `<img class="addSubTaskIcons icon delete" src="../assets/img/delete-32.png" alt="" onclick="deleteSubtask(event)">`;
}