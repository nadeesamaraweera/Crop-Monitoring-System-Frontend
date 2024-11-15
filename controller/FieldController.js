import { FieldModel } from '../model/FieldModel.js';
import { cropList, staffList, fieldList } from '../db/db.js';

const fieldForm = document.getElementById("fieldForm");
const tableBody = document.getElementById("tbl-field").querySelector("tbody");
let fieldCodeCounter = 1;
let editingRow = null;
const searchField = document.getElementById('searchField');

function selectLocation() {
    console.log("Getting location...");
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                document.getElementById("fieldLocation").value = `${latitude}, ${longitude}`;
                alert("Location set successfully!");
                console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
            },
            (error) => {
                console.error("Error retrieving location:", error);
                alert("Unable to retrieve location. Please try again.");
            }
        );
    } else {
        alert("Geolocation is not supported by this browser.");
        console.error("Geolocation not supported.");
    }
}
document.getElementById("location").addEventListener("click", selectLocation);  // Add this line
document.getElementById("updateLocation").addEventListener("click", selectLocation);  // Add this line
// Search functionality
if (searchField && tableBody) {
    searchField.addEventListener('input', function () {
        try {
            const query = this.value.toLowerCase();
            const rows = tableBody.querySelectorAll('tr');
            let foundMatch = false;

            rows.forEach(row => {
                const fieldName = row.cells[1]?.textContent.toLowerCase();
                const location = row.cells[2]?.textContent.toLowerCase();
                const extentSize = row.cells[3]?.textContent.toLowerCase();
                const crops = row.cells[4]?.textContent.toLowerCase();

                if (fieldName.includes(query) || location.includes(query) || extentSize.includes(query) || crops.includes(query)) {
                    row.style.display = '';
                    foundMatch = true;
                } else {
                    row.style.display = 'none';
                }
            });

            if (!foundMatch && query) {
                alert("No matching field records found.");
            }
        } catch (error) {
            console.error("Search error:", error);
        }
    });
}
// Populate dropdowns for crops and staff
function populateDropdowns() {
    const cropDropdown = document.getElementById("filed-cropId");
    const staffDropdown = document.getElementById("filed-staffId");

    cropList.forEach(crop => {
        const option = document.createElement("option");
        option.value = crop.name;
        option.textContent = crop.name;
        cropDropdown.appendChild(option);
    });

    staffList.forEach(staff => {
        const option = document.createElement("option");
        option.value = staff.name;
        option.textContent = staff.name;
        staffDropdown.appendChild(option);
    });
}
// Populate dropdowns for update modal
function populateUpdateDropdowns() {
    const cropDropdown = document.getElementById("fieldCropUpdate");
    const staffDropdown = document.getElementById("staffCropUpdate");

    cropDropdown.innerHTML = '<option value="">Select Crop</option>';
    staffDropdown.innerHTML = '<option value="">Select Staff Member</option>';

    cropList.forEach(crop => {
        const option = document.createElement("option");
        option.value = crop.name;
        option.textContent = crop.name;
        cropDropdown.appendChild(option);
    });

    staffList.forEach(staff => {
        const option = document.createElement("option");
        option.value = staff.name;
        option.textContent = staff.name;
        staffDropdown.appendChild(option);
    });
}

populateDropdowns();
// Clear image previews
function clearImagePreviews() {
    const preview1 = document.getElementById('preview1');
    const preview2 = document.getElementById('preview2');

    if (preview1) {
        preview1.src = "#";
        preview1.classList.add('d-none');
    }
    if (preview2) {
        preview2.src = "#";
        preview2.classList.add('d-none');
    }
}
// Handle the form submission (for both adding and updating fields)
fieldForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const fieldName = document.getElementById("fieldName").value.trim();
    const fieldLocation = document.getElementById("fieldLocation").value.trim();
    const extentSize = document.getElementById("extentSize").value.trim();
    const staff = document.getElementById("filed-staffId").value;
    const crop = document.getElementById("filed-cropId").value;
    const fieldImage1 = document.getElementById("fieldImage1").files[0];
    const fieldImage2 = document.getElementById("fieldImage2").files[0];

    if (!fieldName || !fieldLocation || !extentSize) {
        alert("Please fill in all fields.");
        return;
    }
    if (!fieldImage1 && !fieldImage2) {
        alert("Please upload at least one image");
        return;
    }

    const img1Src = fieldImage1 ? URL.createObjectURL(fieldImage1) : '';
    const img2Src = fieldImage2 ? URL.createObjectURL(fieldImage2) : '';

    if (editingRow) {
        // Update the existing field
        const fieldIndex = editingRow.dataset.index;
        const field = fieldList[fieldIndex];

        // Update the field properties
        field.fieldName = fieldName;
        field.fieldLocation = fieldLocation;
        field.extentSize = extentSize;
        field.crops = crop;
        field.staff = staff;
        field.fieldImage1 = img1Src || field.fieldImage1;  // Only update if the new image exists
        field.fieldImage2 = img2Src || field.fieldImage2;  // Only update if the new image exists

        // Update the row in the table
        updateTableRow(field, fieldIndex);

        // Clear the editing row reference
        editingRow = null;

        alert("Field updated successfully!");
    } else {
        // Add new field
        const fieldCode = "F00" + fieldCodeCounter++;
        const newField = new FieldModel(fieldCode, fieldName, fieldLocation, extentSize, crop, staff, img1Src, img2Src);
        fieldList.push(newField);
        addRowToTable(newField, fieldList.length - 1);
        alert("New field added successfully!");
    }

    fieldForm.reset();
    clearImagePreviews();
    const newFieldModal = bootstrap.Modal.getInstance(document.getElementById("newFieldModal"));
    newFieldModal.hide();
    renderTable();
});

