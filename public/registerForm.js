const form = document.getElementById("form");
const inputs = document.querySelectorAll(".formInput");
const submitBtn = document.getElementById("registerSubmitBtn");
const formSettings = document.getElementById("formSettings");

const expresiones = {
  name: /^[a-zA-ZÀ-ÿ\s]{1,50}$/, // Letras y espacios, pueden llevar acentos.
  surname: /^[a-zA-ZÀ-ÿ\s]{1,50}$/, // Letras y espacios, pueden llevar acentos.
  email: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
  phone: /^\d{7,15}$/,
  password: /^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{8,50}$/
};

fields = {
    name: false, 
    surname: false,
    email: false,
    phone: false,
    password: false
}

submitBtn.disabled = true;

const validateForm = (e) => {
    switch (e.target.name) {
        case 'name':
            validateField(expresiones.name, e.target, 'name');
        break;
        case 'surname':
            validateField(expresiones.surname, e.target, 'surname');
        break;
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
    if (fields.name && fields.surname && fields.email && fields.phone && fields.password == true) {
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
