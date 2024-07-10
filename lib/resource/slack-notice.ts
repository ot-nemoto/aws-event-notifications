import * as chatbot from 'aws-cdk-lib/aws-chatbot';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as sns from 'aws-cdk-lib/aws-sns';
import { NagSuppressions } from 'cdk-nag';
import { Construct } from 'constructs';

export interface SlackNoticeProps {
    // Workspace ID
    workspaceId: string;
    // Channel ID
    channelId: string;
}

export class SlackNotice extends Construct {
    public readonly topic: sns.Topic;
    public readonly channelConfiguration: chatbot.SlackChannelConfiguration;

    constructor(scope: Construct, id: string, props: SlackNoticeProps) {
        super(scope, id);

        // Amazon SNS
        this.topic = new sns.Topic(this, 'SnsTopic', {
            topicName: 'aws-event-slack-notice',
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
            slackChannelConfigurationName: 'aws-event-slack-notice',
            slackWorkspaceId: props.workspaceId,
            slackChannelId: props.channelId,
            guardrailPolicies: [iam.ManagedPolicy.fromAwsManagedPolicyName('ReadOnlyAccess')],
            notificationTopics: [this.topic],
            loggingLevel: chatbot.LoggingLevel.INFO,
            role: channelRole,
        });
    }
}
