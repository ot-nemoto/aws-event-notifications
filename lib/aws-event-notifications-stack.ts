import * as cdk from 'aws-cdk-lib';
import * as events from 'aws-cdk-lib/aws-events';
import { Construct } from 'constructs';
import { SlackNotice } from './resource/slack-notice';

export interface AwsEventNotigicationsStackProps extends cdk.StackProps {
    // Slack Workspace ID
    slackWorkspaceId: string;
    // Slack Channel ID
    slackChannelId: string;
}

export class AwsEventNotigicationsStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props: AwsEventNotigicationsStackProps) {
        super(scope, id, props);

        const slackNotice = new SlackNotice(this, 'SlackNotice', {
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
            targets: [new cdk.aws_events_targets.SnsTopic(slackNotice.topic)],
        });
        // new events.Rule(this, 'AwsSavingsplansEventsRule', {
        //     ruleName: 'aws-savingsplans-notification',
        //     description: 'aws.savingsplans rules created by aws-event-notifications.',
        //     eventPattern: {
        //         source: ['aws.savingsplans'],
        //     },
        //     targets: [new cdk.aws_events_targets.SnsTopic(slackNotice.topic)],
        // });

        // Outputs
        new cdk.CfnOutput(this, 'version', {
            value: process.env.npm_package_version || '0.1.0',
        });
        new cdk.CfnOutput(this, 'slack_workspace_id', {
            value: props.slackWorkspaceId,
        });
        new cdk.CfnOutput(this, 'slack_channel_id', {
            value: props.slackChannelId,
        });
    }
}
