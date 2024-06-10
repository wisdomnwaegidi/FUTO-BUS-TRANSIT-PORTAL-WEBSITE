document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("#form");
  const firstNameInput = document.getElementById("firstName");
  const lastNameInput = document.getElementById("lastName");
  const emailInput = document.getElementById("email");
  const phoneNumberInput = document.getElementById("phoneNumber");
  const locationSelect = document.getElementById("location");
  const passwordInput = document.getElementById("password");
  const togglePassword = document.getElementById("toggle");

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const phoneRegex = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-s./0-9]*$/;

  const validateInput = (input, regex = null, minLength = 0) => {
    let isValid = true;

    if (input.value.trim() === "") {
      isValid = false;
    } else if (regex && !regex.test(input.value)) {
      isValid = false;
    } else if (minLength && input.value.length !== minLength) {
      isValid = false;
    } else if (input.tagName === "SELECT" && input.selectedIndex === 0) {
      isValid = false;
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
      }
    }

    return isValid;
  };

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const isFirstNameValid = validateInput(firstNameInput);
    const isLastNameValid = validateInput(lastNameInput);
    const isEmailValid = validateInput(emailInput, emailRegex);
    const isPhoneNumberValid = validateInput(phoneNumberInput, phoneRegex, 11);
    const isLocationValid = validateInput(locationSelect);
    const isPasswordValid = validateInput(passwordInput);

    if (
      isFirstNameValid &&
      isLastNameValid &&
      isEmailValid &&
      isPhoneNumberValid &&
      isLocationValid &&
      isPasswordValid
    ) {
      try {
        await register();
      } catch (error) {
        console.error(error);
      }
    }
  });

  const register = async () => {
    const formData = {
      firstName: firstNameInput.value,
      lastName: lastNameInput.value,
      email: emailInput.value,
      phoneNumber: phoneNumberInput.value,
      location: locationSelect.value,
      password: passwordInput.value,
    };

    console.log("Sending data to server:", formData);

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
    passwordInput.type =
      passwordInput.type === "password" ? "text" : "password";
  });
});
