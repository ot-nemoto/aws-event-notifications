import * as dotenv from 'dotenv';
import { readFile } from 'fs/promises';
import { handler } from './index.mjs';

dotenv.config({ path: '../../.env' });

process.env.SPACE_NAME = process.env.backlog_space_name;
process.env.PROJECT_ID = process.env.backlog_project_id;
process.env.API_KEY = process.env.backlog_api_key;
process.env.ISSUE_TYPE_ID = process.env.backlog_issue_type_id;

const args = process.argv.slice(2);
if (args.length === 0) {
    console.log('No arguments provided.');
    process.exit(0);
}

const event = JSON.parse(await readFile(args[0], 'utf8'));

handler({
    Records: [
        {
            EventSource: 'aws:sns',
            EventVersion: '1.0',
            EventSubscriptionArn:
                'arn:aws:sns:ap-northeast-1:123456789012:aws-event-backlog-notice:00000000-0000-0000-0000-000000000000',
            Sns: {
                Type: 'Notification',
                MessageId: '00000000-0000-0000-0000-000000000000',
                TopicArn: 'arn:aws:sns:ap-northeast-1:123456789012:aws-event-backlog-notice',
                Subject: null,
                Message: JSON.stringify(event),
                Timestamp: '2024-01-01T00:00:00.000Z',
                SignatureVersion: '1',
                Signature: null,
                SigningCertUrl: null,
                UnsubscribeUrl: null,
                MessageAttributes: {},
            },
        },
    ],
});
