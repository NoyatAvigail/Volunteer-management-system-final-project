import {contactsServices} from './contactsServices';
import {requestsServices} from './requestsServices';

export const createHandler = async ({ type, currentUser, body, onSuccess, onError }) => {
    try {
        switch (type) {
            case 'Patients':
                return await contactsServices.createPatient(body);
            case 'Hospitalizeds':
                return await contactsServices.createHospitalized(body);
            case 'Events':
                return await requestsServices.createEvent(body);
            default:
                throw new Error(`Unsupported type: ${type}`);
        }
        if (onSuccess) onSuccess(result);
        return result;
    } catch (error) {
        onError?.(error);
        throw error;
    }
};