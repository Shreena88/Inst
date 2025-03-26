/* Scroll Down Function */
function scrollToNextSection() {
    window.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
}

/* Hide Navbar on Scroll */
document.addEventListener("DOMContentLoaded", function () {
    let lastScrollTop = 0;
    let navbar = document.querySelector(".navbar");
    let logo = document.getElementById("logo");

    window.addEventListener("scroll", function () {
        let currentScroll = window.scrollY;

        if (currentScroll > lastScrollTop && currentScroll > 50) {
            navbar.classList.add("hidden");
            logo.classList.add("hidden");
        } else {
            navbar.classList.remove("hidden");
            logo.classList.remove("hidden");
        }
        lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
    });
});

/* Upload & Flip Card Function */
function uploadFile() {
    let fileInput = document.getElementById("fileInput");
    let uploadStatus = document.getElementById("uploadStatus");
    let flipCardInner = document.querySelector(".flip-card-inner");
    let progressBar = document.getElementById("progress-bar");
    let progressText = document.getElementById("progress-text");

    if (fileInput.files.length === 0) {
        uploadStatus.innerHTML = "Please select a file!";
        uploadStatus.style.color = "red";
        return;
    }

    let file = fileInput.files[0];
    uploadStatus.innerHTML = `Uploading: ${file.name}...`;
    uploadStatus.style.color = "black";

    // Reset Progress Bar
    progressBar.style.width = "0%";
    progressText.innerHTML = "0%";

    // Flip Animation to Processing State
    flipCardInner.style.transition = "transform 1.5s cubic-bezier(0.25, 1, 0.5, 1)";
    flipCardInner.style.transform = "rotateY(180deg)";

    setTimeout(() => {
        uploadStatus.innerHTML = "Upload Successful! Extracting...";
        uploadStatus.style.color = "black";

        startProgressBar();
    }, 1200);

    function startProgressBar() {
        let extractionProgress = 0;

        let extractionInterval = setInterval(() => {
            extractionProgress += 5;
            progressBar.style.width = `${extractionProgress}%`;
            progressText.innerHTML = `${extractionProgress}%`;

            if (extractionProgress >= 100) {
                clearInterval(extractionInterval);
                setTimeout(() => {
                    uploadStatus.innerHTML = "Extraction Complete!";
                    uploadStatus.style.color = "green";

                    // Hide upload section & show new card after extraction
                    showNewCard();
                }, 700);
            }
        }, 300);
    }
}


function uploadFile() {
    let fileInput = document.getElementById("fileInput");
    let uploadStatus = document.getElementById("uploadStatus");
    let flipCardInner = document.querySelector(".flip-card-inner");
    let progressBar = document.getElementById("progress-bar");
    let progressText = document.getElementById("progress-text");

    if (fileInput.files.length === 0) {
        uploadStatus.innerHTML = "Please select a file!";
        uploadStatus.style.color = "red";
        return;
    }

    let file = fileInput.files[0];
    uploadStatus.innerHTML = `Uploading: ${file.name}...`;
    uploadStatus.style.color = "black";

    // Reset Progress Bar
    progressBar.style.width = "0%";
    progressText.innerHTML = "0%";

    // Flip Animation to Processing State
    flipCardInner.style.transition = "transform 1.5s cubic-bezier(0.25, 1, 0.5, 1)";
    flipCardInner.style.transform = "rotateY(180deg)";

    setTimeout(() => {
        uploadStatus.innerHTML = "Upload Successful! Extracting...";
        uploadStatus.style.color = "black";

        startProgressBar();
    }, 1200);
}

// Progress bar simulation and showing claim info after processing
function startProgressBar() {
    let progressBar = document.getElementById("progress-bar");
    let progressText = document.getElementById("progress-text");
    let extractionProgress = 0;

    let extractionInterval = setInterval(() => {
        extractionProgress += 5;
        progressBar.style.width = `${extractionProgress}%`;
        progressText.innerHTML = `${extractionProgress}%`;

        if (extractionProgress >= 100) {
            clearInterval(extractionInterval);
            setTimeout(() => {
                document.getElementById("uploadStatus").innerHTML = "Extraction Complete!";
                document.getElementById("uploadStatus").style.color = "green";

                showClaimInfo(); // Show Claim Info after processing completes
            }, 700);
        }
    }, 300);
}

