/**
 * Finds and filters tasks based on the search input value.
 *
 */
function findTask() {
    const searchInput = document.getElementById('search').value.toLowerCase();
    const pinnedTaskContainers = document.querySelectorAll('.pinned-task-container');
    pinnedTaskContainers.forEach(container => {
        const headline = container.querySelector('.pinned-task-headline');
        const taskText = headline.textContent.toLowerCase();
        const description = container.querySelector('.pinned-task-discription');
        const taskDescription = description.textContent.toLowerCase();
        if (taskText.includes(searchInput) || taskDescription.includes(searchInput))
            container.classList.remove('d-none');
         else
            container.classList.add('d-none');
    });
}

/**
 * Displays or hides a message indicating the absence of tasks.
 *
 * @param {Element} container - The container element where the message is displayed.
 * @param {Array} tasksArray - An array of tasks.
 * @param {string} text - The text message to display.
 */
function showNoTaskMessage(container, tasksArray, text) {
    const noTaskContainer = document.createElement('div');
    noTaskContainer.textContent = text;
    const tasksExist = tasksArray.some(existingTask => container.id === `task-${existingTask.id}`);
    if (!tasksExist) {
        container.appendChild(noTaskContainer);
    } else {
        const existingNoTaskContainer = container.querySelector('.no-task-message');
        if (existingNoTaskContainer) {
            container.removeChild(existingNoTaskContainer);
        }
    }
}

/**
 * Updates the progress bar based on the completion status of subtasks.
 *
 * @param {string} taskId - The ID of the task.
 */
function updateProgressBar(taskId) {
    const task = allTasks.find(task => task.id === taskId);
    if (!task) {
        console.error(`Task mit der ID "${taskId}" wurde nicht gefunden.`);
        return;
    }
    const progressBarId = task.progressBarId;
    const progressBar = document.getElementById(`progress-bar-${progressBarId}`);
    if (!progressBar) {
        return;
    }
    const subtasksStatusArray = task.subtasksStatusArray || [];
    const filledSubtasksCount = subtasksStatusArray.filter(status => status).length;
    const totalSubtasksCount = subtasksStatusArray.length;
    const progressPercentage = (filledSubtasksCount / totalSubtasksCount) * 100;
    progressBar.style.width = `${progressPercentage}%`;
}

/**
 * Adds a task for the "In Progress" category and opens the overlay.
 */
function addTaskForInProgress() {
    const overlaySection = document.getElementById('addTaskOverlaySection');
    const overlay = document.getElementById('add-task-form');
    overlay.classList.add('slide-in');
    overlaySection.classList.remove('d-none');
    inWhichContainer.push('in-Progress-Container');
}

/**
 * Updates the status of subtasks based on the provided status array and IDs.
 *
 * @param {boolean[]} subtaskStatusArray - Array of boolean values representing subtask statuses.
 * @param {string[]} subtasksIdArray - Array of IDs corresponding to subtasks.
 */
function updateSubtaskStatus(subtaskStatusArray, subtasksIdArray) {
    subtaskStatusArray.forEach((subtaskStatus, index) => {
        const subtaskId = subtasksIdArray[index];
        const subtaskElement = document.getElementById(subtaskId);
        if (subtaskElement) {
            const checkboxElement = subtaskElement.querySelector('.subtask-checkbox');
            if (checkboxElement) {
                checkboxElement.checked = subtaskStatus;
            }
        }
    });
}

/**
 * Applies the line-through style and updates checkbox status for the given task ID.
 *
 * @param {string} currentTaskId - ID of the task to apply styles and update checkboxes.
 */
function applyLineThroughAndCheckbox(currentTaskId) {
    const task = allTasks.find(task => task.id === currentTaskId);
    if (!task) {
        console.error(`Task with ID "${currentTaskId}" was not found.`);
        return;
    }
    const subtasksStatusArray = task.subtasksStatusArray || [];
    const subtasksIdArray = task.subtasksId || [];
    updateSubtaskStatus(subtasksStatusArray, subtasksIdArray);
}

/**
 * Hides the overlay section.
 *
 */
function hideOverlay() {
    const overlaySection = document.getElementById('overlaySection');
    overlaySection.classList.add('d-none');
}

/**
 * Calculates and displays progress based on the status of subtasks.
 *
 * @param {boolean[]} subtasksStatusArray - Array indicating the status of each subtask.
 * @param {HTMLElement[]} subtasks - List of subtask elements.
 * @param {string} progressBarId - ID of the progress bar element.
 */
