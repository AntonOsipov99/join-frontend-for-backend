/**
 * Initialize the application.
 */
async function init() {
    await loadTasks();
    await loadContacts();
    generateSideBar();
    clickEventlisteners();
    createContactDropdown();
    getRandomColor();
    assignOptionIDs();
    setMinDate();
}

let selectedPrioButton = null;
let titlesArray = [];
let descriptionsArray = [];
let assignedToValuesArray = [];
let assignedToColorsArray = [];
let createdAtArray = [];
let priorityArray = [];
let categoryArray = [];
let categoryColorArray = [];
let subtasksArray = [];
let subTasks = [];
let assignedToIDsArray = [];
let assignedShortValues = [];
let subtaskTextsArray = [];
let subtaskIdsArray = [];
let subtasksStatusArray = [];

/**
 * add new Task to Board
 */
function addTask() {
    event.preventDefault();
    const title = document.getElementById('title').value;
    const description = document.getElementById('description_text').value;
    const createdAt = document.getElementById('createdAt').value;
    const subtaskItems = document.querySelectorAll('.subtask-item');
    const { categoryInfo } = getCategoryInfo();
    const { categoryColor } = getCategoryColor();
    if (!document.getElementById('newCategoryContainer').classList.contains('d-none')) {
        handleNewCategoryValidation(
            document.getElementById('newCategoryInput'),
            document.getElementById('newCategoryColor')
        );
    }
    processTask(
        title,
        description,
        createdAt,
        document.getElementById('createdAt'),
        document.getElementById('title'),
        document.getElementById('description_text'),
        document.getElementById('subtaskInput'),
        subtaskItems,
        categoryInfo,
        categoryColor
    );
}

/**
 * Handles the validation for a new category.
 *
 * @param {HTMLInputElement} newCategoryInput - The input field for the new category.
 * @param {HTMLElement} newCategoryColor - The element representing the color of the new category.
 */
function handleNewCategoryValidation(newCategoryInput, newCategoryColor) {
    if (!newCategoryInput.value.trim()) {
        categoryNotification();
        return;
    }
    if (!newCategoryColor.style.backgroundColor) {
        categoryColorNotification();
        return;
    }
    if (newCategoryInput.value.trim() && newCategoryColor.style.backgroundColor) {
        confirmCategoryNotification();
        return;
    }
}

/**
 * Processes a task based on provided inputs and performs necessary validations.
 *
 * @param {string} title - The title of the task.
 * @param {string} description - The description of the task.
 * @param {string} createdAt - The creation date of the task.
 * @param {HTMLInputElement} createdAtInput - The input field for the task's creation date.
 * @param {HTMLInputElement} titleInput - The input field for the task's title.
 * @param {HTMLInputElement} descriptionInput - The input field for the task's description.
 * @param {HTMLInputElement} subtaskInput - The input field for subtasks.
 * @param {NodeListOf<Element>} subtaskItems - The list of subtask elements.
 */
function processTask(title, description, createdAt, createdAtInput, titleInput, descriptionInput, subtaskInput, subtaskItems, categoryInfo, categoryColor) {
    getValueForTaskContacts();
    if (title && description && createdAt && priorityArray.length > 0) {
        createTask(title, description, createdAt, createdAtInput, titleInput, descriptionInput, subtaskInput, subtaskItems, categoryInfo, categoryColor);
        checkUpNewCategory();
    } else {
        showNotification();
    }
}

/**
 * Empties the arrays related to task categories, subtasks, and assignments.
 * Resets arrays used for category, subtask, and assignment details.
 */
function emptyArrayForPrio() {
    categoryArray = [];
    categoryColorArray = [];
    subtaskTextsArray = [];
    subtaskIdsArray = [];
    subtasksStatusArray = [];
    categoryColorArray = [];
    assignedToValuesArray = [];
    assignedToColorsArray = [];
    assignedShortValues = [];
}


/**
 * Check and handle new category validation.
 */
function checkUpNewCategory() {
    if (!newCategoryContainer.classList.contains('d-none')) {
        if (newCategoryInput && !newCategoryInput.value.trim()) {
            categoryNotification();
            emptyArrayForPrio();
            return;
        }
        if (newCategoryColor && !newCategoryColor.style.backgroundColor) {
            categoryColorNotification();
            emptyArrayForPrio();
            return;
        }
        if (newCategoryInput && newCategoryInput.value.trim() && newCategoryColor && newCategoryColor.style.backgroundColor) {
            confirmCategoryNotification();
            emptyArrayForPrio();
            return;
        }
    }
}

/**
 * Extracts information from a subtask element and adds it to global arrays.
 *
 * @param {HTMLElement} subtask - The subtask element.
 */
function extractSubtaskInfo(subtask) {
    const subtaskText = subtask.textContent.trim();
    const subtaskId = subtask.id;
    subtasksStatusArray.push(subtask.querySelector('.subtask-checkbox').checked);
    if (subtaskText && subtaskId) {
        subtaskTextsArray.push(subtaskText);
        subtaskIdsArray.push(subtaskId);
    }
}

