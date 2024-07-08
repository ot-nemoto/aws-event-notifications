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
