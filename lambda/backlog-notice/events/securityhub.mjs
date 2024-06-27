import querystring from 'querystring';

export class SecurityHub {
    constructor(message) {
        this.message = message;
    }
}

export class CustomAction extends SecurityHub {
    constructor(message) {
        super(message);
    }

    createFormData() {
        const finding = {
            title: this.message['detail']['findings'][0]['Title'],
            description: this.message['detail']['findings'][0]['Description'],
            sourceUrl: this.message['detail']['findings'][0]['SourceUrl'],
            severity: this.message['detail']['findings'][0]['Severity']['Label'],
            findingId: this.message['detail']['findings'][0]['Id'],
            recommendationUrl: this.message['detail']['findings'][0]['ProductFields']['RecommendationUrl'],
            resourceId: this.message['detail']['findings'][0]['Resources'][0]['Id'],
            region: this.message['detail']['findings'][0]['Region'],
        };

        console.info(JSON.stringify(finding, null, 2));

        return querystring.stringify({
            projectId: process.env.PROJECT_ID,
            issueTypeId: 795916,
            priorityId: 3,
            summary: finding.title,
            description:
                '## Description' +
                '\n\n' +
                finding.description +
                '\n\n' +
                (finding.sourceUrl ? `[Source](${finding.sourceUrl})` : '') +
                '\n\n' +
                '## Severity' +
                '\n\n' +
                `\`${finding.severity}\`` +
                '\n\n' +
                '## Resource' +
                '\n\n' +
                finding.resourceId +
                '\n\n' +
                '## Links' +
                '\n\n' +
                `- [Security Hub](https://${finding.region}.console.aws.amazon.com/securityhub/home?region=${finding.region}#/findings?search=Id%3D%255Coperator%255C%253AEQUALS%255C%253A${finding.findingId})` +
                '\n' +
                (finding.recommendationUrl ? `- [Recommendation](${finding.recommendationUrl})` : '- Recommendation') +
                '\n\n' +
                '## Original' +
                '\n\n' +
                '```json' +
                '\n' +
                JSON.stringify(this.message, null, 2) +
                '\n' +
                '```',
        });
    }
}
