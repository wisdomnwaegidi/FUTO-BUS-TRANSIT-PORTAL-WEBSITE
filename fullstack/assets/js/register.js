document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("#form");
  const inputs = form.querySelectorAll("input, select");
  const togglePassword = document.getElementById("toggle");

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const phoneRegex = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-s./0-9]*$/;

  const validateInput = (input) => {
    let isValid = true;

    if (input.value.trim() === "") {
      isValid = false;
    } else if (input.type === "email" && !emailRegex.test(input.value)) {
      isValid = false;
    } else if (input.type === "tel") {
      if (input.value.length !== 11 || !phoneRegex.test(input.value)) {
        isValid = false;
      }
    } else if (input.tagName === "SELECT") {
      const selectedIndex = input.selectedIndex;
      if (selectedIndex === 0) {
        isValid = false;
      } else {
        isValid = true;
      }
    }

    if (!isValid) {
      input.style.border = "1px solid red";
      input.placeholder = "Please fill out this field";
      if (input.labels.length > 0) {
        input.labels[0].style.color = "red";
      }
    } else {
      input.style.border = "1px solid green";
      input.placeholder = "";
      if (input.labels.length > 0) {
        input.labels[0].style.color = "black";
      } else if (input.tagName === "SELECT") {
        input.labels[0].style.color = "black";
        input.style.border = "1px solid green";
      }
    }

    return isValid;
  };

  inputs.forEach((input) => {
    input.addEventListener("keyup", () => validateInput(input));
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    let allValid = true;

    inputs.forEach((input) => {
      if (!validateInput(input)) {
        allValid = false;
      }
    });

    if (allValid) {
      try {
        await register();
        form.submit();
        form.reset();
      } catch (error) {
        console.error(error);
      }
    }
  });

  const register = async () => {
    const formData = {};
    inputs.forEach((input) => (formData[input.name] = input.value));

    try {
      const response = await fetch(`/register`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const responseBody = await response.json();
      if (!response.ok) {
        throw new Error(responseBody.message);
      } else {
        console.log(responseBody);
        // Redirect to dashboard
        window.location.href = "/dashboard";
      }
    } catch (error) {
      console.error(error);
    }
  };

  togglePassword.addEventListener("click", () => {
    const passwordToggle = document.getElementById("password");
    passwordToggle.type =
      passwordToggle.type === "password" ? "text" : "password";
  });
});
