import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as chatbot from 'aws-cdk-lib/aws-chatbot';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as events from 'aws-cdk-lib/aws-events';

export interface AwsHealthDashboardNotificationStackProps extends cdk.StackProps {
    slackWorkspaceId: string;
    slackChannelId: string;
}

export class AwsHealthDashboardNotificationStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props: AwsHealthDashboardNotificationStackProps) {
        super(scope, id, props);

        // Amazon SNS
        const topic = new sns.Topic(this, 'SnsTopic', {
            topicName: 'aws-health-dashboard',
        });

        // AWS Chatbot
        const slack = new chatbot.SlackChannelConfiguration(this, 'ChatbotSlackChannelConfiguration', {
            slackChannelConfigurationName: 'aws-health-dashboard',
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
        const rule = new events.Rule(this, 'EventsRule', {
            ruleName: 'aws-health-dashboard',
            eventPattern: {
                source: ['aws.health'],
            },
        });
        rule.addTarget(new cdk.aws_events_targets.SnsTopic(topic));
    }
}
