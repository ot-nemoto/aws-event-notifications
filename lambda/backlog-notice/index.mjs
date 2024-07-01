import axios from 'axios';
import { formData as customAction } from './issue_forms/securityhub/custom_action.mjs';

export const handler = async (event) => {
    console.info(JSON.stringify(event, null, 2));
    const message = JSON.parse(event['Records'][0]['Sns']['Message']);
    console.info(JSON.stringify(message, null, 2));

    let formData = {};
    if (message['source'] === 'aws.securityhub' && message['detail-type'] === 'Security Hub Findings - Custom Action') {
        formData = customAction(message);
    } else {
        throw new Error('Unsupported event source');
    }

    console.info(formData);

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

console.log('Loaded backlog-notice');
