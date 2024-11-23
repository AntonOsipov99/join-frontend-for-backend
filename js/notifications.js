/**
 * Displays the final notification on the board.
 */
function showFinalNotification() {
    const noteWindow = document.getElementById('noteWindow');
    const notificationBackground = document.getElementById('show_final_notification_background');
    const notification = document.getElementById('show_final_notification');
    notificationBackground.style.display = 'flex';
    notification.style.display = 'flex';
    noteWindow.style.display = 'flex';
    setTimeout(() => {
        notificationBackground.style.opacity = '1';
        notification.style.opacity = '1';
    }, 100);
    setTimeout(() => {
        HideShowFinalNotification();
    }, 1000);
}

/**
 * Hides the final notification on the board.
 */
function HideShowFinalNotification() {
    const notificationBackground = document.getElementById('show_final_notification_background');
    const notification = document.getElementById('show_final_notification');
    notificationBackground.style.opacity = '0';
    notification.style.opacity = '0';
    setTimeout(() => {
        notificationBackground.style.display = 'none';
        notification.style.display = 'none';
    }, 500);
}

/**
 * Displays the confirmation notification for category selection.
 */
function confirmCategoryNotification() {
    const button = document.getElementById('category_confirm_btn');
    const noteWindow = document.getElementById('noteWindow');
    const notification = document.getElementById('confirm_category_notification');
    notification.style.display = 'block';
    noteWindow.style.display = 'flex';
    if (window.innerWidth <= 850)
        button.style.display = 'none'
    if (window.innerWidth > 850)
        button.style.display = 'inline-block'
        setTimeout(() => notification.style.opacity = '1', 100);
        setTimeout(HideConfirmedCategoryNotification, 4000);        
}

/**
 * Hides the confirmation notification for category selection.
 */
function HideConfirmedCategoryNotification() {
    const noteWindow = document.getElementById('noteWindow');
    const notification = document.getElementById('confirm_category_notification');
    notification.style.opacity = '0';
    setTimeout(() => {
        notification.style.display = 'none';
    }, 500);
}

/**
 * Displays the notification for priority selection.
 */
function showPrioNotification() {
    const button = document.getElementById('select_prio_btn');
    const noteWindow = document.getElementById('noteWindow');
    const notification = document.getElementById('prio_notification');
    notification.style.display = 'block';
    noteWindow.style.display = 'flex';
    if (window.innerWidth <= 850)
        button.style.display = 'none'
    if (window.innerWidth > 850)
        button.style.display = 'inline-block'
        setTimeout(() => notification.style.opacity = '1', 100);
        setTimeout(prioHideNotification, 4000); 
}

/**
 * Hides the notification for priority selection.
 */
function prioHideNotification() {
    const noteWindow = document.getElementById('noteWindow');
    const notification = document.getElementById('prio_notification');
    notification.style.opacity = '0';
    setTimeout(() => {
        notification.style.display = 'none';
    }, 500);
}

/**
 * Displays the notification for category selection.
 */
function selectCategoryNotification() {
    const button = document.getElementById('select_category_btn');
    const noteWindow = document.getElementById('noteWindow');
    const notification = document.getElementById('select_category_notification');
    noteWindow.style.display = 'flex';
    notification.style.display = 'flex';
    notification.style.justifyContent = 'center';
    notification.style.alignItems = 'center';
    if (window.innerWidth <= 850)
        button.style.display = 'none'
    if (window.innerWidth > 850)
        button.style.display = 'inline-block'
        setTimeout(() => notification.style.opacity = '1', 100);
        setTimeout(selectCategoryHideNotification, 4000);        
}

/**
 * Hides the notification for category selection.
 */
function selectCategoryHideNotification() {
    const notification = document.getElementById('select_category_notification');
    notification.style.opacity = '0';
    setTimeout(() => {

        notification.style.display = 'none';
    }, 500);
}

/**
 * Displays the final notification on the board.
 */
function showBoardFinalNotification() {
    const noteWindow = document.getElementById('noteWindow');
    const notificationBackground = document.getElementById('show_final_board_notification_background');
    const notification = document.getElementById('show_final_board_notification');
    noteWindow.style.display = 'flex';
    notificationBackground.style.display = 'flex';
    notification.style.display = 'flex';
    notification.style.alignItems = 'center';
    notification.style.justifyContent = 'center';
    setTimeout(() => {
        notificationBackground.style.opacity = '1';
        notification.style.opacity = '1';
    }, 100);
    setTimeout(boardHideShowFinalNotification, 1500);
}

/**
 * Hides the final notification on the board.
 */
function boardHideShowFinalNotification() {
    const noteWindow = document.getElementById('noteWindow');
    const notificationBackground = document.getElementById('show_final_board_notification_background');
    const notification = document.getElementById('show_final_board_notification');
    notificationBackground.style.opacity = '0';
    notification.style.opacity = '0';
    setTimeout(() => {
        notificationBackground.style.display = 'none';
        notification.style.display = 'none';
    }, 500);
    if (window.innerWidth <= 850)
        resetFlexDirection(notification);
}

/**
 * Displays the notification for category color selection.
 */
function categoryColorNotification() {
    const noteWindow = document.getElementById('noteWindow');
    const notification = document.getElementById('category_color_notification');
    const button = document.getElementById('category_color_btn');
    if (window.innerWidth <= 850)
        button.style.display = 'none'
    if (window.innerWidth > 850)
        button.style.display = 'inline-block'
    noteWindow.style.display = 'flex';
    notification.style.display = 'flex';
    notification.style.alignItems = 'center';
    notification.style.justifyContent = 'center';
    setTimeout(() => notification.style.opacity = '1', 100);
    setTimeout(categoryColorHideNotification, 4000);
}

/**
 * Hides the notification for category color selection.
 */
function categoryColorHideNotification() {
    const noteWindow = document.getElementById('noteWindow');
    const notification = document.getElementById('category_color_notification');
    notification.style.opacity = '0';
    setTimeout(() => {
        notification.style.display = 'none';
    }, 500);
    if (window.innerWidth <= 850) {
        resetFlexDirection(notification);
    }
}

/**
 * Displays the notification for category selection.
 */
function categoryNotification() {
    const noteWindow = document.getElementById('noteWindow');
    const notification = document.getElementById('category_notification');
    const button = document.getElementById('category_board_btn');
    if (window.innerWidth <= 850)
        button.style.display = 'none'
    if (window.innerWidth > 850)
        button.style.display = 'inline-block'
    noteWindow.style.display = 'flex';
    notification.style.display = 'flex';
    notification.style.alignItems = 'center';
    notification.style.justifyContent = 'center';
    setTimeout(() => notification.style.opacity = '1', 100);
    setTimeout(categoryHideNotification, 4000);    
}

/**
 * Hides the notification for category selection.
 */
function categoryHideNotification() {
    const notification = document.getElementById('category_notification');
    notification.style.opacity = '0';
    setTimeout(() => {
        notification.style.display = 'none';
    }, 500);
    if (window.innerWidth <= 850) {
        resetFlexDirection(notification);
    }
}

/**
 * Resets the flex direction of the notification after hiding.
 * @param {HTMLElement} notification - The notification element.
 */
function resetFlexDirection(notification) {
    setTimeout(() => {
        notification.style.flexDirection = 'row';
    }, 500);
}