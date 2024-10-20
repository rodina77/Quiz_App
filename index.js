document.getElementById('login_btn').addEventListener('click', function() {
  const username = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const phone = document.getElementById('phone').value;

  if (username === '' || username.includes(' ') || username.includes('_')) {
      Swal.fire('Username is required and must not contain spaces or underscores!');
      return;
  }

  if (password.length < 8) {
      Swal.fire('Password must be at least 8 characters long!');
      return;
  }

  let hasUpperCase = false;
  let hasLowerCase = false;

  for (let i = 0; i < password.length; i++) {
      if (password[i] >= 'A' && password[i] <= 'Z') {
          hasUpperCase = true;
      }
      if (password[i] >= 'a' && password[i] <= 'z') {
          hasLowerCase = true;
      }
  }

  if (!hasUpperCase || !hasLowerCase) {
      Swal.fire('Password must include at least one uppercase letter and one lowercase letter!');
      return;
  }

  const userData = {
      username: username,
      email: email,
      password: password,
      phone: phone
  };

  localStorage.setItem('userData', JSON.stringify(userData));
  localStorage.setItem('user_mail', email);
  localStorage.setItem('user_pass', password);
  Swal.fire('Registration Successful!');
  setTimeout(()=>{
  window.location.href="/login_user/index.html"
  },3000)
});
