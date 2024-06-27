import * as cdk from 'aws-cdk-lib';
import * as events from 'aws-cdk-lib/aws-events';
import { Construct } from 'constructs';
import { BacklogNotice } from './resource/backlog-notice';
import { SlackNotice } from './resource/slack-notice';

export interface AwsEventNotigicationsStackProps extends cdk.StackProps {
    // =========================================================================
    // Slack Notice
    // =========================================================================
    slackWorkspaceId: string;
    slackChannelId: string;
    // =========================================================================
    // Backlog Notice
    // =========================================================================
    backlogSpaceName: string;
    backlogProjectId: string;
    backlogApiKey: string;
}

export class AwsEventNotigicationsStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props: AwsEventNotigicationsStackProps) {
        super(scope, id, props);

        const slackNotice = new SlackNotice(this, 'SlackNotice', {
            workspaceId: props.slackWorkspaceId,
            channelId: props.slackChannelId,
        });

        const backlogNotice = new BacklogNotice(this, 'BacklogNotice', {
            spaceName: props.backlogSpaceName,
            projectId: props.backlogProjectId,
            apiKey: props.backlogApiKey,
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
        new events.Rule(this, 'AwsSecurityHubEventsRule', {
            ruleName: 'aws-securityhub-notification',
            description: 'aws.securityhub rules created by aws-event-notifications.',
            eventPattern: {
                source: ['aws.securityhub'],
                detailType: ['Security Hub Findings - Custom Action'],
            },
            targets: [new cdk.aws_events_targets.SnsTopic(backlogNotice.topic)],
        });

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
        new cdk.CfnOutput(this, 'backlog_space_name', {
            value: props.backlogSpaceName,
        });
        new cdk.CfnOutput(this, 'backlog_project_id', {
            value: props.backlogProjectId,
        });
        new cdk.CfnOutput(this, 'backlog_api_key', {
            value: props.backlogApiKey,
        });
    }
}
