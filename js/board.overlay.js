const assignedValuesSet = new Set();

/**
 * Handles the dropdown for assigning contacts in the board overlay.
 * @param {Array<string>} assignedToOptions - Options of assigned contacts.
 */
function boardOverlayContactDropdown(assignedToOptions) {
    let dropdown = document.getElementById('boardOverlayContact');
    let defaultOption = document.createElement('option');
    generateContactsForBoardOverlay(assignedToOptions, dropdown);
    generateOptionValueDropdown(dropdown, defaultOption);
    dropdown.addEventListener('change', (event) => {
        let selectedContact = contacts.find(contact => contact.name === event.target.value);
        if (selectedContact) {
            generateBallForBoardOverlay(selectedContact);
            generateSelectValueForBoardOverlay(defaultOption, dropdown);
        }
    });
}

/**
 * Generates contacts for the board overlay dropdown based on assigned options.
 * @param {Array<string>} assignedToOptions - Options of assigned contacts.
 * @param {HTMLSelectElement} dropdown - Dropdown element for contact assignment.
 */
async function generateContactsForBoardOverlay(assignedToOptions, dropdown) {
    contacts.forEach(contact => {
        let isContactInDropdown = [...dropdown.options].some(option => option.value === contact.name);
        let option = document.createElement('option');
        fillOptionDropdownForBoardOverlay(option, contact, isContactInDropdown);
        if (assignedToOptions.includes(contact.name))
            option.classList.add('d-none');
        option.disabled = isContactInDropdown;
        dropdown.appendChild(option, contact);
    });
}

/**
 * Fills the option in the board overlay dropdown with contact information.
 * @param {HTMLOptionElement} option - Option element to be filled.
 * @param {Object} contact - Contact information.
 * @param {boolean} isContactInDropdown - Indicates if the contact is already in the dropdown.
 */
function fillOptionDropdownForBoardOverlay(option, contact, isContactInDropdown) {
    let isContactAssigned = assignedValuesSet.has(contact.name);
    option.value = contact.name;
    option.textContent = contact.name;
    option.classList.add(isContactAssigned ? 'd-none' : 'not_selected');
    option.disabled = isContactInDropdown;
}

/**
 * Generates the default option value for the board overlay dropdown.
 * @param {HTMLSelectElement} dropdown - Dropdown element for contact assignment.
 * @param {HTMLOptionElement} defaultOption - Default option element.
 */
function generateOptionValueDropdown(dropdown, defaultOption) {
    defaultOption.value = 'Select contacts to assign';
    defaultOption.textContent = 'Select contacts to assign';
    defaultOption.selected = true;
    dropdown.insertBefore(defaultOption, dropdown.firstChild);
}

/**
 * Generates the selected value for the board overlay dropdown.
 * @param {HTMLOptionElement} defaultOption - Default option element.
 * @param {HTMLSelectElement} dropdown - Dropdown element for contact assignment.
 */
function generateSelectValueForBoardOverlay(defaultOption, dropdown) {
    let selectedValue = event.target.value;
    let selectedOption = dropdown.querySelector(`option[value="${selectedValue}"]`);
    selectedOption.classList.add('d-none');
    defaultOption.textContent = selectedValue;
    assignedValuesSet.add(selectedValue);
}

/**
 * Generates a colored ball for the assigned contact in the board overlay.
 * @param {Object} contact - Contact information.
 */
function generateBallForBoardOverlay(contact) {
    let ballAssignedToList = document.getElementById('ballAssignedToList');
    let assigneeContainer = document.createElement('div');
    styleAssigneeContainerForBoardOverlay(contact, assigneeContainer);
    ballAssignedToList.appendChild(assigneeContainer);
    addEventListenerMouseOverAndOut();
}

/**
 * Styles the assignee container for the board overlay.
 * @param {Object} contact - Contact information.
 * @param {HTMLDivElement} assigneeContainer - Container element for the assigned contact.
 */
function styleAssigneeContainerForBoardOverlay(contact, assigneeContainer) {
    assigneeContainer.classList.add('assigneeContainer');
    const [firstName, lastName] = contact.name.split(' ');
    const randomColor = randomColorGenerator();
    assigneeContainer.style.backgroundColor = randomColor;
    assigneeContainer.innerHTML = `${firstName.charAt(0)}${lastName ? lastName.charAt(0) : ''}`;
    assigneeContainer.setAttribute('value', contact.name);
    assigneeContainer.addEventListener('click', () => {
        eventlisterAssigneeContainerForBoardOverlay(assigneeContainer);

    });
}

/**
 * Event listener for the assignee container in the board overlay.
 * @param {HTMLDivElement} assigneeContainer - Container element for the assigned contact.
 */
