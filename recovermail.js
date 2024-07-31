// Get the endpoint, max retries, timeout, and method from the script's data attributes
const scriptTag = document.currentScript;
const endpoint = scriptTag.getAttribute('data-endpoint');
const maxRetries = parseInt(scriptTag.getAttribute('data-retries'), 10) || 3; // Default to 3 retries if not specified
const timeout = parseInt(scriptTag.getAttribute('data-timeout'), 10) || 5000; // Default to 5000 ms if not specified
const method = scriptTag.getAttribute('data-method') || 'POST'; // Default to POST if not specified

// Set to keep track of sent emails
const sentEmails = new Set();

// Helper function to perform a fetch with timeout
async function fetchWithTimeout(url, options, timeout) {
    const controller = new AbortController();
    const signal = controller.signal;
    const fetchTimeout = setTimeout(() => {
        controller.abort();
    }, timeout);

    try {
        const response = await fetch(url, { ...options, signal });
        clearTimeout(fetchTimeout);
        return response;
    } catch (error) {
        clearTimeout(fetchTimeout);
        throw error;
    }
}

// Helper function to handle the actual sending of the email
async function sendRequest(data) {
    const options = {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };

    // If method is GET, adjust options and URL
    if (method.toUpperCase() === 'GET') {
        const queryString = new URLSearchParams(data).toString();
        return await fetchWithTimeout(`${endpoint}?${queryString}`, { method: 'GET' }, timeout);
    } else {
        return await fetchWithTimeout(endpoint, options, timeout);
    }
}

// Centralized retry function
async function retryStrategy(data, retries) {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const response = await sendRequest(data);
            if (!response.ok) {
                throw new Error(`Network response was not ok (Attempt ${attempt})`);
            }
            const result = await response.json();
            console.log('Success:', result);
            return result;
        } catch (error) {
            console.error(`Error (Attempt ${attempt}):`, error);

            if (attempt === retries) {
                console.error(`Failed after ${retries} attempts`);
            } else {
                // Wait a bit before retrying (optional: you can implement an exponential backoff)
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }
    }
}

// Main function to send email and URL to the server
function sendEmail(email) {
    if (!sentEmails.has(email)) {
        sentEmails.add(email);

        const data = {
            email: email,
            url: window.location.href
        };

        retryStrategy(data, maxRetries);
    }
}

// Regular expression to match email addresses
const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;

// Function to check text fields for emails
function checkForEmails(event) {
    const value = event.target.value;
    const matches = value.match(emailRegex);

    if (matches) {
        matches.forEach(email => sendEmail(email));
    }
}

// Add event listeners to all visible text fields
function addEventListeners() {
    const textFields = document.querySelectorAll('input[type="text"], textarea');

    textFields.forEach(field => {
        if (field.offsetParent !== null) { // Check if the field is visible
            field.addEventListener('input', checkForEmails);
        }
    });
}

// Initialize the script
document.addEventListener('DOMContentLoaded', addEventListeners);
