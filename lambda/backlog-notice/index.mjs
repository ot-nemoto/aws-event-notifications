import axios from 'axios';
import { CustomAction } from './events/securityhub.mjs';

export const handler = async (event) => {
    console.info(JSON.stringify(event, null, 2));
    const message = JSON.parse(event['Records'][0]['Sns']['Message']);
    console.info(JSON.stringify(message, null, 2));

    let formData = {};
    if (message['source'] === 'aws.securityhub' && message['detail-type'] === 'Security Hub Findings - Custom Action') {
        formData = new CustomAction(message).createFormData();
    } else {
        throw new Error('Unsupported event source');
    }

    console.info(JSON.stringify(formData, null, 2));

    try {
        const response = await axios.post(`https://${process.env.SPACE_NAME}.backlog.com/api/v2/issues`, formData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            params: {
                apiKey: process.env.API_KEY,
            },
        });
        console.log(response.data);
    } catch (error) {
        console.error(error);
        throw error;
    }

    return {
        statusCode: 200,
        message: 'OK',
    };
};
