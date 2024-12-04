import {
  checkTokenValidity,
  getAllLogs,
  getAllFields,
  getAllCrops,
  saveLog,
  searchLog,
  updateLog,
  deleteLog,
} from "../model/logModel.js";

$(document).ready(function () {
  if (checkTokenValidity()) {
    $("#btnSave").click(() => {
      const logData = {
        fieldId: $("#fieldId").val(),
        cropId: $("#cropId").val(),
        temperature: $("#temperature").val(),
        details: $("#observations").val(),
        observedImg: $("#observedImg").prop("files")[0],
      };

      saveLog(logData).then(() => {
        loadLogTable().then(() => {
          $("#addLogModal").modal("hide");
        });
      });
    });

    $("#btnUpdate").click(() => {
      const logId = $("#editLogId").val();
      const logData = {
        fieldId: $("#editFieldId").val(),
        cropId: $("#editCropId").val(),
        temperature: $("#editTemperature").val(),
        details: $("#editObservations").val(),
        observedImg: $("#editObservedImg").prop("files")[0],
      };

      updateLog(logId, logData).then(() => {
        loadLogTable().then(() => {
          $("#editLogModal").modal("hide");
        });
      });
    });
    loadLogTable();
  }
});

$(document).on("click", ".btn-edit-log", function () {
  const row = $(this).closest("tr");
  const logId = row.find("td:eq(0)").text();
  const fieldId = row.find("td:eq(1)").text();
  const cropId = row.find("td:eq(2)").text();
  const staffId = row.find("td:eq(3)").text();
  const temperature = row.find("td:eq(4)").text();
  const observations = row.find("td:eq(5)").text();

  $("#editLogId").val(logId);
  $("#editFieldId").val(fieldId);
  $("#editCropId").val(cropId);
  $("#editStaffId").val(staffId);
  $("#editTemperature").val(temperature.split("°")[0]);
  $("#editObservations").val(observations);

  $("#editLogModal").modal("show");
});

$("#btnSearch").click(async function () {
  try {
    const logId = $("#dropdownMenuButton").text().trim();
    if (!logId) {
      swal("Warning!", "Please enter a log ID to search", "info");
      return;
    }

    $("#btnSearch")
      .html(
        `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Searching...`
      )
      .prop("disabled", true);

    const log = await searchLog(logId);
    $("#logTable").empty();

    if (!log) {
      swal("Warning!", "No log found with the given ID", "info");
      return;
    }

    const imageSrc = log.observedImg
      ? `data:image/jpeg;base64,${log.observedImg}`
      : "assets/img/no-image.png";

    $("#logTable").append(`
      <tr>
        <td>${log.logId}</td>
        <td>${log.fieldId}</td>
        <td>${log.cropId}</td>
        <td>${log.staff}</td>
        <td>${log.temperature}°C</td>
        <td>${log.details}</td>
        <td><img src="${imageSrc}" width="50" height="50" alt="Observed Image"></td>
        <td>${log.date}</td>
        <td>
          <button class="btn btn-outline-primary btn-sm mb-1 btn-edit-log mx-1" data-log-id="${log.logId}" data-bs-toggle="modal" data-bs-target="#editLogModal">
            <i class="bi bi-pencil"></i>
          </button>
          <button class="btn btn-outline-danger btn-sm mb-1 btn-delete-log" data-log-id="${log.logId}">
            <i class="bi bi-trash"></i>
          </button>
        </td>
      </tr>
    `);
  } catch (error) {
    console.log("Error:", error);
    swal(
      "Error!",
      "Something went wrong while fetching the log details",
      "error"
    );
  } finally {
    $("#btnSearch")
      .html('<i class="bi bi-search"></i>')
      .prop("disabled", false);
  }
});

$(document).on("click", ".btn-delete-log", function () {
  const logId = $(this).data("log-id");

  swal({
    title: "Are you sure?",
    text: "Once deleted, you will not be able to recover this log!",
    icon: "warning",
    buttons: true,
    dangerMode: true,
  }).then((willDelete) => {
    if (willDelete) {
      deleteLog(logId).then(() => {
        loadLogTable();
      });
    }
  });
});

async function loadLogTable() {
  try {
    const logList = await getAllLogs();
    const logTable = $("#logTable");
    logTable.empty();

    logList.forEach((log) => {
      const imageSrc = log.observedImg
        ? `data:image/jpeg;base64,${log.observedImg}`
        : "assets/img/no-image.png";

      logTable.append(
        `<tr>
            <td>${log.logId}</td>
            <td>${log.fieldId}</td>
            <td>${log.cropId}</td>
            <td>${log.staff}</td>
            <td>${log.temperature}°C</td>
            <td>${log.details}</td>
            <td><img src="${imageSrc}" width="50" height="50"></td>
            <td>${log.date}</td>
            <td>
            <button class="btn btn-outline-primary btn-sm mb-1 btn-edit-log mx-1" data-log-id="${log.logId}" data-bs-toggle="modal" data-bs-target="#editLogModal">
              <i class="bi bi-pencil"></i>
            </button>
            <button class="btn btn-outline-danger btn-sm mb-1 btn-delete-log" data-log-id="${log.logId}">
              <i class="bi bi-trash"></i>
            </button>
          </td>
        </tr>`
      );
    });
  } catch (error) {
    console.log("Error:", error);
  } finally {
    loadLogIds();
    loadFieldIds();
    loadCropIds();
  }
}

async function loadLogIds() {
  const logList = await getAllLogs();
  const logIdDropdown = $("#logList");
  logIdDropdown.empty();

  logList.forEach((log) => {
    const logId = log.logId;
    const listItem = `<li> <a class="dropdown-item" href="#" data-value="${logId}">${logId}</a></li>`;
    logIdDropdown.append(listItem);
  });

  $("#logList").on("click", ".dropdown-item", function (event) {
    event.preventDefault();
    const selectedId = $(this).data("value");
    $("#dropdownMenuButton").text(selectedId);
    $("#dropdownMenuButton").data("selected-id", selectedId);
  });
}

async function loadFieldIds() {
  const fieldList = await getAllFields();
  const fieldIdDropdown = $(".fieldId");
  fieldIdDropdown.empty();
  fieldIdDropdown.append(
    `<option value="" disabled selected>Select Field Id</option>`
  );

  fieldList.forEach((field) => {
    fieldIdDropdown.append(`
        <option value="${field.fieldId}">${field.fieldId}</option>
      `);
  });
}

async function loadCropIds() {
  const cropList = await getAllCrops();
  const cropIdDropdown = $(".cropId");
  cropIdDropdown.empty();
  cropIdDropdown.append(
    `<option value="" disabled selected>Select Crop Id</option>`
  );

  cropList.forEach((crop) => {
    cropIdDropdown.append(`
            <option value="${crop.cropId}">${crop.cropId}</option>
        `);
  });
}
