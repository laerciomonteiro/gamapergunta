import { environment } from '../../../environments/environment';

const API_URL = `${environment.baseUrl}`;

export const endpoints = {
    authentication: {
        login: `${API_URL}/login`,
        refresh_token: `${API_URL}/login-refresh`
    },
    forms: {
        all: `${API_URL}/forms/list`
    },
    answers: {
        save: `${API_URL}/answers/save`
    }
};
