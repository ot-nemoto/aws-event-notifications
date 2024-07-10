import axios from 'axios';
import querystring from 'querystring';

export const getCategory = async (category_name) => {
    try {
        const response = await axios.get(
            `https://${process.env.SPACE_NAME}.backlog.com/api/v2/projects/${process.env.PROJECT_ID}/categories`,
            {
                params: {
                    apiKey: process.env.API_KEY,
                },
            }
        );
        let ret = response.data.find((category) => category.name === category_name);
        if (ret === undefined) {
            ret = await addCategory(category_name);
        }
        console.log(`getCategory: ${JSON.stringify(ret)}`);
        return ret;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const addCategory = async (category_name) => {
    try {
        const response = await axios.post(
            `https://${process.env.SPACE_NAME}.backlog.com/api/v2/projects/${process.env.PROJECT_ID}/categories`,
            querystring.stringify({ name: category_name }),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                params: {
                    apiKey: process.env.API_KEY,
                },
            }
        );
        console.log(`addCategory: ${JSON.stringify(response.data)}`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getVersion = async (version_name) => {
    try {
        const response = await axios.get(
            `https://${process.env.SPACE_NAME}.backlog.com/api/v2/projects/${process.env.PROJECT_ID}/versions`,
            {
                params: {
                    apiKey: process.env.API_KEY,
                },
            }
        );
        let ret = response.data.find((version) => version.name === version_name);
        if (ret === undefined) {
            ret = await addVersion(version_name);
        }
        console.log(`getVersion: ${JSON.stringify(ret)}`);
        return ret;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const addVersion = async (version_name) => {
    try {
        const response = await axios.post(
            `https://${process.env.SPACE_NAME}.backlog.com/api/v2/projects/${process.env.PROJECT_ID}/versions`,
            querystring.stringify({ name: version_name }),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                params: {
                    apiKey: process.env.API_KEY,
                },
            }
        );
        console.log(`addVersion: ${JSON.stringify(response.data)}`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getCustomField = async (custom_field_name) => {
    try {
        const response = await axios.get(
            `https://${process.env.SPACE_NAME}.backlog.com/api/v2/projects/${process.env.PROJECT_ID}/customFields`,
            {
                params: {
                    apiKey: process.env.API_KEY,
                },
            }
        );
        let ret = response.data.find((custom_field) => custom_field.name === custom_field_name);
        if (ret === undefined) {
            ret = await addCustomField(custom_field_name);
        }
        console.log(`getCustomField: ${JSON.stringify(ret)}`);
        return ret;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const addCustomField = async (custom_field_name) => {
    try {
        const response = await axios.post(
            `https://${process.env.SPACE_NAME}.backlog.com/api/v2/projects/${process.env.PROJECT_ID}/customFields`,
            querystring.stringify({ typeId: 1, name: custom_field_name }),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                params: {
                    apiKey: process.env.API_KEY,
                },
            }
        );
        console.log(`addCustomField: ${JSON.stringify(response.data)}`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getIssue = async (eventId, customFieldName = 'event_id') => {
    try {
        const customField = await getCustomField(customFieldName);
        const response = await axios.get(`https://${process.env.SPACE_NAME}.backlog.com/api/v2/issues`, {
            params: {
                apiKey: process.env.API_KEY,
                'projectId[]': process.env.PROJECT_ID,
                [`customField_${customField.id}`]: eventId,
            },
        });
        console.log(`getIssue: ${JSON.stringify(response.data)}`);
        return response.data.length ? response.data[0] : null;
    } catch (error) {
        console.error(error);
        throw error;
    }
};
