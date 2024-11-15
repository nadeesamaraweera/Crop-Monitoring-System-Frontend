
// Sidebar toggle functionality for mobile view
document.getElementById("toggleSidebar").addEventListener("click", function() {
    document.querySelector(".sidebar").classList.toggle("active");
});

// Close sidebar button functionality
document.getElementById("closeSidebar").addEventListener("click", function() {
    document.querySelector(".sidebar").classList.remove("active");
});


// Logout alert
$('#btn-logout').on('click', function () {
    alert("Logged out successfully!");
    window.location.href = "index.html";
});

function loadTotalVehicles() {
    const totalVehicles = 10; // Example value
    document.getElementById('totalVehicles').innerText = totalVehicles;
}

function loadTotalCrops() {
    const totalCrops = 25; // Example value
    document.getElementById('totalCrops').innerText = totalCrops;
}
function updateDateTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed, so add 1
    const day = String(now.getDate()).padStart(2, '0');
    const formattedDate = `Date: ${year}.${month}.${day}`; // Custom format

    const nows = new Date();
    const options = { hour12: true, hour: 'numeric', minute: 'numeric', second: 'numeric' };
    const formattedTime = `Time: ${nows.toLocaleTimeString(undefined, options).replace(/:/g, '.')}`;
    console.log(formattedTime);

    document.getElementById('currentDate').innerText = formattedDate;
    document.getElementById('currentTime').innerText = formattedTime;
}

setInterval(updateDateTime, 1000);
window.onload = updateDateTime;

// Initial call to display immediately on page load
window.onload = updateDateTime;

// Initial function calls when the page loads
window.onload = function() {
    loadTotalVehicles();
    loadTotalCrops();
    updateDateTime();
};

// Navigation functionality for different sections
function showSection(sectionId) {
    $(".content section").hide();
    $(sectionId).show();
}
$('#crops').on('click', () => showSection('#cropsSection'));
$('#dashboard').on('click', () => showSection('#dashboard-sec'));
$('#field').on('click', () => showSection('#fieldsSection'));
$('#staff').on('click', () => showSection('#staffSection'));
$('#log').on('click', () => showSection('#logsSection'));
$('#vehicle').on('click', () => showSection('#vehicleSection'));
$('#equipment').on('click', () => showSection('#equipmentSection'));
$('#user').on('click', () => showSection('#userSection'));

// // navigate to pages
// $('#crops').on('click', () => {
//     $('#cropsSection').css('display', 'block');
//     $('#logsSection').css('display', 'none');
//     $('#dashboardSection').css('display', 'none');
//     $('#fieldsSection').css('display', 'none');
//     $('#staffSection').css('display', 'none');
//     $('#vehicleSection').css('display', 'none');
//     $('#equipmentSection').css('display', 'none');
//     $('#userSection').css('display', 'none');
//     console.log("clicked");
// });
// $('#dashboard').on('click', () => {
//     $('#dashboardSection').css('display', 'block');
//     $('#logsSection').css('display', 'none');
//     $('#cropsSection').css('display', 'none');
//     $('#fieldsSection').css('display', 'none');
//     $('#staffSection').css('display', 'none');
//     $('#vehicleSection').css('display', 'none');
//     $('#equipmentSection').css('display', 'none');
//     $('#userSection').css('display', 'none');
//     console.log("clicked");
// });
// $('#field').on('click', () => {
//     $('#fieldsSection').css('display', 'block');
//     $('#logsSection').css('display', 'none');
//     $('#dashboardSection').css('display', 'none');
//     $('#cropsSection').css('display', 'none');
//     $('#staffSection').css('display', 'none');
//     $('#vehicleSection').css('display', 'none');
//     $('#equipmentSection').css('display', 'none');
//     $('#userSection').css('display', 'none');
//     console.log("clicked");
// });
// $('#staff').on('click', () => {
//     $('#staffSection').css('display', 'block');
//     $('#fieldsSection').css('display', 'none');
//     $('#logsSection').css('display', 'none');
//     $('#dashboardSection').css('display', 'none');
//     $('#cropsSection').css('display', 'none');
//     $('#vehicleSection').css('display', 'none');
//     $('#equipmentSection').css('display', 'none');
//     $('#userSection').css('display', 'none');
//     console.log("clicked");
// });
// $('#log').on('click', () => {
//     $('#logsSection').css('display', 'block');
//     $('#staffSection').css('display', 'none');
//     $('#fieldsSection').css('display', 'none');
//     $('#dashboardSection').css('display', 'none');
//     $('#cropsSection').css('display', 'none');
//     $('#vehicleSection').css('display', 'none');
//     $('#equipmentSection').css('display', 'none');
//     $('#userSection').css('display', 'none');
//     console.log("clicked");
// });
// $('#vehicle').on('click', () => {
//     $('#vehicleSection').css('display', 'block');
//     $('#logsSection').css('display', 'none');
//     $('#staffSection').css('display', 'none');
//     $('#fieldsSection').css('display', 'none');
//     $('#dashboardSection').css('display', 'none');
//     $('#cropsSection').css('display', 'none');
//     $('#equipmentSection').css('display', 'none');
//     $('#userSection').css('display', 'none');
//     console.log("clicked");
// });
// $('#equipment').on('click', () => {
//     $('#equipmentSection').css('display', 'block');
//     $('#vehicleSection').css('display', 'none');
//     $('#logsSection').css('display', 'none');
//     $('#staffSection').css('display', 'none');
//     $('#fieldsSection').css('display', 'none');
//     $('#dashboardSection').css('display', 'none');
//     $('#cropsSection').css('display', 'none');
//     $('#userSection').css('display', 'none');
//
//     console.log("clicked");
// });
// $('#user').on('click', () => {
//     $('#userSection').css('display', 'block');
//     $('#equipmentSection').css('display', 'none');
//     $('#vehicleSection').css('display', 'none');
//     $('#logsSection').css('display', 'none');
//     $('#staffSection').css('display', 'none');
//     $('#fieldsSection').css('display', 'none');
//     $('#dashboardSection').css('display', 'none');
//     $('#cropsSection').css('display', 'none');
//
//
//     console.log("clicked");
// });

