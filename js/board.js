let inWhichContainer = [];
let task_category = {};
let tasksToDo = [];
let tasksInProgress = [];
let tasksAwaitFeedback = [];
let tasksDone = [];

/**
 * Initializes the Kanban board by loading tasks, contacts, generating the sidebar,
 * showing tasks, restoring tasks from local storage, sorting tasks into arrays,
 * adding event listeners for task overlays, creating contact dropdown, assigning option IDs,
 * and setting the minimum date for the board.
 */
async function initForBoard() {
    await loadTasks();
    await loadContacts();
    generateSideBar();
    showTasks();
    addTaskOverlayClickEventlisteners();
    createContactDropdown();
    assignOptionIDs();
    setMinDateForBoard();
    addToggleTaskNavigateContainerListener();
}

/**
 * Sets the minimum date for the board based on the current date.
 */
function setMinDateForBoard() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const currentDate = `${year}-${month}-${day}`;
    document.getElementById('createdAt').min = currentDate;
}

/**
 * Resets the assigned field by programmatically triggering click events on assignee balls.
 */
function resetAssignedField() {
    const assignedToList = document.getElementById('assignedToList');
    const assigneeBalls = assignedToList.querySelectorAll('.assigneeContainer');
    const clickEvent = new Event('click', { bubbles: true });
    assigneeBalls.forEach(ball => {
        ball.dispatchEvent(clickEvent);
    });
}

/**
 * Extracts information about assignees and populates corresponding arrays.
 */
function getTargetArray(taskDiv, tasksToDo, tasksInProgress, tasksAwaitFeedback, tasksDone) {
    switch (taskDiv.parentElement.id) {
        case 'target-to-do-table':
            return tasksToDo;
        case 'target-in-progress-table':
            return tasksInProgress;
        case 'target-await-feedback-table':
            return tasksAwaitFeedback;
        case 'target-done-table':
            return tasksDone;
        default:
            return [];
    }
}

/**
 * Extracts information about assignees and populates corresponding arrays.
 */
function extractAssigneeInfo() {
    const assignedToDiv = document.getElementById('assignedToList');
    const assigneeContainers = assignedToDiv.getElementsByClassName('assigneeContainer');
    for (const container of assigneeContainers) {
        const backgroundColor = container.style.backgroundColor;
        const contactValue = container.getAttribute('data-contact-value');
        const contactText = container.textContent.trim();
        assignedToColorsArray.push(backgroundColor);
        assignedToValuesArray.push(contactValue);
        assignedShortValues.push(contactText);
    }
}

/**
 * Creates a task object based on the provided category.
 *
 * @param {string} categorySelect - The selected task category.
 * @returns {Object|undefined} The created task object or undefined if the category is invalid.
 */
function createTaskObject(categorySelect) {
    if (categorySelect === 'Select task category') {
        selectCategoryNotification();
        return;
    }
    return buildTaskObject();
}

/**
 * Builds and returns a task object with various properties.
 *
 * @returns {Object} The built task object.
 */
function buildTaskObject() {
    const id = generateUniqueID();
    return {
        task_id: id,
        title: document.getElementById('title').value,
        description_text: document.getElementById('description_text').value,
        task_category: categoryArray,
        created_at: document.getElementById('createdAt').value,
        priority: priorityArray,
        subtasks: subtaskTextsArray,
        subtasks_id: subtaskIdsArray,
        subtasks_status_array: subtasksStatusArray,
        category_colors: categoryColorArray,
        assigned_to_values: assignedToValuesArray,
        assigned_to_colors: assignedToColorsArray,
        assigned_short_values: assignedShortValues,
        in_which_container: inWhichContainer.length > 0 ? inWhichContainer : 'for-To-Do-Container'
    };
}


/**
 * Gathers information about the task from user input.
 * @returns {Object} An object containing task information.
 */
function gatherTaskInfo() {
    const createdAt = document.getElementById('createdAt').value;
    const title = document.getElementById('title').value;
    return {
        title,
        createdAt,
    };
}

/**
 * Updates various arrays with the task information.
 * @param {Object} task - The task object to update arrays.
 */
async function updateArrays(task) {
    titlesArray.push(task.title);
    descriptionsArray.push(task.description_text);
    createdAtArray.push(task.created_at);
    allTasks = [];
    allTasks.push(task);
    await saveTasks();
    allTasks = [];
    await loadTasks();
}

/**
 * Empties arrays related to task information.
 */
function emptyArrays() {
    subtasksArray = [];
    categoryArray = [];
    categoryColorArray = [];
    assignedToValuesArray = [];
    assignedToColorsArray = [];
    assignedShortValues = [];
    createdAtArray = [];
    priorityArray = [];
    subtaskTextsArray = [];
    subtaskIdsArray = [];
    subtasksStatusArray = [];
}

