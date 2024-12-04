import { userSignIn, userSignUp } from "../model/userModel.js";

$(document).ready(function () {
  $("#signup-form").hide();

  $("#login-form a").click(function (e) {
    e.preventDefault();
    $("#login-form").fadeOut(300, function () {
      $("#signup-form").fadeIn(300);
    });
  });

  $("#signup-form a").click(function (e) {
    e.preventDefault();
    $("#signup-form").fadeOut(300, function () {
      $("#login-form").fadeIn(300);
    });
  });

  $(".togglePassword").on("click", function () {
    const passwordField = $(".password");
    const eyeIcon = $(".eyeIcon");

    if (passwordField.attr("type") === "password") {
      passwordField.attr("type", "text");
      eyeIcon.removeClass("bi-eye-slash").addClass("bi-eye");
    } else {
      passwordField.attr("type", "password");
      eyeIcon.removeClass("bi-eye").addClass("bi-eye-slash");
    }
  });

  $("#userLogIn").click(function () {
    const userName = $("#username").val();
    const password = $("#loginPassword").val();

    if (!userName || !password) {
      swal("Warning!", "Please fill in both username and password!", "info");
      return;
    }

    const userData = {
      email: userName,
      password: password,
    };

    const promise = userSignIn(userData);

    promise
      .then((response) => {
        if (response && response.token) {
          localStorage.setItem("authToken", response.token);
          window.location.href = "../pages/dashboard.html";
        }
      })
      .catch((error) => {
        $("#username").val("");
        $("#loginPassword").val("");
        swal("Login failed!", "Invalid credentials! Please try again", "error");
      });
  });

  $("#userSignUp").click(function () {
    const email = $("#email").val();
    const password = $("#signPassword").val();

    if (!email || !password) {
      swal("Warning!", "Please fill in both email and password!", "info");
      return;
    }

    const userData = {
      email: email,
      password: password,
    };
    const promise = userSignUp(userData);

    promise
      .then((response) => {
        if (response && response.token) {
          swal("Confirmation!", "User Registration Successfully!", "success");
          localStorage.setItem("authToken", response.token);
          window.location.href = "../pages/dashboard.html";
        }
      })
      .catch((error) => {
        $("#email").val("");
        $("#signPassword").val("");
        swal(
          "Registration failed!",
          "You are not staff member! Please enter valid email",
          "error"
        );
      });
  });
});
