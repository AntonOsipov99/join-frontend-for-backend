const STORAGE_TOKEN = '6JWGFSP8ZA4Y8JE2FOVSN7ZO8Z67IFY8GHNHPA6B'
const STORAGE_URL = 'http://127.0.0.1:8000/join/';

let lokalUsers = [];
let summary = [];
let allTasks = [];
let sortTasks = {
    'toDo': '',
    'progress': '',
    'feedback': '',
    'done': '',
}

//------------------------------------------------------------------------------//
//-----------------------------save User at Backend-----------------------------//
//------------------------------------------------------------------------------//

/**
 * save User at Backend
 * @async
 * @param {string} key 
 * @param {string} value 
 * @returns 
 */
async function setItem(key, value) {
    try {
        const response = await fetch(`${STORAGE_URL}${key}/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Falls Sie CSRF-Token verwenden:
                // 'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value,
            },
            body: JSON.stringify({
                [key]: value
            })
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
        const response = await fetch(storage);
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
    const response = await fetch(url);
    const dataJson = await response.json();
    const data = [];
    if (dataJson != '') {
        for (let i = 0; i < dataJson.length; i++) {
            if (dataJson) {
                let oneData = (dataJson[i][key]);
                let parsedData = JSON.parse(oneData);
                parsedData = parsedData.map(task => ({
                    ...task,
                    backendId: dataJson[i].id
                }));
                data.push(...parsedData);
            }
        }
    } return data
}

async function updateTaskInBackend(backendId, updatedContactData) {
    try {
        const response = await fetch(`${STORAGE_URL}allTasks/${backendId}/`, {
            method: 'PATCH',
            headers: {
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

//------------------------------------------------------------------------------//
//-----------------------------get User from Backend----------------------------//
//------------------------------------------------------------------------------//



//------------------------------------------------------------------------------//
//-----------------------------get Username from URL----------------------------//
//------------------------------------------------------------------------------//

/**
 * get Username from URL
 * @returns 
 */
function getUserName() {
    const urlParams = new URLSearchParams(window.location.search);
    const msg = urlParams.get('msg');
    if (msg) {
        let userName = msg.split(',');
        return userName[1];
    } else {
        return 'Guest'
    }
}


//------------------------------------------------------------------------------//
//----------------------------load User from Backend----------------------------//
//------------------------------------------------------------------------------//

/**
 * load User from Backend
 * @async
 * @returns 
 */
async function loadUsers() {
    try {
        let users = JSON.parse(await getItem('users'));
        return users
    } catch (e) {
        console.error('Loading error:', e);
    }
}


//------------------------------------------------------------------------------//
//-------------------------load User from local Storage-------------------------//
//------------------------------------------------------------------------------//

/**
 * load User from local Storage
 * @returns 
 */
function loadUsersFromLocalStorage() {
    return lokalUsers = JSON.parse(localStorage.getItem('users')) || [];
}


//------------------------------------------------------------------------------//
//--------------------------save User at local Storage--------------------------//
//------------------------------------------------------------------------------//

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

//------------------------------------------------------------------------------//
//-------------------------delete User at local Storage-------------------------//
//------------------------------------------------------------------------------//

/**
 * delete User at local Storage
 */
function clearLocalStorage() {
    localStorage.removeItem('users');
}


//------------------------------------------------------------------------------//
//----------------------------------delete User---------------------------------//
//------------------------------------------------------------------------------//

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


//------------------------------------------------------------------------------//
//---------------------------save Contacts at Backend---------------------------//
//------------------------------------------------------------------------------//

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
        const response = await fetch(`${STORAGE_URL}contacts/${backendId}/`, {
            method: 'DELETE',
            headers: {
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

//------------------------------------------------------------------------------//
//--------------------------load Contacts from Backend--------------------------//
//------------------------------------------------------------------------------//

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

// async function getItem(key) {
//     const url = `${STORAGE_URL}${key}/`;
//     const response = await fetch(url);
//     const dataJson = await response.json();
//     const data = [];
//     if (dataJson != '') {
//         for (let i = 0; i < dataJson.length; i++) {
//             if (dataJson) {
//                 let oneData = (dataJson[i][key]);
//                 let parsedData = JSON.parse(oneData);
//                 parsedData = parsedData.map(task => ({
//                     ...task,
//                     backendId: dataJson[i].id
//                 }));
//                 data.push(...parsedData);
//             }
//         }
//     } return data
// }

async function updateContactInBackend(backendId, value) {
    try {
        const response = await fetch(`${STORAGE_URL}contacts/${backendId}/`, {
            method: 'PUT',
            headers: {
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


async function changeContactInBackend(backendId, value) {
    try {
        const response = await fetch(`${STORAGE_URL}contacts/${backendId}/`, {
            method: 'PUT',
            headers: {
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


// async function updateContactInBackend(backendId, updatedContactData) {
//     try {
//         const response = await fetch(`${STORAGE_URL}allTasks/${backendId}/`, {
//             method: 'PATCH',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({
//                 contacts: updatedContactData
//             })
//         });
//         if (!response.ok) {
//             throw new Error(`HTTP error! status: ${response.status}`);
//         }
//     } catch (error) {
//         console.error('Error updating task in backend:', error);
//         throw error;
//     }
// }


//------------------------------------------------------------------------------//
//-----------------------------save Tasks at Backend----------------------------//
//------------------------------------------------------------------------------//

/**
 * save Tasks at Backend
 * @async
 */
async function saveTasks() {
    await setItem('allTasks', JSON.stringify(allTasks));
}

//------------------------------------------------------------------------------//
//-----------------------------load Tasks at Backend----------------------------//
//------------------------------------------------------------------------------//

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

/**
 * Loads task status information from the server and updates the local sortTasks object.
 *
 */
async function loadTaskStatusFromServer() {
    const taskStatusKeys = Object.keys(sortTasks).map(category => `taskStatus_${sortTasks[category]}`);
    const taskStatusValues = await Promise.all(taskStatusKeys.map(key => getItem(key)));
    taskStatusValues.forEach((value, index) => {
        const category = Object.keys(sortTasks)[index];
        sortTasks[category] = value;
    });
}
