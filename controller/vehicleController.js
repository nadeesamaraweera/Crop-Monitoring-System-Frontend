import {
  checkTokenValidity,
  getAllVehicles,
  validateVehicle,
  saveVehicle,
  updateVehicle,
  searchVehicle,
  deleteVehicle,
} from "../model/vehicleModel.js";

$(document).ready(function () {
  if (checkTokenValidity()) {
    $("#btnSave").click(() => {
      const category = $("#category").val();
      const numberPlate = $("#licensePlate").val();
      const fuelType = $("#fuelType").val();
      const status = $("#status").val();
      const remarks = $("#remarks").val();

      const vehicleData = {
        category: category,
        numberPlate: numberPlate,
        fuelType: fuelType,
        status: status,
        remarks: remarks,
      };

      if (validateVehicle(vehicleData)) {
        const promise = saveVehicle(vehicleData);
        promise.then(() => {
          loadVehicleTable().then((r) => {
            $("#addVehicleModal").modal("hide");
          });
        });
      }
    });

    $("#btnEdit").click(function () {
      const vehicleId = $("#editVehicleId").val();
      const category = $("#editCategory").val();
      const numberPlate = $("#editLicensePlate").val();
      const fuelType = $("#editFuelType").val();
      const status = $("#editStatus").val();
      const remarks = $("#editRemarks").val();

      const vehicleData = {
        category: category,
        numberPlate: numberPlate,
        fuelType: fuelType,
        status: status,
        remarks: remarks,
      };

      swal({
        title: "Are you sure?",
        text: "Do you want to update this vehicle!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willUpdate) => {
        if (willUpdate) {
          if (validateVehicle(vehicleData)) {
            const promise = updateVehicle(vehicleId, vehicleData);
            promise.then(() => {
              loadVehicleTable().then((r) => {
                $("#editVehicleModal").modal("hide");
              });
            });
          }
        }
      });
    });

    $("#btnSearch").click(async function () {
      try {
        const vehicleId = $("#dropdownMenuButton").text().trim();

        if (!vehicleId || vehicleId === "Search Vehicle By Id") {
          swal("Warning!", "Please select a valid vehicle ID", "info");
          return;
        }

        $("#btnSearch")
          .html(
            '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Searching...'
          )
          .prop("disabled", true);

        const vehicleDetails = await searchVehicle(vehicleId);

        let vehicleArray = [];
        if (vehicleDetails) {
          if (Array.isArray(vehicleDetails)) {
            vehicleArray = vehicleDetails;
          } else if (typeof vehicleDetails === "object") {
            vehicleArray = [vehicleDetails];
          }
        }

        $("#vehicleTable").empty();

        if (vehicleArray.length === 0) {
          swal("Information", "No vehicle details found", "info");
          return;
        }

        vehicleArray.forEach(function (vehicle) {
          const row = createVehicleTableRow(vehicle);
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
          `Failed to retrieve vehicle details: ${error.message}`,
          "error"
        );
      } finally {
        $("#btnSearch")
          .html('<i class="bi bi-search"></i>')
          .prop("disabled", false);
      }
    });

    loadVehicleTable();
  }
});

$(document).on("click", ".btn-delete-vehicle", function () {
  const vehicleId = $(this).data("vehicle-id");

  swal({
    title: "Are you sure?",
    text: `Do you want to delete vehicle with ID: ${vehicleId}?`,
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
      const promise = deleteVehicle(vehicleId);
      promise.then(() => {
        loadVehicleTable();
      });
    }
  });
});

async function loadVehicleTable() {
  const vehicleList = await getAllVehicles();
  $("#vehicleTable").empty();
  vehicleList.forEach((vehicle) => {
    $(".table").append(
      "<tr> " +
        "<td>" +
        vehicle.vehicleId +
        "</td>" +
        "<td>" +
        vehicle.category +
        "</td>" +
        "<td class ='text-uppercase'>" +
        vehicle.numberPlate +
        "</td>" +
        "<td>" +
        vehicle.fuelType +
        "</td>" +
        "<td>" +
        vehicle.status +
        "</td>" +
        "<td>" +
        vehicle.remarks +
        "</td>" +
        "<td>" +
        "<button class='btn btn-outline-primary btn-sm mb-1 btn-edit-vehicle mx-1' data-vehicle-id='" +
        vehicle.vehicleId +
        "' data-bs-toggle='modal' data-bs-target='#editVehicleModal'>" +
        "<i class='bi bi-pencil'></i>" +
        "</button>" +
        "<button class='btn btn-outline-danger btn-sm mb-1 btn-delete-vehicle' data-vehicle-id='" +
        vehicle.vehicleId +
        "'>" +
        "<i class='bi bi-trash'></i>" +
        "</button>" +
        "</td>" +
        "</tr>"
    );
  });
  loadVehicleIds();
}

async function loadVehicleIds() {
  try {
    const vehicleList = await getAllVehicles();
    const vehicleIdDropdown = $("#vehicleIdList");
    vehicleIdDropdown.empty();

    vehicleList.forEach((vehicle) => {
      const vehicleId = vehicle.vehicleId;
      const listItem = `
        <li>
          <a class="dropdown-item" href="#" data-value="${vehicleId}">
            ${vehicleId}
          </a>
        </li>
      `;
      vehicleIdDropdown.append(listItem);
    });

    $("#vehicleIdList").on("click", ".dropdown-item", function (event) {
      event.preventDefault();
      const selectedId = $(this).data("value");
      $("#dropdownMenuButton").text(selectedId);
      $("#dropdownMenuButton").data("selected-id", selectedId);
    });
  } catch (error) {
    console.error("Error loading vehicle IDs:", error);
  }
}

$(document).on("click", ".btn-edit-vehicle", function () {
  const row = $(this).closest("tr");
  const vehicleId = row.find("td:eq(0)").text();
  const category = row.find("td:eq(1)").text();
  const numberPlate = row.find("td:eq(2)").text();
  const fuelType = row.find("td:eq(3)").text();
  const status = row.find("td:eq(4)").text();
  const remarks = row.find("td:eq(5)").text();

  $("#editVehicleId").val(vehicleId);
  $("#editCategory").val(category);
  $("#editLicensePlate").val(numberPlate);
  $("#editFuelType").val(fuelType);
  $("#editStatus").val(status);
  $("#editRemarks").val(remarks);
});

function createVehicleTableRow(vehicle) {
  const safeValue = (value) => value || "N/A";
  return `
        <tr>
            <td>${safeValue(vehicle.vehicleId)}</td>
            <td>${safeValue(vehicle.category)}</td>
            <td>${safeValue(vehicle.numberPlate)}</td>
            <td>${safeValue(vehicle.fuelType)}</td>
            <td>${safeValue(vehicle.status)}</td>
            <td>${safeValue(vehicle.remarks)}</td>
            <td>
                <div class="btn-group" role="group">
                    <button class='btn btn-outline-primary btn-sm mb-1 mx-1 btn-edit-vehicle' 
                            data-vehicle-id='${vehicle.vehicleId}' 
                            data-bs-toggle='modal' 
                            data-bs-target='#editVehicleModal'>
                        <i class='bi bi-pencil'></i>
                    </button>
                    <button class='btn btn-outline-danger btn-sm mb-1 btn-delete-vehicle' 
                            data-vehicle-id='${vehicle.vehicleId}'>
                        <i class='bi bi-trash'></i>
                    </button>
                </div>
            </td>
        </tr>
    `;
}
