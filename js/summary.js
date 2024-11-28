/**
 * initialize first Steps for the Page
 * @async
 */
async function initSummary() {
    await loadTasks();
    generateSideBar();
    generateUserName();
    fillSummary();
}

/**
 * on Mouse over
 * @param {string} id 
 * @param {string} section 
 * @param {string} imgSrc 
 */
function hoverOverSummaryTasks(id, section, imgSrc) {
    document.getElementById(`${id}`).classList.remove('summary-progress-none-hover');
    document.getElementById(`${id}_count`).classList.remove('color-000000');
    document.getElementById(`${id}_section`).classList.remove('color-2A3647');
    document.getElementById(`${id}`).classList.add('summary-progress-hover');
    document.getElementById(`${id}_count`).classList.add('color-FFFFFF');
    document.getElementById(`${id}_section`).classList.add('color-FFFFFF');
    if (section == 'to_do_and_done')
        hoverOverToDoAndDone(id, imgSrc);
    if (section == 'urgend-tasks') 
        hoverOverUrgendTask(id);
    if (section == 'summary-task-board')
        hoverOverTaskCounts(id);
}

/**
 * 
 * @param {string} id 
 * @param {string} imgSrc 
 */
function hoverOverToDoAndDone(id, imgSrc) {
    document.getElementById(`${id}`).classList.remove('to-do-and-done-taskarea');
    document.getElementById(`${id}`).classList.add('to-do-and-done-taskarea-hover');
    document.getElementById(`${id}_img`).src = `../assets/img/summary_${imgSrc}_hover.svg`;
}

/**
 * 
 * @param {string} id 
 */
function hoverOverUrgendTask(id) {
    document.getElementById(`${id}_taskfield`).classList.remove('summary-urgend');
    document.getElementById(`${id}_date`).classList.remove('color-2A3647');
    document.getElementById(`${id}_deadline`).classList.remove('color-2A3647');
    document.getElementById(`${id}_taskfield`).classList.add('summary-urgend-hover');
    document.getElementById(`${id}_date`).classList.add('color-FFFFFF');
    document.getElementById(`${id}_deadline`).classList.add('color-FFFFFF');
}

/**
 * 
 * @param {string} id 
 */
function hoverOverTaskCounts(id) {
    document.getElementById(`${id}`).classList.remove('urgent-task-overview');
    document.getElementById(`${id}`).classList.add('urgent-task-overview-hover');
}

/**
 * on Mouse leave
 * @param {string} id 
 * @param {string} section 
 * @param {string} imgSrc 
 */
function hoverLeaveSummaryTasks(id, section, imgSrc) {
    document.getElementById(`${id}`).classList.remove('summary-progress-hover');
    document.getElementById(`${id}_count`).classList.remove('color-FFFFFF');
    document.getElementById(`${id}_section`).classList.remove('color-FFFFFF');
    document.getElementById(`${id}`).classList.add('summary-progress-none-hover');
    document.getElementById(`${id}_count`).classList.add('color-000000');
    document.getElementById(`${id}_section`).classList.add('color-2A3647');
    if (section == 'to_do_and_done')
        hoverLeaveToDoAndDone(id, imgSrc);
    if (section == 'urgend-tasks')
        hoverLeaveUrgendTask(id);
    if (section == 'summary-task-board') 
        hoverLeaveTaskCounts(id);
}

/**
 * Leave To and Done
 * @param {string} id 
 * @param {string} imgSrc 
 */
function hoverLeaveToDoAndDone(id, imgSrc) {
    document.getElementById(`${id}`).classList.remove('to-do-and-done-taskarea-hover');
    document.getElementById(`${id}`).classList.add('to-do-and-done-taskarea');
    document.getElementById(`${id}_img`).src = `../assets/img/summary_${imgSrc}.svg`;
}

/**
 * Leave Urgend Tasks
 * @param {string} id 
 */
function hoverLeaveUrgendTask(id) {
    document.getElementById(`${id}_taskfield`).classList.remove('summary-urgend-hover');
    document.getElementById(`${id}_date`).classList.remove('color-FFFFFF');
    document.getElementById(`${id}_deadline`).classList.remove('color-FFFFFF');
    document.getElementById(`${id}_taskfield`).classList.add('summary-urgend');
    document.getElementById(`${id}_date`).classList.add('color-2A3647');
    document.getElementById(`${id}_deadline`).classList.add('color-2A3647');
}

/**
 * 
 * @param {string} id 
 */
