const settingsEmail = document.getElementById("settingsEmail");
const settingsPhone = document.getElementById("settingsPhone");
const oldPassword = document.getElementById("oldPassword");
const newPassword = document.getElementById("newPassword");
const confirmNewPassword = document.getElementById("confirmNewPassword");
const settingsSaveBtn = document.getElementById("settingsSaveBtn");
const inputs = document.querySelectorAll(".settingsInput");

var disabled = document.getElementById("settingsName").disabled;
document.getElementById("settingsName").disabled = true;
document.getElementById("settingsSurname").disabled = true;

const expresiones = {
    email: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
    phone: /^\d{7,15}$/,
    password: /^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{8,50}$/
};

fields = {
    email: false,
    phone: false,
    password: false
}

submitBtn.disabled = true;

const validateForm = (e) => {
    switch (e.target.name) {
        case 'newEmail':
            validateField(expresiones.email, e.target, 'email');
        break;
        case 'newPhone':
            validateField(expresiones.phone, e.target, 'phone');
        break;
        case 'newPassword':
            validateField(expresiones.password, e.target, 'password');
            confirmPassword();
        break;
        case 'confirmNewPassword':
            confirmPassword();
        break;
    }
    if (fields.email && fields.phone && fields.password == true) {
        submitBtn.disabled = false;
    } else {
        submitBtn.disabled = true;
    }
}

inputs.forEach((input) => {
    input.addEventListener("keyup", validateForm);
    input.addEventListener("blur", validateForm);
  });


