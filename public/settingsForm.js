const form = document.getElementById("settingsForm");
const submitBtn = document.getElementById("settingsSaveBtn");
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
        case 'email':
            validateField(expresiones.email, e.target, 'email');
        break;
        case 'phone':
            validateField(expresiones.phone, e.target, 'phone');
        break;
        case 'password':
            validateField(expresiones.password, e.target, 'password');
            confirmPassword();
        break;
        case 'confirm_password':
            confirmPassword();
        break;
    }
    if (fields.password || fields.email || fields.phone == true) {
        submitBtn.disabled = false;
    } else {
        submitBtn.disabled = true;
    }
}

const validateField = (expresion, input, field) => {
    if(expresion.test(input.value)) {
        document.getElementById(`${field}Group`).classList.remove('incorrectForm');
        document.getElementById(`${field}Group`).classList.add('correctForm');
        document.querySelector(`#${field}Group i`).classList.add('fa-circle-check');
        document.querySelector(`#${field}Group i`).classList.remove('fa-times-circle'); 
        if(field !== 'name' && field !== 'surname'){
            document.querySelector(`#${field}Group .formInputError`).classList.remove('formInputErrorActive');
        }  
        fields[field] = true;
    } else {
        document.getElementById(`${field}Group`).classList.add('incorrectForm');
        document.getElementById(`${field}Group`).classList.remove('correctForm');
        document.querySelector(`#${field}Group i`).classList.remove('fa-circle-check');
        document.querySelector(`#${field}Group i`).classList.add('fa-times-circle'); 
        document.querySelector(`#${field}Group .formInputError`).classList.add('formInputErrorActive');
        fields[field] = false;
    }
    if (input.value < 1) {
        document.getElementById(`${field}Group`).classList.remove('correctForm');
        document.getElementById(`${field}Group`).classList.remove('incorrectForm');
        document.querySelector(`#${field}Group i`).classList.remove('fa-times-circle');
        document.querySelector(`#${field}Group i`).classList.remove('fa-circle-check');
        document.querySelector(`#${field}Group .formInputError`).classList.remove('formInputErrorActive');
        fields[field] = false;
    }
}

const confirmPassword = () => {
    const password = document.getElementsByClassName("password");
    const confirm_password = document.getElementsByClassName("confirm_password");
    
    if (password[0].value.length > 0) {
        if (password[0].value !== confirm_password[0].value) {
            document.getElementById(`confirm_passwordGroup`).classList.add('incorrectForm');
            document.getElementById(`confirm_passwordGroup`).classList.remove('correctForm');
            document.querySelector(`#confirm_passwordGroup i`).classList.remove('fa-circle-check');
            document.querySelector(`#confirm_passwordGroup i`).classList.add('fa-times-circle'); 
            document.querySelector(`#confirm_passwordGroup .formInputError`).classList.add('formInputErrorActive');
            fields['password'] = false;
        } else if (password[0].value == confirm_password[0].value){
            document.getElementById(`confirm_passwordGroup`).classList.remove('incorrectForm');
            document.getElementById(`confirm_passwordGroup`).classList.add('correctForm');
            document.querySelector(`#confirm_passwordGroup i`).classList.add('fa-circle-check');
            document.querySelector(`#confirm_passwordGroup i`).classList.remove('fa-times-circle'); 
            document.querySelector(`#confirm_passwordGroup .formInputError`).classList.remove('formInputErrorActive');
            fields['password'] = true;
        } 
    } else {
        document.getElementById(`confirm_passwordGroup`).classList.remove('correctForm');
        document.getElementById(`confirm_passwordGroup`).classList.remove('incorrectForm');
        document.querySelector(`#confirm_passwordGroup i`).classList.remove('fa-times-circle');
        document.querySelector(`#confirm_passwordGroup i`).classList.remove('fa-circle-check');
        document.querySelector(`#confirm_passwordGroup .formInputError`).classList.remove('formInputErrorActive');
        fields['password'] = false;
    }
}

inputs.forEach((input) => {
    input.addEventListener("keyup", validateForm);
    input.addEventListener("blur", validateForm);
  });