function calculateProgress(subtasksStatusArray, subtasks, progressBarId) {
    const filledSubtasksCount = subtasksStatusArray.filter(status => status).length;
    const progressPercentage = (filledSubtasksCount / subtasks.length) * 100;
    const progressBar = document.getElementById(`progress-bar-${progressBarId}`);
    const progressBarCounter = document.getElementById(`progress-bar-counter-${progressBarId}`);
    if (progressBar && progressBarCounter) {
        progressBarCounter.innerText = `${filledSubtasksCount}/${subtasks.length}`;
        progressBar.style.transition = 'width 0.5s ease';
        progressBar.style.height = '100%';
        progressBar.style.backgroundColor = '#29ABE2';
        progressBar.style.width = `${progressPercentage}%`;
    }
}

/**
 * Checks and updates the progress bar for a given task based on its subtask status.
 *
 * @param {string} taskId - The ID of the task to check progress for.
 * @param {string} progressBarId - The ID of the progress bar element.
 */
function checkProgressBar(taskId, progressBarId) {
    const task = allTasks.find(task => task.id === taskId);
    const progressBar = document.getElementById(`progress-bar-${progressBarId}`);
    const progressBarCounter = document.getElementById(`progress-bar-counter-${progressBarId}`);
    if (!task || !progressBar || !progressBarCounter) return;
    const subtasks = task.subtasks || [];
    const subtasksStatusArray = task.subtasksStatusArray || [];
    calculateProgress(subtasksStatusArray, subtasks, progressBarId);
}

/**
 * Sets the selected category and its color in the designated HTML element.
 *
 * @param {string} category - The category name.
 * @param {string} color - The color associated with the category.
 * @returns {string} The selected category color.
 */
function selectedCategory(category, color) {
    category = category.charAt(0).toUpperCase() + category.slice(1);
    document.getElementById('category').innerHTML = /*html*/ `
            <div id="_xak1l2uph" class="categoryContainer">
                ${category}
                <div class="categoryColor" style="background-color: ${color}; margin-left: 10px"></div>
            </div>
        `;
    closeCategoryDropdown();
    return color;
}

/**
 * Clears the arrays used for adding tasks.
 */
function clearAddTaskArrays() {
    subtasksArray = [];
    categoryArray = [];
    categoryColorArray = [];
    assignedToValuesArray = [];
    assignedToColorsArray = [];
    assignedShortValues = [];
    createdAtArray = [];
    priorityArray = [];
}

/**
 * Changes the icon of the clear button to the default state.
 * @param {string} IdHover - The ID of the button in the hover state.
 * @param {string} IdDefault - The ID of the button in the default state.
 */
function changeClearBtnIconToDefault(IdHover, IdDefault) {
    document.getElementById(IdHover).classList.add('d-none');
    document.getElementById(IdDefault).classList.remove('d-none');
}

/**
 * Changes the icon of the clear button to the hover state.
 * @param {string} IdDefault - The ID of the button in the default state.
 * @param {string} IdHover - The ID of the button in the hover state.
 */
function changeClearBtnIconToHover(IdDefault, IdHover) {
    document.getElementById(IdDefault).classList.add('d-none');
    document.getElementById(IdHover).classList.remove('d-none');
}

/**
 * Opens the overlay for adding tasks.
 */
function openOverlay() {
    const overlaySection = document.getElementById('addTaskOverlaySection');
    const overlay = document.getElementById('add-task-form');
    overlay.classList.add('slide-in');
    overlaySection.classList.remove('d-none');
}

/**
 * Adds a task for the "Await Feedback" category and opens the overlay.
 */
function addTaskForAwaitFeedback() {
    const overlaySection = document.getElementById('addTaskOverlaySection');
    const overlay = document.getElementById('add-task-form');
    overlay.classList.add('slide-in');
    overlaySection.classList.remove('d-none');
    inWhichContainer.push('for-Await-Feedback-Container');
}

/**
 * Closes the overlay, clearing the state.
 */
function closeOverlay() {
    inWhichContainer = [];
    const overlaySection = document.getElementById('addTaskOverlaySection');
    const overlay = document.getElementById('addTaskOverlaySection');
    overlay.classList.remove('slide-in');
    overlaySection.classList.add('d-none');
}

