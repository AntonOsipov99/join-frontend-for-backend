let currentTaskId;

/**
 * Creates an assignee container element.
 * @param {string} contactName - The name of the contact.
 * @param {string} color - The background color of the container.
 * @returns {HTMLDivElement} - The assignee container element.
 */
function createAssigneeContainer(contactName, color) {
    const assigneeContainer = document.createElement('div');
    assigneeContainer.classList.add('assigneeContainer');
    assigneeContainer.style.backgroundColor = color;
    const [firstName, lastName] = contactName.split(' ');
    assigneeContainer.innerHTML = `${firstName.charAt(0)}${lastName ? lastName.charAt(0) : ''}`;
    assigneeContainer.setAttribute('value', contactName);
    return assigneeContainer;
}

/**
 * Adds event listeners to the assignee container.
 * @param {HTMLDivElement} assigneeContainer - The assignee container element.
 */
function addAssigneeContainerEvents(assigneeContainer) {
    assigneeContainer.addEventListener('mouseover', () => {
        const value = assigneeContainer.getAttribute('value');
        if (value)
            assigneeContainer.setAttribute('title', value);
    });
    assigneeContainer.addEventListener('mouseout', () => {
        assigneeContainer.removeAttribute('title');
    });
    assigneeContainer.addEventListener('click', () => {
        assigneeContainer.remove();
        const contactValue = assigneeContainer.getAttribute('value');
        const dropdown = document.getElementById('boardOverlayContact');
        const option = [...dropdown.options].find(opt => opt.value === contactValue);
        if (option)
            option.classList.remove('d-none');
    });
}

/**
 * Generates and appends assignee containers for the board overlay.
 * @param {string[]} assignedToColors - The colors of assigned contacts.
 * @param {string[]} assignedToValues - The values of assigned contacts.
 * @param {HTMLElement} assignedToList - The container for assigned contacts.
 */
function ballForBoardOverlay(assignedToColors, assignedToValues, assignedToList) {
    for (let i = 0; i < assignedToColors.length; i++) {
        const contactName = assignedToValues[i];
        const color = assignedToColors[i];
        const contact = contacts.find(c => c.name === contactName);
        if (contact) {
            const assigneeContainer = createAssigneeContainer(contactName, color);
            addAssigneeContainerEvents(assigneeContainer);
            assignedToList.appendChild(assigneeContainer);
        } else {
            console.error('Kontakt nicht gefunden für Wert:', contactName);
        }
    }
}

/**
 * Holt den Beschreibungstext einer Aufgabe.
 * @param {Object} task - Die Aufgabe
 * @returns {string} - Der Beschreibungstext der Aufgabe
 */
function getDescriptionText(task) {
    return task.description_text;
}

/**
 * Retrieves the creation date value from the provided task.
 * @param {Object} task - The task containing creation date information
 * @returns {any} - The value representing the creation date of the task
 */
function getIdDateValue(task) {
    return task.createdAt;
}

/**
 * Retrieves the title from the provided task.
 * @param {Object} task - The task containing title information
 * @returns {string} - The title of the task
 */
function getTitle(task) {
    return task.title;
}

/**
 * Generates a list of options for the 'assigned to' field based on the provided task.
 * @param {Object} task - The task containing 'assigned to' information
 * @returns {string} - The HTML string representing the options for the 'assigned to' field
 */
function getAssignedToOptions(task) {
    return task.assignedToValues.map((contact, index) => {
        return `<option value="${contact}" data-id="${index}" data-color="${task.assignedToColors[index]}">${contact}</option>`;
    }).join('');
}

/**
 * Generates a list of subtasks based on the provided task.
 * @param {Object} task - The task containing subtasks information
 * @returns {string} - The HTML string representing the list of subtasks
 */
function getSubtasksList(task) {
    if (task.subtasksId && task.subtasks) {
        return task.subtasksId.map((subtaskId, index) => {
            const subtask = task.subtasks[index];
            return subtasksListTemplate(subtaskId, subtask);
        }).join('');
    }
    return '';
}

/**
 * Initializes the task based on the currently displayed task ID.
 * @param {number} currentShowedTaskId - The ID of the currently displayed task
 * @returns {Object|null} - The task found or null if not found
 */
function initializeTask(currentShowedTaskId) {
    currentTaskId = [];
    const taskOverviewPopUp = document.getElementById('taskOverviewPopUp');
    taskOverviewPopUp.innerHTML = '';
    const task = allTasks.find(task => task.id === currentShowedTaskId);
    currentTaskId = currentShowedTaskId;
    if (!task) {
        console.error(`Task mit der ID '${currentTaskId}' wurde nicht gefunden.`);
        return null;
    }
    return task;
}

