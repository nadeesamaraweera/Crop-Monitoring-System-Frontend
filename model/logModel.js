const token = localStorage.getItem("authToken");
const baseUrl = "http://localhost:8080/greenShadow/api/v1/log";

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

export function getAllLogs() {
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

export function saveLog(logData) {
  const formData = new FormData();
  formData.append("fieldId", logData.fieldId);
  formData.append("cropId", logData.cropId);
  formData.append("temperature", logData.temperature);
  formData.append("details", logData.details);
  formData.append("observedImg", logData.observedImg);

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
      swal("Confirmation!", "Log Saved Successfully!", "success");
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
        swal("Error!", "Log Save Failed", "error");
      }
    },
  });
}

export function updateLog(logId, logData) {
  const formData = new FormData();
  formData.append("fieldId", logData.fieldId);
  formData.append("cropId", logData.cropId);
  formData.append("temperature", logData.temperature);
  formData.append("details", logData.details);
  formData.append("observedImg", logData.observedImg);

  return $.ajax({
    url: baseUrl + "/" + logId,
    method: "PATCH",
    processData: false,
    contentType: false,
    data: formData,
    headers: {
      Authorization: "Bearer " + token,
    },

    success: function () {
      swal("Confirmation!", "Log Updated Successfully!", "success");
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
        swal("Error!", "Log Update Failed", "error");
      }
    },
  });
}

export function searchLog(logId) {
  return $.ajax({
    url: baseUrl + "/" + logId,
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

export function deleteLog(logId) {
  return $.ajax({
    url: baseUrl + "/" + logId,
    method: "DELETE",
    contentType: "application/json",
    headers: {
      Authorization: "Bearer " + token,
    },

    success: function () {
      swal("Confirmation!", "Log Deleted Successfully!", "success");
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
        swal("Error!", "Log Delete Failed", "error");
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

export function getAllCrops() {
  return $.ajax({
    url: "http://localhost:8080/greenShadow/api/v1/crop",
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