/**
 * Finalizes the board state by showing a final notification, closing the overlay,
 * showing tasks, restoring tasks from local storage, sorting tasks into arrays, emptying arrays,
 * and clearing add task fields.
 */
function finalizeBoardState() {
    showBoardFinalNotification();
    setTimeout(() => {
        closeOverlay();
        showTasks();
        emptyArrays();
    }, 1500);
    forClearAddTaskWithBtn();
}

/**
 * Handles filled fields by gathering task information, updating arrays, and finalizing the board state.
 * @param {Object} task - The task object to handle.
 */
async function handleFilledFields(task) {
    const taskInfo = gatherTaskInfo();
    await updateArrays({ ...taskInfo, ...task });
    finalizeBoardState();
}

/**
 * Shows a notification and resets arrays based on the status of assigned values and priorities.
 */
function showNotificationAndResetArrays() {
    if (priorityArray.length === 0) {
        showPrioNotification();
        priorityArray = [];
        assignedToValuesArray = [];
        assignedToColorsArray = [];
        assignedShortValues = [];
        subtasksArray = [];
        subtasksStatusArray = [];
    } else {
        boardHideShowFinalNotification();
    }
}

/**
 * Empties arrays related to handling new categories.
 * Clears subtasks, category, category colors, assigned values, assigned colors,
 * assigned short values, and creation dates arrays.
 */
function emptyHandleNewCategoryArray() {
    subtasksArray = [];
    categoryArray = [];
    categoryColorArray = [];
    assignedToValuesArray = [];
    assignedToColorsArray = [];
    assignedShortValues = [];
    createdAtArray = [];
}

/**
 * Adds a task from the overlay, preventing the default event action and validating required fields.
 */
async function addTaskFromOverlay() {
    event.preventDefault();
    const { categorySelect, categoryColors, description, createdAt, title, newCategoryContainer, newCategoryInput, newCategoryColor, subtaskItems } = declareVariables();
    if (!newCategoryContainer.classList.contains('d-none')) {
        handleNewCategoryValidation(newCategoryInput, newCategoryColor);
    } else if (categorySelect === 'Select task category') {
        emptyHandleNewCategoryArray();
        selectCategoryNotification();
        return false;
    } else {
        pushCategoryIntoTask(categorySelect, categoryColors);
        let subtaskTextsArray = [];
        let subtaskIdsArray = [];
        collectSubtaskInfo(subtaskItems, subtaskTextsArray, subtaskIdsArray);
        extractAssigneeInfo();
        await (validateTaskFields(title, categorySelect, categoryColors, description, createdAt) 
            ? handleFilledFields(createTaskObject(categorySelect)) 
            : showNotificationAndResetArrays());
    }
}

/**
 * Pushes selected category and its color into respective arrays.
 * If the category is 'Select task category', it triggers a notification and returns false.
 * Otherwise, it pushes the category and its color into their respective arrays and returns true.
 *
 * @param {string} categorySelect - The selected category.
 * @param {string} categoryColors - The color associated with the selected category.
 * @returns {boolean} Returns true if the category and color were successfully added, otherwise false.
 */
function pushCategoryIntoTask(categorySelect, categoryColors) {
    categoryArray = [];
    categoryColorArray = [];
    if (categorySelect === 'Select task category') {
        selectCategoryNotification();
        return false;
    } else {
        categoryArray.push(categorySelect);
        categoryColorArray.push(categoryColors);
        return true;
    }
}

/**
 * Controls the entry of a task category and its associated color.
 * If both the category and color are default values, the function terminates.
 *
 * @param {string} categorySelect - The selected category.
 * @param {string} categoryColors - The color associated with the selected category.
 */
function controlCategoryEntry(categorySelect, categoryColors) {
    if (categorySelect === 'Select task category' && categoryColors === 'background-color: #FFFFFF;') {
        return;
    }
}


/**
 * Retrieves various DOM elements and their values used in task creation.
 * @returns {Object} - An object containing values of description, createdAt, title,
 * newCategoryContainer, newCategoryInput, newCategoryColor, and subtaskItems.
 */
function declareVariables() {
    const categorySelect = document.getElementById('category');
    return {
        categorySelect: categorySelect ? categorySelect.innerText.trim() : '',
        categoryColors: categorySelect ? categorySelect.querySelector('.categoryColor').style.backgroundColor : '',
        description: document.getElementById('description_text').value,
        createdAt: document.getElementById('createdAt').value,
        title: document.getElementById('title').value,
        newCategoryContainer: document.getElementById('newCategoryContainer'),
        newCategoryInput: document.getElementById('newCategoryInput'),
        newCategoryColor: document.getElementById('newCategoryColor'),
        subtaskItems: document.querySelectorAll('.subtask-item')
    };
}

