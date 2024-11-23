function clearInputFields() {
    cancelNewCategory();
    closeCategoryDropdown();
    resetTaskInformation();
    resetToClickedButton();
    resetToNormalButton();
    const titleInput = document.getElementById('title');
    const descriptionInput = document.getElementById('description_text');
    titleInput.value = '';
    descriptionInput.value = '';
    const assignedToSelect = document.getElementById('which_assigned_contact');
    assignedToSelect.selectedIndex = 0;
    const dueDateInput = document.getElementById('createdAt');
    dueDateInput.value = '';
    const subtask = document.getElementById('subtaskList');
    subtask.innerHTML = '';
    resetAssignedField();
}

