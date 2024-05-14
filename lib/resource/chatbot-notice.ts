import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as chatbot from 'aws-cdk-lib/aws-chatbot';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as events from 'aws-cdk-lib/aws-events';
import { NagSuppressions } from 'cdk-nag';

export interface ChatbotNoticeProps {
    // Slack Workspace ID
    slackWorkspaceId: string;
    // Slack Channel ID
    slackChannelId: string;
}

export class ChatbotNotice extends Construct {
    public readonly topic: sns.Topic;
    public readonly channelConfiguration: chatbot.SlackChannelConfiguration;

    constructor(scope: Construct, id: string, props: ChatbotNoticeProps) {
        super(scope, id);

        // Amazon SNS
        this.topic = new sns.Topic(this, 'SnsTopic', {
            topicName: 'aws-event-chatbot-notice',
            enforceSSL: true, // AwsSolutions-SNS3
        });
        NagSuppressions.addResourceSuppressions(this.topic, [
            {
                id: 'AwsSolutions-SNS2',
                reason: 'Encryption is not needed for topics which is used for triggering state machine.',
            },
        ]);

        // AWS IAM
        // Default roles are created in the constructor of SlackChannelConfiguration, but roles are created separately to support cdk-nag.
        const channelRole = new iam.Role(this, 'ChannelRole', {
            assumedBy: new iam.ServicePrincipal('chatbot.amazonaws.com'),
        });
        const channelPolicy = new iam.ManagedPolicy(this, 'ChannelPolicy', {
            statements: [
                new iam.PolicyStatement({
                    resources: ['*'],
                    actions: ['cloudwatch:Describe*', 'cloudwatch:Get*', 'cloudwatch:List*'],
                    effect: iam.Effect.ALLOW,
                }),
            ],
        });
        channelRole.addManagedPolicy(channelPolicy);
        NagSuppressions.addResourceSuppressions(channelPolicy, [
            {
                id: 'AwsSolutions-IAM5',
                reason: 'Uncontrollable due to CDK-generated custom resource.',
                appliesTo: [
                    'Action::cloudwatch:Describe*',
                    'Action::cloudwatch:Get*',
                    'Action::cloudwatch:List*',
                    'Resource::*',
                ],
            },
        ]);

        // AWS Chatbot
        this.channelConfiguration = new chatbot.SlackChannelConfiguration(this, 'ChatbotSlackChannelConfiguration', {
            slackChannelConfigurationName: 'aws-event-chatbot-notice',
            slackWorkspaceId: props.slackWorkspaceId,
            slackChannelId: props.slackChannelId,
            guardrailPolicies: [iam.ManagedPolicy.fromAwsManagedPolicyName('ReadOnlyAccess')],
            notificationTopics: [this.topic],
            loggingLevel: chatbot.LoggingLevel.INFO,
            role: channelRole,
        });
    }
}
