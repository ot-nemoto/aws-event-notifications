import axios from 'axios';
import { customAction } from './events/securityhub.mjs';

export const handler = async (event) => {
    console.info(JSON.stringify(event, null, 2));
    const message = JSON.parse(event['Records'][0]['Sns']['Message']);
    console.info(JSON.stringify(message, null, 2));

    let formData = {};
    if (message['source'] === 'aws.securityhub' && message['detail-type'] === 'Security Hub Findings - Custom Action') {
        formData = customAction(message);
    }
    console.info(JSON.stringify(formData, null, 2));

    // const alert = {
    //     title: message['detail']['findings'][0]['Title'],
    //     description: message['detail']['findings'][0]['Description'],
    //     sourceUrl: message['detail']['findings'][0]['SourceUrl'],
    //     severity: message['detail']['findings'][0]['Severity']['Label'],
    //     findingId: message['detail']['findings'][0]['Id'],
    //     recommendationUrl: message['detail']['findings'][0]['ProductFields']['RecommendationUrl'],
    //     resourceId: message['detail']['findings'][0]['Resources'][0]['Id'],
    //     region: message['detail']['findings'][0]['Region'],
    // };
    //
    // console.info(JSON.stringify(alert, null, 2));
    //
    // const formData = querystring.stringify({
    //     projectId: process.env.PROJECT_ID,
    //     issueTypeId: 795916,
    //     priorityId: 3,
    //     summary: alert.title,
    //     description:
    //         '## Description' +
    //         '\n\n' +
    //         alert.description +
    //         '\n\n' +
    //         `[Source](${alert.sourceUrl})` +
    //         '\n\n' +
    //         '## Severity' +
    //         '\n\n' +
    //         `\`${alert.severity}\`` +
    //         '\n\n' +
    //         '## Resource' +
    //         '\n\n' +
    //         alert.resourceId +
    //         '\n\n' +
    //         '## Links' +
    //         '\n\n' +
    //         `- [Security Hub](https://${alert.region}.console.aws.amazon.com/securityhub/home?region=${alert.region}#/findings?search=Id%3D%255Coperator%255C%253AEQUALS%255C%253A${alert.findingId})` +
    //         '\n' +
    //         `- [Recommendation](${alert.recommendationUrl})` +
    //         '\n\n' +
    //         '## Original' +
    //         '\n\n' +
    //         '```json' +
    //         '\n' +
    //         JSON.stringify(message, null, 2) +
    //         '\n' +
    //         '```',
    // });

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
        body: JSON.stringify('Hello from Lambda!'),
    };
};
