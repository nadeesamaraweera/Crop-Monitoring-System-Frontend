const token = localStorage.getItem("authToken");
const baseUrl = "http://localhost:8080/greenShadow/api/v1/crop";

export function checkTokenValidity() {
  return $.ajax({
    url: "http://localhost:8080/cms/api/v1/greenShadow/validate-token",
    method: "POST",
    headers: {
      Authorization: "Bearer " + token,
    },

    success: function () {
      console.log("Token is valid");
    },

    error: function (xhr) {
      if (xhr.status === 401) {
        console.warn("Token has expired");
        swal(
          "Warning!",
          "Your session has expired. Please log in again.",
          "warning"
        );
        window.location.href = "../index.html";
      } else {
        console.error("Invalid token or error occurred");
      }
    },
  });
}

export function getAllCrops() {
  return $.ajax({
    url: baseUrl,
    method: "GET",
    contentType: "application/json",
    headers: {
      Authorization: "Bearer " + token,
    },

    error: function (error) {
      console.log("Error: " + error);
    },
  });
}

export function saveCrop(cropData) {
  const formData = new FormData();
  formData.append("commonName", cropData.commonName);
  formData.append("scientificName", cropData.scientificName);
  formData.append("category", cropData.category);
  formData.append("season", cropData.season);
  formData.append("cropImg", cropData.cropImg);
  formData.append("fields", JSON.stringify(cropData.fields));

  return $.ajax({
    url: baseUrl,
    method: "POST",
    processData: false,
    contentType: false,
    data: formData,
    headers: {
      Authorization: "Bearer " + token,
    },

    success: function () {
      swal("Confirmation!", "Crop Saved Successfully!", "success");
    },

    error: function (xhr) {
      if (xhr.status === 403) {
        swal(
          "Access Denied!",
          "You are not authorized to perform this action!",
          "warning"
        );
      } else {
        console.log(xhr);
        swal("Error!", "Crop Save Failed", "error");
      }
    },
  });
}

export function updateCrop(cropId, cropData) {
  const formData = new FormData();
  formData.append("commonName", cropData.commonName);
  formData.append("scientificName", cropData.scientificName);
  formData.append("category", cropData.category);
  formData.append("season", cropData.season);
  formData.append("cropImg", cropData.cropImg);
  formData.append("fields", JSON.stringify(cropData.fields));
  console.log(cropData.cropImg);

  return $.ajax({
    url: baseUrl + "/" + cropId,
    method: "PATCH",
    processData: false,
    contentType: false,
    data: formData,
    headers: {
      Authorization: "Bearer " + token,
    },

    success: function () {
      swal("Confirmation!", "Crop Updated Successfully!", "success");
    },

    error: function (xhr) {
      if (xhr.status === 403) {
        swal(
          "Access Denied!",
          "You are not authorized to perform this action!",
          "warning"
        );
      } else {
        console.log(xhr);
        swal("Error!", "Crop Update Failed", "error");
      }
    },
  });
}

export async function searchCrop(cropId) {
  return $.ajax({
    url: baseUrl + "/" + cropId,
    method: "GET",
    contentType: "json",
    headers: {
      Authorization: "Bearer " + token,
    },

    error: function (error) {
      console.log(error);
    },
  });
}

export function deleteCrop(cropId) {
  return $.ajax({
    url: baseUrl + "/" + cropId,
    method: "DELETE",
    contentType: "application/json",
    headers: {
      Authorization: "Bearer " + token,
    },

    success: function () {
      swal("Confirmation!", "Crop Deleted Successfully!", "success");
    },

    error: function (xhr) {
      if (xhr.status === 403) {
        swal(
          "Access Denied!",
          "You are not authorized to perform this action!",
          "warning"
        );
      } else {
        console.log(error);
      }
    },
  });
}

export function getAllFields() {
  return $.ajax({
    url: "http://localhost:8080/greenShadow/api/v1/field",
    method: "GET",
    contentType: "application/json",
    headers: {
      Authorization: "Bearer " + token,
    },

    error: function (error) {
      console.log(error);
    },
  });
}