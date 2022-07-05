const form = document.getElementById("form");
const submitBtn = document.getElementById("settingsSaveBtn");
const inputs = document.querySelectorAll(".settingsInput");

const expresiones = {
    password: /^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{8,50}$/
};

fields = {
    password: false,
    confirmPassword: false
}

submitBtn.disabled = true;

const validateForm = (e) => {
    switch (e.target.name) {
        case 'password':
            validateField(expresiones.password, e.target, 'password');
            confirmPassword();
        break;
        case 'confirm_password':
            confirmPassword();
        break;
    }
    if (fields.password && fields.confirmPassword == true) {
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
            fields['confirmPassword'] = false;
        } else if (password[0].value == confirm_password[0].value){
            document.getElementById(`confirm_passwordGroup`).classList.remove('incorrectForm');
            document.getElementById(`confirm_passwordGroup`).classList.add('correctForm');
            document.querySelector(`#confirm_passwordGroup i`).classList.add('fa-circle-check');
            document.querySelector(`#confirm_passwordGroup i`).classList.remove('fa-times-circle'); 
            document.querySelector(`#confirm_passwordGroup .formInputError`).classList.remove('formInputErrorActive');
            fields['confirmPassword'] = true;
        } 
    } else {
        document.getElementById(`confirm_passwordGroup`).classList.remove('correctForm');
        document.getElementById(`confirm_passwordGroup`).classList.remove('incorrectForm');
        document.querySelector(`#confirm_passwordGroup i`).classList.remove('fa-times-circle');
        document.querySelector(`#confirm_passwordGroup i`).classList.remove('fa-circle-check');
        document.querySelector(`#confirm_passwordGroup .formInputError`).classList.remove('formInputErrorActive');
        fields['confirmPassword'] = false;
    }
}

inputs.forEach((input) => {
    input.addEventListener("keyup", validateForm);
    input.addEventListener("blur", validateForm);
    input.addEventListener("change", validateForm);
  });


