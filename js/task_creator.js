/**
 * Creates an edit icon for subtasks.
 * @returns {HTMLDivElement} - The created edit icon container.
 */
function createEditIcon() {
    const editIconContainer = document.createElement('div');
    editIconContainer.classList.add('pencil_icon_div');
    const editIcon = document.createElement('img');
    editIcon.src = '../assets/img/pencil-32.png';
    editIcon.alt = '';
    editIcon.classList.add('addSubTaskIcons', 'icon', 'pencil');
    editIcon.onclick = editFirstSubtask;
    editIconContainer.appendChild(editIcon);
    return editIconContainer;
}

/**
 * Creates a delete icon for subtasks.
 * @returns {HTMLDivElement} - The created delete icon container.
 */
function createDeleteIcon() {
    const deleteIconContainer = document.createElement('div');
    deleteIconContainer.classList.add('delete_icon_div');
    const deleteIcon = document.createElement('img');
    deleteIcon.src = '../assets/img/delete-32.png';
    deleteIcon.alt = '';
    deleteIcon.classList.add('addSubTaskIcons', 'icon', 'delete');
    deleteIcon.onclick = deleteSubtask;
    deleteIconContainer.appendChild(deleteIcon);
    return deleteIconContainer;
}

/**
 * Edits the first subtask.
 * @param {Event} event - The event object.
 */
function editFirstSubtask(event) {
    const subtaskItem = event.target.closest('.subtask-item');
    const subtaskText = subtaskItem.textContent.trim();
    if (subtaskItem.classList.contains('lineThrough'))
        subtaskItem.classList.remove('lineThrough');
    const inputField = createInputField(subtaskText);
    const checkmarkIcon = createCheckmarkIcon(inputField, subtaskItem,);
    subtaskItem.innerHTML = '';
    subtaskItem.appendChild(inputField);
    subtaskItem.appendChild(checkmarkIcon);
    inputField.focus();
}

/**
 * Creates an input field for editing.
 * @param {string} value - The initial value of the input field.
 * @returns {HTMLInputElement} - The created input field element.
 */
function createInputField(value) {
    const inputField = document.createElement('input');
    inputField.type = 'text';
    inputField.value = value;
    return inputField;
}

/**
 * Creates a checkmark icon for confirming changes.
 * @param {HTMLInputElement} inputField - The associated input field.
 * @returns {HTMLImageElement} - The created checkmark icon element.
 */
function createCheckmarkIcon(inputField, subtaskItem,) {
    const checkmarkIcon = document.createElement('img');
    checkmarkIcon.classList.add('addSubTaskIcons', 'icon', 'checkmark');
    checkmarkIcon.src = '../assets/img/check-mark-3-32.png';
    checkmarkIcon.alt = 'Apply Changes';
    checkmarkIcon.addEventListener('click', () => {
        const editedText = inputField.value.trim();
        subtaskItem.innerHTML = '';
        subtaskItem.appendChild(document.createTextNode(editedText));
        subtaskItem.appendChild(createIcon('edit'));
        subtaskItem.appendChild(createIcon('delete'));
    });
    return checkmarkIcon;
}

/**
 * Styles the checkbox for the subtask in the board overlay.
 * @param {HTMLInputElement} checkbox - Checkbox element for the subtask.
 */
function styleCheckbox(checkbox) {
    checkbox.type = 'checkbox';
    checkbox.classList.add('subtask-checkbox');
}

function resetPriorityButtonsAddTask() {
    const buttons = ['urgent', 'medium', 'low'];
    buttons.forEach(button => {
        const normalBtn = document.getElementById(`normal_${button}_btn`);
        const clickedBtn = document.getElementById(`clicked_${button}_btn`);
        normalBtn.classList.remove('d-none');
        clickedBtn.classList.add('d-none');
    });
}

/**
 * Clears all the fields and arrays used for adding tasks.
 */
function clearAddTaskFields() {
    clearInputFields();
    resetPriorityButtonsAddTask();
    resetAssignedField();
    clearDateInput();
    clearSubtasks();
    clearAddTaskArrays();
}