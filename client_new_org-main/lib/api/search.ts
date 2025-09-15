import apiClient from "./api-client";

export const combinedSearchApi = async () => {
    const response = await apiClient.get('/browse/search');
    return response.data;
};

export const searchStylesApi = async (q: string) => {
    const response = await apiClient.get('/browse/styles/search', {
        params: { q, page: 1, limit: 20 }
    });
    return response.data;
}

export const searchConversationsApi = async (q: string) => {
    const response = await apiClient.post('/messages/search/conv', {
        query: q,
        limit: 20
    });
    return response.data;
}

export const searchGlobalMessagesApi = async (q: string) => {
    const response = await apiClient.post('/messages/search', {
        query: q,
        limit: 20
    });
    return response.data;
}