import {
  checkTokenValidity,
  getAllCrops,
  getAllFields,
  saveCrop,
  updateCrop,
  searchCrop,
  deleteCrop,
} from "../model/cropsModel.js";

const cropScientificNames = {
  Rice: "Oryza sativa",
  Cowpea: "Vigna unguiculata",
  GreenGram: "Vigna radiata",
  Chickpea: "Cicer arietinum",
  SweetPotato: "Ipomoea batatas",
  Reddish: "Raphanus sativus",
  Cassava: "Manihot esculenta",
};

$(document).ready(function () {
  if (checkTokenValidity()) {
    $(".cropCommonName").on("change", function () {
      const selectedCommonName = $(this).val();
      const scientificName = cropScientificNames[selectedCommonName];
      $(".cropScientificName").val(scientificName);
    });

    let selectedFields = [];

    $("#selectedFieldsList").on("click", ".remove-btn", function () {
      const $listItem = $(this).closest("li");
      const valueToRemove = $listItem.data("value");
      $listItem.remove();
      selectedFields = selectedFields.filter(
        (value) => value !== valueToRemove
      );
      $(`#fieldId option[value="${valueToRemove}"]`).prop("selected", false);
      console.log("Current selected fields:", selectedFields);
    });

    $("#updatedFieldsList").on("click", ".remove-btn", function () {
      const $listItem = $(this).closest("li");
      const valueToRemove = $listItem.data("value");
      $listItem.remove();
      selectedFields = selectedFields.filter(
        (value) => value !== valueToRemove
      );
      $(`#editFieldId option[value="${valueToRemove}"]`).prop(
        "selected",
        false
      );
      console.log("Current selected fields:", selectedFields);
    });

    $(".fieldId").change(function () {
      const selectedOption = $(this).find("option:selected");
      const value = selectedOption.val();
      const text = selectedOption.text();

      if (value && !selectedFields.includes(value)) {
        selectedFields.push(value);

        $("#selectedFieldsList").append(`
            <li data-value="${value}">
                ${text}
                <button type="button" class="remove-btn btn btn-danger btn-sm mt-1 ms-2">
                    <span aria-hidden="true">&times;</span>
                </button>
            </li>
        `);

        $("#updatedFieldsList").append(`
            <li data-value="${value}">
                ${text}
                <button type="button" class="remove-btn btn btn-danger btn-sm mt-1 ms-2">
                    <span aria-hidden="true">&times;</span>
                </button>
            </li>
        `);
      }
    });

    $("#btnSave").click(() => {
      const commonName = $("#cropCommonName").val();
      const scientificName = $("#cropScientificName").val();
      const category = $("#cropCategory").val();
      const season = $("#cropSeason").val();
      const cropImg = $("#cropImg").prop("files")[0];
      console.log("Selected fields:", selectedFields);

      const cropData = {
        commonName: commonName,
        scientificName: scientificName,
        category: category,
        season: season,
        cropImg: cropImg,
        fields: selectedFields,
      };

      saveCrop(cropData)
        .then(() => {
          loadCropTable().then(() => {
            $("#addCropModal").modal("hide");
          });
        })
        .catch((error) => {
          console.error("Failed to save crop data:", error);
        });
    });

    $("#btnEdit").click(() => {
      const cropId = $("#editCropId").val();
      const commonName = $("#editCropCommonName").val();
      const scientificName = $("#editCropScientificName").val();
      const category = $("#editCropCategory").val();
      const season = $("#editCropSeason").val();
      const cropImg = $("#editCropImg").prop("files")[0];

      const cropData = {
        commonName: commonName,
        scientificName: scientificName,
        category: category,
        season: season,
        cropImg: cropImg,
        fields: selectedFields,
      };

      updateCrop(cropId, cropData)
        .then(() => {
          loadCropTable().then(() => {
            $("#editCropModal").modal("hide");
          });
        })
        .catch((error) => {
          console.error("Failed to update crop data:", error);
        });
    });

    $("#btnSearch").click(async function () {
      try {
        const cropId = $("#dropdownMenuButton").text().trim();
        if (!cropId) {
          swal("Warning!", "Please select a crop ID!", "info");
          return;
        }

        $("#btnSearch")
          .html(
            '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Searching...'
          )
          .prop("disabled", true);
        const cropDetails = await searchCrop(cropId);
        let cropArray = [];
        if (cropDetails) {
          if (Array.isArray(cropDetails)) {
            cropArray = cropDetails;
          } else if (typeof cropDetails === "object") {
            cropArray = [cropDetails];
          }
        }

        $("#cropTable").empty();
        if (cropArray.length === 0) {
          swal("Information", "No crop details found!", "info");
          return;
        }

        cropArray.forEach(function (crop) {
          const row = createCropTableRow(crop);
          $(".table tbody").append(row);
        });
      } catch (error) {
        console.error("Error retrieving crop details:", error);
        swal(
          "Error",
          `Failed to retrieve crop details: ${error.message}`,
          "error"
        );
      } finally {
        $("#btnSearch")
          .html('<i class="bi bi-search"></i>')
          .prop("disabled", false);
      }
    });

    $(document).on("click", ".btn-edit-crop", function () {
      const row = $(this).closest("tr");
      const cropId = row.find("td:eq(0)").text();
      const cropCommonName = row.find("td:eq(1)").text();
      const cropScientificName = row.find("td:eq(2)").text();
      const fieldType = row.find("td:eq(3)").text();
      const cropCategory = row.find("td:eq(4)").text();
      const cropSeason = row.find("td:eq(5)").text();

      $("#editCropId").val(cropId);
      $("#editCropCommonName").val(cropCommonName);
      $("#editCropScientificName").val(cropScientificName);
      $("#editCropCategory").val(cropCategory);
      $("#editCropSeason").val(cropSeason);

      const selectedFields = fieldType.split(",");
      $("#editFieldId option").each(function () {
        const optionValue = $(this).val();
        $(this).prop("selected", selectedFields.includes(optionValue));
      });

      $("#updatedFieldsList").empty();
      selectedFields.forEach((field) => {
        if (field) {
          $("#updatedFieldsList").append(`
                <li data-value="${field}">
                    ${field}
                    <button type="button" class="remove-btn btn btn-danger btn-sm mt-1 ms-2">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </li>
            `);
        }
      });
      $("#editCropModal").modal("show");
    });

    loadCropTable();
  }
});