/**
 * Collects information from subtask items and populates arrays.
 * @param {NodeList} subtaskItems - The list of subtask items.
 * @param {string[]} subtaskTextsArray - The array to store subtask texts.
 * @param {string[]} subtaskIdsArray - The array to store subtask IDs.
 */
function collectSubtaskInfo(subtaskItems, subtaskTextsArray, subtaskIdsArray) {
    subtaskItems.forEach(subtask => {
        const subtaskText = subtask.textContent.trim();
        const subtaskId = subtask.id;
        subtasksStatusArray.push(subtask.querySelector('.subtask-checkbox').checked);
        if (subtaskText && subtaskId) {
            subtaskTextsArray.push(subtaskText);
            subtaskIdsArray.push(subtaskId);
        }
    });
}

/**
 * Handles validation for new category input and color.
 * Shows appropriate notifications based on the validation result.
 * @param {HTMLElement} newCategoryInput - The input element for a new category.
 * @param {HTMLElement} newCategoryColor - The color element for a new category.
 */
function handleNewCategoryValidation(newCategoryInput, newCategoryColor) {
    if (newCategoryInput && !newCategoryInput.value.trim()) {
        categoryNotification();
    } else if (newCategoryColor && !newCategoryColor.style.backgroundColor) {
        categoryColorNotification();
    } else if (newCategoryInput && newCategoryInput.value.trim() && newCategoryColor && newCategoryColor.style.backgroundColor) {
        confirmCategoryNotification();
    }
}

/**
 * Validates essential task fields to ensure they are not empty.
 * @param {string} title - The title of the task.
 * @param {string} description - The description of the task.
 * @param {string} createdAt - The creation date of the task.
 * @returns {boolean} - Returns true if all required fields are non-empty,
 * including title, description, createdAt, priorityArray, and assignedToValuesArray.
 */
function validateTaskFields(title, categorySelect, categoryColors, description, createdAt) {
    return title && categorySelect && categoryColors && description && createdAt && priorityArray.length > 0;
}

/**
 * Creates a task div element with specified attributes.
 * @param {Object} task - The task object.
 * @returns {HTMLElement} The created task div element.
 */
function createTaskDiv(task) {
    const taskDiv = document.createElement('div');
    taskDiv.classList.add('task-item');
    taskDiv.setAttribute('id', `task-${task.id}`);
    taskDiv.setAttribute('draggable', true);
    taskDiv.addEventListener('dragstart', onDragStart);
    return taskDiv;
}

/**
 * Determines the target container for a task based on its status.
 * @param {Object} task - The task object.
 * @param {HTMLElement} taskContainer - The task container element.
 * @param {HTMLElement} inProgressContainer - The in-progress container element.
 * @param {HTMLElement} feedbackTaskContainer - The feedback task container element.
 * @returns {HTMLElement} The target container for the task.
 */
function determineTargetContainer(task, taskContainer, inProgressContainer, feedbackTaskContainer, doneTaskContainer) {
    let targetContainer = taskContainer;
    const inWhichContainer = task.in_which_container;
    if (inWhichContainer && inWhichContainer.includes('for-To-Do-Container'))
        targetContainer = taskContainer;
    else if (inWhichContainer && inWhichContainer.includes('in-Progress-Container'))
        targetContainer = inProgressContainer;
    else if (inWhichContainer && inWhichContainer.includes('for-Await-Feedback-Container'))
        targetContainer = feedbackTaskContainer;
    else if (inWhichContainer && inWhichContainer.includes('for-Done-Container'))
        targetContainer = doneTaskContainer;
    return targetContainer;
}

/**
 * Creates assignment balls HTML based on assigned values and colors.
 * @param {Object} task - The task object.
 * @returns {string} The HTML string for assignment balls.
 */
function createAssignmentBalls(task) {
    let assignePinnedTaskBall = '';
    if (task.assigned_to_values && task.assigned_to_values.length > 0) {
        const maxAssignmentsToShow = 3;
        const assignmentsToDisplay = task.assigned_to_values.slice(0, maxAssignmentsToShow);
        let additionalAssignmentsCount = task.assigned_to_values.length - maxAssignmentsToShow;
        assignePinnedTaskBall = processAssignments(assignmentsToDisplay, task.assigned_to_colors);
        if (additionalAssignmentsCount > 0) {
            assignePinnedTaskBall += `
                <div class="assigne-ball" style="background-color: rgb(0, 0, 0)">
                    +${additionalAssignmentsCount}
                </div>
            `;
        }
    }
    return assignePinnedTaskBall;
}

