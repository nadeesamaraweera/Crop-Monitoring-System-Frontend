$(document).ready(function () {
    // Initial setup: Show Sign-In/Sign-Up section, hide dashboard and other sections
    $('#signInAndSignUp-sec').css({ display: 'block' });
    $('#header-sec, #sections-wrapper').css({ display: 'none' });

    // Event listener for login button click
    $('#loginBtn').on('click', function (event) {
        event.preventDefault();
        const email = $('#emailLogin').val().trim();
        const password = $('#passwordLogin').val().trim();

        if (!email || !password) {
            alert("Please enter both email and password.");
            return;
        }
        if (!validateEmail(email)) {
            alert("Please enter a valid email address.");
            return;
        }

        // Check if email and password match the predefined credentials
        if (email === "nadee@gmail.com" && password === "123123") {
            alert("Login Successfully!");
            window.location.href = "";
        } else {
            alert("Invalid email or password. Please try again.");
        }
    });

    // Function for email validation
    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Logic for switching between Sign-Up and Sign-In forms
    const signInForm = document.getElementById("signInForm");
    const signUpForm = document.getElementById("signUpForm");

    window.showSignUp = function () {
        signInForm.style.display = "none";
        signUpForm.style.display = "block";
    };
    window.showSignIn = function () {
        signInForm.style.display = "block";
        signUpForm.style.display = "none";
    };

    // Event listener for Sign-Up form submission
    $('#signUpForm').on('submit', function (event) {
        event.preventDefault();
        const email = $('#email').val().trim();
        const role = $('#role').val();
        const password = $('#Password').val();
        const confirmPassword = $('#confirmPassword').val();

        if (!email || !validateEmail(email)) {
            alert("Please enter a valid email address.");
            return;
        }
        if (!role) {
            alert("Please select your role.");
            return;
        }
        if (password !== confirmPassword) {
            alert("Passwords do not match. Please try again.");
            $('#Password').val('');
            $('#confirmPassword').val('');
            return;
        }
        if (password.length < 6) {
            alert("Password must be at least 6 characters long.");
            return;
        }
        alert("Sign Up Successfully!");
        showSignIn();
    });

    // Toggle password visibility
    $('.toggle-password').on('click', function () {
        const input = $(this).siblings('input');
        const icon = $(this).children('i');

        if (input.attr('type') === 'password') {
            input.attr('type', 'text');
            icon.removeClass('bi-eye-slash').addClass('bi-eye');
        } else {
            input.attr('type', 'password');
            icon.removeClass('bi-eye').addClass('bi-eye-slash');
        }
    });
});
