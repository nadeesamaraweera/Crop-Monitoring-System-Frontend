export function userSignIn(user) {
  return $.ajax({
    url: "http://localhost:8080/greenShadow/api/v1/auth/signin",
    method: "POST",
    contentType: "application/json",
    data: JSON.stringify(user),

    success: function (response) {
      return response;
    },

    error: function (error) {
      console.error("Login failed:", error);
    },
  });
}

export function userSignUp(user) {
  return $.ajax({
    url: "http://localhost:8080/cms/api/v1/greenShadow/signup",
    method: "POST",
    contentType: "application/json",
    data: JSON.stringify(user),

    success: function (response) {
      return response;
    },

    error: function (error) {
      console.error("Registration failed:", error);
    },
  });
}