// Function to Show Claim Info Card After Processing
function showClaimInfo() {
    let flipCard = document.querySelector(".flip-card");
    let claimInfoCard = document.getElementById("claim-info-card");

    // Hide Upload & Process Section
    flipCard.style.display = "none";
    claimInfoCard.style.display = "flex";

    let fileInput = document.getElementById("fileInput");

    // Check if any file was uploaded
    if (fileInput.files.length === 0) {
        document.getElementById("docType").innerHTML = "Unknown Document";
        document.getElementById("claimStatus").innerHTML = "Failed to Process";
        document.getElementById("extractedData").innerHTML = "<p>No document uploaded.</p>";
        return;
    }

    let uploadedFile = fileInput.files[0];
    let fileName = uploadedFile.name;
    let fileType = uploadedFile.type;

    // Determine document type based on file extension
    let docType;
    if (fileName.toLowerCase().includes("aadhar")) {
        docType = "Aadhar Card";
    } else if (fileName.toLowerCase().includes("passport")) {
        docType = "Passport";
    } else if (fileName.toLowerCase().includes("pan")) {
        docType = "PAN Card";
    } else if (fileType === "application/pdf") {
        docType = "PDF Document";
    } else if (fileType.startsWith("image/")) {
        docType = "Scanned Image";
    } else {
        docType = "Unknown Document";
    }

    // Display extracted details dynamically
    document.getElementById("docType").innerHTML = docType;
    document.getElementById("claimStatus").innerHTML = "Processing Completed";
    document.getElementById("extractedData").innerHTML = `
        <p><strong>File Name:</strong> ${fileName}</p>
        <p><strong>File Type:</strong> ${fileType || "Unknown"}</p>
        <p><strong>Upload Time:</strong> ${new Date().toLocaleString()}</p>
    `;
}

// Restart Upload Process
function restartUpload() {
    location.reload(); // Reloads the page to reset the form
}

document.addEventListener("DOMContentLoaded", function () {
    let loginBtn = document.getElementById("loginBtn");
    let loginPopup = document.getElementById("loginPopup");
    let loginOverlay = document.getElementById("loginOverlay");

    // Show login popup on button click
    loginBtn.addEventListener("click", function (event) {
        event.preventDefault();
        loginPopup.style.display = "block";
        loginOverlay.style.display = "block";
    });

    // Hide login popup when clicking outside
    loginOverlay.addEventListener("click", function () {
        loginPopup.style.display = "none";
        this.style.display = "none";
    });

    // Check if user is logged in & update UI
    let loggedInUser = localStorage.getItem("userLoggedIn");
    if (loggedInUser) {
        loginBtn.textContent = loggedInUser; // Replace "Log In" with Username
        loginBtn.classList.add("logged-in");
    }
});

function toggleForm() {
    let loginForm = document.getElementById("loginForm");
    let registerForm = document.getElementById("registerForm");
    let formTitle = document.getElementById("formTitle");

    if (loginForm.style.display === "none") {
        loginForm.style.display = "block";
        registerForm.style.display = "none";
        formTitle.innerText = "Log In";
    } else {
        loginForm.style.display = "none";
        registerForm.style.display = "block";
        formTitle.innerText = "Register";
    }
}

