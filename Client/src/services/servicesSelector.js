import { contactsServices } from './contactsServices';
import { requestsServices } from './requestsServices';

export const createHandler = async ({ type, body, onSuccess, onError }) => {
    try {
        switch (type) {
            case 'Patients':
                return await contactsServices.create(body, 'patients');
            case 'Hospitalizeds':
                return await contactsServices.create(body, 'hospitalizeds');
            case 'Events':
                return await requestsServices.create(body);
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

export const deleteHandler = async ({ type, id, onSuccess, onError }) => {
    try {
        switch (type) {
            case 'Events':
                return await requestsServices.delete(id, onSuccess, onError);
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

export const updatHandler = async (type, id, body, onSuccess, onError) => {
    try {
        switch (type) {
            case 'Events':
                return await requestsServices.update(id, body);
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