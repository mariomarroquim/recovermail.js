# Recovermail.js

JavaScript to capture user-entered emails and send them to an endpoint.

## Overview

`recovermail.js` is a JavaScript tool designed to capture email addresses entered by users in any visible text fields on an HTML page. It sends the detected emails along with the full URL of the current page to a specified external endpoint via a user-defined request method (GET or POST). The tool includes retry logic and a timeout feature to ensure reliable data transmission.

## Usefulness

This script is ideal for businesses needing to capture and process email addresses entered by users on their website. It automates email collection for purposes such as newsletter sign-ups, contact forms, user feedback, and marketing campaigns. The script ensures reliable data transmission with retry and timeout mechanisms, preventing duplicate submissions and reducing the risk of lost information.

## Usage

### Include the Script

To use `recovermail.js`, include it in your HTML page with the necessary `data` attributes for configuration.

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Capture Emails</title>
</head>
<body>
    <!-- Your content here -->
    <input type="text" name="email"/>

    <!-- Include the script with the external URL, retry count, timeout, and method as data attributes -->
    <script src="https://github.com/mariomarroquim/recovermail.js/blob/main/recovermail.js"
            data-endpoint="https://example.com/collectEmails"
            data-retries="3"
            data-timeout="5000"
            data-method="POST">
    </script>
</body>
</html>
```

### Configure the Script data attributes
- data-endpoint: The URL to which the detected emails and page URL will be sent.
- data-retries: The maximum number of retry attempts for failed requests (default: 3).
- data-timeout: The timeout duration in milliseconds for the request (default: 5000 ms).
- data-method: The HTTP method to use for the request (GET or POST, default: POST).

#### In the example above:

The script will send emails to https://example.com/collectEmails.
It will retry up to 3 times for failed requests.
Each request will timeout if it takes longer than 5000 milliseconds.
The request method will be POST.

## Support
You can contact me at mariomarroquim@gmail.com.