/**
 * Processes assignments and returns the HTML string for assignment balls.
 * @param {Array} assignments - An array of assignments.
 * @param {Array} colors - An array of colors.
 * @returns {string} The HTML string for assignment balls.
 */
function processAssignments(assignments, colors) {
    let assignePinnedTaskBall = '';
    assignments.forEach((assignment, index) => {
        const nameParts = assignment.trim().split(' ');
        let initials = '';
        if (nameParts.length >= 2) {
            initials = nameParts[0][0] + nameParts[1][0];
        } else if (nameParts.length === 1)
            initials = nameParts[0][0];
        const color = colors[index];
        assignePinnedTaskBall += `
            <div class="assigne-ball" style="background-color: ${color}">
                <div>${initials}</div>
            </div>
        `;
    });
    return assignePinnedTaskBall;
}

/**
 * Adds content to the task div based on task information.
 * @param {Object} task - The task object.
 * @param {HTMLElement} taskDiv - The task div element.
 * @param {string} assignePinnedTaskBall - The HTML string for assignment balls.
 * @param {string} priorityImageSrc - The source URL for the priority image.
 * @param {string} categorybackgroundColor - The background color for the category.
 */
function addContentToTaskDiv(task, taskDiv, assignePinnedTaskBall, priorityImageSrc, categorybackgroundColor, progressBarId, taskId) {
    taskDiv.innerHTML = /*html*/ `
            <div class="pinned-task-container" onclick="showTasksInOverview('${task.id}', event)">
                <div class="category-background-color" style="background-color: ${categorybackgroundColor}">
                    <div class="category-div-text">${task.task_category}</div>
                </div>
                <img src="../assets/img/dots.svg" class="navigate-tasks-mobile" onclick="toggleTaskNavigateContainer(event)">
                <div class="task-navigate-container">
                    <div class="mobile-taskcategory to-do-category">To Do</div>
                    <div class="mobile-taskcategory in-progress-category">In Progress</div>
                    <div class="mobile-taskcategory await-feedback-category">Await Feedback</div>
                    <div class="mobile-taskcategory done-category">Done</div>
                </div>
                <h3 class="pinned-task-headline">${task.title}</h3>
                <p class="pinned-task-discription">${task.description_text}</p>
                <div id="progress-div-${taskId}"></div>
                <div id="ball-and-prio-img-div" class="ball-and-prio-img-div">
                <div class="pinnedAssigneBallPosition">
                    ${assignePinnedTaskBall}
                    </div>
                    <div class="pinnedPrioPosition">
                    <div>
                        ${priorityImageSrc ? `<img class="pinnedPrioImg" src="${priorityImageSrc}" alt="Priority Image">` : ''}
                    </div>
                    </div>
                </div>
            </div>`;
}

/**
 * Initializes drag and drop functionality for drop containers.
 */
function initializeDragAndDrop() {
    const dropContainers = document.querySelectorAll('.drop-container');
    dropContainers.forEach(container => {
        container.addEventListener('drop', onDrop);
        container.addEventListener('dragover', allowDrop);
        container.addEventListener('dragleave', () => {
            container.querySelector('.drop-container > :nth-child(2)').style.backgroundColor = '';
            container.querySelector('.drop-container > :nth-child(2)').style.border = '';
            container.classList.remove('drag-over');
        });
    });
}
/**
 * Shows tasks by clearing task containers, displaying tasks, and initializing drag and drop.
 */
function showTasks() {
    const taskContainer = document.getElementById('target-to-do-table');
    const feedbackTaskContainer = document.getElementById('target-await-feedback-table');
    const inProgressContainer = document.getElementById('target-in-progress-table');
    const targetDoneTable = document.getElementById('target-done-table');
    clearTaskContainers(taskContainer, feedbackTaskContainer, inProgressContainer, targetDoneTable);
    createSpecificNoTaskDivs();
    createNoTaskDiv();
    displayTasks(taskContainer, feedbackTaskContainer, inProgressContainer, targetDoneTable);
}

/**
 * Clears the content of specified containers.
 * @param {...HTMLElement} containers - The containers to clear.
 */
function clearTaskContainers(...containers) {
    containers.forEach(container => container.innerHTML = '');
}

/**
 * Gets the source URL for the priority image based on the priority.
 * @param {string} priority - The priority string.
 * @returns {string} The source URL for the priority image.
 */
function getPriorityImageSrc(priority) {
    if (priority && priority.includes('low')) {
        return '../assets/img/Prio baja.svg';
    } else if (priority && priority.includes('medium')) {
        return '../assets/img/Prio media.svg';
    } else if (priority && priority.includes('urgent')) {
        return '../assets/img/Prio alta.svg';
    }
}