function register() {
    let username = document.getElementById("registerUsername").value.trim();
    let password = document.getElementById("registerPassword").value.trim();
    let message = document.getElementById("message");

    if (username === "" || password === "") {
        message.innerHTML = "Fields cannot be empty!";
        return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || {};
    if (users[username]) {
        message.innerHTML = "Username already exists!";
        return;
    }

    users[username] = password;
    localStorage.setItem("users", JSON.stringify(users));

    message.innerHTML = "Registration successful!";
    message.style.color = "green";
    toggleForm();
}

function login() {
    let username = document.getElementById("loginUsername").value.trim();
    let password = document.getElementById("loginPassword").value.trim();
    let message = document.getElementById("message");

    let users = JSON.parse(localStorage.getItem("users")) || {};

    if (users[username] === password) {
        localStorage.setItem("userLoggedIn", username);

        // Hide login popup
        document.getElementById("loginPopup").style.display = "none";
        document.getElementById("loginOverlay").style.display = "none";

        // Change login button to username
        let loginBtn = document.getElementById("loginBtn");
        loginBtn.textContent = username;
        loginBtn.classList.add("logged-in");
    } else {
        message.innerHTML = "Invalid username or password!";
    }
}



document.addEventListener("DOMContentLoaded", function () {
    let loginBtn = document.getElementById("loginBtn");
    let loginPopup = document.getElementById("loginPopup");
    let loginOverlay = document.getElementById("loginOverlay");

    // Show login popup on button click
    loginBtn.addEventListener("click", function (event) {
        event.preventDefault();
        loginPopup.style.display = "block";
        loginOverlay.style.display = "block";
    });

    // Hide login popup when clicking outside
    loginOverlay.addEventListener("click", function () {
        loginPopup.style.display = "none";
        this.style.display = "none";
    });

    // Check if user is logged in & update UI
    let loggedInUser = localStorage.getItem("userLoggedIn");
    if (loggedInUser) {
        loginBtn.textContent = loggedInUser; // Replace "Log In" with Username
        loginBtn.classList.add("logged-in");
    }
});

function toggleForm() {
    let loginForm = document.getElementById("loginForm");
    let registerForm = document.getElementById("registerForm");
    let formTitle = document.getElementById("formTitle");

    if (loginForm.style.display === "none") {
        loginForm.style.display = "block";
        registerForm.style.display = "none";
        formTitle.innerText = "Log In";
    } else {
        loginForm.style.display = "none";
        registerForm.style.display = "block";
        formTitle.innerText = "Register";
    }
}

function register() {
    let username = document.getElementById("registerUsername").value.trim();
    let password = document.getElementById("registerPassword").value.trim();
    let message = document.getElementById("message");

    if (username === "" || password === "") {
        message.innerHTML = "Fields cannot be empty!";
        return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || {};
    if (users[username]) {
        message.innerHTML = "Username already exists!";
        return;
    }

    users[username] = password;
    localStorage.setItem("users", JSON.stringify(users));

    // Automatically log the user out after registering
    localStorage.removeItem("userLoggedIn"); 
    message.innerHTML = "Registration successful! Please log in.";
    message.style.color = "green";

    // Reset login button text after logout
    let loginBtn = document.getElementById("loginBtn");
    loginBtn.textContent = "Log In"; 
    loginBtn.classList.remove("logged-in");

    toggleForm();
}

function register() {
    let username = document.getElementById("registerUsername").value.trim();
    let email = document.getElementById("registerMail").value.trim();
    let password = document.getElementById("registerPassword").value.trim();
    let message = document.getElementById("message");

    if (username === "" || email === "" || password === "") {
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

    message.innerHTML = "Registration successful!";
    message.style.color = "green";

    // Hide the login/register popup after successful registration
    setTimeout(() => {
        document.getElementById("loginPopup").style.display = "none";
        document.getElementById("loginOverlay").style.display = "none";
    }, 1000); // Wait for 1 second before closing
}
document.addEventListener("DOMContentLoaded", function () {
    let loginBtn = document.getElementById("loginBtn");
    let loginPopup = document.getElementById("loginPopup");
    let loginOverlay = document.getElementById("loginOverlay");

    // Show login popup on button click
    loginBtn.addEventListener("click", function (event) {
        event.preventDefault();
        loginPopup.style.display = "block";
        loginOverlay.style.display = "block";
        document.body.classList.add("login-active"); // Hide navbar
    });

    // Hide login popup when clicking outside
    loginOverlay.addEventListener("click", function () {
        loginPopup.style.display = "none";
        this.style.display = "none";
        document.body.classList.remove("login-active"); // Show navbar again
    });

    // Check if user is logged in & update UI
    let loggedInUser = localStorage.getItem("userLoggedIn");
    if (loggedInUser) {
        loginBtn.textContent = loggedInUser; // Replace "Log In" with Username
        loginBtn.classList.add("logged-in");
    }
});

function toggleForm() {
    let loginForm = document.getElementById("loginForm");
    let registerForm = document.getElementById("registerForm");
    let formTitle = document.getElementById("formTitle");

    if (loginForm.style.display === "none") {
        loginForm.style.display = "block";
        registerForm.style.display = "none";
        formTitle.innerText = "Log In";
    } else {
        loginForm.style.display = "none";
        registerForm.style.display = "block";
        formTitle.innerText = "Register";
    }
}

function register() {
    let username = document.getElementById("registerUsername").value.trim();
    let email = document.getElementById("registerMail").value.trim();
    let password = document.getElementById("registerPassword").value.trim();
    let message = document.getElementById("message");

    if (username === "" || email === "" || password === "") {
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

    message.innerHTML = "Registration successful!";
    message.style.color = "green";

    // Hide login popup after registration
    setTimeout(() => {
        document.getElementById("loginPopup").style.display = "none";
        document.getElementById("loginOverlay").style.display = "none";
        document.body.classList.remove("login-active"); // Show navbar again
    }, 1000);
}

function login() {
    let username = document.getElementById("loginUsername").value.trim();
    let password = document.getElementById("loginPassword").value.trim();
    let message = document.getElementById("message");

    let users = JSON.parse(localStorage.getItem("users")) || {};

    if (users[username] && users[username].password === password) {
        localStorage.setItem("userLoggedIn", username);

        // Hide login popup after login
        document.getElementById("loginPopup").style.display = "none";
        document.getElementById("loginOverlay").style.display = "none";
        document.body.classList.remove("login-active"); // Show navbar again

        // Change login button to username
        let loginBtn = document.getElementById("loginBtn");
        loginBtn.textContent = username;
        loginBtn.classList.add("logged-in");
    } else {
        message.innerHTML = "Invalid username or password!";
    }
}


document.addEventListener("DOMContentLoaded", function () {
    let loginBtn = document.getElementById("loginBtn");
    let loginPopup = document.getElementById("loginPopup");
    let loginOverlay = document.getElementById("loginOverlay");

    // Show login popup on button click
    loginBtn.addEventListener("click", function (event) {
        event.preventDefault();
        loginPopup.style.display = "block";
        loginOverlay.style.display = "block";
        document.body.classList.add("login-active"); // Hide navbar
    });

    // Hide login popup when clicking outside
    loginOverlay.addEventListener("click", function () {
        loginPopup.style.display = "none";
        this.style.display = "none";
        document.body.classList.remove("login-active"); // Show navbar again
    });

    // Check if user is logged in & update UI
    let loggedInUser = localStorage.getItem("userLoggedIn");
    if (loggedInUser) {
        loginBtn.textContent = loggedInUser; // Replace "Log In" with Username
        loginBtn.classList.add("logged-in");
    }
});

function toggleForm() {
    let loginForm = document.getElementById("loginForm");
    let registerForm = document.getElementById("registerForm");
    let formTitle = document.getElementById("formTitle");

    if (loginForm.style.display === "none") {
        loginForm.style.display = "block";
        registerForm.style.display = "none";
        formTitle.innerText = "Log In";
    } else {
        loginForm.style.display = "none";
        registerForm.style.display = "block";
        formTitle.innerText = "Register";
    }
}

function register() {
    let username = document.getElementById("registerUsername").value.trim();
    let email = document.getElementById("registerMail").value.trim();
    let password = document.getElementById("registerPassword").value.trim();
    let message = document.getElementById("message");

    if (username === "" || email === "" || password === "") {
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

    message.innerHTML = "Registration successful!";
    message.style.color = "green";

    // Hide login popup after registration
    setTimeout(() => {
        document.getElementById("loginPopup").style.display = "none";
        document.getElementById("loginOverlay").style.display = "none";
        document.body.classList.remove("login-active"); // Show navbar again
    }, 1000);
}

function login() {
    let username = document.getElementById("loginUsername").value.trim();
    let password = document.getElementById("loginPassword").value.trim();
    let message = document.getElementById("message");

    let users = JSON.parse(localStorage.getItem("users")) || {};

    if (users[username] && users[username].password === password) {
        localStorage.setItem("userLoggedIn", username);

        // Hide login popup after login
        document.getElementById("loginPopup").style.display = "none";
        document.getElementById("loginOverlay").style.display = "none";
        document.body.classList.remove("login-active"); // Show navbar again

        // Change login button to username
        let loginBtn = document.getElementById("loginBtn");
        loginBtn.textContent = username;
        loginBtn.classList.add("logged-in");
    } else {
        message.innerHTML = "Invalid username or password!";
    }
}

