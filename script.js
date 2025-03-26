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

