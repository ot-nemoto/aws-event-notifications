import querystring from 'querystring';

export class CustomAction {
    // The template for the description field of the issue form
    static TEMPLATE = `
## Description

<description>

[Source]<sourceUrl>

## Severity

<severity>

## Resource

<resourceId>

## Links

- [Security Hub](https://<region>.console.aws.amazon.com/securityhub/home?region=<region>#/findings?search=Id%3D%255Coperator%255C%253AEQUALS%255C%253A<id>)
- [Recommendation]<recommendationUrl>

## Original

\`\`\`json
<original>
\`\`\`
`;

    // Create the request body for the issue form
    static requestBody(message) {
        const finding = {
            id: message['detail']['findings'][0]['Id'],
            title: message['detail']['findings'][0]['Title'],
            description: message['detail']['findings'][0]['Description'],
            sourceUrl: message['detail']['findings'][0]['SourceUrl'],
            severity: message['detail']['findings'][0]['Severity']['Label'],
            recommendationUrl: message['detail']['findings'][0]['ProductFields']['RecommendationUrl'],
            resourceId: message['detail']['findings'][0]['Resources'][0]['Id'],
            region: message['detail']['findings'][0]['Region'],
        };

        console.info(JSON.stringify(finding, null, 2));

        const description = this.TEMPLATE.replaceAll('<description>', finding.description)
            .replaceAll('<sourceUrl>', finding.sourceUrl ? `(${finding.sourceUrl})` : '')
            .replaceAll('<severity>', finding.severity)
            .replaceAll('<resourceId>', finding.resourceId)
            .replaceAll('<region>', finding.region)
            .replaceAll('<id>', finding.id)
            .replaceAll('<recommendationUrl>', finding.recommendationUrl ? `(${finding.recommendationUrl})` : '')
            .replaceAll('<original>', JSON.stringify(message, null, 2));

        return querystring.stringify({
            projectId: process.env.PROJECT_ID,
            issueTypeId: process.env.ISSUE_TYPE_ID,
            priorityId: ['CRITICAL', 'HIGH'].includes(finding.severity) ? 2 : 3,
            summary: finding.title,
            description: description,
        });
    }
}