$(document).on("click", ".btn-delete-crop", function () {
  const cropId = $(this).data("crop-id");

  swal({
    title: "Are you sure?",
    text: `Do you want to delete crop with ID: ${cropId}?`,
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
      const promise = deleteCrop(cropId);
      promise.then(() => {
        loadCropTable();
      });
    }
  });
});

async function loadCropTable() {
  try {
    const cropList = await getAllCrops();
    const cropTable = $("#cropTable");
    cropTable.empty();

    cropList.forEach((crop) => {
      const imageSrc = crop.cropImg
        ? `data:image/jpeg;base64,${crop.cropImg}`
        : "./assets/images/default-crop.png";

      cropTable.append(`
        <tr>
          <td>${crop.cropId}</td>
          <td>${crop.commonName}</td>
          <td>${crop.scientificName}</td>
          <td>${crop.fields || "-"}</td>
          <td>${crop.category}</td>
          <td>${crop.season}</td>
          <td><img src="${imageSrc}" alt="Crop Image" width="50" height="50"></td>
          <td>
            <button class="btn btn-outline-primary btn-sm mb-1 btn-edit-crop mx-1" data-crop-id="${
              crop.cropId
            }" data-bs-toggle="modal" data-bs-target="#editCropModal">
              <i class="bi bi-pencil"></i>
            </button>
            <button class="btn btn-outline-danger btn-sm mb-1 btn-delete-crop" data-crop-id="${
              crop.cropId
            }">
              <i class="bi bi-trash"></i>
            </button>
          </td>
        </tr>
      `);
    });
  } catch (error) {
    console.error("Error loading crop table:", error);
  } finally {
    loadCropIds();
    loadFieldIds();
  }
}

async function loadCropIds() {
  try {
    const cropList = await getAllCrops();
    const cropIdDropdown = $("#cropList");
    cropIdDropdown.empty();

    cropList.forEach((crop) => {
      const cropId = crop.cropId;
      const listItem = `
            <li>
            <a class="dropdown-item" href="#" data-value="${cropId}">
                ${cropId}
            </a>
            </li>
        `;
      cropIdDropdown.append(listItem);
    });

    $("#cropList").on("click", ".dropdown-item", function (event) {
      event.preventDefault();
      const selectedId = $(this).data("value");
      $("#dropdownMenuButton").text(selectedId);
      $("#dropdownMenuButton").data("selected-id", selectedId);
    });
  } catch (error) {
    console.error("Error loading crop IDs:", error);
  }
}

function createCropTableRow(crop) {
  const imageSrc = crop.cropImg
    ? `data:image/jpeg;base64,${crop.cropImg}`
    : "./assets/images/default-crop.png";

  return `
    <tr>
      <td>${crop.cropId}</td>
      <td>${crop.commonName}</td>
      <td>${crop.scientificName}</td>
      <td>${crop.fields || "-"}</td>
      <td>${crop.category}</td>
      <td>${crop.season}</td>
      <td><img src="${imageSrc}" alt="Crop Image" width="50" height="50"></td>
      <td>
        <button class="btn btn-outline-primary btn-sm mb-1 btn-edit-crop mx-1" data-crop-id="${
          crop.cropId
        }" data-bs-toggle="modal" data-bs-target="#editCropModal">
          <i class="bi bi-pencil"></i>
        </button>
        <button class="btn btn-outline-danger btn-sm mb-1 btn-delete-crop" data-crop-id="${
          crop.cropId
        }">
          <i class="bi bi-trash"></i>
        </button>
      </td>
    </tr>
  `;
}

async function loadFieldIds() {
  const fieldList = await getAllFields();
  const fieldIdDropdown = $(".fieldId");
  fieldIdDropdown.empty();
  fieldIdDropdown.append(
    `<option value="" disabled selected>Select Field Ids</option>`
  );

  fieldList.forEach((field) => {
    fieldIdDropdown.append(`
        <option value="${field.fieldId}">${field.fieldId}</option>
      `);
  });
}