function eventlisterAssigneeContainerForBoardOverlay(assigneeContainer) {
    assigneeContainer.remove();
    const contactValue = assigneeContainer.getAttribute('value');
    const dropdown = document.getElementById('boardOverlayContact');
    const option = [...dropdown.options].find(opt => opt.value === contactValue);
    if (option) {
        option.classList.remove('d-none');
    }
}

/**
 * Adds mouseover and mouseout event listeners to the document.
 */
function addEventListenerMouseOverAndOut() {
    document.addEventListener('mouseover', (event) => {
        if (event.target.classList.contains('assigneeContainer')) {
            event.target.setAttribute('title', event.target.getAttribute('value'));
        }
    });
    document.addEventListener('mouseout', (event) => {
        if (event.target.classList.contains('assigneeContainer')) {
            event.target.removeAttribute('title');
        }
    });
}

/**
 * Generates a random RGB color.
 * @returns {string} - Random RGB color string.
 */
function randomColorGenerator() {
    const getRandomColorComponent = () => Math.floor(Math.random() * 200);
    const r = getRandomColorComponent();
    const g = getRandomColorComponent();
    const b = getRandomColorComponent();
    return `rgb(${r},${g},${b})`;
}

/**
 * Adds click event listeners for priority buttons in the board.
 */
function boardClickEventlisteners() {
    document.getElementById('board_urgent_btn').addEventListener('click', (event) => {
        priorityArray = [];
        event.preventDefault();
        handleBoardOverlayPrioButtonClick('urgent');
    });
    document.getElementById('board_medium_btn').addEventListener('click', (event) => {
        priorityArray = [];
        event.preventDefault();
        handleBoardOverlayPrioButtonClick('medium');
    });
    document.getElementById('board_low_btn').addEventListener('click', (event) => {
        priorityArray = [];
        event.preventDefault();
        handleBoardOverlayPrioButtonClick('low');
    });
}

/**
 * Handles the click event for priority buttons in the board overlay.
 * @param {string} prio - Priority value ('urgent', 'medium', or 'low').
 */
function handleBoardOverlayPrioButtonClick(prio) {
    if (selectedPrioButton === prio) {
        prioButtonIsPrio(prio);
    } else {
        if (selectedPrioButton) {
            const prevNormalButtonId = `board_${selectedPrioButton}_btn`;
            const prevClickedButtonId = `board_clicked_${selectedPrioButton}_btn`;
            document.getElementById(prevNormalButtonId).classList.remove('d-none');
            document.getElementById(prevClickedButtonId).classList.add('d-none');
        }
        updatePriority(prio);
    }
}

/**
 * Handles the case where the priority button is already the selected priority.
 * @param {string} prio - Priority value ('urgent', 'medium', or 'low').
 */
function prioButtonIsPrio(prio) {
    selectedPrioButton = null;
    document.getElementById(`board_${prio}_btn`).classList.remove('d-none');
    document.getElementById(`board_clicked_${prio}_btn`).classList.add('d-none');
    const index = priorityArray.indexOf(prio);
    if (index !== -1) {
        priorityArray.splice(index, 1);
    }
}

/**
 * Updates the selected priority and UI accordingly.
 * @param {string} prio - Priority value ('urgent', 'medium', or 'low').
 */
function updatePriority(prio) {
    if (selectedPrioButton) {
        const clickedButtons = document.querySelectorAll('#board_clicked_urgent_btn, #board_clicked_medium_btn, #board_clicked_low_btn');
        clickedButtons.forEach(button => {
            button.classList.add('d-none');
        });
        const prevNormalButtonId = `board_${selectedPrioButton}_btn`;
        document.getElementById(prevNormalButtonId).classList.remove('d-none');
    }
    switchCasePriorityBtn(prio);
    pushUpdatePriority(prio);
}

/**
 * Updates the priority of a task and adds it to the priority array.
 *
 * @param {string} prio - The priority value to be updated.
 */
function pushUpdatePriority(prio) {
    switchCasePriorityBtn(prio);
    selectedPrioButton = prio;
    document.getElementById(`board_${prio}_btn`).classList.add('d-none');
    document.getElementById(`board_clicked_${prio}_btn`).classList.remove('d-none');
    priorityArray.push(prio);
}

/**
 * Adds a new subtask element to the board.
 *
 * @param {string} subtaskText - The text content of the subtask.
 * @returns {HTMLLIElement} The created list item element.
 */
