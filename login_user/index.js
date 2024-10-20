function login(event) {
  let email = document.getElementById("email").value.trim();
  let password = document.getElementById("password").value.trim();

  let user_mail = localStorage.getItem("user_mail");
  let user_pass = localStorage.getItem("user_pass");

  if (email === user_mail && password === user_pass) {
    setTimeout(() => {
      window.location.href = "/login_user/mainPage.html"; 
    }, 1500);
    Swal.fire({
      title: "Good job!",
      text: "Successfully logged in",
      icon: "success"
    });
  } else {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Wrong email or password!",
    });
  }
}

document.getElementById("login_btn").addEventListener("click", login);
