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
    if (!isNonEmptyString(data.fullName) || !isNonEmptyString(data.password)) {
        return "fullName and password are required";
    }
    return null;
}

export function validateFirstRegisterStep(data) {
    if (!isNonEmptyString(data.fullName) || !isNonEmptyString(data.password) || !isNonEmptyString(data.verifyPassword)) {
        return "All fields are required";
    }
    if (data.password !== data.verifyPassword) {
        return "Passwords do not match";
    }
    return null;
}

export function validateSecondRegisterStep(data) {
    const requiredFields = [
        'userId', 'gender', 'fullName', 'email', 'phone', 'address', 'sector',
    ];
    
    for (const field of requiredFields) {
        if (!isNonEmptyString(data[field])) {
            return `Field '${field}' is required and must be a non - empty string`;
        }
    }

    if (!isValidEmail(data.email)) {
        return "Email format is invalid";
    }

    return null;
}