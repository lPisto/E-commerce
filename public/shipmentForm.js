const form = document.getElementById("shipmentForm");
const submitBtn = document.getElementById("shipmentSaveBtn");
const inputs = document.querySelectorAll(".shipmentInput");
const country = inputs[4]
const countryPh = inputs[4].placeholder;
const city = inputs[5]
const cityPh = inputs[5].placeholder;
const street = inputs[6]
const streetPh = inputs[6].placeholder;
const streetNumber = inputs[7]
const streetNumberPh = inputs[7].placeholder;
const flat = inputs[8]
const flatPh = inputs[8].placeholder;
const description = inputs[9]
const descriptionPh = inputs[9].placeholder;

const expresiones = {
    email: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
    phone: /^\d{7,15}$/,
    country: /^[a-zA-ZÀ-ÿ\s]{1,50}$/,
    city: /^[a-zA-ZÀ-ÿ\s]{1,50}$/,
    street: /^[a-zA-ZÀ-ÿ\s]{1,50}$/,
    streetNumber: /^\d{1,15}$/
};

fields = {
    email: false,
    phone: false,
    country: false,
    city: false,
    street: false,
    streetNumber: false
}

if(countryPh == "Country" || cityPh == "City" || streetPh == "Street" || streetNumberPh == "Number") {
    submitBtn.disabled = true;
} else {
    submitBtn.disabled = false;
}

const validateForm = (e) => {
    switch (e.target.name) {
        case 'email':
            validateField(expresiones.email, e.target, 'email');
        break;
        case 'phone':
            validateField(expresiones.phone, e.target, 'phone');
        break;
    }
    if (countryPh == "Country" || cityPh == "City" || streetPh == "Street" || streetNumberPh == "Number") {
        switch (e.target.name) {
            case 'country':
                validateField(expresiones.country, e.target, 'country');
            break;
            case 'city':
                validateField(expresiones.city, e.target, 'city');
            break;
            case 'street':
                validateField(expresiones.street, e.target, 'street');
            break;
            case 'streetNumber':
                validateField(expresiones.streetNumber, e.target, 'streetNumber');
            break;
        }
        if (fields.country && fields.city && fields.street && fields.streetNumber == true) {
            submitBtn.disabled = false;
        } else {
            submitBtn.disabled = true;
        }
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
});


