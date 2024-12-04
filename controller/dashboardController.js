import { checkTokenValidity } from "../model/dashboardModel.js";

$(document).ready(function () {
  if (checkTokenValidity()) {
    const token = localStorage.getItem("authToken");
    console.log(token);

    $(".dash-btn a").on("click", function (event) {
      event.preventDefault();
      const page = $(this).attr("href");
      $("#mainContentFrame").attr("src", page);
    });
  }
});

$(".btn-signout").click(function () {
  swal({
    title: "Are you sure?",
    text: "Do you want to signout this system!",
    icon: "warning",
    buttons: true,
    dangerMode: true,
  }).then((willOut) => {
    if (willOut) {
      localStorage.removeItem("authToken");
      window.location.href = "../index.html";
    }
  });
});