/**
 * Updates the task details in the tasks array.
 * @param {string} descriptionText - The task description.
 * @param {string} title - The task title.
 * @param {string} dueDate - The due date of the task.
 * @param {number} taskIndex - The index of the task in the array.
 * @param {string[]} updatedPriority - The updated priority array.
 * @param {string[]} subtasksArray - The array of subtasks.
 * @param {string[]} assignedToValues - The values of assigned contacts.
 * @param {string[]} assignedShortValues - The short values of assigned contacts.
 * @param {string[]} assignedToColors - The colors of assigned contacts.
 */
function updateTaskDetailsInArray(descriptionText, title, dueDate, taskIndex, updatedPriority, subtasksTextArray, assignedToValues, assignedShortValues, assignedToColors, subtasksStatusArray, subtasksIdArray) {
    const task = allTasks[taskIndex];
    task.title = title;
    task.description_text = descriptionText;
    task.createdAt = dueDate;
    task.priority = updatedPriority.slice();
    task.subtasks = subtasksTextArray.slice();
    task.subtasksId = subtasksIdArray.slice();
    task.assignedToValues = assignedToValues.slice();
    task.assignedShortValues = assignedShortValues.slice();
    task.assignedToColors = assignedToColors.slice();
    task.subtasksStatusArray = subtasksStatusArray;
}

/**
 * Adds a task for the "To-Do" category and opens the overlay.
 */
function addTaskForToDo() {
    const overlaySection = document.getElementById('addTaskOverlaySection');
    const overlay = document.getElementById('add-task-form');
    overlay.classList.add('slide-in');
    overlaySection.classList.remove('d-none');
    inWhichContainer.push('for-To-Do-Container'); // Füge 'for-To-Do-Container' zum Array hinzu
}

/**
 * Handles the case when a task is not found in the tasks array.
 * @param {number|string} taskId - The ID of the task.
 */
function handleTaskNotFound(taskId) {
    console.error(`Task mit der ID "${taskId}" wurde nicht im allTasks-Array gefunden.`);
    return;
}

/**
 * Handles the confirmation action on the board for a task.
 * Extracts task details, finds the task index, and updates/saves the task if found.
 * Displays an error message if the task is not found.
 * 
 */
async function boardConfirm() {
    event.preventDefault();
    const taskDetails = extractTaskDetails();
    const taskIndex = findTaskIndex(taskDetails.taskId);
    if (taskIndex !== -1) {
        const assigneeDetails = extractAssigneeDetails(taskDetails.assignedToDiv);
        const updatedPriority = determineUpdatedPriority(taskIndex);
        updateTaskAndSave(taskIndex, taskDetails, assigneeDetails, updatedPriority);
    } else {
        handleTaskNotFound(taskDetails.taskId);
    }
}

/**
 * Extracts details of a task from the board input values.
 * 
 * @returns {Object} - An object containing task details extracted from the board input.
 * @property {string} taskId - The ID of the task.
 * @property {string} title - The title of the task.
 * @property {string} descriptionText - The description of the task.
 * @property {string} dueDate - The due date of the task.
 * @property {HTMLElement} assignedToDiv - The DOM element representing the assigned contacts.
 * @property {boolean[]} subtasksStatusArray - An array of subtask completion statuses.
 * @property {string[]} subtasksTextArray - An array of subtask text descriptions.
 * @property {string[]} subtasksIdArray - An array of subtask IDs.
 */
function extractTaskDetails() {
    const { taskId, title, descriptionText, dueDate, assignedToDiv, subtasksStatusArray, subtasksTextArray, subtasksIdArray } = getBoardInputValues();
    return { taskId, title, descriptionText, dueDate, assignedToDiv, subtasksStatusArray, subtasksTextArray, subtasksIdArray };
}

/**
 * Finds the index of a task in the task list by its ID.
 * 
 * @param {string} taskId - The ID of the task to find.
 * @returns {number} - The index of the task in the task list. Returns -1 if not found.
 */
function findTaskIndex(taskId) {
    return allTasks.findIndex(task => task.id === taskId);
}

/**
 * Extracts details of assignees from the given element.
 * 
 * @param {HTMLElement} assignedToDiv - The HTML element containing assignee details.
 * @returns {Object} - An object containing arrays of assignee values, short values, and colors.
 */