/**
 * Updates the task details in the task overview.
 *
 * @param {Object} task - The task object to update.
 */
function updateTaskDetails(task) {
    const descriptionText = getDescriptionText(task);
    const idDateValue = getIdDateValue(task);
    const title = getTitle(task);
    const assignedToOptions = getAssignedToOptions(task);
    const subtasksList = getSubtasksList(task);
    editTaskOverviewTemplate(taskOverviewPopUp, title, descriptionText, idDateValue, subtasksList);
    boardOverlayContactDropdown(assignedToOptions);
}


/**
 * Displays assigned contacts in the board overlay.
 *
 * @param {Object} task - The task object containing assigned contact information.
 */
function displayAssignedContacts(task) {
    const assignedToList = document.getElementById('ballAssignedToList');
    ballForBoardOverlay(task.assignedToColors, task.assignedToValues, assignedToList);
}

/**
 * Performs various actions related to tasks on the board.
 * - Clears board input fields.
 * - Sets click event listeners on the board.
 * - Sets a minimum date.
 * - Applies line-through and checkbox to the specified task.
 * - Simulates a priority button click for the specified task.
 */
function performTaskActions() {
    clearBoardInputFields();
    boardClickEventlisteners();
    setMinDate();
    applyLineThroughAndCheckbox(currentTaskId);
    simulatePriorityButtonClick(currentTaskId);
}

/**
 * Reverses the visibility of buttons for the 'medium' priority.
 */
function reverseForMediumBtn() {
    document.getElementById('board_clicked_urgent_btn').classList.add('d-none');
    document.getElementById('board_clicked_low_btn').classList.add('d-none');
    document.getElementById('board_urgent_btn').classList.remove('d-none');
    document.getElementById('board_low_btn').classList.remove('d-none');
}

/**
 * Prepares and displays task details for editing.
 * - Retrieves the task details based on the current displayed task ID.
 * - Updates the task details in the display.
 * - Shows assigned contacts for the task.
 * - Performs various actions related to task operations on the board.
 */
function editingShowTask(currentShowedTaskId) {
    const task = initializeTask(currentShowedTaskId);
    if (!task) return;
    updateTaskDetails(task);
    displayAssignedContacts(task);
    performTaskActions();
}

/**
 * Updates the button state based on the priority and hides/shows the appropriate buttons.
 *
 * @param {string} prio - The priority value ('urgent', 'medium', or 'low').
 */
function updateButtonState(prio) {
    document.getElementById(`board_${prio}_btn`).classList.add('d-none');
    document.getElementById(`board_clicked_${prio}_btn`).classList.remove('d-none');
    priorityArray.push(prio);
}

/**
 * Simulates a priority button click for a given task ID and updates the button state accordingly.
 *
 * @param {string} taskId - The ID of the task.
 */
function simulatePriorityButtonClick(taskId) {
    const task = allTasks.find(task => task.id === taskId);
    if (!task) {
        console.error(`Task with ID "${taskId}" was not found.`);
        return;
    }
    const priority = task.priority;
    if (priority.indexOf('urgent') !== -1) {
        resetPriorityButtons();
        updateButtonState('urgent');
    } else if (priority.indexOf('medium') !== -1) {
        resetPriorityButtons();
        updateButtonState('medium');
    } else if (priority.indexOf('low') !== -1) {
        resetPriorityButtons();
        updateButtonState('low');
    } else {
        console.error(`Invalid priority value "${priority}" for task with ID "${taskId}".`);
    }
}

/**
 * Switches the case for the priority button based on the priority value.
 *
 * @param {string} prio - The priority value ('urgent', 'medium', or 'low').
 */
function switchCasePriorityBtn(prio) {
    switch (prio) {
        case 'urgent':
            reverseForUrgentBtn();
            break;
        case 'medium':
            reverseForMediumBtn();
            break;
        case 'low':
            reverseForLowBtn();
            break;
        default:
            break;
    }
}

/**
 * Reverses the visibility of buttons for the 'low' priority.
 */
function reverseForLowBtn() {
    document.getElementById('board_clicked_urgent_btn').classList.add('d-none');
    document.getElementById('board_clicked_medium_btn').classList.add('d-none');
    document.getElementById('board_medium_btn').classList.remove('d-none');
    document.getElementById('board_urgent_btn').classList.remove('d-none');
    document.getElementById('board_low_btn').classList.remove('d-none');
}

