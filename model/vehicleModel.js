const token = localStorage.getItem("authToken");
const baseUrl = "http://localhost:8080/greenShadow/api/v1/vehicle";

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

export function getAllVehicles() {
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

export function saveVehicle(vehicle) {
  return $.ajax({
    url: baseUrl,
    method: "POST",
    contentType: "application/json",
    data: JSON.stringify(vehicle),
    headers: {
      Authorization: "Bearer " + token,
    },

    success: function () {
      swal("Confirmation!", "Vehicle Saved Successfully!", "success");
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
        swal("Error!", "Vehicle Save Failed!", "error");
      }
    },
  });
}

export function updateVehicle(vehicleId, vehicleData) {
  return $.ajax({
    url: baseUrl + "/" + vehicleId,
    method: "PATCH",
    contentType: "application/json",
    data: JSON.stringify(vehicleData),
    headers: {
      Authorization: "Bearer " + token,
    },

    success: function () {
      swal("Confirmation!", "Vehicle Update Successfully!", "success");
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
        swal("Error!", "Vehicle Update Failed!", "error");
      }
    },
  });
}

export async function searchVehicle(vehicleId) {
  return $.ajax({
    url: baseUrl + "/" + vehicleId,
    method: "GET",
    dataType: "json",
    headers: {
      Authorization: "Bearer " + token,
    },

    error: function (error) {
      console.log(error);
      swal("Warning!", "Vehicle not found!", "info");
    },
  });
}

export function deleteVehicle(vehicleId) {
  return $.ajax({
    url: baseUrl + "/" + vehicleId,
    method: "DELETE",
    data: "data",
    dataType: "dataType",
    headers: {
      Authorization: "Bearer " + token,
    },

    success: function () {
      swal("Confirmation!", "Vehicle Delete Successfully!", "success");
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
        swal("Error!", "Vehicle Delete Failed!", "error");
      }
    },
  });
}

export function validateVehicle(vehicle) {
  const numberPlatePattern = /^[A-Za-z]{2,3} \d{4}$/;

  if (!numberPlatePattern.test(vehicle.numberPlate)) {
    swal({
      title: "Warning!",
      text: "Invalid Vehicle Number Plate!",
      icon: "error",
      button: "Try Again!",
    });
    return false;
  }
  return true;
}
