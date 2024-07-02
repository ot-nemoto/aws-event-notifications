import axios from 'axios';
import { issueForm as ifCustomAction } from './issue_forms/securityhub/custom_action.mjs';

export const handler = async (event) => {
    console.info(JSON.stringify(event, null, 2));
    const message = JSON.parse(event['Records'][0]['Sns']['Message']);
    console.info(JSON.stringify(message, null, 2));

    let issueForm = {};
    if (message['source'] === 'aws.securityhub' && message['detail-type'] === 'Security Hub Findings - Custom Action') {
        issueForm = ifCustomAction(message);
    } else {
        throw new Error('Unsupported event source');
    }

    console.info(issueForm);

    try {
        const response = await axios.post(`https://${process.env.SPACE_NAME}.backlog.com/api/v2/issues`, issueForm, {
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