/**
 * Generates HTML for a subtask in the task overview.
 * @param {string} subtask - The subtask description.
 * @returns {string} - HTML for the subtask.
 */
function subtasksListTemplate(subtasksId, subtasks) {
    return `<li id="${subtasksId}" class="subtask-item">
        <input type="checkbox" class="subtask-checkbox">
        ${subtasks}
        <div class="pencil_icon_div">
            <img class="addSubTaskIcons icon pencil" src="../assets/img/pencil-32.png" alt="" onclick="editSubtask(event)">
        </div>
        <div class="delete_icon_div">
            <img class="addSubTaskIcons icon delete" src="../assets/img/delete-32.png" alt="" onclick="deleteSubtask(event)">
        </div>
    </li>`;
}

/**
 * Generates and displays the task overview form for editing.
 * @param {HTMLElement} taskOverviewPopUp - The task overview popup element.
 * @param {string} title - The task title.
 * @param {string} descriptionText - The task description.
 * @param {string} idDateValue - The due date of the task.
 * @param {string} subtasksList - HTML list of subtasks.
 */
function editTaskOverviewTemplate(taskOverviewPopUp, title, descriptionText, idDateValue, subtasksList) {
    taskOverviewPopUp.innerHTML = /*html*/ `
    <form class="taskOverviewForm" onsubmit="event.preventDefault(); boardConfirm();">
    <div class="board-vector-position"><img class="board-vector-class" src="../assets/img/Vector (1).svg" alt="" onclick="closeBoardTaskOverviewPopUp()"></div>
        <div class="add_title_section">
            <span>Title</span>
            <input required="" type="text" class="title_inputfield" id="boardOverlayTitle" placeholder="Enter a title" value="${title}">

            <div class="add_description_section">
                <span>Description</span>
                <textarea required="" type="text" class="description_inputfield" id="boardOverlaydescriptionText" placeholder="Enter a Description">${descriptionText}</textarea>

                <div class="assigned_to_section">
                    <span>Assigned to</span>
                    <label for="Select contacts to assign"></label>
                    <select required="" class="assigned_to_inputfield" name="contacts" id="boardOverlayContact">Select contacts to assign</select>
                    <div class="assignedToList" id="ballAssignedToList"></div>
                </div>
            </div>
        </div>

        <div class="date_Prio_div">
            <div class="add_date_section">
                <span class="">Due date</span>
                <input required="" type="date" Value="${idDateValue}"  class="date_inputfield" id="editedCreatedAt" placeholder="dd/mm/yy">
            </div>

            <div class="add_Prio_section">
                            <span>Prio</span>
                            <div class="prio_btn_position">
                                <button id="board_urgent_btn" class="urgent_prio_btn_characteristics">
                                    <div class="prio_btn_text_icon">
                                        <h6 class="prio_btn_text_position">Urgent</h6>
                                        <img class="prio_icon_position" src="../assets/img/Prio alta.svg"
                                            alt="High-Prio-Icon">
                                    </div>
                                </button>
                                <button type="button" value="urgent" id="board_clicked_urgent_btn"
                                    class="urgent_prio_btn_characteristics_onclick d-none">
                                    <div class="prio_btn_text_icon">
                                        <h6 class="prio_btn_text_position">Urgent</h6>
                                        <img class="prio_icon_position" src="../assets/img/Prio alta-white.svg"
                                            alt="High-Prio-Icon">
                                    </div>
                                </button>
                                <button id="board_medium_btn" class="medium_prio_btn_characteristics">
                                    <div class="prio_btn_text_icon">
                                        <h6 class="prio_btn_text_position">Medium</h6>
                                        <img class="prio_icon_position" src="../assets/img/Prio media.svg"
                                            alt="Medium-Prio-Icon">
                                    </div>
                                </button>
                                <button type="button" value="medium" id="board_clicked_medium_btn"
                                    class="medium_prio_btn_characteristics_onclick d-none">
                                    <div class="prio_btn_text_icon">
                                        <h6 class="prio_btn_text_position">Medium</h6>
                                        <img class="prio_icon_position" src="../assets/img/Prio media-white.svg"
                                            alt="Medium-Prio-Icon">
                                    </div>
                                </button>
                                <button id="board_low_btn" class="low_prio_btn_characteristics">
                                    <div class="prio_btn_text_icon">
                                        <h6 class="prio_btn_text_position">Low</h6>
                                        <img class="prio_icon_position" src="../assets/img/Prio baja.svg"
                                            alt="Low-Prio-Icon">
                                    </div>
                                </button>
                                <button type="button" value="low" id="board_clicked_low_btn"
                                    class="low_prio_btn_characteristics_onclick d-none">
                                    <div class="prio_btn_text_icon">
                                        <h6 class="prio_btn_text_position">Low</h6>
                                        <img class="prio_icon_position" src="../assets/img/Prio baja-white.svg"
                                            alt="Low-Prio-Icon">
                                    </div>
                                </button>
                            </div>
                        </div>
            <div class="task-container">
                <div class="taskContainerItemsPosition">
                    <input class="subtaskInputfield" type="text" id="subtaskBoardInput" placeholder="Add new subtask">
                    <div class="subtaskButton">
                        <img class="subtask_img" src="../assets/img/add.svg" alt="" onclick="addSubtaskToBoard()">
                    </div>
                </div>

                <ul id="boardSubtaskList" class="boardSubtaskList">
                    ${subtasksList}
                </ul>
            </div>
        </div>
    <div class="board-confirm-div">
        <button type="submit" class="board-confirm-btn">
            <span>Ok</span>
            <img src="../assets/img/check.svg" alt="">
        </button>
    </div>
    </form>`;
}

