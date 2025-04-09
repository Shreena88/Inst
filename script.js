document.addEventListener("DOMContentLoaded", function () {
    const navbar = document.querySelector(".navbar");
    const logo = document.getElementById("logo");
    const loginBtn = document.getElementById("loginBtn");
    const loginPopup = document.getElementById("loginPopup");
    const loginOverlay = document.getElementById("loginOverlay");
    let lastScrollTop = 0;

    // Scroll Down Function
    window.scrollToNextSection = function () {
        window.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
    };

    // Hide Navbar on Scroll
    window.addEventListener("scroll", function () {
        let currentScroll = window.scrollY;
        navbar.classList.toggle("hidden", currentScroll > lastScrollTop && currentScroll > 50);
        logo.classList.toggle("hidden", currentScroll > lastScrollTop && currentScroll > 50);
        lastScrollTop = Math.max(currentScroll, 0);
    });

    // Toggle Login Popup
    loginBtn.addEventListener("click", function (event) {
        event.preventDefault();
        loginPopup.style.display = "block";
        loginOverlay.style.display = "block";
        document.body.classList.add("login-active");
    });

    // Hide Login Popup when clicking outside
    loginOverlay.addEventListener("click", function () {
        loginPopup.style.display = "none";
        loginOverlay.style.display = "none";
        document.body.classList.remove("login-active");
    });

    // Check if User is Logged In & Update UI
    let loggedInUser = localStorage.getItem("userLoggedIn");
    if (loggedInUser) {
        loginBtn.textContent = loggedInUser;
        loginBtn.classList.add("logged-in");
    }
});

// Toggle between Login & Register Forms
function toggleForm() {
    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");
    const formTitle = document.getElementById("formTitle");

    const isLoginVisible = loginForm.style.display !== "none";
    loginForm.style.display = isLoginVisible ? "none" : "block";
    registerForm.style.display = isLoginVisible ? "block" : "none";
    formTitle.innerText = isLoginVisible ? "Register" : "Log In";
}

