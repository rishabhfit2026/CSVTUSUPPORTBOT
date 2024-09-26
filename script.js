document.addEventListener("DOMContentLoaded", function() { 
    let step = 0;
    let userName = '';
    let userLocation = '';
    const spreadsheetId = '1funQ8l4sVh7bFqoEwhYj3EWpNnqaH8uJlw2qsd267dw'; // Your spreadsheet ID
    const scriptUrl = 'https://script.google.com/macros/s/AKfycbw-cl9MRmTcN6S5Hgiv8jktLxMJxHrNFtBFz5mVeQhiNkSbuUjNfxrSNi9KWILF-ckERg/exec'; // Updated Apps Script URL

    function appendMessage(text, className, isLink = false) {
        const messageBox = document.createElement("div");
        messageBox.classList.add("message", className);

        if (isLink) {
            const link = document.createElement("a");
            link.href = text;
            link.target = "_blank"; // Open in a new tab
            link.textContent = text;
            messageBox.appendChild(link);
        } else {
            messageBox.textContent = text;
        }

        const chatBox = document.getElementById("chat-box");
        chatBox.appendChild(messageBox);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    function appendButtons(button1Text, button2Text = null) {
        const buttonContainer = document.createElement("div");
        buttonContainer.classList.add("button-container");

        const button1 = document.createElement("button");
        button1.textContent = button1Text;
        button1.classList.add("stylish-button");
        button1.addEventListener("click", function() {
            handleUserInput(button1Text);
        });

        buttonContainer.appendChild(button1);

        if (button2Text) {
            const button2 = document.createElement("button");
            button2.textContent = button2Text;
            button2.classList.add("stylish-button");
            button2.addEventListener("click", function() {
                handleUserInput(button2Text);
            });
            buttonContainer.appendChild(button2);
        }

        const chatBox = document.getElementById("chat-box");
        chatBox.appendChild(buttonContainer);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    function simulateTyping(callback) {
        appendMessage("Typing...", "bot-message");
        setTimeout(callback, 1500);
    }

    function fetchStatus(referenceId) {
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Sheet1!A:B`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                const rows = data.values;
                let statusFound = false;

                if (rows) {
                    for (const row of rows) {
                        if (row[0] === referenceId) {
                            appendMessage(`The status for Reference ID ${referenceId} is: ${row[1]}`, "bot-message");
                            statusFound = true;
                            break;
                        }
                    }
                }

                if (!statusFound) {
                    appendMessage("Sorry, we couldn't find any status for that Reference ID.", "bot-message");
                }
            })
            .catch(error => {
                appendMessage("There was an error fetching the status. Please try again.", "bot-message");
                console.error(error);
            });
    }

    function handleUserInput(userInput) {
        if (step === 0) {
            appendMessage("Hi there! 👋\n\nWelcome to CSVTU SUPPORT. I'll help you with your CSVTU queries.\n\nBefore we get going, I'd love to know your name?", "bot-message");
            step++;
        } else if (step === 1) {
            userName = userInput;
            appendMessage(`Nice to meet you, ${userName}! How can I help today?`, "bot-message");
            appendButtons("Application Online", "Track Your Order");
            step++;
        } else if (step === 2) {
            if (userInput === "Application Online") {
                appendMessage("Awesome! Let's find you some Application forms.", "bot-message");
                appendMessage("Please enter the address where you're going to apply online 😇", "bot-message");
                step++;
            } else if (userInput === "Track Your Order") {
                appendMessage("Sure! Here is the link to track your order:", "bot-message");
                appendMessage(scriptUrl, "bot-message", true); // Show the URL as a clickable link
                setTimeout(() => {
                    window.open(scriptUrl, "_blank"); // Redirect to a new window/tab
                }, 2000); // 2 seconds delay to allow user to click the link
                
                // After showing the link, set up the further queries message
                simulateTyping(() => {
                    appendMessage("If you have further queries, please contact: degree@csvtu.ac.in", "bot-message");
                    // Ask how the bot can help again
                    setTimeout(() => {
                        appendMessage(`How can I help you today, ${userName}?`, "bot-message");
                        appendButtons("Application Online", "Track Your Order"); // Restore options
                    }, 2000); // 2 seconds delay before asking again
                });
            }
        } else if (step === 3) {
            userLocation = userInput;
            appendMessage(`Nice place! I hope you enjoy your time at ${userLocation}.`, "bot-message");
            simulateTyping(() => {
                appendMessage('Please fill out the form here:', "bot-message");
                appendMessage('https://forms.gle/8ZYUhBixpu7na3df6', "bot-message", true); // Updated Google Form link
                appendButtons("Yes, I filled it", "No, I haven't yet");
                step++;
            });
        } else if (step === 4) {
            if (userInput === "Yes, I filled it") {
                simulateTyping(() => {
                    appendMessage("🎉 Congratulations! You've successfully filled out the form. You should have received a Reference ID in your email.", "bot-message");

                    // Redirect to options after success message
                    setTimeout(() => {
                        appendMessage(`How can I help today, ${userName}?`, "bot-message");
                        appendButtons("Application Online", "Track Your Order");
                        step = 2; // Reset step to allow selecting options again
                    }, 2000); // 2 seconds delay before showing the options again
                });
            } else if (userInput === "No, I haven't yet") {
                appendMessage("Please fill out the form and then come back to continue.", "bot-message");
            }
        } else if (step === 5) {
            fetchStatus(userInput); // Fetch status based on reference ID input
        }
    }

    document.getElementById("send-btn").addEventListener("click", function() {
        const userInput = document.getElementById("user-input").value.trim();
        if (userInput) {
            appendMessage(userInput, "user-message");
            document.getElementById("user-input").value = "";
            handleUserInput(userInput);
        }
    });

    document.getElementById("user-input").addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            document.getElementById("send-btn").click();
        }
    });
});
