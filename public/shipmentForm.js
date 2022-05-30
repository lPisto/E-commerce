const form = document.getElementById("shipmentForm");
const submitBtn = document.getElementById("shipmentSaveBtn");
const inputs = document.querySelectorAll(".shipmentInput");
const country = document.getElementById("shipmentCountry");
const countryPh = document.getElementById("shipmentCountry").placeholder;
const city = document.getElementById("shipmentCity");
const cityPh = document.getElementById("shipmentCity").placeholder;
const street = document.getElementById("shipmentStreet");
const streetPh = document.getElementById("shipmentStreet").placeholder;
const streetNumber = document.getElementById("shipmentStreetNumber");
const streetNumberPh = document.getElementById("shipmentStreetNumber").placeholder;
const flat = document.getElementById("shipmentFlat");
const flatPh = document.getElementById("shipmentFlat").placeholder;
const description = document.getElementById("shipmentDescription");
const descriptionPh = document.getElementById("shipmentDescription").placeholder;

const expresiones = {
    email: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
    phone: /^\d{7,15}$/,
    streetNumber: /^\d{1,15}$/
};

fields = {
    name:false,
    surname: false,
    email: false,
    phone: false,
    streetNumber: false
}

if(countryPh == "Country" || cityPh == "City" || streetPh == "Street" || streetNumberPh == "Number") {
    submitBtn.disabled = true;
    if (country.value > 0 && city.value > 0 && street.value > 0 && streetNumber.value > 0) {
        submitBtn.disabled = false;
    }
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
        case 'streetNumber':
            validateField(expresiones.streetNumber, e.target, 'streetNumber');
        break;
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


