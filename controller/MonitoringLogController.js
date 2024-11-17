import { LogModel } from '../model/LogModel.js';
import { staffList, fieldList,vehicleList,logList} from '../db/db.js';

const logForm = document.getElementById("logForm");
const tableBody = document.getElementById("tbl-log").querySelector("tbody");
let logCodeCounter = 1;
let editingRow = null;
const searchLog = document.getElementById('searchLog');
// Search functionality
if (searchLog && tableBody) {
    searchLog.addEventListener('input', function () {
        try {
            const query = this.value.toLowerCase();
            const rows = tableBody.querySelectorAll('tr');
            let foundMatch = false;

            rows.forEach(row => {
                const logCode = row.cells[1]?.textContent.toLowerCase();
                if (logCode.includes(query)) {
                    row.style.display = '';
                    foundMatch = true;
                } else {
                    row.style.display = 'none';
                }
            });
            if (!foundMatch && query) {
                alert("No matching staff records found.");
            }
        } catch (error) {
            console.error("Search error:", error);
        }
    });
}
function formatDate(dateString) {
    const date = new Date(dateString);
    return `${(date.getMonth() + 1).toString().padStart(2, '0')}/${
        date.getDate().toString().padStart(2, '0')
    }/${date.getFullYear()}`;
}
// Handle the form submission (for both adding and updating fields)
logForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const logDate = document.getElementById("logDate").value.trim();
    const logDetails = document.getElementById("logDetails").value.trim();
    const observedImage = document.getElementById("observedImage").files[0];
    const relevantFields = document.getElementById("logFiledId").value.trim();
    const relevantCrops = document.getElementById("logCropId").value.trim()
    const relevantStaff= document.getElementById("logStaffId").value.trim();
    if (!logDate || !logDetails  ) {
        alert("Please fill in all fields.");
        return;
    }
    if (!observedImage){
        alert("Please Upload Image")
        return;
    }
    const imgSrc = observedImage ? URL.createObjectURL(observedImage): '';

    if (editingRow) {
        // Update the existing field
        const logIndex = editingRow.dataset.index;
        const log = logList[logIndex];

        // Update the field properties
        log.logDate =logDate;
        log.logDetails =logDetails;
        log.observedImage= imgSrc || log.observedImage;
        log.relevantFields =relevantFields;
        log.relevantCrops =relevantCrops;
        log.relevantStaff =relevantStaff
        updateTableRow(log, logIndex);
        // Clear the editing row reference
        editingRow = null;
        alert("Log updated successfully!");
    } else {
        // Add new log
        const logCode = "   LG0" + logCodeCounter++;
        const newLog = new LogModel(logCode,logDate, logDetails,observedImage, relevantFields,relevantCrops,relevantStaff);
        logList.push(newLog);
        addRowToTable(newLog, logList.length - 1);
        alert("New Log added successfully!");
    }

    logForm.reset();
    clearImagePreviews();
    const newLogModal = bootstrap.Modal.getInstance(document.getElementById("newLogModal"));
    newLogModal.hide();
    renderTable();
});
// Function to update table row
function updateTableRow(log, index) {
    const row = tableBody.querySelector(`tr[data-index='${index}']`);
    row.cells[1].textContent = log.logDate;
    row.cells[2].textContent = log.logDetails;
    row.cells[3].querySelector("img").src = log.observedImage || "#";
    row.cells[4].textContent = log.relevantFields;
    row.cells[5].textContent = log.relevantCrops;
    row.cells[6].textContent = log.relevantStaff;
}
// Add a row to the table
function addRowToTable(log, index) {
    const row = document.createElement('tr');
    row.dataset.index = index;
    row.innerHTML = `
        <td>${log.logCode}</td>
        <td>${formatDate(log.logDate)}</td>
        <td>${log.logDetails}</td>
        <td><img src="${log.observedImage}" width="50"></td>
        <td>${log.relevantFields}</td>
        <td>${log.relevantCrops}</td>
        <td>${log.relevantStaff}</td>
        <td>
            <button class="btn btn-warning btn-sm edit-btn">Update</button>
            <button class="btn btn-danger btn-sm delete-btn">Delete</button>
        </td>
    `;
    tableBody.appendChild(row);
}

// Render the table from fieldList (all fields)
function renderTable() {
    tableBody.innerHTML = '';
    logList.forEach((log, index) => addRowToTable(log, index));
}
// Handle table actions (edit & delete)
tableBody.addEventListener("click", function (event) {
    const row = event.target.closest("tr");
    if (!row) return;

    const logIndex = row.dataset.index;

    if (event.target.classList.contains("edit-btn")) {
        editingRow = row;
        const log = logList[logIndex];

        document.getElementById("updateLogDate").value = new Date(log.logDate).toISOString().split('T')[0];
        document.getElementById("updateDetails").value = log.logDetails;
        document.getElementById("updateLogFieldId").value = log.relevantFields;
        document.getElementById("updateLogCropId").value = log.relevantCrops;
        document.getElementById("updateLogStaffId").value = log.relevantStaff;


        const imgSrc = row.cells[3].querySelector("img").src;

        if (imgSrc) {
            document.getElementById("updatePreviewLog").src = imgSrc;
            document.getElementById("updatePreviewLog").classList.remove('d-none');
        } else {
            document.getElementById("updatePreviewLog").classList.add('d-none');
        }

        const updateModal = new bootstrap.Modal(document.getElementById('updateLogModal'));
        updateModal.show();
    }

    if (event.target.classList.contains("delete-btn")) {
        const confirmed = confirm(`Are you sure you want to delete the crop: ${logList[logIndex].logCode}?`);
        if (confirmed) {
            logList.splice(logIndex, 1);
            renderTable();
        }
    }
});
     // Function to clear image previews
    function clearImagePreviews() {
        const previewLog = document.getElementById('previewLog');
        if (previewLog) {
            previewLog.src = "#";
            previewLog.classList.add('d-none');
        }
    }
    // Initial render of the table
    renderTable();

document.getElementById("updateLogForm").addEventListener("submit", function (event) {
    event.preventDefault();
    if (editingRow) {
        // Get values from the update crop form fields
        const logDate = document.getElementById("updateLogDate").value.trim();
        const logDetails = document.getElementById("updateDetails").value.trim();
        const observedImage = document.getElementById("updateLogImage").files[0];
        const relevantFields = document.getElementById("updateLogFieldId").value.trim();
        const relevantCrops = document.getElementById("updateLogCropId").value.trim();
        const relevantStaff = document.getElementById("updateLogStaffId").value.trim();
        const cells = editingRow.getElementsByTagName("td");
        cells[1].innerText = logDate;
        cells[2].innerText = logDetails;
        cells[4].innerText = relevantFields;
        cells[5].innerText = relevantCrops;
        cells[6].innerText = relevantStaff;
        if (observedImage) {
            cells[3].querySelector("img").src = URL.createObjectURL(observedImage);
        }
        alert("Log updated successfully!");
        editingRow = null;
        const updateLogModalEl = document.getElementById('updateLogModal');
        const updateLogModal = bootstrap.Modal.getInstance(updateLogModalEl);
        if (updateLogModal) {
            updateLogModal.hide();
        }
        logForm.reset();
    }
});