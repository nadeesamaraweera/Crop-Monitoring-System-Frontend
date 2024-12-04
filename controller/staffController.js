import {
  checkTokenValidity,
  getAllStaff,
  getAllVehicles,
  saveStaff,
  updateStaff,
  searchStaff,
  deleteStaff,
  validateUserData,
} from "../model/staffModel.js";

$(document).ready(function () {
  if (checkTokenValidity()) {
    $("#btnSave").click(() => {
      const firstName = $("#staffFirstName").val();
      const lastName = $("#staffLastName").val();
      const designation = $("#designation").val();
      const gender = $("#gender").val();
      const dob = $("#dob").val();
      const addressL1 = $("#addressL1").val();
      const addressL2 = $("#addressL2").val();
      const addressL3 = $("#addressL3").val();
      const addressL4 = $("#addressL4").val();
      const addressL5 = $("#addressL5").val();
      const mobile = $("#mobile").val();
      const email = $("#email").val();
      const role = $("#role").val();
      const vehicleId = $("#vehicleId").val();

      const userData = {
        firstName: firstName,
        lastName: lastName,
        designation: designation,
        gender: gender,
        dateOfBirth: dob,
        addressLine1: addressL1,
        addressLine2: addressL2,
        addressLine3: addressL3,
        addressLine4: addressL4,
        addressLine5: addressL5,
        mobile: mobile,
        email: email,
        role: role,
        vehicleId: vehicleId,
      };

      if (validateUserData(userData)) {
        const promise = saveStaff(userData);
        promise.then(() => {
          loadStaffTable();
        });
      }
    });

    $("#btnEdit").click(function () {
      const staffId = $("#editStaffId").val();
      const firstName = $("#editStaffFirstName").val();
      const lastName = $("#editStaffLastName").val();
      const designation = $("#editDesignation").val();
      const gender = $("#editGender").val();
      const dob = $("#editDob").val();
      const addressL1 = $("#editAddressL1").val();
      const addressL2 = $("#editAddressL2").val();
      const addressL3 = $("#editAddressL3").val();
      const addressL4 = $("#editAddressL4").val();
      const addressL5 = $("#editAddressL5").val();
      const mobile = $("#editMobile").val();
      const email = $("#editEmail").val();
      const role = $("#editRole").val();
      const vehicleId = $("#editVehicleId").val();

      const staffData = {
        firstName: firstName,
        lastName: lastName,
        designation: designation,
        gender: gender,
        dateOfBirth: dob,
        addressLine1: addressL1,
        addressLine2: addressL2,
        addressLine3: addressL3,
        addressLine4: addressL4,
        addressLine5: addressL5,
        mobile: mobile,
        email: email,
        role: role,
        vehicleId: vehicleId,
      };

      swal({
        title: "Are you sure?",
        text: "Do you want to update this member!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willUpdate) => {
        if (willUpdate) {
          if (validateUserData(staffData)) {
            const promise = updateStaff(staffId, staffData);
            promise.then(() => {
              loadStaffTable();
            });
          }
        }
      });
    });

    $("#btnSearch").click(async function () {
      try {
        const staffId = $("#dropdownMenuButton").text().trim();

        if (!staffId || staffId === "Search Staff By Id") {
          swal("Warning!", "Please select a valid staff ID", "warning");
          return;
        }

        $("#btnSearch")
          .html(
            '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Searching...'
          )
          .prop("disabled", true);

        const staffDetails = await searchStaff(staffId);

        let staffArray = [];
        if (staffDetails) {
          if (Array.isArray(staffDetails)) {
            staffArray = staffDetails;
          } else if (typeof staffDetails === "object") {
            staffArray = [staffDetails];
          }
        }

        $("#staffTable").empty();

        if (staffArray.length === 0) {
          swal("Information", "No staff details found", "info");
          return;
        }

        staffArray.forEach(function (staff) {
          const row = createStaffTableRow(staff);
          $(".table tbody").append(row);
        });
      } catch (error) {
        console.error("Comprehensive error details:", {
          message: error.message,
          name: error.name,
          stack: error.stack,
        });
        swal(
          "Error",
          `Failed to retrieve staff details: ${error.message}`,
          "error"
        );
      } finally {
        $("#btnSearch")
          .html('<i class="bi bi-search"></i>')
          .prop("disabled", false);
      }
    });

    $("#editSelectedFieldsList").on("click", ".remove-btn", function () {
      const valueToRemove = $(this).data("value");
      $(this).parent().remove();
      $("#editField option")
        .filter(function () {
          return $(this).val() === valueToRemove;
        })
        .prop("selected", false);
    });

    loadStaffTable();
    loadVehicleIds();
    loadStaffIds();
  }
});

$(document).on("click", ".btn-edit-staff", function () {
  const row = $(this).closest("tr");
  const staffId = row.find("td:eq(0)").text();
  const staffName = row.find("td:eq(1)").text().split(" ");
  const designation = row.find("td:eq(2)").text();
  const vehicle = row.find("td:eq(3)").text();
  const gender = row.find("td:eq(4)").text();
  const dob = row.find("td:eq(5)").text();
  const address = row.find("td:eq(7)").text().split(" ");
  const mobile = row.find("td:eq(8)").text();
  const email = row.find("td:eq(9)").text();
  const role = row.find("td:eq(10)").text();

  $("#editStaffId").val(staffId);
  $("#editStaffFirstName").val(staffName[0]);
  $("#editStaffLastName").val(staffName[1] || "");
  $("#editDesignation").val(designation);
  $("#editGender").val(gender);
  $("#editDob").val(dob);
  $("#editAddressL1").val(address[0]);
  $("#editAddressL2").val(address[1]);
  $("#editAddressL3").val(address[2]);
  $("#editAddressL4").val(address[3]);
  $("#editAddressL5").val(address[4]);
  $("#editMobile").val(mobile);
  $("#editEmail").val(email);
  $("#editRole").val(role);
  $("#editVehicleId").val(vehicle);
  $("#editStaffModal").modal("show");
});