// Register User
function register() {
    const username = document.getElementById("registerUsername").value.trim();
    const email = document.getElementById("registerMail").value.trim();
    const password = document.getElementById("registerPassword").value.trim();
    const message = document.getElementById("message");

    if (!username || !email || !password) {
        message.innerHTML = "Fields cannot be empty!";
        return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || {};
    if (users[username]) {
        message.innerHTML = "Username already exists!";
        return;
    }

    users[username] = { email, password };
    localStorage.setItem("users", JSON.stringify(users));

    message.innerHTML = "Registration successful! Please log in.";
    message.style.color = "green";

    // Hide login popup after successful registration
    setTimeout(() => {
        document.getElementById("loginPopup").style.display = "none";
        document.getElementById("loginOverlay").style.display = "none";
        document.body.classList.remove("login-active");
    }, 1000);

    toggleForm();
}

// Login User
function login() {
    const username = document.getElementById("loginUsername").value.trim();
    const password = document.getElementById("loginPassword").value.trim();
    const message = document.getElementById("message");

    let users = JSON.parse(localStorage.getItem("users")) || {};

    if (users[username] && users[username].password === password) {
        localStorage.setItem("userLoggedIn", username);

        // Hide login popup after login
        document.getElementById("loginPopup").style.display = "none";
        document.getElementById("loginOverlay").style.display = "none";
        document.body.classList.remove("login-active");

        // Update Login Button to Username
        let loginBtn = document.getElementById("loginBtn");
        loginBtn.textContent = username;
        loginBtn.classList.add("logged-in");
    } else {
        message.innerHTML = "Invalid username or password!";
    }
}

// Upload & Process File
async function uploadFile() {
    const fileInput = document.getElementById("fileInput");
    const uploadStatus = document.getElementById("uploadStatus");
    const flipCardInner = document.querySelector(".flip-card-inner");
    const progressBar = document.getElementById("progress-bar");
    const progressText = document.getElementById("progress-text");

    if (fileInput.files.length === 0) {
        uploadStatus.innerHTML = "Please select a file!";
        uploadStatus.style.color = "red";
        return;
    }

    let file = fileInput.files[0];
    uploadStatus.innerHTML = `Uploading: ${file.name}...`;
    uploadStatus.style.color = "black";

    // Initialize progress bar
    progressBar.style.width = "0%";
    progressText.innerHTML = "0%";

    // Create FormData for API
    const formData = new FormData();
    formData.append('file', file);

    try {
        // Flip the card to show processing side
        flipCardInner.style.transition = "transform 1.5s cubic-bezier(0.25, 1, 0.5, 1)";
        flipCardInner.style.transform = "rotateY(180deg)";

        // Upload to API
        const response = await fetch('http://localhost:8000/upload', {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Upload failed: ' + response.statusText);
        }

        const result = await response.json();
        console.log('Upload response:', result); // Debug log

        if (!result.task_id) {
            throw new Error('No task ID received');
        }

        // Start polling for progress
        await pollProgress(result.task_id);
    } catch (error) {
        console.error('Error:', error);
        uploadStatus.innerHTML = "Upload failed! Please try again. Error: " + error.message;
        uploadStatus.style.color = "red";
        // Flip card back
        flipCardInner.style.transform = "rotateY(0deg)";
    }
}

// Poll for progress updates
async function pollProgress(taskId) {
    const progressBar = document.getElementById("progress-bar");
    const progressText = document.getElementById("progress-text");
    const uploadStatus = document.getElementById("uploadStatus");

    const pollInterval = setInterval(async () => {
        try {
            const response = await fetch(`http://localhost:8000/status/${taskId}`);
            if (!response.ok) {
                throw new Error('Status check failed');
            }

            const data = await response.json();
            console.log('Progress data:', data); // Debug log

            if (data.status === "completed") {
                clearInterval(pollInterval);
                progressBar.style.width = "100%";
                progressText.innerHTML = "100%";
                uploadStatus.innerHTML = "Processing Complete!";
                uploadStatus.style.color = "green";
                showClaimInfo(data.result);
            } else if (data.status === "error") {
                clearInterval(pollInterval);
                uploadStatus.innerHTML = "Processing failed! Please try again.";
                uploadStatus.style.color = "red";
            } else {
                // Update progress
                const progress = data.progress || 0;
                progressBar.style.width = `${progress}%`;
                progressText.innerHTML = `${progress}%`;
            }
        } catch (error) {
            console.error('Error polling progress:', error);
            clearInterval(pollInterval);
            uploadStatus.innerHTML = "Error checking progress!";
            uploadStatus.style.color = "red";
        }
    }, 1000); // Poll every second
}

// Update showClaimInfo to use API results
function showClaimInfo(result) {
    document.querySelector(".flip-card").style.display = "none";
    document.getElementById("claim-info-card").style.display = "flex";

    if (!result) {
        updateClaimInfo("Unknown Document", "Failed to Process", "No results available.");
        return;
    }

    const { document_type, extracted_data } = result;
    
    // Format extracted data for display
    let formattedData = '<div class="extracted-data-container">';
    for (const [key, value] of Object.entries(extracted_data)) {
        formattedData += `<p><strong>${key}:</strong> ${value}</p>`;
    }
    formattedData += '</div>';

    updateClaimInfo(
        document_type,
        "Processing Completed",
        formattedData
    );
}

// Detect Document Type
function detectDocumentType(fileName, fileType) {
    if (fileName.toLowerCase().includes("aadhar")) return "Aadhar Card";
    if (fileName.toLowerCase().includes("passport")) return "Passport";
    if (fileName.toLowerCase().includes("pan")) return "PAN Card";
    if (fileType === "application/pdf") return "PDF Document";
    if (fileType.startsWith("image/")) return "Scanned Image";
    return "Unknown Document";
}

// Update Claim Info UI
function updateClaimInfo(docType, status, extractedData) {
    document.getElementById("docType").innerHTML = docType;
    document.getElementById("claimStatus").innerHTML = status;
    document.getElementById("extractedData").innerHTML = extractedData;
}

// Restart Upload
function restartUpload() {
    location.reload();
}



// Add this function to handle API connection
async function connectToAPI(file) {
    try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('http://localhost:8000/upload', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error('Upload failed');
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// Add this function to check progress
async function checkProgress(taskId) {
    try {
        const response = await fetch(`http://localhost:8000/status/${taskId}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Progress Error:', error);
        throw error;
    }
}