/**
 * Retrieves category information from the DOM.
 *
 * @returns {{category: string, categoryColor: string}} - The category and its color.
 */
function getCategoryInfo() {
    const categorySelect = document.getElementById('category');
    const categoryInfo = categorySelect ? categorySelect.innerText.trim() : '';
    return { categoryInfo };
}

/**
 * Retrieves the background color of the selected category.
 *
 * @returns {Object} An object containing the background color of the selected category.
 * @property {string} categoryColor - The background color of the selected category.
 */
function getCategoryColor() {
    const categorySelect = document.getElementById('category');
    const categoryColor = categorySelect ? categorySelect.querySelector('.categoryColor').style.backgroundColor : '';
    return { categoryColor };
}

/**
 * Handles invalid task categories by displaying a notification.
 *
 * @param {string} category - The task category.
 * @returns {boolean} - Returns true if the category is invalid, otherwise false.
 */
function handleInvalidCategory(categoryInfo) {
    if (categoryInfo === 'Select task category') {
        emptyArrayCategory();
        selectCategoryNotification();
        return true;
    }
    return false;
}

/**
 * Empties arrays related to categories, subtasks, and assignments.
 * Resets arrays used for category details, subtasks, and assignments.
 */
function emptyArrayCategory() {
    categoryArray = [];
    categoryColorArray = [];
    subtaskTextsArray = [];
    subtaskIdsArray = [];
    subtasksStatusArray = [];
    categoryColorArray = [];
    assignedToValuesArray = [];
    assignedToColorsArray = [];
    assignedShortValues = [];
}

/**
 * Creates and saves a task using provided parameters.
 *
 * @param {string} title - The task title.
 * @param {string} description - The task description.
 * @param {string} createdAt - The task creation date.
 * @param {string} category - The task category.
 * @param {string} categoryColor - The color associated with the task category.
 * @param {HTMLElement} subtaskInput - The input field for subtasks.
 * @param {Array<HTMLElement>} subtaskItems - Array of subtask elements.
 */
function createAndSaveTask(title, description, createdAt, subtaskInput, subtaskItems, categoryInfo, categoryColor) {
    pushAndSaveTaskToUser(title, description, createdAt, subtaskInput, subtaskItems, categoryInfo, categoryColor);
}

/**
 * Resets input and subtask-related fields.
 *
 * @param {HTMLElement} createdAtInput - The input field for task creation date.
 * @param {HTMLElement} titleInput - The input field for task title.
 * @param {HTMLElement} descriptionInput - The input field for task description.
 * @param {HTMLElement} subtaskInput - The input field for subtasks.
 * @param {HTMLElement} subtaskList - The list element containing subtasks.
 */
function resetInputAndSubtaskFields(createdAtInput, titleInput, descriptionInput, subtaskInput, subtaskList) {
    resetInputFields(createdAtInput, titleInput, descriptionInput, subtaskInput, subtaskList);
    resetSubTaskItems();
}

/**
 * Handles the final steps of task handling, including style adjustments and notifications.
 *
 */
function finalizeTaskHandling() {
    removeStylefromPrirorityButton();
    addStylefromPrirorityButton();
    showFinalNotification();
    setTimeout(() => {
        redirectToBoard();
    }, 1600);
    clearInputFields();
}

/**
 * Orchestrates the process of creating a task by calling relevant functions.
 *
 * @param {string} title - The task title.
 * @param {string} description - The task description.
 * @param {string} createdAt - The task creation date.
 * @param {HTMLElement} createdAtInput - The input field for task creation date.
 * @param {HTMLElement} titleInput - The input field for task title.
 * @param {HTMLElement} descriptionInput - The input field for task description.
 * @param {HTMLElement} subtaskInput - The input field for subtasks.
 * @param {Array<HTMLElement>} subtaskItems - Array of subtask elements.
 */
function createTask(title, description, createdAt, createdAtInput, titleInput, descriptionInput, subtaskInput, subtaskItems, categoryInfo, categoryColor) {
    subtaskItems.forEach(extractSubtaskInfo);
    if (handleInvalidCategory(categoryInfo)) {
        return;
    }
    createAndSaveTask(title, description, createdAt, subtaskInput, subtaskItems, categoryInfo, categoryColor,);
    resetInputAndSubtaskFields(createdAtInput, titleInput, descriptionInput, subtaskInput, subtaskList);
    finalizeTaskHandling();
}


/**
 * Get value of assignee Contacts
 */
