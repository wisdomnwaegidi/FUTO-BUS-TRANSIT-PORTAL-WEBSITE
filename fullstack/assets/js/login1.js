document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("login-form");
  const alertContainer = document.getElementById("alert");
  const submit = document.querySelector("button#sbtn");
  const checkbox = document.getElementById("checkbox");
  const spinner = document.getElementById("spinner");
  const valid = true;

  const login = async (event) => {
    event.preventDefault();

    if (valid) {
      submit.disabled = true;
      spinner.style.display = "inline-block";

      try {
        const data = new FormData(form);
        const jsonData = JSON.stringify(Object.fromEntries(data.entries())); // Serialize FormData to JSON

        const response = await fetch("/login", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: jsonData, // Use body to send JSON data
        });

        const res = await response.json();
        console.log(res);

        if (!response.ok) {
          alertContainer.innerHTML = `<div class="alert alert-danger">${
            res.errors?.[0]?.msg || "An error occurred. Please try again."
          }</div>`;
        } else if (res.redirect) {
          window.location.href = res.redirect;
        } else {
          alertContainer.innerHTML = `<div class="alert alert-danger">Unexpected error. Please try again.</div>`;
        }
      } catch (error) {
        console.error(error);
        alertContainer.innerHTML = `<div class="alert alert-danger">An error occurred. Please try again.</div>`;
      } finally {
        submit.disabled = false;
        spinner.style.display = "none";
      }
    }
  };

  checkbox.addEventListener("click", () => {
    const password = document.getElementById("password");
    password.type = password.type === "password" ? "text" : "password";
  });

  form.addEventListener("submit", login);
});

/* document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById("login-form");
  const alertContainer = document.getElementById("alert");
  const submit = document.querySelector("button#sbtn");
  const checkbox = document.getElementById("checkbox");
  const spinner = document.getElementById("spinner");
  const valid = true;

  const login = async (event) => {
    event.preventDefault();

    if (valid) {
      submit.disabled = true;
      spinner.style.display = "inline-block";

      try {
        const data = new FormData(form);
        const jsonData = JSON.stringify(Object.fromEntries(data.entries())); // Serialize FormData to JSON

        const response = await fetch('/login', {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: jsonData, // Use body to send JSON data
        });

        const res = await response.json();
        console.log(res);

        if (!response.ok) {
          alertContainer.innerHTML = `<div class="alert alert-danger">${res.errors?.[0]?.msg || "An error occurred. Please try again."}</div>`;
        } else if (res.redirect) {
          window.location.href = res.redirect;
        } else {
          alertContainer.innerHTML = `<div class="alert alert-danger">Unexpected error. Please try again.</div>`;
        }
      } catch (error) {
        console.error(error);
        alertContainer.innerHTML = `<div class="alert alert-danger">An error occurred. Please try again.</div>`;
      } finally {
        submit.disabled = false;
        spinner.style.display = "none";
      }
    }
  };

  checkbox.addEventListener("click", () => {
    const password = document.getElementById("password");
    password.type = password.type === "password" ? "text" : "password";
  });

  form.addEventListener("submit", login);
}); */
