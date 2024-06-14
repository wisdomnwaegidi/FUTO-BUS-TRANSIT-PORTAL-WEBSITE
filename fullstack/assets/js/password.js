document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('form');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmpassword');
    const emailInput = document.getElementById('email');
    const errorMessage = document.createElement('div');
    errorMessage.classList.add('error-message');
    form.appendChild(errorMessage);
  
    form.addEventListener('submit', async function(event) {
      event.preventDefault(); // Prevent form from submitting normally
  
      const password = passwordInput.value.trim();
      const confirmPassword = confirmPasswordInput.value.trim();
      const email = emailInput.value.trim();
  
      // Clear any previous error messages
      errorMessage.textContent = '';
  
      // Validate passwords
      if (password.length < 8) {
        errorMessage.textContent = 'Password must be at least 8 characters long.';
        return;
      }
  
      if (password !== confirmPassword) {
        errorMessage.textContent = 'Passwords do not match.';
        return;
      }
  
      // If validation passes, submit the form via Fetch API
      try {
        const response = await fetch(form.action, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, password, confirmPassword })
        });
  
        if (response.ok) {
          alert('Password reset link has been sent to your email!');
          // Redirect or update UI as needed
        } else {
          const errorData = await response.json();
          errorMessage.textContent = errorData.message || 'An error occurred. Please try again.';
        }
      } catch (error) {
        errorMessage.textContent = 'Request failed. Please check your connection.';
      }
    });
  });
  