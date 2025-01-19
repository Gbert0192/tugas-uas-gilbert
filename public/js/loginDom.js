document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("myForm").addEventListener("submit", function (e) {
    const noHpInput = document.getElementById("phoneNumber");
    let noHpValue = noHpInput.value;
    let firstNumberHp = noHpValue.charAt(0);

    // Jika nomor HP dimulai dengan "62"
    if (noHpValue.startsWith("62")) {
      noHpInput.value = "0" + noHpValue.slice(2); // Ubah "62" menjadi "0"
    } else if (firstNumberHp !== "0" && firstNumberHp !== "62") {
      // Memeriksa jika nomor tidak diawali dengan "0" atau "62"
      noHpInput.value = "0" + noHpValue; // Menambahkan "0" di depan nomor
    }

    console.log(noHpInput.value);
  });
});

const togglePasswordButton = document.getElementById("togglePassword");
const passwordInput = document.getElementById("password");
const toggleText = document.getElementById("toggleText");

togglePasswordButton.addEventListener("click", () => {
  const isPasswordVisible = passwordInput.type === "text";
  passwordInput.type = isPasswordVisible ? "password" : "text";
  toggleText.textContent = isPasswordVisible ? "Show" : "Hide";
});

const togglePasswordButton2 = document.getElementById("togglePassword2");
const passwordInput2 = document.getElementById("confirmPassword");
const toggleText2 = document.getElementById("toggleText2");

togglePasswordButton2.addEventListener("click", () => {
  const isPasswordVisible = passwordInput2.type === "text";
  passwordInput2.type = isPasswordVisible ? "password" : "text";
  toggleText2.textContent = isPasswordVisible ? "Show" : "Hide";
});

document.querySelector("form").addEventListener("submit", function () {
  document.getElementById("loading-spinner").classList.remove("hidden");
});

// register dom
function normalizePhoneNumber(phoneNumber) {
  return phoneNumber.replace(/^0|^(\+62|62)/, "");
}

fetch("/auth/register-data", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
})
  .then((response) => response.json())
  .then((data) => {
    console.log("Registered Phones:", data.registeredPhones);
    console.log("Registered Emails:", data.registeredEmails);

    const registeredPhones = data.registeredPhones.map(normalizePhoneNumber);
    const registeredEmails = data.registeredEmails;

    function showWarning(elementId, message) {
      const warningElement = document.getElementById(elementId);
      warningElement.textContent = message;
      warningElement.classList.toggle("hidden", message === "");
      checkFormValidity();
    }

    function checkFormValidity() {
      const warnings = document.querySelectorAll(".warning");
      const hasErrors = Array.from(warnings).some(
        (warning) => warning.textContent.trim() !== ""
      );
      const submitButton = document.getElementById("submitButton");
      submitButton.disabled = hasErrors;
    }

    const phoneNumberInput = document.getElementById("phoneNumber");
    phoneNumberInput.addEventListener("input", function () {
      let phoneNumber = this.value;

      phoneNumber = normalizePhoneNumber(phoneNumber);

      if (registeredPhones.includes(phoneNumber)) {
        showWarning("phone-warning", "Nomor telepon sudah terdaftar");
      } else {
        showWarning("phone-warning", "");
      }
    });

    document.getElementById("email").addEventListener("input", function () {
      const email = this.value;
      if (registeredEmails.includes(email)) {
        showWarning("email-warning", "Email sudah terdaftar");
      } else {
        showWarning("email-warning", "");
      }
    });

    document.getElementById("password").addEventListener("input", function () {
      const password = this.value;
      if (password.length < 6) {
        showWarning("password-warning", "Password harus lebih dari 6 karakter");
      } else {
        showWarning("password-warning", "");
      }
    });

    document
      .getElementById("confirmPassword")
      .addEventListener("input", function () {
        const password = document.getElementById("password").value;
        const confirmPassword = this.value;
        if (confirmPassword !== password) {
          showWarning(
            "confirmPassword-warning",
            "Password dan konfirmasi password tidak cocok"
          );
        } else {
          showWarning("confirmPassword-warning", "");
        }
      });

    document.getElementById("myForm").addEventListener("submit", function (e) {
      const submitButton = document.getElementById("submitButton");
      if (submitButton.disabled) {
        e.preventDefault();
        alert("Formulir memiliki error. Harap perbaiki sebelum mengirim.");
      }
    });

    checkFormValidity();
  })
  .catch((error) => {
    console.error("Error:", error);
  });
