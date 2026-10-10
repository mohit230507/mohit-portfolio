// Mobile navigation: toggle the menu and keep accessibility state in sync.
const menuToggle = document.querySelector("#menu-toggle");
const navLinks = document.querySelector("#nav-links");

menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("is-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
});

// Close the mobile menu after someone chooses a navigation link.
navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");
  });
});

// Keep the footer year current automatically.
document.querySelector("#year").textContent = new Date().getFullYear();

// Contact form validation. This demo does not send or store form submissions.
const contactForm = document.querySelector("#contact-form");
const formFeedback = document.querySelector("#form-feedback");

const validationRules = {
  name: {
    message: "Please enter at least 2 characters for your name.",
    valid: (value) => value.trim().length >= 2
  },
  email: {
    message: "Please enter a valid email address.",
    valid: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
  },
  message: {
    message: "Please enter a message of at least 10 characters.",
    valid: (value) => value.trim().length >= 10
  }
};

function validateField(field) {
  const rule = validationRules[field.name];
  const errorElement = document.querySelector(`#${field.name}-error`);
  const isValid = rule.valid(field.value);

  field.setAttribute("aria-invalid", String(!isValid));
  errorElement.textContent = isValid ? "" : rule.message;
  return isValid;
}

Object.keys(validationRules).forEach((fieldName) => {
  const field = contactForm.elements[fieldName];
  field.addEventListener("input", () => {
    // Only show validation feedback after the user has started entering data.
    if (field.hasAttribute("aria-invalid")) {
      validateField(field);
    }
    formFeedback.textContent = "";
  });
});

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const fields = Object.keys(validationRules).map((name) => contactForm.elements[name]);
  const allValid = fields.map(validateField).every(Boolean);

  if (allValid) {
    formFeedback.textContent = "Looks good! This demo validates your message, but does not send it.";
    contactForm.reset();
    fields.forEach((field) => field.removeAttribute("aria-invalid"));
    Object.keys(validationRules).forEach((name) => {
      document.querySelector(`#${name}-error`).textContent = "";
    });
  } else {
    formFeedback.textContent = "Please check the highlighted fields and try again.";
    fields.find((field) => field.getAttribute("aria-invalid") === "true")?.focus();
  }
});
