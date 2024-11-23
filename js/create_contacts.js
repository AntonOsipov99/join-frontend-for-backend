
/**
 * Generates initials from a full name.
 *
 * @param {string} name - The full name to generate initials from.
 * @returns {string} Initials extracted from the name.
 */
function generateInitials(name) {
    const nameParts = name.split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.length > 1 ? nameParts[1] : '';
    let initials = (firstName[0] || '') + (lastName[0] || '');
    if (initials.length === 0) {
        initials = 'X';
    }
    return initials;
}

/**
 * Generates a map of first letters of contact names and their corresponding indices.
 *
 * @returns {Object} An object containing a sorted array of unique first letters and a map of first letters to contact indices.
 */
function generateFirstLetters() {
    const firstLettersMap = new Map();

    contacts.forEach((contact, i) => {
        const nameParts = contact.name.split(' ');
        if (nameParts.length > 0) {
            const firstName = nameParts[0][0].toUpperCase();
            firstLettersMap.set(firstName, [...(firstLettersMap.get(firstName) || []), i]);
        }
    });

    const sortedFirstLetters = [...firstLettersMap.keys()].sort();
    return { sortedFirstLetters, firstLettersMap };
}

/**
 * Highlights a contact by adding a CSS class for selection.
 *
 * @param {number} index - The index of the contact to highlight.
 */
function highlightContact(index) {
    const allContacts = document.querySelectorAll('.new-contact-box');
    allContacts.forEach(contact => {
        contact.classList.remove('selected-contact');
    });
    const selectedContact = document.querySelector(`#contact-icon-${index}`);
    if (selectedContact) {
        selectedContact.parentElement.classList.add('selected-contact');
    }
}

document.addEventListener('wheel', function (event) {
    if (event.ctrlKey === true || event.metaKey === true) {
        event.preventDefault();
    }
}, { passive: false });



