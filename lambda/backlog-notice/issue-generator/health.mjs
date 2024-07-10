import querystring from 'querystring';
import { getCategory, getCustomField, getVersion } from '../backlog.mjs';

export class Health {
    static template = `
## Description

<description>

## Resource

<resourceId>

## Links

- [Health Dashboard](https://health.console.aws.amazon.com/health/home#/account/event-log?eventID=<id>&eventTab=details)

## Original

\`\`\`json
<original>
\`\`\`
`;

    constructor(message) {
        this.message = message;

        this.detail = {
            eventArn: message['detail']['eventArn'],
            accountId: message['detail']['affectedAccount'],
            region: message['detail']['eventRegion'],
            typeCode: message['detail']['eventTypeCode'],
            description: message['detail']['eventDescription'][0]['latestDescription'],
            entities: message['detail']['affectedEntities'].map((entity) => entity.entityValue),
        };

        console.info(JSON.stringify(this.finding, null, 2));
    }

    priorityId() {
        return 3;
    }

    summary() {
        return this.detail.typeCode;
    }

    description() {
        return Health.template
            .replaceAll('<description>', this.detail.description)
            .replaceAll('<resourceId>', this.detail.entities.map((value) => `- \`${value}\``).join('\n'))
            .replaceAll('<id>', this.detail.eventArn)
            .replaceAll('<original>', JSON.stringify(this.message, null, 2));
    }

    eventId() {
        return this.detail.eventArn;
    }

    async requestBody() {
        const category = await getCategory(this.detail.accountId);
        const milestone = await getVersion(this.message['source']);
        const customField = await getCustomField('event_id');

        return querystring.stringify({
            projectId: process.env.PROJECT_ID,
            issueTypeId: process.env.ISSUE_TYPE_ID,
            priorityId: this.priorityId(),
            summary: this.summary(),
            description: this.description(),
            'categoryId[]': category.id,
            'milestoneId[]': milestone.id,
            [`customField_${customField.id}`]: this.eventId(),
        });
    }
}

Object.freeze(Health);
