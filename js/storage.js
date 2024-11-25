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

// async function setItem(key, value) {
//     const payload = { key, value }; //, token: STORAGE_TOKEN
//     return fetch(`${STORAGE_URL}${key}/`, { method: 'POST', body: JSON.stringify(payload) })
//         .then(res => res.json());
// }

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
                [key]: value  // Dynamischer Key
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

// async function setItem(storage, data) {
//     try {
//         const response = await fetch(storage, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify(data)
//         });
//         if (!response.ok) {
//             throw new Error('Network response was not ok');
//         }
//         const result = await response.json();
//         if (storage === CONTACT_STORAGE_URL) {
//             contacts = data;
//         } else if (storage === TASKS_STORAGE_URL) {
//             allTasks = data;
//         } else if (storage === SUMMARY_STORAGE_URL) {
//             summary = data;
//         }
//         return result;
//     } catch (error) {
//         console.error('Error:', error);
//         throw error;
//     }
// }


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
                let dataId = (dataJson[i]['id']);
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

// async function getItem(key) {
//     const url = `${STORAGE_URL}${key}/`;
//     const response = await fetch(url);
//     const dataJson = await response.json();
//     const data = [];
//     if (dataJson != '') {
//         for (let i = 0; i < dataJson.length; i++) {
//             if (dataJson[i][key]) {
//                 let oneData = (dataJson[i][key]);
//                 let parsedData = JSON.parse(oneData);
//                 data.push(parsedData[0]);
//             }
//         }
//     } return data
// }

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
    // let users = JSON.parse(await getItem('users'));
    // let userName = getUserName();
    // let userIndex = users.findIndex(u => u.name === userName);
    // users[userIndex].contacts = contacts;
    await setItem('contacts', JSON.stringify(contacts));
}


//------------------------------------------------------------------------------//
//--------------------------load Contacts from Backend--------------------------//
//------------------------------------------------------------------------------//

/**
 * load Contacts from Backend
 * @async
 */
async function loadContacts() {
    // let users = JSON.parse(await getItem('users'));
    // let userName = getUserName();
    // let userIndex = users.findIndex(u => u.name === userName);
    // let userContacts = users[userIndex].contacts
    // if (userContacts == undefined) {
    //     contacts = []
    // } else {
    //     contacts = userContacts
    // }
    contacts = await getItem('contacts');
}


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
