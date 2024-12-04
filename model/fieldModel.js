const token = localStorage.getItem("authToken");
const baseUrl = "http://localhost:8080/cms/api/v1/field";

export function checkTokenValidity() {
  return $.ajax({
    url: "http://localhost:8080/cms/api/v1/auth/validate-token",
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

export function gelAllFields() {  
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

export function saveField(fieldData) {
  const formData = new FormData();
  formData.append("fieldName", fieldData.fieldName);
  formData.append("location", fieldData.location);
  formData.append("size", fieldData.size);
  formData.append("staffs", JSON.stringify(fieldData.staffs));
  formData.append("fieldImg1", fieldData.fieldImg1);
  formData.append("fieldImg2", fieldData.fieldImg2);
  console.log("Field Data:", fieldData);

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
      swal("Confirmation!", "Field Saved Successfully!", "success");
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
        swal("Error!", "Field Save Failed", "error");
      }
    },
  });
}

export function updateField(fieldId, fieldData) {
  const formData = new FormData();
  formData.append("fieldName", fieldData.fieldName);
  formData.append("location", fieldData.location);
  formData.append("size", fieldData.size);
  formData.append("staffs", JSON.stringify(fieldData.staffs));
  formData.append("fieldImg1", fieldData.fieldImg1);
  formData.append("fieldImg2", fieldData.fieldImg2);

  return $.ajax({
    url: baseUrl + "/" + fieldId,
    method: "PATCH",
    processData: false,
    contentType: false,
    data: formData,
    headers: {
      Authorization: "Bearer " + token,
    },

    success: function () {
      swal("Confirmation!", "Field Updated Successfully!", "success");
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
        swal("Error!", "Field Update Failed", "error");
      }
    },
  });
}

export async function searchField(fieldId) {
  return $.ajax({
    url: baseUrl + "/" + fieldId,
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

export function deleteField(fieldId) {
  return $.ajax({
    url: baseUrl + "/" + fieldId,
    method: "DELETE",
    contentType: "application/json",
    headers: {
      Authorization: "Bearer " + token,
    },

    success: function () {
      swal("Confirmation!", "Field Deleted Successfully!", "success");
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
        swal("Error!", "Field Delete Failed", "error");
      }
    },
  });
}

export function getAllStaff() {
  return $.ajax({
    url: "http://localhost:8080/cms/api/v1/staff",
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