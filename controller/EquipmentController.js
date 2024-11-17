import { EquipmentModel } from '../model/EquipmentModel.js';
import { staffList,fieldList,equipmentList} from '../db/db.js';

const equipmentForm = document.getElementById("equipmentForm");
const tableBody = document.getElementById("tbl-equipment").querySelector("tbody");
let equipmentCodeCounter = 1;
let editingRow = null;
const searchEquipment = document.getElementById('searchEquipment');
// Search functionality
if (searchEquipment && tableBody) {
    searchEquipment.addEventListener('input', function () {
        try {
            const query = this.value.toLowerCase();
            const rows = tableBody.querySelectorAll('tr');
            let foundMatch = false;

            rows.forEach(row => {
                const equipmentCode = row.cells[1]?.textContent.toLowerCase();
                const equipmentType = row.cells[2]?.textContent.toLowerCase();
                const equipmentStatus = row.cells[3]?.textContent.toLowerCase();
                if (equipmentCode.includes(query) || equipmentType.includes(query) || equipmentStatus.includes(query)) {
                    row.style.display = '';
                    foundMatch = true;
                } else {
                    row.style.display = 'none';
                }
            });
            if (!foundMatch && query) {
                alert("No matching vehicle records found.");
            }
        } catch (error) {
            console.error("Search error:", error);
        }
    });
}

// Fuel Types and Farm Vehicle Categories
const Types = ["Select  Type" ,"Electrical", "Mechanical"];
const status = ["Select Status" ,"Available", "In Use"];

// Function to populate dropdowns
function populateDropdown(dropdown, options, selectedValue = "") {
    dropdown.innerHTML = ""; // Clear existing options
    options.forEach(option => {
        const opt = document.createElement("option");
        opt.value = option;
        opt.textContent = option;
        if (option === selectedValue) {
            opt.selected = true;
        }
        dropdown.appendChild(opt);
    });
}

// Populate the dropdowns for Fuel Type and Farm Vehicle Category on page load
populateDropdown(document.getElementById("equipmentType"), Types);
populateDropdown(document.getElementById("equipmentStatus"), status);

// Handle the form submission (for both adding and updating fields)
equipmentForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const equipmentName = document.getElementById("equipmentName").value.trim();
    const equipmentType= document.getElementById("equipmentType").value.trim();
    const equipmentStatus = document.getElementById("equipmentStatus").value.trim();
    const equipmentAssignedStaff= document.getElementById("EquipmentStaffId").value.trim();
    const equipmentAssignedField = document.getElementById("EquipmentFieldId").value.trim()
    if (!equipmentName || !equipmentType || !equipmentStatus) {
        alert("Please fill in all fields.");
        return;
    }
    if (editingRow) {
        // Update the existing field
        const equipmentIndex = editingRow.dataset.index;
        const equipment = equipmentList[equipmentIndex];

        // Update the field properties
        equipment.equipmentName =equipmentName;
        equipment.equipmentType =equipmentType;
        equipment.equipmentStatus =equipmentStatus;
        equipment.equipmentAssignedStaff =equipmentAssignedStaff;
        equipment.eequipmentAssignedField  =equipmentAssignedField ;


        updateTableRow(equipment, equipmentIndex);
        // Clear the editing row reference
        editingRow = null;
        alert("Equipment updated successfully!");
    } else {
        // Add new log
        const equipmentCode = "   EQ0" + equipmentCodeCounter++;
        const newEquipment = new EquipmentModel(equipmentCode,equipmentName,equipmentType,equipmentStatus,equipmentAssignedStaff,equipmentAssignedField);
        equipmentList.push(newEquipment);
        addRowToTable(newEquipment, equipmentList.length - 1);
        alert("New Equipment added successfully!");
    }

    equipmentForm.reset();
    const newEquipmentModal = bootstrap.Modal.getInstance(document.getElementById("newEquipmentModal"));
    newEquipmentModal.hide();
    renderTable();
});
// // Function to update table row
function updateTableRow(equipment, index) {
    const row = tableBody.querySelector(`tr[data-index='${index}']`);
    row.cells[1].textContent = equipment.equipmentName;
    row.cells[2].textContent = equipment.equipmentType;
    row.cells[3].textContent = equipment.equipmentStatus;
    row.cells[4].textContent = equipment.equipmentAssignedStaff;
    row.cells[6].textContent = equipment.eequipmentAssignedField;
}
// // // Add a row to the table
function addRowToTable(equipment, index) {
    const row = document.createElement('tr');
    row.dataset.index = index;
    row.innerHTML = `
        <td>${equipment.equipmentCode}</td>
        <td>${equipment.equipmentName}</td>
        <td>${equipment.equipmentType}</td>
        <td>${equipment.equipmentStatus}</td>
        <td>${equipment.equipmentAssignedStaff}</td>
        <td>${equipment.equipmentAssignedField}</td>

        <td>
            <button class="btn btn-warning btn-sm edit-btn">Update</button>
            <button class="btn btn-danger btn-sm delete-btn">Delete</button>
        </td>
    `;
    tableBody.appendChild(row);
}
function renderTable() {
    tableBody.innerHTML = '';
    equipmentList.forEach((equipment, index) => addRowToTable(equipment, index));
}

