import axios from 'axios';
import querystring from 'querystring';
import { getIssue } from './backlog.mjs';
import { SecurityHub } from './issue-generator/securityhub.mjs';

export const handler = async (event) => {
    console.info(JSON.stringify(event, null, 2));
    const message = JSON.parse(event['Records'][0]['Sns']['Message']);
    console.info(JSON.stringify(message, null, 2));

    let requestBody = querystring.stringify({});
    let issue = null;
    if (message['source'] === 'aws.securityhub' && message['detail-type'] === 'Security Hub Findings - Imported') {
        const generator = new SecurityHub(message);
        requestBody = await generator.requestBody();
        issue = await getIssue(generator.eventId());
    } else {
        throw new Error('Unsupported event source');
    }

    console.info(requestBody);

    try {
        if (issue) {
            console.info(`[${issue.issueKey}] Issue already exists.`);
            return {
                statusCode: 200,
                message: 'OK',
            };
        }
        const response = await axios.post(`https://${process.env.SPACE_NAME}.backlog.com/api/v2/issues`, requestBody, {
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
