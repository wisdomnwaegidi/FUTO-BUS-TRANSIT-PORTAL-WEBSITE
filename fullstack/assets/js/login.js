document.addEventListener("DOMContentLoaded", function () {
  const checkBox = document.getElementById("checkbox");
  const form = document.getElementById("login-form");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const submitButton = document.getElementById("sbtn");
  const spinner = document.getElementById("spinner");

  // Function to validate email
  const validateEmail = () => {
    const email = emailInput.value.trim();
    if (email === "") {
      emailInput.style.border = "1px solid red";
      emailInput.placeholder = "Please enter your email";
      emailInput.labels[0].innerText = "Email (required)";
      emailInput.labels[0].style.color = "red";
      return false;
    } else {
      emailInput.style.border = "1px solid green";
      emailInput.placeholder = "sample@mail.com";
      emailInput.labels[0].innerText = "Email";
      emailInput.labels[0].style.color = "black";
      return true;
    }
  };

  // Function to validate password
  const validatePassword = () => {
    const password = passwordInput.value.trim();
    if (password === "") {
      passwordInput.style.border = "1px solid red";
      passwordInput.placeholder = "Please enter your password";
      passwordInput.labels[0].innerText = "Password (required)";
      passwordInput.labels[0].style.color = "red";
      return false;
    } else {
      passwordInput.style.border = "1px solid green";
      passwordInput.placeholder = "eg Mamafrica20";
      passwordInput.labels[0].innerText = "Password";
      passwordInput.labels[0].style.color = "black";
      return true;
    }
  };

  // Form submission event listener
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const isEmailValid = validateEmail();
    const isPasswordValid = validatePassword();

    const buttonUpdate = () => {
      spinner.style.display = "inline-block";
      submitButton.textContent = "Please wait...";
    };

    if (isEmailValid && isPasswordValid) {
      buttonUpdate();
      try {
        form.submit(); // Submit the form after login
        await login();
      } catch (error) {
        console.log(error);
      } finally {
        submitButton.textContent = "Login";
        spinner.style.display = "none";
      }
    } else {
      // Delay to show red borders before removing them
      setTimeout(() => {
        emailInput.style.border = "";
        passwordInput.style.border = "";
      }, 5000);
    }
  });

  const login = async () => {
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    const formData = { email, password };

    try {
      const res = await fetch(`/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const responseBody = await res.json();
      
      if (!res.ok) {
        throw new Error(responseBody.message);
      } else {
        console.log(responseBody);
        window.location.href = "/dashboard";
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Toggle Password visibility
  checkBox.addEventListener("click", () => {
    const password = document.getElementById("password");
    password.type = password.type === "password" ? "text" : "password";
  });

  // Input blur event listeners for validation
  emailInput.addEventListener("keyup", validateEmail);
  passwordInput.addEventListener("keyup", validatePassword);
});