function getValueForTaskContacts() {
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
 * set stats of task
 * @param {title value} title 
 * @param {description value} description 
 * @param {category for task} category 
 * @param {due date of task} createdAt 
 * @returns 
 */
function createTaskArray(title, description, createdAt, categoryInfo, categoryColor) {
    const id = generateUniqueID();
    let task = {
        id: id,
        title: title,
        description_text: description,
        task_category: categoryInfo,
        createdAt: createdAt,
        priority: priorityArray,
        subtasks: subtaskTextsArray,
        subtasksId: subtaskIdsArray,
        subtasksStatusArray: subtasksStatusArray,
        categoryColors: categoryColorArray,
        assignedToValues: assignedToValuesArray,
        assignedToColors: assignedToColorsArray,
        assignedShortValues: assignedShortValues,
    };
    return task;
}

/**
 * push and save task for user
 * @param {title value} title 
 * @param {description value} description 
 * @param {due date of task} createdAt 
 * @param {category for task} category 
 * @param {color of category} categoryColor 
 */
function pushAndSaveTaskToUser(title, description, createdAt, subtaskInput, subtaskItems, categoryInfo, categoryColor) {
    if (title && description && createdAt && categoryInfo && categoryColor) {
        let task = createTaskArray(title, description, createdAt, categoryInfo, categoryColor);
        titlesArray.push(title);
        descriptionsArray.push(description);
        categoryColorArray.push(categoryColor);
        allTasks.push(task);
        saveTasks();
    }
}

/**
 * reset inputfields
 * @param {ID Element of due date} createdAtInput 
 * @param {ID Element of title} titleInput 
 * @param {ID Element of description} descriptionInput 
 * @param {ID Element of subtask input} subtaskInput 
 * @param {ID Element of subtask list} subtaskList 
 */
function resetInputFields(createdAtInput, titleInput, descriptionInput, subtaskInput, subtaskList) {
    createdAtInput.value = '';
    titleInput.value = '';
    descriptionInput.value = '';
    subtaskInput.value = '';
    subtaskList.innerHTML = '';
}

/**
 * reset Subtasks
 */
function resetSubTaskItems() {
    let subtaskItems = document.getElementsByClassName('subtask-item');
    for (let i = 0; i < subtaskItems.length; i++) {
        subtaskItems[i].innerHTML = '';
    }
}

/**
 * reset style from prirorty Button
 */
function removeStylefromPrirorityButton() {
    const urgentBtn = document.getElementById('normal_urgent_btn');
    const mediumBtn = document.getElementById('normal_medium_btn');
    const lowBtn = document.getElementById('normal_low_btn');
    if (urgentBtn) 
        urgentBtn.classList.remove('d-none');
    if (mediumBtn)
        mediumBtn.classList.remove('d-none');
    if (lowBtn)
        lowBtn.classList.remove('d-none');
}



/**
 * add style from prirorty Button
 */
function addStylefromPrirorityButton() {
    const clickedUrgentBtn = document.getElementById('clicked_urgent_btn');
    const clickedMediumBtn = document.getElementById('clicked_medium_btn');
    const clickedLowBtn = document.getElementById('clicked_low_btn');
    if (clickedUrgentBtn)
        clickedUrgentBtn.classList.add('d-none');
    if (clickedMediumBtn)
        clickedMediumBtn.classList.add('d-none');
    if (clickedLowBtn)
        clickedLowBtn.classList.add('d-none');
}

/**
 * notfication of emptyinput
 */
function showNotification() {
    if (priorityArray.length === 0) {
        showPrioNotification();
        resetTaskInformation();
    } else {
        showFinalNotification();
    }
}

/**
 * reset style from prirorty Button
 */
function addStylefromPrirorityButton() {
    const urgentBtn = document.getElementById('clicked_urgent_btn');
    const mediumBtn = document.getElementById('clicked_medium_btn');
    const lowBtn = document.getElementById('clicked_low_btn');
    if (urgentBtn)
        urgentBtn.classList.add('d-none');
    if (mediumBtn)
        mediumBtn.classList.add('d-none');
    if (lowBtn)
        lowBtn.classList.add('d-none');
}

/**
 * reset Task Information
 */
function resetTaskInformation() {
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
 * generate a unique ID
 * @returns random ID
 */
function generateUniqueID() {
    return '_' + Math.random().toString(36).substr(2, 9);
}

/**
 * Sets up click event listeners for priority buttons and category dropdown interactions.
 */
function clickEventlisteners() {
    ['urgent', 'medium', 'low'].forEach((priority) => {
        document.getElementById(`normal_${priority}_btn`).addEventListener('click', (event) => {
            event.preventDefault();
            handlePrioButtonClick(priority);
        });
    });
    document.getElementById('category').onclick = closeCategoryDropdown;
    document.addEventListener('click', function (event) {
        var categoryDiv = document.getElementById('category');
        var targetElement = event.target;
        if (targetElement !== categoryDiv && !categoryDiv.contains(targetElement)) {
            closeCategoryDropdown();
        }
    });
}

/**
 * Setting a minimum selectable date
 */
function setMinDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const currentDate = `${year}-${month}-${day}`;
    document.getElementById('createdAt').min = currentDate;
}

/**
 * Resets the assigned field by programmatically triggering a click event on each assignee ball.
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
 * Clears various input fields and performs additional cleanup actions.
 */
function clearInputFields() {
    clearSubtasks();
    resetAssignedField();
    cancelNewCategory();
    closeCategoryDropdown();
    resetTaskInformation();
    clear();
    clearSubtasks();
}