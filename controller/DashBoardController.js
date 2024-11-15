
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

// Date and time update function
$(document).ready(function() {
    function updateDateTime() {
        const currentDate = new Date().toLocaleDateString();
        const currentTime = new Date().toLocaleTimeString();
        $('#date').text(` ${currentDate}`);
        $('#time').text(` ${currentTime}`);
    }

    updateDateTime();
    setInterval(updateDateTime, 1000);
});

// Navigation functionality for different sections
function showSection(sectionId) {
    $(".content section").hide();
    $(sectionId).show();
}
$('#crops').on('click', () => showSection('#cropsSection'));
$('#dashboard').on('click', () => showSection('#dashboardSection'));
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

