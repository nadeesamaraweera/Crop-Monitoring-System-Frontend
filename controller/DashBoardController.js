// Sidebar toggle functionality for mobile view
document.getElementById("toggleSidebar").addEventListener("click", function () {
    document.querySelector(".sidebar").classList.toggle("active");
});

// Close sidebar button functionality
document.getElementById("closeSidebar").addEventListener("click", function () {
    document.querySelector(".sidebar").classList.remove("active");
});

// Logout alert functionality
document.getElementById("btn-logout").addEventListener("click", function () {
    alert("Logged out successfully!");
    window.location.href = "index.html"; // Redirect to login page or homepage
});

// Function to load total vehicles (example value)
function loadTotalVehicles() {
    const totalVehicles = 10; // Replace with dynamic value if available
    document.getElementById("totalVehicles").innerText = totalVehicles;
}

// Function to load total crops (example value)
function loadTotalCrops() {
    const totalCrops = 25; // Replace with dynamic value if available
    document.getElementById("totalCrops").innerText = totalCrops;
}

// Function to update date and time
function updateDateTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(now.getDate()).padStart(2, '0');
    const formattedDate = `Date: ${year}.${month}.${day}`;

    const options = { hour12: true, hour: 'numeric', minute: 'numeric', second: 'numeric' };
    const formattedTime = `Time: ${now.toLocaleTimeString(undefined, options).replace(/:/g, '.')}`;

    document.getElementById("currentDate").innerText = formattedDate;
    document.getElementById("currentTime").innerText = formattedTime;
}

// Navigation functionality for different sections
function showSection(sectionId) {
    // Hide all sections first
    document.querySelectorAll(".content section").forEach((section) => {
        section.style.display = "none";
    });

    // Show the selected section
    document.querySelector(sectionId).style.display = "block";
}

// Attach event listeners for navigation buttons
document.getElementById("dashboard").addEventListener("click", () => showSection("#dashboard-sec"));
document.getElementById("field").addEventListener("click", () => showSection("#field-sec"));
document.getElementById("crop").addEventListener("click", () => showSection("#crop-sec"));
document.getElementById("staff").addEventListener("click", () => showSection("#staff-sec"));
document.getElementById("log").addEventListener("click", () => showSection("#log-sec"));
document.getElementById("vehicle").addEventListener("click", () => showSection("#vehicle-sec"));
document.getElementById("equipment").addEventListener("click", () => showSection("#equipment-sec"));
// Initial function calls when the page loads
window.onload = function () {
    loadTotalVehicles(); // Load total vehicles
    loadTotalCrops();    // Load total crops
    updateDateTime();    // Update date and time
    showSection("#dashboard-sec"); // Default section to display
};

// Update date and time every second
setInterval(updateDateTime, 1000);

// Function to handle button clicks in the Quick Links section
document.querySelectorAll(".btn-outline-success").forEach((button) => {
    button.addEventListener("click", function (event) {
        event.preventDefault(); // Prevent the default anchor behavior
        const buttonText = this.innerText.trim(); // Get button text to identify the action
        switch (buttonText) {
                case "Add New Crop":
                showLinks("#crop-sec"); // Show the Crop section
                break;
                case "Add New Log":
                showLinks("#log-sec"); // Show the Log section
                break;
                case "Add new Equipment":
                showLinks("#equipment-sec"); // Show the Equipment section
                break;
                default:
                console.warn("No action defined for this button.");
                break;
        }
    });
});
function showLinks(sectionId) {
    // Hide all sections
    document.querySelectorAll(".content section").forEach((section) => {
        section.style.display = "none";
    });
    document.querySelector(sectionId).style.display = "block";
}
