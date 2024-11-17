import { VehicleModel } from '../model/VehicleModel.js';
import { staffList, vehicleList} from '../db/db.js';

const vehicleForm = document.getElementById("vehicleForm");
const tableBody = document.getElementById("tbl-vehicle").querySelector("tbody");
let vehicleCodeCounter = 1;
let editingRow = null;
const searchVehicle = document.getElementById('searchVehicle');
// Search functionality
if (searchVehicle && tableBody) {
    searchVehicle.addEventListener('input', function () {
        try {
            const query = this.value.toLowerCase();
            const rows = tableBody.querySelectorAll('tr');
            let foundMatch = false;

            rows.forEach(row => {
                const vehicleCode = row.cells[1]?.textContent.toLowerCase();
                const licenseNumber = row.cells[2]?.textContent.toLowerCase();
                const vehicleStatus = row.cells[3]?.textContent.toLowerCase();


                if (vehicleCode.includes(query) || licenseNumber.includes(query) || vehicleStatus.includes(query)) {
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
const fuelTypes = ["Select Fuel Type" ,"Gasoline", "Diesel", "CNG", "LPG", "Electric", "Hybrid", "Hydrogen"];
const vehicleCategories = ["Select Category" ,"Tractor", "Harvester", "Plow", "Sprayer", "Cultivator", "Seed Drill", "Wagon", "Combine", "Baler"];
const status = ["Select Status" ,"Available", "Out Of Service"];

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
populateDropdown(document.getElementById("fuelType"), fuelTypes);
populateDropdown(document.getElementById("vehicleCategory"), vehicleCategories);
populateDropdown(document.getElementById("vehicleStatus"), status);



// Handle the form submission (for both adding and updating fields)
vehicleForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const licenseNumber = document.getElementById("licenseNumber").value.trim();
    const vehicleCategory = document.getElementById("vehicleCategory").value.trim();
    const fuelType = document.getElementById("fuelType").value.trim();
    const vehicleStatus = document.getElementById("vehicleStatus").value.trim();
    const vehicleAllocatedStaff = document.getElementById("VehicleStaffId").value.trim()
    const vehicleRemark = document.getElementById("vehicleRemark").value.trim();
    if (!licenseNumber || !vehicleCategory || !fuelType) {
        alert("Please fill in all fields.");
        return;
    }
    if (editingRow) {
        // Update the existing field
        const vehicleIndex = editingRow.dataset.index;
        const vehicle = vehicleList[vehicleIndex];

        // Update the field properties
        vehicle.licenseNumber = licenseNumber;
        vehicle.vehicleCategory = vehicleCategory;
        vehicle.fuelType = fuelType;
        vehicle.vehicleStatus = vehicleStatus;
        vehicle.vehicleAllocatedStaff = vehicleAllocatedStaff;
        vehicle.vehicleRemark= vehicleRemark;

        updateTableRow(vehicle, vehicleIndex);
        // Clear the editing row reference
        editingRow = null;
        alert("Vehicle updated successfully!");
    } else {
        // Add new log
        const vehicleCode = "   VH0" + vehicleCodeCounter++;
        const newVehicle = new VehicleModel(vehicleCode,licenseNumber,vehicleCategory,fuelType,vehicleStatus,vehicleAllocatedStaff,vehicleRemark);
        vehicleList.push(newVehicle);
        addRowToTable(newVehicle, vehicleList.length - 1);
        alert("New Vehicle added successfully!");
    }

    vehicleForm.reset();
    const newVehicleModal = bootstrap.Modal.getInstance(document.getElementById("newVehicleModal"));
    newVehicleModal.hide();
    renderTable();
});
// // Function to update table row
function updateTableRow(vehicle, index) {
    const row = tableBody.querySelector(`tr[data-index='${index}']`);
    row.cells[1].textContent = vehicle.licenseNumber;
    row.cells[2].textContent = vehicle.vehicleCategory;
    row.cells[3].textContent = vehicle.fuelType;
    row.cells[4].textContent = vehicle.vehicleStatus;
    row.cells[5].textContent = vehicle.vehicleAllocatedStaff;
    row.cells[6].textContent = vehicle.vehicleRemark;
}
// // Add a row to the table
function addRowToTable(vehicle, index) {
    const row = document.createElement('tr');
    row.dataset.index = index;
    row.innerHTML = `
        <td>${vehicle.vehicleCode}</td>
        <td>${vehicle.licenseNumber}</td>
        <td>${vehicle.vehicleCategory}</td>
        <td>${vehicle.fuelType}</td>
        <td>${vehicle.vehicleStatus}</td>
        <td>${vehicle.vehicleAllocatedStaff}</td>
        <td>${vehicle.vehicleRemark}</td>

        <td>
            <button class="btn btn-warning btn-sm edit-btn">Update</button>
            <button class="btn btn-danger btn-sm delete-btn">Delete</button>
        </td>
    `;
    tableBody.appendChild(row);
}
function renderTable() {
    tableBody.innerHTML = '';
    vehicleList.forEach((vehicle, index) => addRowToTable(vehicle, index));
}

// Handle table actions (edit & delete)
tableBody.addEventListener("click", function (event) {
    const row = event.target.closest("tr");
    if (!row) return;

    const vehicleIndex = row.dataset.index;

    if (event.target.classList.contains("edit-btn")) {
        editingRow = row;
        const vehicle = vehicleList[vehicleIndex];

        document.getElementById("updateLicenseNumber").value = vehicle.licenseNumber;
        populateDropdown(document.getElementById("updateVehicleCategory"), vehicleCategories,vehicle.vehicleCategory);
        populateDropdown(document.getElementById("updateFuelType"), fuelTypes,vehicle.fuelType);
        populateDropdown(document.getElementById("updateStatus"),status,vehicle.vehicleStatus);
        document.getElementById("updateStaffMember").value = vehicle.vehicleAllocatedStaff;
        document.getElementById("updateRemark").value = vehicle.vehicleRemark;

        const updateVehicleModal = new bootstrap.Modal(document.getElementById('updateVehicleModal'));
        updateVehicleModal.show();
    }

    if (event.target.classList.contains("delete-btn")) {
        const confirmed = confirm(`Are you sure you want to delete the vehicle: ${vehicleList[vehicleIndex].vehicleCode}?`);
        if (confirmed) {
            vehicleList.splice(vehicleIndex, 1);
            renderTable();
        }
    }
});

// Initial render of the table
renderTable();

document.getElementById("updateVehicleForm").addEventListener("submit", function (event) {
    event.preventDefault();
    if (editingRow) {
        // Get values from the update crop form fields
        const licenseNumber = document.getElementById("updateLicenseNumber").value.trim();
        const vehicleCategory = document.getElementById("updateVehicleCategory").value.trim();
        const fuelType = document.getElementById("updateFuelType").value.trim();
        const vehicleStatus = document.getElementById("updateStatus").value.trim();
        const allocatedStaff = document.getElementById("updateStaffMember").value.trim();
        const vehicleRemark = document.getElementById("updateRemark").value.trim();
        const cells = editingRow.getElementsByTagName("td");
        cells[1].innerText = licenseNumber;
        cells[2].innerText = vehicleCategory;
        cells[3].innerText = fuelType;
        cells[4].innerText = vehicleStatus;
        cells[5].innerText = allocatedStaff;
        cells[6].innerText = vehicleRemark;


        alert("Vehicle updated successfully!");
        editingRow = null;
        const updateVehicleModalEl = document.getElementById('updateVehicleModal');
        const updateVehicleModal = bootstrap.Modal.getInstance(updateVehicleModalEl);
        if (updateVehicleModal) {
            updateVehicleModal.hide();
        }
        vehicleForm.reset();
    }
});