function hoverLeaveTaskCounts(id) {
    document.getElementById(`${id}`).classList.remove('urgent-task-overview-hover');
    document.getElementById(`${id}`).classList.add('urgent-task-overview');
}

/**
 * Summary Animation
 */
function playSummaryGreetingAnimation() {
    setTimeout(function () {
        let greetingUser = document.getElementById('greeting_user');
        let greetingBackground = document.getElementById('greeting_background');
        let greetingUserBackground = document.getElementById('greeting_user_background');
        greetingUser.style.animation = 'reduceGreeting 2s ease-in-out forwards'
        greetingBackground.style.animation = 'reduceGreetingBg 2s ease-in-out forwards'
        greetingUserBackground.style.animation = 'reduceGreeting 2s ease-in-out forwards'
    }, 500)
}

/**
 * generate Name for greeting
 */
function generateUserName() {
    let userName = getUserName()
    let greeting = getGreeting();
    document.getElementById('user_name').innerHTML = `${userName}`;
    document.getElementById('user_greeting').innerHTML = `${greeting}`;
    playSummaryGreetingAnimation();
}

/**
 * generate Greeting
 * @returns 
 */
function getGreeting() {
    const now = new Date();
    const currentHour = now.getHours();
    if (currentHour >= 0 && currentHour < 12) {
        return "Good morning,";
    } else if (currentHour >= 12 && currentHour < 18) {
        return "Good afternoon,";
    } else 
        return "Good evening,";
    
}

/**
 * open Board
 */
function openTaskBoard() {
    let userName = getUserName();
    window.location.href = `board.html?msg=Welcomme to Join, ${userName}`;
}

/**
 * fill Summary
 * @async
 */
async function fillSummary() {
    let userName = getUserName();
    document.getElementById('user_name').innerHTML = userName;
    let containerCounts = {
        'for-To-Do-Container': 0,
        'in-Progress-Container': 0,
        'for-Await-Feedback-Container': 0,
        'for-Done-Container': 0
    };
    for (let i = 0; i < allTasks.length; i++) {
        let containerName = allTasks[i]['inWhichContainer'];
        if (containerCounts.hasOwnProperty(containerName))
            containerCounts[containerName]++;
    }
    document.getElementById('to_do_count').textContent = containerCounts['for-To-Do-Container'];
    document.getElementById('task_progress_count').textContent = containerCounts['in-Progress-Container'];
    document.getElementById('task_feedback_count').textContent = containerCounts['for-Await-Feedback-Container'];
    document.getElementById('done_count').textContent = containerCounts['for-Done-Container'];
    countUrgent();
}

// let urgentTasks = oneTask['priority'];
// let howManyUrgentTasks = [];
/**
 * Count Tasks for Summary
 * @param {string} user 
 * @param {string} taskcategory 
 * @param {string} status 
 * @param {string} containerID 
 */
function countUrgent() {
    let taskCount = 0;
    let urgentCount = 0;
    for (let i = 0; i < allTasks.length; i++) {
        const task = allTasks[i];
        if (task['priority'] != '') {
            taskCount++;
            if (task['priority'] == 'urgent') {
                urgentCount++;
                findDueDate();
            }
        }
    }
    document.getElementById('task_board_count').innerHTML = taskCount;
    document.getElementById('urgend_count').innerHTML = urgentCount;
}

/**
 * Count Task Category
 * @param {string} user 
 * @param {string} containerID 
 * @param {string} category 
 */
function countTasks(containerID, category) {
document.getElementById(containerID).innerHTML = taskCounter.length;
}

/**
 * Count all Tasks
 * @param {string} user 
 * @param {string} containerID 
 */
function countBoardTasks(containerID) {
    let taskAtBoard = 0;
    for (let i = 0; i < allTasks.length; i++) {
        taskAtBoard++
    }
    document.getElementById(containerID).innerHTML = taskAtBoard;
}

/**
 * Find Due Date
 * @param {string} user 
 * @returns 
 */
function findDueDate() {
    let urgendDate = document.getElementById('urgend_date');
    let closestDate = Infinity;
    for (let i = 0; i < allTasks.length; i++) {
        if (allTasks[i]['priority'] == 'urgent') {            
            let task = new Date(allTasks[i]['createdAt']);
            if (task < closestDate || closestDate === null)
                closestDate = task;
        }
    }
    if (closestDate == Infinity)
        return;
     else
        urgendDate.innerHTML = closestDate.toLocaleDateString();
}