function createSubtaskElement(subtaskText) {
    const listItem = document.createElement('li');
    const checkbox = document.createElement('input');
    const editIcon = document.createElement('div');
    const deleteIcon = document.createElement('div');
    styleCheckbox(checkbox);
    styleListItem(listItem, subtaskText);
    styleEditIcon(editIcon);
    styleDeleteIcon(deleteIcon);
    const styledListItem = styleListItem(listItem);
    styledListItem.appendChild(checkbox);
    styledListItem.appendChild(document.createTextNode(subtaskText));
    listItem.appendChild(editIcon);
    listItem.appendChild(deleteIcon);
    return styledListItem;
}

/**
 * Adds a new subtask to the board based on the input value.
 *
 */
function addSubtaskToBoard() {
    const subtaskBoardInput = document.getElementById('subtaskBoardInput');
    const subtaskText = subtaskBoardInput.value.trim();
    if (subtaskText !== '') {
        const boardSubtaskList = document.getElementById('boardSubtaskList');
        const newSubtask = createSubtaskElement(subtaskText);
        boardSubtaskList.appendChild(newSubtask);
        subtaskBoardInput.value = '';
    }
}

/**
 * Styles the checkbox for the subtask in the board overlay.
 * @param {HTMLInputElement} checkbox - Checkbox element for the subtask.
 */
function styleCheckbox(checkbox) {
    checkbox.type = 'checkbox';
    checkbox.classList.add('subtask-checkbox');
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

/**
 * Appends child elements for the subtask in the board overlay.
 * @param {HTMLInputElement} checkbox - Checkbox element for the subtask.
 * @param {string} subtaskText - Text content of the subtask.
 * @param {HTMLLIElement} listItem - List item element for the subtask.
 * @param {HTMLDivElement} editIcon - Edit icon element for the subtask.
 * @param {HTMLDivElement} deleteIcon - Delete icon element for the subtask.
 * @param {HTMLUListElement} boardSubtaskList - List element for the board subtasks.
 */
function appendChildForSubTextElements(checkbox, subtaskText, listItem, editIcon, deleteIcon, boardSubtaskList) {
    boardSubtaskList.appendChild(checkbox);
    listItem.textContent = subtaskText;
    listItem.appendChild(editIcon);
    listItem.appendChild(deleteIcon);
    boardSubtaskList.appendChild(listItem);
}

/**
 * Closes the board task overview pop-up.
 */
function closeBoardTaskOverviewPopUp() {
    const addTaskOverlaySection = document.getElementById('addTaskOverlaySection');
    const overlaySection = document.getElementById('overlaySection');
    overlaySection.classList.add('d-none');
    addTaskOverlaySection.classList.add('d-none');
}

/**
 * Clears the input fields in the board overlay.
 */
function clearBoardInputFields() {
    const dropdown = document.getElementById('boardOverlayContact');
    const options = dropdown.options;
    const assigneeContainers = document.querySelectorAll('.assigneeContainer');
    for (let i = 0; i < options.length; i++) {
        const optionValue = options[i].value;
        const isValueMatched = Array.from(assigneeContainers).some(container => container.getAttribute('value') === optionValue);
        if (isValueMatched) {
            options[i].classList.add('d-none');
        } else
            options[i].classList.remove('d-none');
    }
}

/**
 * Sets the flex direction of a notification to 'column'.
 * @param {HTMLElement} notification - The notification element.
 */
function addFlexDirectionColumn(notification) {
    notification.style.flexDirection = 'column';
}

/**
 * Sets the minimum date of the 'editedCreatedAt' element to the current date.
 */
function setMinDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const currentDate = `${year}-${month}-${day}`;
    document.getElementById('editedCreatedAt').min = currentDate;
}

/**
 * Toggles the visibility of the task navigate container based on a click event.
 *
 * @param {Event} event - The click event.
 */
function toggleTaskNavigateContainer(event) {
    let clickedElement = event.target;
    let containerToDisplay = clickedElement.nextElementSibling;
    if (containerToDisplay.classList.contains('task-navigate-container')) {
        containerToDisplay.style.display = 'block';
    }
}

/**
 * Hides all task navigate containers if the clicked element is not a task navigate container.
 *
 * @param {Event} event - The click event.
 */
function hideTaskNavigateContainers(event) {
    let clickedElement = event.target;
    if (!clickedElement.classList.contains('task-navigate-container')) {
        let taskNavigateContainers = document.querySelectorAll('.task-navigate-container');
        taskNavigateContainers.forEach(container => {
            container.style.display = 'none';
        });
    }
}

/**
 * Adds a click event listener to the task board to hide task navigate containers.
 *
 */
function addToggleTaskNavigateContainerListener() {
    let taskBoard = document.getElementById('findTask');
    taskBoard.addEventListener('click', hideTaskNavigateContainers);
}
