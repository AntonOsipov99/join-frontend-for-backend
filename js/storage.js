const token = '';
const STORAGE_URL = 'http://127.0.0.1:8000/join/';

let lokalUsers = [];
let summary = [];
let allTasks = [];
let users = [];
let notVisible = false;

/**
 * save User at Backend
 * @async
 * @param {string} key 
 * @param {string} value 
 * @returns 
 */
async function setItem(key, value) {
    try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`${STORAGE_URL}${key}/`, {
            method: 'POST',
            headers: {
                'Authorization': `Token ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(value)
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error setting item:', error);
        throw error;
    }
}

async function getData(storage) {
    try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(storage, {
            method: 'GET',
            headers: {
                'Authorization': `Token ${token}`,
                'Content-Type': 'application/json'
            }
        });
        if (response.status === 401) {
            localStorage.removeItem('authToken');
            window.location.href = 'login.html';
            return;
        }
        const data = await response.json();
        if (storage == CONTACT_STORAGE_URL);
        contacts = data;
        if (storage == TASKS_STORAGE_URL)
            allTasks = data;
        else if (storage == SUMMARY_STORAGE_URL)
            summary = data;
    } catch (error) {
        console.error('Error:', error);
    }
}

async function getItem(key) {
    const url = `${STORAGE_URL}${key}/`;
    const token = localStorage.getItem('authToken');
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
        }
    });
    if (response.status === 401) {
        localStorage.removeItem('authToken');
        window.location.href = '../index.html';
        return [];
    }
    const dataJson = await response.json();
    const data = [];
    if (dataJson != '') {
        for (let i = 0; i < dataJson.length; i++) {
            data.push(dataJson[i]);
        }
    } return data;
} 

async function updateTaskInBackend(backendId, updatedContactData) {
    try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`${STORAGE_URL}allTasks/${backendId}/`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Token ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contacts: updatedContactData
            })
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    } catch (error) {
        console.error('Error updating task in backend:', error);
        throw error;
    }
}

/**
 * get Username from URL
 * @returns 
 */
function getUserName() {
    const urlParams = new URLSearchParams(window.location.search);
    const msg = urlParams.get('msg');
    if (msg) {
        let userName = msg.split(',');
        return userName[1].trim();
    } else {
        return 'Guest';
    }
}


/**
 * save User at local Storage
 * @async
 */
async function saveUserToLocalStorage() {
    let emailValue = document.getElementById('email_log_in')
    let users = JSON.parse(await getItem('users'));
    let user = users.find(u => u.email == emailValue.value.toLowerCase())
    let userNumber = lokalUsers.find(l => l.email == emailValue.value.toLowerCase())
    if (userNumber != undefined) {
        lokalUsers.splice(0);
        lokalUsers.push(user);
    } else {
        lokalUsers.push(user);
    }
    localStorage.setItem('users', JSON.stringify(lokalUsers));
}

/**
 * delete User at local Storage
 */
function clearLocalStorage() {
    localStorage.removeItem('users');
}

/**
 * delete User
 * @async
 * @param {string} email 
 */
async function deleteUser(email) {
    let users = JSON.parse(await getItem('users'));
    users = users.filter(u => u.email !== email.toLowerCase());
    await setItem('users', JSON.stringify(users));
}

/**
 * save Contacts at Backend
 * @async
 */
async function saveContacts() {
    await setItem('contacts', JSON.stringify(contacts));
}

async function saveNewContact() {
    await setItem('contacts', JSON.stringify(newContact));
}

async function deleteContactFromBackend(backendId) {
    try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`${STORAGE_URL}contacts/${backendId}/`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Token ${token}`,
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    } catch (error) {
        console.error('Error deleting task from backend:', error);
        throw error;
    }
}

/**
 * load Contacts from Backend
 * @async
 */
async function loadContacts() {
    contacts = await getItem('contacts');
}

async function setContactsBackendId() {
    for (let i = 0; i < contacts.length; i++) {
        let value = [];
        value.push(contacts[i]);
        let stringifyValue = JSON.stringify(value);
        let backendId = contacts[i].backendId;
        await updateContactInBackend(backendId, stringifyValue);
    }
}

async function updateContactInBackend(backendId, value) {
    try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`${STORAGE_URL}contacts/${backendId}/`, {
            method: 'PUT',
            headers: {
                'Authorization': `Token ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contacts: value
            })
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    } catch (error) {
        console.error('Error updating task in backend:', error);
        throw error;
    }
}

/**
 * save Tasks at Backend
 * @async
 */
async function saveTasks() {
    await setItem('allTasks', allTasks[0]);
}

/**
 * load Tasks at Backend
 * @async
 */
async function loadTasks() {
    allTasks = await getItem('allTasks');
}

/**
 * Updates the task status on the server by sending a POST request with the task ID and target container ID.
 *
 * @param {string} taskId - The ID of the task to update.
 * @param {string} targetContainerId - The ID of the target container.
 */
async function updateTaskStatusOnServer(taskId, targetContainerId) {
    const payload = { key: `taskStatus_${taskId}`, value: targetContainerId };//, token: STORAGE_TOKEN
    await fetch(STORAGE_URL, { method: 'POST', body: JSON.stringify(payload) });
}

function showArrow() {
    if (notVisible == true) {
        document.getElementById("not-visible-arrow").classList.add('show-arrow');
    }
}

function redirectToSignUp() {
    localStorage.setItem('notVisible', false);
    window.location.href = './signup.html';
}

async function changeContactInBackend(backendId, value) {
    try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`${STORAGE_URL}contacts/${backendId}/`, {
            method: 'PUT',
            headers: {
                'Authorization': `Token ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contacts: value
            })
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response;
    } catch (error) {
        console.error('Error updating task in backend:', error);
        throw error;
    }
}
