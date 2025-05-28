export function isNonEmptyString(value) {
    return typeof value === 'string' && value.trim() !== '';
}

export function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return isNonEmptyString(email) && emailRegex.test(email);
}

export function isValidNumber(value) {
    return !isNaN(parseFloat(value)) && isFinite(value);
}

export function validateLoginForm(data) {
    if (!isNonEmptyString(data.username) || !isNonEmptyString(data.password)) {
        return "Username and password are required";
    }
    return null;
}

export function validateFirstRegisterStep(data) {
    if (!isNonEmptyString(data.username) || !isNonEmptyString(data.password) || !isNonEmptyString(data.verifyPassword)) {
        return "All fields are required";
    }
    if (data.password !== data.verifyPassword) {
        return "Passwords do not match";
    }
    return null;
}

export function validateSecondRegisterStep(data) {
    const requiredFields = [
        "name", "email", "street", "suite", "city", "zipcode",
        "lat", "lng", "phone", "website", "companyName", "catchPhrase", "bs"
    ];

    for (const field of requiredFields) {
        if (!isNonEmptyString(data[field])) {
            return `Field '${field}' is required and must be a non - empty string`;
        }
    }

    if (!isValidEmail(data.email)) {
        return "Email format is invalid";
    }

    if (!isValidNumber(data.lat) || !isValidNumber(data.lng)) {
        return "Latitude and Longitude must be valid numbers";
    }

    return null;
}