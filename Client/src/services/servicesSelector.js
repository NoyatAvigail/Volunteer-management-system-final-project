import { contactsServices } from './contactsServices';
import { patientsService } from './patientsServices';
import { requestsServices } from './requestsServices';
import { thanksService } from './thanksService';
export const createHandler = async ({ type, body, onSuccess, onError }) => {
    try {
        switch (type) {
            case 'Patients':
                return await patientsService.create(body, 'patients');
            case 'Hospitalizeds':
                return await contactsServices.create(body, 'hospitalizeds');
            case 'Events':
                return await requestsServices.create(body);
            case 'Thanks':
                return await thanksService.create(body, onSuccess, onError)
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
            case 'Thanks':
                return await thanksService.deleteNote(id, onSuccess, onError)
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
            case 'Thanks':
                return await thanksService.updateNote(id, body, onSuccess, onError)
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