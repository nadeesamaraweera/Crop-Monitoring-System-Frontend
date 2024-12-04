import {
  checkTokenValidity,
  getAllEquipments,
  getAllFields,
  getAllStaff,
  saveEquipment,
  searchEquipment,
  updateEquipment,
  deleteEquipment,
} from "../model/equipmentModel.js";

$(document).ready(function () {
  if (checkTokenValidity()) {
    $("#btnSave").on("click", function () {
      const category = $("#category").val();
      const type = $("#type").val();
      const staff = $("#assignStaff").val();
      const field = $("#assignField").val();
      const status = $("#status").val();

      const equipmentData = {
        category: category,
        type: type,
        eqStaff: staff,
        eqField: field,
        status: status,
      };

      const promise = saveEquipment(equipmentData);
      promise.then(() => {
        loadEquipmentTable().then((r) => {
          $("#addEquipmentModal").modal("hide");
        });
      });
    });

    $("#btnEdit").on("click", function () {
      const equipmentId = $("#editEquipmentId").val();
      const category = $("#editCategory").val();
      const type = $("#editType").val();
      const staff = $("#editAssignStaff").val();
      const field = $("#editAssignField").val();
      const status = $("#editStatus").val();

      const equipmentData = {
        equipmentId: equipmentId,
        category: category,
        type: type,
        eqStaff: staff,
        eqField: field,
        status: status,
      };

      swal({
        title: "Are you sure?",
        text: "Do you want to update this equipment!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willUpdate) => {
        if (willUpdate) {
          const promise = updateEquipment(equipmentId, equipmentData);
          promise.then(() => {
            loadEquipmentTable().then((r) => {
              $("#editEquipmentModal").modal("hide");
            });
          });
        }
      });
    });

    $("#btnSearch").click(async function () {
      try {
        const equipmentId = $("#dropdownMenuButton").text().trim();

        if (!equipmentId || equipmentId === "Search Equipment by Id") {
          swal("Warning!", "Please enter Equipment ID!", "info");
          return;
        }

        $("#btnSearch")
          .html(
            '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Searching...'
          )
          .prop("disabled", true);

        const equipmentList = await searchEquipment(equipmentId);

        let equipmentArray = [];
        if (equipmentList) {
          if (Array.isArray(equipmentList)) {
            equipmentArray = equipmentList;
          } else if (typeof equipmentList === "object") {
            equipmentArray = [equipmentList];
          }
        }

        $("#equipmentTable").empty();

        if (equipmentArray.length === 0) {
          swal("Warning!", "Equipment not found!", "info");
          return;
        }

        equipmentArray.forEach((equipment) => {
          const row = createEquipmentTableRow(equipment);
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
          `Failed to retrieve equipment details: ${error.message}`,
          "error"
        );
      } finally {
        $("#btnSearch")
          .html('<i class="bi bi-search"></i>')
          .prop("disabled", false);
      }
    });

    loadEquipmentTable();
  }
});

$(document).on("click", ".btn-delete-equipment", function () {
  const equipmentId = $(this).data("equipment-id");

  swal({
    title: "Are you sure?",
    text: "Once deleted, you will not be able to recover this equipment!",
    icon: "warning",
    buttons: true,
    dangerMode: true,
  }).then((willDelete) => {
    if (willDelete) {
      const promise = deleteEquipment(equipmentId);
      promise.then(() => {
        loadEquipmentTable();
      });
    }
  });
});

async function loadEquipmentTable() {
  try {
    const equipmentList = await getAllEquipments();
    const equipmentTable = $("#equipmentTable");
    equipmentTable.empty();

    equipmentList.forEach((equipment) => {
      $(".table").append(
        "<tr> " +
          "<td>" +
          equipment.equipmentId +
          "</td>" +
          "<td>" +
          equipment.category +
          "</td>" +
          "<td>" +
          equipment.type +
          "</td>" +
          "<td>" +
          equipment.eqStaff +
          "</td>" +
          "<td>" +
          equipment.eqField +
          "</td>" +
          "<td>" +
          equipment.status +
          "</td>" +
          "<td>" +
          "<button class='btn btn-outline-primary btn-sm mb-1 btn-edit-equipment mx-1' data-equipment-id='" +
          equipment.equipmentId +
          "' data-bs-toggle='modal' data-bs-target='#editEquipmentModal'>" +
          "<i class='bi bi-pencil'></i>" +
          "</button>" +
          "<button class='btn btn-outline-danger btn-sm mb-1 btn-delete-equipment' data-equipment-id='" +
          equipment.equipmentId +
          "'>" +
          "<i class='bi bi-trash'></i>" +
          "</button>" +
          "</td>" +
          "</tr>"
      );
    });
  } catch (error) {
    console.error("Error loading equipment table:", error);
  } finally {
    loadEquipmentIds();
    loadStaffIds();
    loadFieldIds();
  }
}

async function loadEquipmentIds() {
  try {
    const equipmentList = await getAllEquipments();
    const equipmentIdDropdown = $("#equipmentList");
    equipmentIdDropdown.empty();

    equipmentList.forEach((equipment) => {
      const equipmentId = equipment.equipmentId;
      const listItem = `
        <li>
          <a class="dropdown-item" href="#" data-value="${equipmentId}">
            ${equipmentId}
          </a>
        </li>
      `;
      equipmentIdDropdown.append(listItem);
    });

    $("#equipmentList").on("click", ".dropdown-item", function (event) {
      event.preventDefault();
      const selectedId = $(this).data("value");
      $("#dropdownMenuButton").text(selectedId);
      $("#dropdownMenuButton").data("selected-id", selectedId);
    });
  } catch (error) {
    console.error("Error loading equipment IDs:", error);
  }
}

$(document).on("click", ".btn-edit-equipment", function () {
  const row = $(this).closest("tr");
  const equipmentId = row.find("td:eq(0)").text();
  const category = row.find("td:eq(1)").text();
  const type = row.find("td:eq(2)").text();
  const staff = row.find("td:eq(3)").text();
  const field = row.find("td:eq(4)").text();
  const status = row.find("td:eq(5)").text();

  $("#editEquipmentId").val(equipmentId);
  $("#editCategory").val(category);
  $("#editType").val(type);
  $("#editStatus").val(status);
  $("#editAssignStaff").val(staff);
  $("#editAssignField").val(field);

  $("#editEquipmentModal").modal("show");
});

function createEquipmentTableRow(equipment) {
  const safeValue = (value) => value || "N/A";
  return `
        <tr>
            <td>${safeValue(equipment.equipmentId)}</td>
            <td>${safeValue(equipment.category)}</td>
            <td>${safeValue(equipment.type)}</td>
            <td>${safeValue(equipment.eqStaff)}</td>
            <td>${safeValue(equipment.eqField)}</td>
            <td>${safeValue(equipment.status)}</td>
            <td>
                <div class="btn-group" role="group">
                    <button class='btn btn-outline-primary btn-sm mb-1 mx-1 btn-edit-equipment' 
                            data-equipment-id='${equipment.equipmentId}' 
                            data-bs-toggle='modal' 
                            data-bs-target='#editEquipmentModal'>
                        <i class='bi bi-pencil'></i>
                    </button>
                    <button class='btn btn-outline-danger btn-sm mb-1 btn-delete-equipment' 
                            data-equipment-id='${equipment.equipmentId}'>
                        <i class='bi bi-trash'></i>
                    </button>
                </div>
            </td>
        </tr>
    `;
}

async function loadStaffIds() {
  const staffList = await getAllStaff();
  const staffDropdown = $(".staffId");
  staffDropdown.empty();

  staffDropdown.append(
    "<option value='' disabled selected>Select Allocated Staff Member</option>"
  );

  staffList.forEach((staff) => {
    staffDropdown.append(
      "<option value='" + staff.staffId + "'>" + staff.staffId + "</option>"
    );
  });
}

async function loadFieldIds() {
  const fieldList = await getAllFields();
  const fieldDropdown = $(".fieldId");
  fieldDropdown.empty();

  fieldDropdown.append(
    "<option value='' disabled selected>Select Allocated Field</option>"
  );

  fieldList.forEach((field) => {
    fieldDropdown.append(
      "<option value='" + field.fieldId + "'>" + field.fieldId + "</option>"
    );
  });
}
