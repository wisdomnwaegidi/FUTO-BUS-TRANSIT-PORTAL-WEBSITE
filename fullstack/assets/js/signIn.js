class Login {
  constructor(form, fields) {
    this.form = form;
    this.fields = fields;
    this.validateonSubmit();
  }

  validateonSubmit() {
    // let self = this;
    let error = 0;

    this.form.addEventListener("submit", (e) => {
      e.preventDefault();
      error = 0; // reset the error count
      this.fields.forEach((field) => {
        const input = document.querySelector(`#${field}`);
        if (this.validateFields(input) === "") {
          error++;
        }
      });
      if (error === 0) {
        // if all fields are valid
        // localStorage.setItem('auth', 1);
        this.form.submit();
        this.fields.forEach((field1) => {
          let input1 = document.querySelector(`#${field1}`);
          input1.value = "";
        });
      }
    });
  }

  validateFields(field) {
    let error = "";
    if (field.id === "email" && !emailRegex.test(field.value)) {
      error = "Please enter a valid email address";
    } else if (field.id === "password") {
      if (field.value === "") {
        error = "Please enter your password";
      }
    }
    if (error) {
      this.setStatus(field, error, "error");
      return ""; // return an empty string to indicate an error
    } else {
      this.setStatus(field, null, "success");
      // console.log('success');
      return "success"; // return a string to indicate success
    }
  }

  setStatus(field, message, status) {
    const errorMessage = field.parentElement.querySelector(".error-message");
    const successMessage =
      field.parentElement.querySelector(".success-message");

    if (status === "error") {
      errorMessage.innerText = message;
      field.classList.add("input-error");
      errorMessage.style.color = "red";
      field.value = null;

      setTimeout(() => {
        errorMessage.innerText = null;
        field.classList.remove("input-error");
        errorMessage.style.color = "";
      }, 2000);
    }

    if (status === "success") {
      // successMessage.innerText = 'Successfully validated!';
      field.classList.add("input-success");
      successMessage.style.color = "#08af48";
    }

    setTimeout(() => {
      successMessage.innerText = "";
    }, 10000);
  }
}

const form = document.querySelector(".loginForm");
const emailRegex =
  /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
const phoneRegex = /^\d{11,}$/;

if (form) {
  const fields = ["email", "password"];
  const validator = new Login(form, fields);
}
