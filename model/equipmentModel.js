const token = localStorage.getItem("authToken");
const baseUrl = "http://localhost:8080/greenShadow/api/v1/equipment";

export function checkTokenValidity() {
  return $.ajax({
    url: "http://localhost:8080/greenShadow/api/v1/auth/validate-token",
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

export function getAllEquipments() {
  return $.ajax({
    url: baseUrl,
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

export function saveEquipment(equipment) {
  return $.ajax({
    url: baseUrl,
    method: "POST",
    contentType: "application/json",
    data: JSON.stringify(equipment),
    headers: {
      Authorization: "Bearer " + token,
    },

    success: function () {
      swal("Confirmation!", "Equipment Saved Successfully!", "success");
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
        swal("Error!", "Equipment Saved Failed", "error");
      }
    },
  });
}

export function updateEquipment(equipmentId, equipmentData) {
  return $.ajax({
    url: baseUrl + "/" + equipmentId,
    method: "PATCH",
    contentType: "application/json",
    data: JSON.stringify(equipmentData),
    headers: {
      Authorization: "Bearer " + token,
    },

    success: function () {
      swal("Confirmation!", "Equipment Update Successfully!", "success");
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
        swal("Error!", "Equipment Update Failed", "error");
      }
    },
  });
}

export async function searchEquipment(equipmentId) {
  return $.ajax({
    url: baseUrl + "/" + equipmentId,
    method: "GET",
    dataType: "json",
    headers: {
      Authorization: "Bearer " + token,
    },

    error: function (error) {
      console.log(error);
      swal("Warning!", "Equipment not found!", "info");
    },
  });
}

export function deleteEquipment(equipmentId) {
  return $.ajax({
    url: baseUrl + "/" + equipmentId,
    method: "DELETE",
    data: "data",
    dataType: "dataType",
    headers: {
      Authorization: "Bearer " + token,
    },

    success: function () {
      swal("Confirmation!", "Equipment Delete Successfully!", "success");
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
        swal("Error!", "Equipment Delete Failed", "error");
      }
    },
  });
}

export function getAllStaff() {
  return $.ajax({
    url: "http://localhost:8080/greenShadow/api/v1/staff",
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