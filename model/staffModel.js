const token = localStorage.getItem("authToken");
const baseUrl = "http://localhost:8080/greenShadow/api/v1/staff";

export function checkTokenValidity() {
  return $.ajax({
    url: "http://localhost:8080/greenShadow/api/v1/greenShadow/validate-token",
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

export function getAllStaff() {
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

export function getAllVehicles() {
  return $.ajax({
    url: "http://localhost:8080/greenShadow/api/v1/vehicle",
    method: "GET",
    dataType: "json",
    headers: {
      Authorization: `Bearer ` + token,
    },

    error: function (error) {
      console.log(error);
    },
  });
}

export function saveStaff(staff) {
  return $.ajax({
    url: baseUrl,
    method: "POST",
    contentType: "application/json",
    data: JSON.stringify(staff),
    headers: {
      Authorization: `Bearer ` + token,
    },

    success: function () {
      swal("Confirmation!", "Staff Member Saved Successfully!", "success");
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
        swal("Error!", "Staff Saved Failed", "error");
      }
    },
  });
}

export function updateStaff(staffId, staffData) {
  return $.ajax({
    url: baseUrl + "/" + staffId,
    method: "PATCH",
    contentType: "application/json",
    data: JSON.stringify(staffData),
    headers: {
      Authorization: "Bearer " + token,
    },

    success: function () {
      swal("Confirmation!", "Staff Member Update Successfully!", "success");
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
        swal("Error!", "Staff Update Failed", "error");
      }
    },
  });
}

export async function searchStaff(staffId) {
  return $.ajax({
    url: baseUrl + "/" + staffId,
    method: "GET",
    dataType: "json",
    headers: {
      Authorization: "Bearer " + token,
    },

    error: function (error) {
      console.log(error);
      swal("Warning!", "Member not found!", "info");
    },
  });
}

export function deleteStaff(staffId) {
  return $.ajax({
    url: baseUrl + "/" + staffId,
    method: "DELETE",
    data: "data",
    dataType: "dataType",
    headers: {
      Authorization: "Bearer " + token,
    },

    success: function () {
      swal("Confirmation!", "Member Delete Successfully!", "success");
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
        swal("Error!", "Staff Delete Failed", "error");
      }
    },
  });
}

export function validateUserData(user) {
  const namePattern = /^[A-Za-z\s]+$/;
  const addressPattern = /^[A-Za-z0-9\s,.'-]+$/;
  const mobilePattern = /^\d{10}$/;
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!namePattern.test(user.firstName)) {
    swal({
      title: "Warning!",
      text: "Invalid First Name!",
      icon: "error",
      button: "Try Again!",
    });
    return false;
  }

  if (!namePattern.test(user.lastName)) {
    swal({
      title: "Warning!",
      text: "Invalid Last Name!",
      icon: "error",
      button: "Try Again!",
    });
    return false;
  }

  const combinedAddress = `${user.addressLine1} ${user.addressLine2} ${user.addressLine3} ${user.addressLine4} ${user.addressLine5}`;
  if (!addressPattern.test(combinedAddress.trim())) {
    swal({
      title: "Warning!",
      text: "Invalid Address!",
      icon: "error",
      button: "Try Again!",
    });
    return false;
  }

  if (!mobilePattern.test(user.mobile)) {
    swal({
      title: "Warning!",
      text: "Invalid Mobile Number!",
      icon: "error",
      button: "Try Again!",
    });
    return false;
  }

  if (!emailPattern.test(user.email)) {
    swal({
      title: "Warning!",
      text: "Invalid Email Address!",
      icon: "error",
      button: "Try Again!",
    });
    return false;
  }

  return true;
}
