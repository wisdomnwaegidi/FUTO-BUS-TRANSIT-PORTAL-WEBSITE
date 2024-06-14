document.addEventListener("DOMContentLoaded", function () {
  const profilePictureInput = document.getElementById("profilePicture");
  const imagePreview = document.getElementById("imagePreview");
  const uploadButton = document.getElementById("uploadButton");
  const profileForm = document.getElementById("profileForm");
  const uploadForm = document.getElementById("uploadForm");
  const messageElement = document.getElementById("message");
  const messageElementOne = document.getElementById("messageone");
  const toastMessage = document.getElementById("toastMessage");

  const userId = "<%= user._id %>";

  profilePictureInput.addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        imagePreview.src = e.target.result;
      };
      reader.readAsDataURL(file);
      uploadButton.style.display = "block";
      uploadButton.disabled = false;
    }
  });

  profileForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const formData = new FormData(profileForm);
    const url = `/profile/${userId}/picture`;

    try {
      const response = await fetch(url, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(
          "An error occurred while uploading the profile picture."
        );
      }

      const data = await response.json();
      messageElement.textContent = data.message;
    } catch (error) {
      console.error("Error:", error);
      messageElement.textContent =
        error.message ||
        "An error occurred while uploading the profile picture.";
    }
  });

  uploadForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(uploadForm);
    const url = `/profile/${userId}/details`;

    try {
      const response = await fetch(url, {
        method: "PUT",
        credentials: "include",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Error updating profile");
      }

      const data = await response.json();
      console.log(data);

      // Update the UI with the new user details
      document.getElementById("firstName").value = data.user.firstName;
      document.getElementById("lastName").value = data.user.lastName;
      document.getElementById("email").value = data.user.email;
      document.getElementById("address").value = data.user.address;

      toastMessage.textContent = data.message;
      toastMessage.style.display = "block";
      setTimeout(() => {
        toastMessage.style.display = "none";
      }, 3000); // 3 seconds
    } catch (error) {
      console.error("Error:", error);
      messageElementOne.textContent = error.message || "Error updating profile";
    }
  });
});
