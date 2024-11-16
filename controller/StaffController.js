import { StaffModel } from '../model/StaffModel.js';
import { staffList, fieldList,vehicleList} from '../db/db.js';

const staffForm = document.getElementById("staffForm");
const tableBody = document.getElementById("tbl-staff").querySelector("tbody");
let staffCodeCounter = 1;
let editingRow = null;
const searchStaff = document.getElementById('searchStaff');

// Search functionality
if (searchStaff && tableBody) {
    searchStaff.addEventListener('input', function () {
        try {
            const query = this.value.toLowerCase();
            const rows = tableBody.querySelectorAll('tr');
            let foundMatch = false;

            rows.forEach(row => {
                const staffCode = row.cells[1]?.textContent.toLowerCase();
                const addressLine3 = row.cells[2]?.textContent.toLowerCase();
                const roleStaff = row.cells[3]?.textContent.toLowerCase();

                if (staffCode.includes(query) || addressLine3.includes(query) || roleStaff.includes(query)) {
                    row.style.display = '';
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

// Handle the form submission (for both adding and updating fields)
staffForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const firstName = document.getElementById("firstName").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    const designation = document.getElementById("designation").value.trim();
    const gender = document.getElementById("gender").value;
    const joinedDate = document.getElementById("joinedDate").value.trim()
    const dob = document.getElementById("dob").value;
    const addressLine1  = document.getElementById("addressLine01").value;
    const addressLine2 = document.getElementById("addressLine02").value;
    const addressLine3 = document.getElementById("addressLine03").value;
    const addressLine4 = document.getElementById("addressLine04").value;
    const addressLine5 = document.getElementById("addressLine05").value;
    const contactNo = document.getElementById("contactNo").value;
    const emailStaff = document.getElementById("emailStaff").value;
    const roleStaff = document.getElementById("roleStaff").value;
    const fieldStaff = document.getElementById("filed-staff").value;
    const vehicleStaff = document.getElementById("vehicle-staff").value;


    if (!firstName || !lastName || !designation || !gender || !joinedDate || !dob ||!addressLine1 ||!addressLine2 ||!addressLine3 ||!addressLine4 ||!addressLine5  || !contactNo ||!emailStaff ||!roleStaff) {
        alert("Please fill in all fields.");
        return;
    }


    if (editingRow) {
        // Update the existing field
        const staffIndex = editingRow.dataset.index;
        const staff = staffList[staffIndex];

        // Update the field properties
        staff.firstName = firstName;
        staff.lastName = lastName;
        staff.designation = designation;
        staff.gender =gender;
        staff.joinedDate = joinedDate;
        staff.dob = dob;
        staff.addressLine1 = addressLine1;
        staff.addressLine2= addressLine2;
        staff.addressLine3 = addressLine3;
        staff.addressLine4 = addressLine4;
        staff.addressLine5 = addressLine5;
        staff.contactNo = contactNo;
        staff.email = emailStaff;
        staff.fields = fieldStaff;
        staff.vehicle = vehicleStaff;

        // Update the row in the table
        updateTableRow(staff, staffIndex);

        // Clear the editing row reference
        editingRow = null;

        alert("Staff updated successfully!");
    } else {
        // Add new crop
        const staffCode = "ST0" + staffCodeCounter++;
        const newStaff = new StaffModel(staffCode,firstName, lastName,designation, gender,joinedDate, dob,addressLine1,addressLine2,addressLine3,addressLine4,addressLine5,contactNo,emailStaff,fieldStaff,vehicleStaff );
        staffList.push(newStaff);
        addRowToTable(newStaff, staffList.length - 1);
        alert("New Staff added successfully!");
    }

    staffForm.reset();
    const newStaffModal = bootstrap.Modal.getInstance(document.getElementById("newStaffModal"));
    newStaffModal.hide();
    renderTable();
});

// Function to update table row
function updateTableRow(staff, index) {
    const row = tableBody.querySelector(`tr[data-index='${index}']`);
    row.cells[1].textContent = staff.firstName;
    row.cells[2].textContent = staff.lastName;
    row.cells[3].textContent = staff.designation;
    row.cells[4].textContent = staff.gender;
    row.cells[5].textContent = staff.joinedDate;
    row.cells[6].textContent = staff.dob;
    row.cells[7].textContent = staff.addressLine1;
    row.cells[8].textContent = staff.addressLine2;
    row.cells[9].textContent = staff.addressLine3;
    row.cells[10].textContent = staff.addressLine4;
    row.cells[11].textContent = staff.addressLine5;
    row.cells[12].textContent = staff.contactNo;
    row.cells[13].textContent = staff.staffEmail;
    row.cells[14].textContent = staff.staffRole;
    row.cells[15].textContent = staff.staffFields;
    row.cells[16].textContent = staff.staffVehicle;
}

// Add a row to the table
function addRowToTable(staff, index) {
    const row = document.createElement('tr');
    row.dataset.index = index;
    row.innerHTML = `
        <td>${staff.id}</td>
        <td>${staff.firstName}</td>
        <td>${staff.lastName}</td>
        <td>${staff.designation}</td>
        <td>${staff.gender}</td>
        <td>${staff.joinedDate}</td>
        <td>${staff.dob}</td>
        <td>${staff.addressLine1}</td>
        <td>${staff.addressLine2}</td>
        <td>${staff.addressLine3}</td>
        <td>${staff.addressLine4}</td>
        <td>${staff.addressLine5}</td>
        <td>${staff.contactNo}</td>
        <td>${staff.staffEmail}</td>
        <td>${staff.staffRole}</td>
        <td>${staff.staffFields}</td>
        <td>${staff.staffVehicle}</td>
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
    staffList.forEach((staff, index) => addRowToTable(staff, index));
}

// // Handle table actions (edit & delete)
tableBody.addEventListener("click", function (event) {
    const row = event.target.closest("tr");
    if (!row) return;

    const staffIndex = row.dataset.index;

    if (event.target.classList.contains("edit-btn")) {
        editingRow = row;
        const staff = staffList[staffIndex];

        document.getElementById("firstNameUpdate").value = staff.firstName;
        document.getElementById("lastNameUpdate").value = staff.lastName;
        document.getElementById("designationUpdate").value = staff.designation;
        document.getElementById("genderUpdate").value = staff.gender;
        document.getElementById("joinedDateUpdate").value = staff.joinedDate;
        document.getElementById("dobUpdate").value = staff.dob;
        document.getElementById("addressLine01Update").value = staff.addressLine1;
        document.getElementById("addressLine02Update").value = staff.addressLine2;
        document.getElementById("addressLine03Update").value = staff.addressLine3;
        document.getElementById("addressLine04Update").value = staff.addressLine4;
        document.getElementById("addressLine05Update").value = staff.addressLine5;
        document.getElementById("ContactNoUpdate").value = staff.contactNo;
        document.getElementById("emailStaffUpdate").value = staff.staffEmail;
        document.getElementById("roleStaffUpdate").value = staff.staffRole;
        document.getElementById("updateField").value = staff.staffFields;
        document.getElementById("updateVehicle").value = staff.staffVehicle;

        const updateModal = new bootstrap.Modal(document.getElementById('updateStaffModal'));
        updateModal.show();
    }

    if (event.target.classList.contains("delete-btn")) {
        const confirmed = confirm(`Are you sure you want to delete the staff: ${staffList[staffIndex].id}?`);
        if (confirmed) {
            staffList.splice(staffIndex, 1);
            renderTable();
        }
    }
});
// Initial render of the table
renderTable();

document.getElementById("updateCropForm").addEventListener("submit", function (event) {
    event.preventDefault();
    if (editingRow) {
        // Get values from the update crop form fields
        const firstName = document.getElementById("firstNameUpdate").value.trim();
        const lastName = document.getElementById("lastNameUpdate").value.trim();
        const designation = document.getElementById("designationUpdate").value.trim();
        const gender = document.getElementById("genderUpdate").value.trim();
        const joinedDate = document.getElementById("joinedDateUpdate").value.trim();
        const dob = document.getElementById("dobUpdate").value.trim();
        const addressLine1 = document.getElementById("addressLine01Update").value;
        const addressLine2 = document.getElementById("addressLine02Update").value;
        const addressLine3 = document.getElementById("addressLine03Update").value;
        const addressLine4 = document.getElementById("addressLine04Update").value;
        const addressLine5 = document.getElementById("addressLine05Update").value;
        const contactNo = document.getElementById("ContactNoUpdate").value;
        const email = document.getElementById("emailStaffUpdate").value;
        const staffRole = document.getElementById("roleStaffUpdate").value;
        const staffFields = document.getElementById("updateField").value;
        const staffVehicle = document.getElementById("updateVehicle").value;

        const cells = editingRow.getElementsByTagName("td");
        cells[1].innerText = firstName;
        cells[2].innerText = lastName;
        cells[3].innerText = designation;
        cells[4].innerText = gender;
        cells[5].innerText = joinedDate;
        cells[6].innerText = dob;
        cells[7].innerText = addressLine1;
        cells[8].innerText = addressLine2;
        cells[9].innerText = addressLine3;
        cells[10].innerText = addressLine4;
        cells[11].innerText = addressLine5;
        cells[12].innerText = contactNo;
        cells[13].innerText = email;
        cells[14].innerText = staffRole;
        cells[15].innerText = staffFields;
        cells[16].innerText = staffVehicle;


        alert("Staff updated successfully!");
        editingRow = null;
        const updateStaffModalEl = document.getElementById('updateStaffModal');
        const updateStaffModal = bootstrap.Modal.getInstance(updateStaffModalEl);
        if (updateStaffModal) {
            updateStaffModal.hide();
        }
        staffForm.reset();
    }
});