// // Handle table actions (edit & delete)
 tableBody.addEventListener("click", function (event) {
    const row = event.target.closest("tr");
    if (!row) return;

     const equipmentIndex = row.dataset.index;
     if (event.target.classList.contains("edit-btn")) {
        editingRow = row;
        const equipment = equipmentList[equipmentIndex];

        document.getElementById("updateEquipmentName").value = equipment.equipmentName;
        populateDropdown(document.getElementById("updateEquipmentType"), Types,equipment.equipmentType);
        populateDropdown(document.getElementById("updateEquipmentStatus"),status,equipment.equipmentStatus);
        document.getElementById("updateEquipmentStaffMember").value = equipment.equipmentAssignedStaff;
        document.getElementById("updateEquipmentFields").value = equipment.equipmentAssignedField;

        const updateEquipmentModal = new bootstrap.Modal(document.getElementById('updateEquipmentModal'));
        updateEquipmentModal.show();
    }

    if (event.target.classList.contains("delete-btn")) {
        const confirmed = confirm(`Are you sure you want to delete the vehicle: ${equipmentList[equipmentIndex].equipmentCode}?`);
        if (confirmed) {
            equipmentList.splice(equipmentIndex, 1);
            renderTable();
        }
    }
});
 // Initial render of the table
 renderTable();

document.getElementById("updateEquipmentForm").addEventListener("submit", function (event) {
    event.preventDefault();
    if (editingRow) {
        // Get values from the update crop form fields
        const equipmentName = document.getElementById("updateEquipmentName").value.trim();
        const equipmentType= document.getElementById("updateEquipmentType").value.trim();
        const equipmentStatus = document.getElementById("updateEquipmentStatus").value.trim();
        const equipmentStaffMember= document.getElementById("updateEquipmentStaffMember").value.trim();
        const equipmentFields= document.getElementById("updateEquipmentFields").value.trim();
        const cells = editingRow.getElementsByTagName("td");
        cells[1].innerText = equipmentName;
        cells[2].innerText = equipmentType;
        cells[3].innerText = equipmentStatus;
        cells[4].innerText = equipmentStaffMember;
        cells[5].innerText = equipmentFields;

        alert("Equipment updated successfully!");
        editingRow = null;
        const updateEquipmentModalEl = document.getElementById('updateEquipmentModal');
        const updateEquipmentModal = bootstrap.Modal.getInstance(updateEquipmentModalEl);
        if (updateEquipmentModal) {
            updateEquipmentModal.hide();
        }
       equipmentForm.reset();
    }
});