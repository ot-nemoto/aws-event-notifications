import querystring from 'querystring';
import { getCategory, getVersion } from '../../backlog.mjs';

export class CustomAction {
    static template = `
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

    constructor(message) {
        this.message = message;

        this.finding = {
            id: message['detail']['findings'][0]['Id'],
            accountId: message['detail']['findings'][0]['AwsAccountId'],
            title: message['detail']['findings'][0]['Title'],
            description: message['detail']['findings'][0]['Description'],
            sourceUrl: message['detail']['findings'][0]['SourceUrl'],
            severity: message['detail']['findings'][0]['Severity']['Label'],
            recommendationUrl: message['detail']['findings'][0]['ProductFields']['RecommendationUrl'],
            resourceId: message['detail']['findings'][0]['Resources'][0]['Id'],
            region: message['detail']['findings'][0]['Region'],
        };

        console.info(JSON.stringify(this.finding, null, 2));
    }

    priorityId() {
        return ['CRITICAL', 'HIGH'].includes(this.finding.severity) ? 2 : 3;
    }

    summary() {
        return this.finding.title;
    }

    description() {
        return CustomAction.template
            .replaceAll('<description>', this.finding.description)
            .replaceAll('<sourceUrl>', this.finding.sourceUrl ? `(${this.finding.sourceUrl})` : '')
            .replaceAll('<severity>', this.finding.severity)
            .replaceAll('<resourceId>', this.finding.resourceId)
            .replaceAll('<region>', this.finding.region)
            .replaceAll('<id>', this.finding.id)
            .replaceAll(
                '<recommendationUrl>',
                this.finding.recommendationUrl ? `(${this.finding.recommendationUrl})` : ''
            )
            .replaceAll('<original>', JSON.stringify(this.message, null, 2));
    }

    async requestBody() {
        const category = await getCategory(this.finding.accountId);
        const milestone = await getVersion(this.message['source']);

        return querystring.stringify({
            projectId: process.env.PROJECT_ID,
            issueTypeId: process.env.ISSUE_TYPE_ID,
            priorityId: this.priorityId(),
            summary: this.summary(),
            description: this.description(),
            'categoryId[]': category.id,
            'milestoneId[]': milestone.id,
        });
    }
}

Object.freeze(CustomAction);
