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
        // NagSuppressions.addResourceSuppressions(this.topic, [
        //     {
        //         id: 'AwsSolutions-SNS2',
        //         reason: 'Encryption is not needed for topics which is used for triggering state machine.',
        //     },
        // ]);

        // AWS Chatbot
        this.channelConfiguration = new chatbot.SlackChannelConfiguration(this, 'ChatbotSlackChannelConfiguration', {
            slackChannelConfigurationName: 'aws-event-chatbot-notice',
            slackWorkspaceId: props.slackWorkspaceId,
            slackChannelId: props.slackChannelId,
            guardrailPolicies: [iam.ManagedPolicy.fromAwsManagedPolicyName('ReadOnlyAccess')],
            notificationTopics: [this.topic],
            logRetention: cdk.aws_logs.RetentionDays.INFINITE,
            loggingLevel: chatbot.LoggingLevel.INFO,
        });
        this.channelConfiguration.addToRolePolicy(
            new iam.PolicyStatement({
                resources: ['*'],
                actions: ['cloudwatch:Describe*', 'cloudwatch:Get*', 'cloudwatch:List*'],
                effect: iam.Effect.ALLOW,
            })
        );
        // NagSuppressions.addResourceSuppressionsByPath(
        //     this,
        //     `/${this.stackName}/ChatbotSlackChannelConfiguration/ConfigurationRole/DefaultPolicy/Resource`,
        //     [{ id: 'AwsSolutions-IAM5', reason: 'Necessary to grant Get access to all objects in the cloudwatch.' }]
        // );
        // NagSuppressions.addResourceSuppressionsByPath(
        //     this,
        //     `/${this.stackName}/LogRetentionaae0aa3c5b4d4f87b02d85b201efdd8a/ServiceRole/Resource`,
        //     [{ id: 'AwsSolutions-IAM4', reason: 'Uncontrollable due to CDK-generated custom resource.' }]
        // );
        // NagSuppressions.addResourceSuppressionsByPath(
        //     this,
        //     `/${this.stackName}/LogRetentionaae0aa3c5b4d4f87b02d85b201efdd8a/ServiceRole/DefaultPolicy/Resource`,
        //     [{ id: 'AwsSolutions-IAM5', reason: 'Uncontrollable due to CDK-generated custom resource.' }]
        // );
    }
}
