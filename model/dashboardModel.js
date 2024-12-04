const token = localStorage.getItem("authToken");

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