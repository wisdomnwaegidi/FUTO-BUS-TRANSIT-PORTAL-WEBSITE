document.addEventListener("DOMContentLoaded", function () {
  const profilePictureInput = document.getElementById("profilePicture");
  const imagePreview = document.getElementById("imagePreview");
  const uploadButton = document.getElementById("uploadButton");
  const profileForm = document.getElementById("profileForm");
  const messageElement = document.getElementById("message");

  profilePictureInput.addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        imagePreview.src = e.target.result;
      };
      reader.readAsDataURL(file);
      uploadButton.disabled = false;

      uploadButton.addEventListener("click", function () {
        handleAvatarUpload(file);
      });
    }
  });

  async function handleAvatarUpload(file) {
    const formData = new FormData(profileForm);
    formData.set("profilePicture", file);
    const url = `/profile/66623c066dafb828000e04e2/edit`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {},
        body: formData,
      });

      const res = await res.json();

      console.log(res);
      if (!res.ok) {
        messageElement.textContent =
          res.error.message ||
          "An error occurred while uploading the profile picture.";
        return;
      }
      messageElement.textContent =
        res.message || "Profile picture updated successfully!";
    } catch (error) {
      console.error("Error:", error);
      messageElement.textContent =
        "An error occurred while uploading the profile picture.";
    }
  }
});
