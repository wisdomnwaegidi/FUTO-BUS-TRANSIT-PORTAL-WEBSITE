const form = document.querySelector("#form");
const inputs = form.querySelectorAll("input, select");
const err = document.querySelector(".error11");
const toast = document.querySelector(".toast");


const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const phoneRegex = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-s./0-9]*$/;

form.addEventListener("submit", (event) => {
  event.preventDefault();

  let isValid = true;
  let errorMessage = "Please fill in all fields correctly";

  inputs.forEach((input) => {
    if (input.value.trim() === "") {
      isValid = false;
    } else if (input.type === "email") {
      if (!emailRegex.test(input.value)) {
        isValid = false;
      }
    } else if (input.type === "tel") {
      if (input.value.length !== 11 || !phoneRegex.test(input.value)) {
        isValid = false;
        errorMessage = "Numbers should be eleven digits";
      }
    } else if (input.tagName === "SELECT") {
      if (input.value === input.options[0].value) {
        isValid = false;
        errorMessage = "Please select a location";
      }
    }
  });

  if (isValid) {
    form.submit();
    inputs.value = "";
    toast.textContent = "Registration successful";
    toast.style.display = "block";
    setTimeout(() => {
      toast.style.display = "none";
    }, 5000);
  } else {
    err.classList.add("error-message");
    err.textContent = errorMessage;
    setTimeout(() => {
      err.classList.remove("error-message");
      err.textContent = "";
    }, 3000);
  }
});

const register = async () => {
  const data = inputs.value;

  const formData = { data };

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
  }
};

const toggle__password = document.getElementById("toggle");
toggle__password.addEventListener("click", () => {
  const passwordToggle = document.getElementById("password");
  if (passwordToggle.type === "password") {
    passwordToggle.type = "text";
  } else {
    passwordToggle.type = "password";
  }
});
