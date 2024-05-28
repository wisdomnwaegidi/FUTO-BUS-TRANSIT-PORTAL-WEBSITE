// Set cookie with acceptance value
 function setCookie(cookieName, cookieValue, expirationDays) {
  const date = new Date();
  date.setTime(date.getTime() + (expirationDays * 24 * 60 * 60 * 1000));
  const expires = "expires=" + date.toUTCString();
  document.cookie = cookieName + "=" + cookieValue + ";" + expires + ";path=/";
}

// Handle cookie acceptance
function acceptCookies() {
  setCookie("cookieConsent", "accepted", 30);
  document.getElementById("cookieModal").style.display = "none";
}

// Handle cookie rejection
function rejectCookies() {
  setCookie("cookieConsent", "rejected", 30);
  document.getElementById("cookieModal").style.display = "none";
}

async function settingCookies(event) {
  event.preventDefault(); // Prevent the default behavior of the link

  try {
    const response = await fetch('/cookiesettings');
    if (!response.ok) {
      throw new Error('Failed to fetch HTML file');
    }

    const html = await response.text();
    // Process the received HTML file
    console.log(html)

    // display to the user the cookies setting
    window.document.body.innerHTML = html;

  } catch (error) {
    console.log('Error:', error);
  }
}

// Retrieve the cookie value
function getCookieValue(cookieName) {
  const cookies = document.cookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    if (cookie.startsWith(cookieName + '=')) {
      return cookie.substring(cookieName.length + 1);
    }
  }
  return null;
}

// Display the cookie value on page load if cookie consent is accepted
window.addEventListener('DOMcontentloaded', function() {
  const cookieConsent = getCookieValue("cookieConsent");
  if (cookieConsent === "accepted") {
    const cookieValue = getCookieValue("myCookie");
    if (cookieValue) {
      const cookieElement = document.getElementById("cookieValue");
      cookieElement.textContent = cookieValue;
    }
  } else if (cookieConsent === "rejected") {
     // Handle rejection behavior if needed
       cookieElement.textContent = cookieValue;
  } else {
    document.getElementById("cookieModal").style.display = "block";
  }
});

// Attach event listeners to buttons
document.getElementById("acceptBtn").addEventListener('click', acceptCookies);
document.getElementById("rejectBtn").addEventListener('click', rejectCookies);
document.getElementById("settingsBtn").addEventListener('click', settingCookies);


// Check if the user has previously accepted the cookie
if (!localStorage.getItem('cookieConsent')) {
  const cookieModal = document.getElementById('cookieModal');
  const acceptBtn = document.getElementById('acceptBtn');
  const settingsBtn = document.getElementById('settingsBtn');

  // Show the cookie pop-up
  cookieModal.style.display = 'block';

  // Handle accept button click
  acceptBtn.addEventListener('click', function() {
    localStorage.setItem('cookieConsent', 'accepted');
    cookieModal.style.display = 'none';
  });

  const cookieSettingsUrl = '/cookiesettings';
 
  // Handle settings button click
  settingsBtn.addEventListener('click', function() {
    // Redirect the user to the cookie settings page
    window.location.href = cookieSettingsUrl;
  });
}
