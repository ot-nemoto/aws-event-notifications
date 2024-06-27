import querystring from 'querystring';

export function customAction(message) {
    const alert = {
        title: message['detail']['findings'][0]['Title'],
        description: message['detail']['findings'][0]['Description'],
        sourceUrl: message['detail']['findings'][0]['SourceUrl'],
        severity: message['detail']['findings'][0]['Severity']['Label'],
        findingId: message['detail']['findings'][0]['Id'],
        recommendationUrl: message['detail']['findings'][0]['ProductFields']['RecommendationUrl'],
        resourceId: message['detail']['findings'][0]['Resources'][0]['Id'],
        region: message['detail']['findings'][0]['Region'],
    };

    console.info(JSON.stringify(alert, null, 2));

    return querystring.stringify({
        projectId: process.env.PROJECT_ID,
        issueTypeId: 795916,
        priorityId: 3,
        summary: alert.title,
        description:
            '## Description' +
            '\n\n' +
            alert.description +
            '\n\n' +
            (alert.sourceUrl ? `[Source](${alert.sourceUrl})` : '') +
            '\n\n' +
            '## Severity' +
            '\n\n' +
            `\`${alert.severity}\`` +
            '\n\n' +
            '## Resource' +
            '\n\n' +
            alert.resourceId +
            '\n\n' +
            '## Links' +
            '\n\n' +
            `- [Security Hub](https://${alert.region}.console.aws.amazon.com/securityhub/home?region=${alert.region}#/findings?search=Id%3D%255Coperator%255C%253AEQUALS%255C%253A${alert.findingId})` +
            '\n' +
            (alert.recommendationUrl ? `- [Recommendation](${alert.recommendationUrl})` : '- Recommendation') +
            '\n\n' +
            '## Original' +
            '\n\n' +
            '```json' +
            '\n' +
            JSON.stringify(message, null, 2) +
            '\n' +
            '```',
    });
}
