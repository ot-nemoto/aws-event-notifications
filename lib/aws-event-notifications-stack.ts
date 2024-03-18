import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as chatbot from 'aws-cdk-lib/aws-chatbot';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as events from 'aws-cdk-lib/aws-events';

export interface AwsEventNotigicationsStackProps extends cdk.StackProps {
    slackWorkspaceId: string;
    slackChannelId: string;
}

export class AwsEventNotigicationsStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props: AwsEventNotigicationsStackProps) {
        super(scope, id, props);

        // Amazon SNS
        const topic = new sns.Topic(this, 'SnsTopic', {
            topicName: 'aws-event-notifications',
        });

        // AWS Chatbot
        const slack = new chatbot.SlackChannelConfiguration(this, 'ChatbotSlackChannelConfiguration', {
            slackChannelConfigurationName: 'aws-event-notifications',
            slackWorkspaceId: props.slackWorkspaceId,
            slackChannelId: props.slackChannelId,
            guardrailPolicies: [iam.ManagedPolicy.fromAwsManagedPolicyName('ReadOnlyAccess')],
            notificationTopics: [topic],
        });
        slack.addToRolePolicy(
            new iam.PolicyStatement({
                resources: ['*'],
                actions: ['cloudwatch:Describe*', 'cloudwatch:Get*', 'cloudwatch:List*'],
                effect: iam.Effect.ALLOW,
            })
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
