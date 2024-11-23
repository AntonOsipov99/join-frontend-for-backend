/**
 * Adds click event listeners to priority buttons in the add task overlay.
 */
function addTaskOverlayClickEventlisteners() {
    document.getElementById('addTask_overlay_urgent_btn').addEventListener('click', (event) => {
        event.preventDefault();
        handleBoardPrioButtonClick('urgent');
    });
    document.getElementById('addTask_overlay_medium_btn').addEventListener('click', (event) => {
        event.preventDefault();
        handleBoardPrioButtonClick('medium');
    });
    document.getElementById('addTask_overlay_low_btn').addEventListener('click', (event) => {
        event.preventDefault();
        handleBoardPrioButtonClick('low');
    });
}

/**
 * Handles the click event for a priority button in the add task overlay.
 * @param {string} prio - The priority value ('urgent', 'medium', or 'low').
 */
function handleBoardPrioButtonClick(prio) {
    priorityArray = [];
    if (selectedPrioButton === prio) {
        selectedPrioButton = null;
        resetPriorityButtons(prio);
        const index = priorityArray.indexOf(prio);
        if (index !== -1)
            priorityArray.splice(index, 1);
    } else {
        if (selectedPrioButton)
            resetPriorityButtons(selectedPrioButton);
        selectedPrioButton = prio;
        document.getElementById(`addTask_overlay_${prio}_btn`).classList.add('d-none');
        document.getElementById(`addTask_overlay_clicked_${prio}_btn`).classList.remove('d-none');
        priorityArray.push(prio);
    }
}
