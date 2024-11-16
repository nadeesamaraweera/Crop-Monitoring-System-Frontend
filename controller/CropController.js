import { CropModel } from '../model/CropModel.js';
import { cropList, fieldList} from '../db/db.js';

const cropForm = document.getElementById("cropForm");
const tableBody = document.getElementById("tbl-crop").querySelector("tbody");
let cropCodeCounter = 1;
let editingRow = null;
const searchCrop = document.getElementById('searchCrop');

// Search functionality
if (searchCrop && tableBody) {
    searchCrop.addEventListener('input', function () {
        try {
            const query = this.value.toLowerCase();
            const rows = tableBody.querySelectorAll('tr');
            let foundMatch = false;

            rows.forEach(row => {
                const cropName = row.cells[1]?.textContent.toLowerCase();
                const scientificName = row.cells[2]?.textContent.toLowerCase();
                const category = row.cells[3]?.textContent.toLowerCase();
                const season = row.cells[4]?.textContent.toLowerCase();

                if (cropName.includes(query) || scientificName.includes(query) || category.includes(query) || season.includes(query)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
            if (!foundMatch && query) {
                alert("No matching crop records found.");
            }
        } catch (error) {
            console.error("Search error:", error);
        }
    });
}
const cropCategories = ["Vegetables", "Fruits", "Grains", "Legumes" ,"Herb","others"];
const cropSeasons = ["Summer", "Winter","Fall", "Spring", "Autumn"];

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

// Populate the add form dropdowns on page load
populateDropdown(document.getElementById("cropCategory"), cropCategories);
populateDropdown(document.getElementById("season"), cropSeasons);

 // Handle the form submission (for both adding and updating fields)
cropForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const cropName = document.getElementById("cropName").value.trim();
    const cropScientificName = document.getElementById("cropScientificName").value.trim();
    const cropCategory = document.getElementById("cropCategory").value.trim();
    const season = document.getElementById("season").value;
    const cropImage = document.getElementById("cropImage").files[0];
    const fields = document.getElementById("filed-cropId").value;

    if (!cropName || !cropScientificName || !cropCategory || !season) {
        alert("Please fill in all fields.");
        return;
    }
    if (!cropImage) {
        alert("Please upload image");
        return;
    }

    const imgSrc = cropImage ? URL.createObjectURL(cropImage) : '';

    if (editingRow) {
        // Update the existing field
        const cropIndex = editingRow.dataset.index;
        const crop = cropList[cropIndex];

        // Update the field properties
        crop.cropName = cropName;
        crop.cropScientificName = cropScientificName;
        crop.cropCategory = cropCategory;
        crop.season = season;
        crop.cropImage= imgSrc || crop.cropImage;
        crop.fields = fields;

        // Update the row in the table
        updateTableRow(crop, cropIndex);

        // Clear the editing row reference
        editingRow = null;

        alert("Crop updated successfully!");
    } else {
        // Add new crop
        const cropCode = "CR0" + cropCodeCounter++;
        const newCrop = new CropModel(cropCode, cropName, cropScientificName, cropCategory, season, imgSrc,fields, );
        cropList.push(newCrop);
        addRowToTable(newCrop, cropList.length - 1);
        alert("New Crop added successfully!");
    }

    cropForm.reset();
    clearImagePreviews();
    const newCropModal = bootstrap.Modal.getInstance(document.getElementById("newCropModal"));
    newCropModal.hide();
    renderTable();
});

// Function to update table row
function updateTableRow(crop, index) {
    const row = tableBody.querySelector(`tr[data-index='${index}']`);
    row.cells[1].textContent = crop.cropName;
    row.cells[2].textContent = crop.cropScientificName;
    row.cells[3].textContent = crop.cropCategory;
    row.cells[4].textContent = crop.season;
    row.cells[5].querySelector("img").src = crop.cropImage || "#";
    row.cells[6].textContent = crop.fields;
}

// Add a row to the table
function addRowToTable(crop, index) {
    const row = document.createElement('tr');
    row.dataset.index = index;
    row.innerHTML = `
        <td>${crop.cropCode}</td>
        <td>${crop.cropName}</td>
        <td>${crop.cropScientificName}</td>
        <td>${crop.cropCategory}</td>
        <td>${crop.season}</td>
        <td><img src="${crop.cropImage}" width="50"></td>
        <td>${crop.fields}</td>
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
    cropList.forEach((crop, index) => addRowToTable(crop, index));
}

// // Handle table actions (edit & delete)
tableBody.addEventListener("click", function (event) {
    const row = event.target.closest("tr");
    if (!row) return;

    const cropIndex = row.dataset.index;

    if (event.target.classList.contains("edit-btn")) {
        editingRow = row;
        const crop = cropList[cropIndex];

        document.getElementById("updateCropName").value = crop.cropName;
        document.getElementById("updateScientificName").value = crop.cropScientificName;
        populateDropdown(document.getElementById("updateCategory"), cropCategories, crop.cropCategory);
        populateDropdown(document.getElementById("updateCropSeason"), cropSeasons, crop.season);
        document.getElementById("cropFieldUpdate").value = crop.fields;

        const imgSrc = row.cells[5].querySelector("img").src;

        if (imgSrc) {
            document.getElementById("updatePreview").src = imgSrc;
            document.getElementById("updatePreview").classList.remove('d-none');
        } else {
            document.getElementById("updatePreview").classList.add('d-none');
        }

        const updateModal = new bootstrap.Modal(document.getElementById('updateCropModal'));
        updateModal.show();
    }

    if (event.target.classList.contains("delete-btn")) {
        const confirmed = confirm(`Are you sure you want to delete the crop: ${cropList[cropIndex].cropName}?`);
        if (confirmed) {
            cropList.splice(cropIndex, 1);
            renderTable();
        }
    }
});
// // Function to clear image previews
function clearImagePreviews() {
    const preview = document.getElementById('preview');

    if (preview) {
        preview.src = "#";
        preview.classList.add('d-none');
    }
}
 // Initial render of the table
renderTable();

document.getElementById("updateCropForm").addEventListener("submit", function (event) {
    event.preventDefault();
    if (editingRow) {
        // Get values from the update crop form fields
        const cropName = document.getElementById("updateCropName").value.trim();
        const cropScientificName = document.getElementById("updateScientificName").value.trim();
        const cropCategory = document.getElementById("updateCategory").value.trim();
        const cropSeason = document.getElementById("updateCropSeason").value.trim();
        const cropImage = document.getElementById("updateCropImage").files[0];
        const cropFieldId = document.getElementById("cropFieldUpdate").value;
        const cells = editingRow.getElementsByTagName("td");
        cells[1].innerText = cropName;
        cells[2].innerText = cropScientificName;
        cells[3].innerText = cropCategory;
        cells[4].innerText = cropSeason;
        cells[6].innerText = cropFieldId;
        if (cropImage) {
            cells[5].querySelector("img").src = URL.createObjectURL(cropImage);
        }
        alert("Crop updated successfully!");
        editingRow = null;
        const updateCropModalEl = document.getElementById('updateCropModal');
        const updateCropModal = bootstrap.Modal.getInstance(updateCropModalEl);
        if (updateCropModal) {
            updateCropModal.hide();
        }
        cropForm.reset();
    }
});


