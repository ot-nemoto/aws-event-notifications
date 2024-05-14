import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as events from 'aws-cdk-lib/aws-events';
import { ChatbotNotice } from './resource/chatbot-notice';

export interface AwsEventNotigicationsStackProps extends cdk.StackProps {
    // Slack Workspace ID
    slackWorkspaceId: string;
    // Slack Channel ID
    slackChannelId: string;
}

export class AwsEventNotigicationsStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props: AwsEventNotigicationsStackProps) {
        super(scope, id, props);

        const chatbotNotice = new ChatbotNotice(this, 'ChatbotNotice', {
            slackWorkspaceId: props.slackWorkspaceId,
            slackChannelId: props.slackChannelId,
        });

        // Amazon EventBridge
        new events.Rule(this, 'AwsHealthEventsRule', {
            ruleName: 'aws-health-notification',
            description: 'aws.health rules created by aws-event-notifications.',
            eventPattern: {
                source: ['aws.health'],
            },
            targets: [new cdk.aws_events_targets.SnsTopic(chatbotNotice.topic)],
        });
        new events.Rule(this, 'AwsSavingsplansEventsRule', {
            ruleName: 'aws-savingsplans-notification',
            description: 'aws.savingsplans rules created by aws-event-notifications.',
            eventPattern: {
                source: ['aws.savingsplans'],
            },
            targets: [new cdk.aws_events_targets.SnsTopic(chatbotNotice.topic)],
        });

        // Outputs
        new cdk.CfnOutput(this, 'version', {
            value: process.env.npm_package_version || '0.1.0',
        });
    }
}