function extractAssigneeDetails(assignedToDiv) {
    const assigneeContainers = assignedToDiv.getElementsByClassName('assigneeContainer');
    const assignedToValues = [];
    const assignedShortValues = [];
    const assignedToColors = [];
    for (const container of assigneeContainers) {
        const backgroundColor = container.style.backgroundColor;
        const contactValue = container.getAttribute('value');
        const contactText = container.textContent.trim();
        assignedToValues.push(contactValue);
        assignedShortValues.push(contactText);
        assignedToColors.push(backgroundColor);
    }
    return { assignedToValues, assignedShortValues, assignedToColors };
}

/**
 * Determines the updated priority based on the current and previous priorities.
 * 
 * @param {number} taskIndex - The index of the task in the tasks array.
 * @returns {Array|string} - The updated priority array or string.
 */
function determineUpdatedPriority(taskIndex) {
    const previousPriority = allTasks[taskIndex].priority;
    return priorityArray.length > 0 ? priorityArray : previousPriority;
}

/**
 * Updates the task details in the array, saves tasks, resets global variables, and updates task display.
 *
 * @param {number} taskIndex - The index of the task in the tasks array.
 * @param {object} taskDetails - Details of the task to be updated.
 * @param {object} assigneeDetails - Details of the task's assignees.
 * @param {Array|string} updatedPriority - Updated priority information.
 * @returns {Promise<void>} - A Promise that resolves after tasks are saved.
 */
async function updateTaskAndSave(taskIndex, taskDetails, assigneeDetails, updatedPriority) {
    updateTaskDetailsInArray(
        taskDetails.descriptionText,
        taskDetails.title,
        taskDetails.dueDate,
        taskIndex,
        updatedPriority,
        taskDetails.subtasksTextArray,
        assigneeDetails.assignedToValues,
        assigneeDetails.assignedShortValues,
        assigneeDetails.assignedToColors,
        taskDetails.subtasksStatusArray,
        taskDetails.subtasksIdArray
    );
    await saveTasks();
    priorityArray = [];
    currentTaskId = [];
    closeTaskOverviewPopUp();
    showTasks();
    sortTaskIntoArrays(allTasks, tasksToDo, tasksInProgress, tasksAwaitFeedback, tasksDone);
}

/**
 * Closes the task overview popup.
 */
function closeTaskOverviewPopUp() {
    inWhichContainer = [];
    const addTaskOverlaySection = document.getElementById('addTaskOverlaySection');
    const overlaySection = document.getElementById('overlaySection');
    overlaySection.classList.add('d-none');
    addTaskOverlaySection.classList.add('d-none');
}

/**
 * Prevents the event from propagating to parent elements.
 * @param {Event} event - The event object.
 */
function doNotClose(event) {
    event.stopPropagation();
}

/**
 * Resets the assigned field to its default value.
 */
function resetAssignedField() {
    const assignedToSelect = document.getElementById('which_assigned_contact');
    assignedToSelect.selectedIndex = 0;
}

/**
 * Clears the date input field.
 */
function clearDateInput() {
    const dueDateInput = document.getElementById('createdAt');
    dueDateInput.value = '';
}

/**
 * Resets the priority buttons to their default state.
 */
function resetPriorityButtons() {
    const buttons = ['urgent', 'medium', 'low'];
    buttons.forEach(button => {
        const normalBtn = document.getElementById(`addTask_overlay_${button}_btn`);
        const clickedBtn = document.getElementById(`addTask_overlay_clicked_${button}_btn`);
        normalBtn.classList.remove('d-none');
        clickedBtn.classList.add('d-none');
    });
}

/**
 * Updates the category based on the selected option in the dropdown.
 */
function updateCategory() {
    const categoryDropdown = document.getElementById('categoryDropdown');
    const categoryContainer = document.getElementById('category');
    const categoryOptions = categoryDropdown.getElementsByClassName('categoryOption');
    if (categoryOptions.length >= 2) {
        const secondCategoryOption = categoryOptions[1];
        categoryContainer.innerHTML = secondCategoryOption.outerHTML;
    }
}

/**
 * Clears the subtask input and the subtask list.
 */
function clearSubtasks() {
    const subtaskInput = document.getElementById('subtaskInput');
    const subtaskList = document.getElementById('subtaskList');
    subtaskInput.value = '';
    subtaskList.innerHTML = '';
}

/**
 * Clears the input fields, resets the assigned field, clears date input, resets priority buttons, updates category, and clears subtasks.
 */
function forClearAddTaskWithBtn() {
    cancelNewCategory();
    closeCategoryDropdown();
    clearInputFields();
    resetAssignedField();
    clearDateInput();
    resetPriorityButtons();
    clearSubtasks();
}