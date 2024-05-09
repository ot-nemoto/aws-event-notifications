import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as chatbot from 'aws-cdk-lib/aws-chatbot';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as events from 'aws-cdk-lib/aws-events';
import { NagSuppressions } from 'cdk-nag';

export interface AwsEventNotigicationsStackProps extends cdk.StackProps {
    // ワークスペースID
    slackWorkspaceId: string;
    // チャンネルID
    slackChannelId: string;
}

export class AwsEventNotigicationsStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props: AwsEventNotigicationsStackProps) {
        super(scope, id, props);

        // Amazon SNS
        const topic = new sns.Topic(this, 'SnsTopic', {
            topicName: 'aws-event-notifications',
            enforceSSL: true, // AwsSolutions-SNS3
        });
        NagSuppressions.addResourceSuppressions(topic, [
            {
                id: 'AwsSolutions-SNS2',
                reason: 'Encryption is not needed for topics which is used for triggering state machine.',
            },
        ]);

        // AWS Chatbot
        const slack = new chatbot.SlackChannelConfiguration(this, 'ChatbotSlackChannelConfiguration', {
            slackChannelConfigurationName: 'aws-event-notifications',
            slackWorkspaceId: props.slackWorkspaceId,
            slackChannelId: props.slackChannelId,
            guardrailPolicies: [iam.ManagedPolicy.fromAwsManagedPolicyName('ReadOnlyAccess')],
            notificationTopics: [topic],
            logRetention: cdk.aws_logs.RetentionDays.INFINITE,
            loggingLevel: chatbot.LoggingLevel.INFO,
        });
        slack.addToRolePolicy(
            new iam.PolicyStatement({
                resources: ['*'],
                actions: ['cloudwatch:Describe*', 'cloudwatch:Get*', 'cloudwatch:List*'],
                effect: iam.Effect.ALLOW,
            })
        );
        NagSuppressions.addResourceSuppressionsByPath(
            this,
            `/${this.stackName}/ChatbotSlackChannelConfiguration/ConfigurationRole/DefaultPolicy/Resource`,
            [{ id: 'AwsSolutions-IAM5', reason: 'Necessary to grant Get access to all objects in the cloudwatch.' }]
        );
        NagSuppressions.addResourceSuppressionsByPath(
            this,
            `/${this.stackName}/LogRetentionaae0aa3c5b4d4f87b02d85b201efdd8a/ServiceRole/Resource`,
            [{ id: 'AwsSolutions-IAM4', reason: 'Uncontrollable due to CDK-generated custom resource.' }]
        );
        NagSuppressions.addResourceSuppressionsByPath(
            this,
            `/${this.stackName}/LogRetentionaae0aa3c5b4d4f87b02d85b201efdd8a/ServiceRole/DefaultPolicy/Resource`,
            [{ id: 'AwsSolutions-IAM5', reason: 'Uncontrollable due to CDK-generated custom resource.' }]
        );

        // Amazon EventBridge
        new events.Rule(this, 'AwsHealthEventsRule', {
            ruleName: 'aws-health-notification',
            description: 'aws.health rules created by aws-event-notifications.',
            eventPattern: {
                source: ['aws.health'],
            },
            targets: [new cdk.aws_events_targets.SnsTopic(topic)],
        });
        new events.Rule(this, 'AwsSavingsplansEventsRule', {
            ruleName: 'aws-savingsplans-notification',
            description: 'aws.savingsplans rules created by aws-event-notifications.',
            eventPattern: {
                source: ['aws.savingsplans'],
            },
            targets: [new cdk.aws_events_targets.SnsTopic(topic)],
        });
    }
}
