const form = document.getElementById('contactForm');
const toast = document.getElementById('toast');

const fields = [
  {
    el: document.getElementById('firstName'),
    validate: (el) => el.value.trim() !== '',
    errorEl: () => document.getElementById('firstName').closest('.field-group').querySelector('.error-msg'),
  },
  {
    el: document.getElementById('lastName'),
    validate: (el) => el.value.trim() !== '',
    errorEl: () => document.getElementById('lastName').closest('.field-group').querySelector('.error-msg'),
  },
  {
    el: document.getElementById('email'),
    validate: (el) => {
      const val = el.value.trim();
      if (val === '') return false;
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
    },
    errorEl: () => {
      const group = document.getElementById('email').closest('.field-group');
      const val = document.getElementById('email').value.trim();
      if (val === '') return group.querySelector('.error-required');
      return group.querySelector('.error-msg:not(.error-required)');
    },
  },
  {
    el: document.querySelectorAll('input[name="queryType"]'),
    validate: () => document.querySelector('input[name="queryType"]:checked') !== null,
    errorEl: () => document.querySelector('.query-group .error-msg'),
    isRadio: true,
  },
  {
    el: document.getElementById('message'),
    validate: (el) => el.value.trim() !== '',
    errorEl: () => document.getElementById('message').closest('.field-group').querySelector('.error-msg'),
  },
  {
    el: document.querySelector('input[name="consent"]'),
    validate: (el) => el.checked,
    errorEl: () => document.querySelector('.consent-group .error-msg'),
    isCheckbox: true,
  },
];

function showError(field) {
  const group = field.el.closest('.field-group') || field.el.closest('.query-group');
  group.classList.add('error');
}

function clearError(field) {
  const group = field.el.closest('.field-group') || field.el.closest('.query-group');
  group.classList.remove('error');
}

function validateField(field) {
  if (field.validate(field.el)) {
    clearError(field);
    return true;
  }
  showError(field);
  return false;
}

function showToast() {
  toast.hidden = false;
  setTimeout(() => {
    toast.hidden = true;
  }, 5000);
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  let allValid = true;

  fields.forEach((field) => {
    if (!validateField(field)) {
      allValid = false;
    }
  });

  if (allValid) {
    showToast();
    form.reset();
    fields.forEach((field) => clearError(field));
  }
});

fields.forEach((field) => {
  if (field.isRadio) {
    field.el.forEach((radio) => {
      radio.addEventListener('change', () => validateField(field));
    });
  } else if (field.isCheckbox) {
    field.el.addEventListener('change', () => validateField(field));
  } else {
    field.el.addEventListener('blur', () => validateField(field));
    field.el.addEventListener('input', () => {
      const group = field.el.closest('.field-group');
      if (group.classList.contains('error')) {
        validateField(field);
      }
    });
  }
});
