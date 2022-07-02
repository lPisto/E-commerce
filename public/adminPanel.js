const form = document.getElementById("form");
const inputs = document.querySelectorAll(".formInput");
const submitBtn = document.getElementById("saveBtn");

const expresiones = {
    email: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/
};

fields = {
    email: false,
    role: false
}

submitBtn.disabled = true;

const validateForm = (e) => {
    switch (e.target.name) {
        case 'email':
            validateField(expresiones.email, e.target, 'email');
        break;
    }
    console.log(e.target.value)
    if (e.target.name == "role") {
        if (e.target.value != "") {
            fields.role = true
        } else {
            fields.role = false
        }
    }
    if (fields.email && fields.role == true) {
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

inputs.forEach((input) => {
    input.addEventListener("keyup", validateForm);
    input.addEventListener("blur", validateForm);
    input.addEventListener("change", validateForm);
  });