// Update the specific row in the table after editing
function updateTableRow(field, index) {
    const row = tableBody.querySelector(`tr[data-index='${index}']`);
    row.cells[1].textContent = field.fieldName;
    row.cells[2].textContent = field.fieldLocation;
    row.cells[3].textContent = field.extentSize;
    row.cells[4].textContent = field.crops;
    row.cells[5].textContent = field.staff;
    row.cells[6].querySelector("img").src = field.fieldImage1 || "#";
    row.cells[7].querySelector("img").src = field.fieldImage2 || "#";
}

// Add a row to the table (for new fields)
function addRowToTable(field, index) {
    const row = document.createElement('tr');
    row.dataset.index = index;
    row.innerHTML = `
        <td>${field.fieldCode}</td>
        <td>${field.fieldName}</td>
        <td>${field.fieldLocation}</td>
        <td>${field.extentSize}</td>
        <td>${field.crops}</td>
        <td>${field.staff}</td>
        <td><img src="${field.fieldImage1}" width="50"></td>
        <td><img src="${field.fieldImage2}" width="50"></td>
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
    fieldList.forEach((field, index) => addRowToTable(field, index));
}

// Handle click events for edit and delete buttons
document.getElementById("tbl-field").addEventListener("click", function (event) {
    const row = event.target.closest("tr");
    if (!row) return;

    const fieldIndex = row.dataset.index;

    if (event.target.classList.contains("edit-btn")) {
        // Populate update modal for editing
        editingRow = row;
        const field = fieldList[fieldIndex];

        document.getElementById("updateFieldName").value = field.fieldName;
        document.getElementById("updateFieldLocation").value = field.fieldLocation;
        document.getElementById("updateExtentSize").value = field.extentSize;

        populateUpdateDropdowns();
        document.getElementById("fieldCropUpdate").value = field.crops;
        document.getElementById("staffCropUpdate").value = field.staff;

        const img1Src = row.cells[6].querySelector("img") ? row.cells[6].querySelector("img").src : '';
        const img2Src = row.cells[7].querySelector("img") ? row.cells[7].querySelector("img").src : '';

        if (img1Src) {
            document.getElementById("updatePreview1").src = img1Src;
            document.getElementById("updatePreview1").classList.remove('d-none');
        } else {
            document.getElementById("updatePreview1").classList.add('d-none');
        }

        if (img2Src) {
            document.getElementById("updatePreview2").src = img2Src;
            document.getElementById("updatePreview2").classList.remove('d-none');
        } else {
            document.getElementById("updatePreview2").classList.add('d-none');
        }

        const updateModal = new bootstrap.Modal(document.getElementById('updateFieldModal'));
        updateModal.show();
    }

    if (event.target.classList.contains("delete-btn")) {
        const field = fieldList[fieldIndex];
        const confirmed = confirm(`Are you sure you want to delete the field: ${field.fieldName}?`);
        if (confirmed) {
            fieldList.splice(fieldIndex, 1);
            renderTable();
        }
    }
});

// Initial table render
renderTable();

document.getElementById("updateFieldForm").addEventListener("submit", function (event) {
    event.preventDefault();
    if (editingRow) {
        const fieldName = document.getElementById("updateFieldName").value.trim();
        const fieldLocation = document.getElementById("updateFieldLocation").value.trim();
        const extentSize = document.getElementById("updateExtentSize").value.trim();
        const crop = document.getElementById("fieldCropUpdate").value;
        const staff = document.getElementById("staffCropUpdate").value;
        const fieldImage1 = document.getElementById("updateFieldImage1").files[0];
        const fieldImage2 = document.getElementById("updateFieldImage2").files[0];
        const cells = editingRow.getElementsByTagName("td");
        cells[1].innerText = fieldName;
        cells[2].innerText = fieldLocation;
        cells[3].innerText = extentSize;
        cells[4].innerText = crop;
        cells[5].innerText = staff;
        if (fieldImage1) {
            cells[6].querySelector("img").src = URL.createObjectURL(fieldImage1);
        }
        if (fieldImage2) {
            cells[7].querySelector("img").src = URL.createObjectURL(fieldImage2);
        }
        alert("Field updated successfully!");
        editingRow = null;
        const updateFieldModalEl = document.getElementById('updateFieldModal');
        const updateFieldModal = bootstrap.Modal.getInstance(updateFieldModalEl);
        if (updateFieldModal) {
            updateFieldModal.hide();
        }
        fieldForm.reset();
    }
});