/**
 * Retrieves and organizes input values from the board for task creation/editing.
 * @returns {{
*  taskId: string,
*  title: string,
*  descriptionText: string,
*  dueDate: string,
*  assignedToDiv: HTMLElement,
*  subtasksStatusArray: boolean[],
*  subtasksTextArray: string[],
*  subtasksIdArray: string[]
* }} An object containing input values and subtask information.
*/
function getBoardInputValues() {
    const taskId = currentTaskId;
    const title = getInputElementValue('boardOverlayTitle');
    const descriptionText = getInputElementValue('boardOverlaydescriptionText');
    const assignedToDiv = document.getElementById('ballAssignedToList');
    const dueDate = getInputElementValue('editedCreatedAt');
    const subtasksInfo = getSubtaskItemsInfo();
    const { subtasksStatusArray, subtasksTextArray, subtasksIdArray } = subtasksInfo;
    clearBoardSubTaskList();
    return { taskId, title, descriptionText, dueDate, assignedToDiv, ...subtasksInfo };
}

/**
 * Retrieves the value of an input element based on the provided element ID.
 * @param {string} elementId - The ID of the input element to retrieve the value from.
 * @returns {string} The value of the input element.
 */
function getInputElementValue(elementId) {
    return document.getElementById(elementId).value;
}

/**
 * Reverses the visibility of buttons for the 'urgent' priority.
 * Hides 'medium' and 'low' clicked buttons, and shows the 'urgent' and 'low' buttons.
 */
function reverseForUrgentBtn() {
    document.getElementById('board_clicked_medium_btn').classList.add('d-none');
    document.getElementById('board_clicked_low_btn').classList.add('d-none');
    document.getElementById('board_urgent_btn').classList.remove('d-none');
    document.getElementById('board_low_btn').classList.remove('d-none');
}


/**
 * Retrieves information about subtask items present in the board overlay.
 * @returns {Object} Information about subtasks, including their status, text, and IDs.
 *                   Format: { subtasksStatusArray: boolean[], subtasksTextArray: string[], subtasksIdArray: string[] }
 */
function getSubtaskItemsInfo() {
    const boardOverlaySubTaskList = document.getElementById('boardSubtaskList');
    const subtaskItems = document.querySelectorAll('#boardSubtaskList .subtask-item');
    const subtasksStatusArray = [];
    const subtasksTextArray = [];
    const subtasksIdArray = [];
    subtaskItems.forEach(item => {
        const text = item.textContent.trim();
        const id = item.id;
        subtasksStatusArray.push(item.querySelector('.subtask-checkbox').checked);
        subtasksTextArray.push(text);
        subtasksIdArray.push(id);
        updateProgressBar(currentTaskId);
    });
    const subtasksArray = Array.from(subtaskItems, item => item.childNodes[0].textContent.trim());
    return { subtasksStatusArray, subtasksTextArray, subtasksIdArray };
}

/**
 * Clears the content of the board overlay subtask list.
 */
function clearBoardSubTaskList() {
    const boardOverlaySubTaskList = document.getElementById('boardSubtaskList');
    boardOverlaySubTaskList.innerHTML = '';
}