$(document).on("click", ".btn-delete-staff", function () {
  const staffId = $(this).data("staff-id");

  swal({
    title: "Are you sure?",
    text: `Do you want to delete staff member with ID: ${staffId}?`,
    icon: "warning",
    buttons: {
      cancel: "Cancel",
      confirm: {
        text: "Delete",
        visible: true,
        className: "btn-danger",
      },
    },
  }).then((willDelete) => {
    if (willDelete) {
      const promise = deleteStaff(staffId);
      promise.then(() => {
        loadStaffTable();
      });
    }
  });
});

async function loadStaffTable() {
  const staffList = await getAllStaff();
  $("#staffTable").empty();
  staffList.forEach(function (staff) {
    $(".table").append(
      "<tr> " +
        "<td>" +
        staff.staffId +
        "</td>" +
        "<td>" +
        staff.firstName +
        " " +
        staff.lastName +
        "</td>" +
        "<td>" +
        staff.designation +
        "</td>" +
        "<td>" +
        (staff.vehicleId || "None") +
        "</td>" +
        "<td>" +
        staff.gender +
        "</td>" +
        "<td>" +
        staff.dateOfBirth +
        "</td>" +
        "<td>" +
        staff.joinedDate +
        "</td>" +
        "<td>" +
        staff.addressLine1 +
        " " +
        staff.addressLine2 +
        " " +
        staff.addressLine3 +
        " " +
        staff.addressLine4 +
        " " +
        staff.addressLine5 +
        "</td>" +
        "<td>" +
        staff.mobile +
        "</td>" +
        "<td>" +
        staff.email +
        "</td>" +
        "<td>" +
        staff.role +
        "</td>" +
        "<td>" +
        "<button class='btn btn-outline-primary btn-sm mb-1 btn-edit-staff mx-1' data-staff-id='" +
        staff.staffId +
        "' data-bs-toggle='modal' data-bs-target='#editStaffModal'>" +
        "<i class='bi bi-pencil'></i>" +
        "</button>" +
        "<button class='btn btn-outline-danger btn-sm mb-1 btn-delete-staff' data-staff-id='" +
        staff.staffId +
        "'>" +
        "<i class='bi bi-trash'></i>" +
        "</button>" +
        "</td>" +
        "</tr>"
    );
  });
  loadStaffIds();
}

async function loadStaffIds() {
  try {
    const staffList = await getAllStaff();
    const staffIdDropdown = $("#staffIdList");
    staffIdDropdown.empty();

    staffList.forEach((staff) => {
      const staffId = staff.staffId;
      const listItem = `
        <li>
          <a class="dropdown-item" href="#" data-value="${staffId}">
            ${staffId}
          </a>
        </li>
      `;
      staffIdDropdown.append(listItem);
    });

    $("#staffIdList").on("click", ".dropdown-item", function (event) {
      event.preventDefault();
      const selectedId = $(this).data("value");
      $("#dropdownMenuButton").text(selectedId);
      $("#dropdownMenuButton").data("selected-id", selectedId);
    });
  } catch (error) {
    console.error("Error loading staff IDs:", error);
  }
}

async function loadVehicleIds() {
  const vehicleList = await getAllVehicles();
  const vehicleDropdown = $(".vehicleId");
  vehicleDropdown.empty();

  vehicleDropdown.append(
    '<option value="" disabled selected>Select a vehicle</option>'
  );

  vehicleList.forEach(function (vehicle) {
    vehicleDropdown.append(
      `<option value="${vehicle.vehicleId}">${vehicle.vehicleId}</option>`
    );
  });
}

function createStaffTableRow(staff) {
  const safeValue = (value) => value || "N/A";

  const fullAddress = [
    staff.addressLine1,
    staff.addressLine2,
    staff.addressLine3,
    staff.addressLine4,
    staff.addressLine5,
  ]
    .filter((line) => line && line.trim() !== "")
    .join(" ");

  return `
        <tr>
            <td>${safeValue(staff.staffId)}</td>
            <td>${safeValue(staff.firstName)} ${safeValue(staff.lastName)}</td>
            <td>${safeValue(staff.designation)}</td>
            <td>${safeValue(staff.vehicleId)}</td>
            <td>${safeValue(staff.gender)}</td>
            <td>${safeValue(staff.dateOfBirth)}</td>
            <td>${safeValue(staff.joinedDate)}</td>
            <td>${fullAddress}</td>
            <td>${safeValue(staff.mobile)}</td>
            <td>${safeValue(staff.email)}</td>
            <td>${safeValue(staff.role)}</td>
            <td>
                <div class="btn-group" role="group">
                    <button class='btn btn-outline-primary btn-sm mb-1 mx-1 btn-edit-staff' 
                            data-staff-id='${staff.staffId}' 
                            data-bs-toggle='modal' 
                            data-bs-target='#editStaffModal'>
                        <i class='bi bi-pencil'></i>
                    </button>
                    <button class='btn btn-outline-danger btn-sm mb-1 btn-delete-staff' 
                            data-staff-id='${staff.staffId}'>
                        <i class='bi bi-trash'></i>
                    </button>
                </div>
            </td>
        </tr>
    `;
}
