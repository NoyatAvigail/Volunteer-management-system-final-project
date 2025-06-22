import { contactsServices } from './contactsServices';
import { requestsServices } from './requestsServices';

export const createHandler = async ({ type, body, onSuccess, onError }) => {
    try {
        switch (type) {
            case 'Patients':
                return await contactsServices.create(body,'patients');
            case 'Hospitalizeds':
                return await contactsServices.create(body,'hospitalizeds');
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

export const deleteHandler = async ({ type, currentUser, body, onSuccess, onError }) => {
    try {
        switch (type) {
            case 'Events':
                return await requestsServices.deleteEvent(body);
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

export const updatHandler = async ({ type, currentUser, body, onSuccess, onError }) => {
    try {
        switch (type) {
            case 'Events':
                return await requestsServices.uptatEvent(body);
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