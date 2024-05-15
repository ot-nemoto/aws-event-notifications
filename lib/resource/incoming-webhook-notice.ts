import { Construct } from 'constructs';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as chatbot from 'aws-cdk-lib/aws-chatbot';
import * as iam from 'aws-cdk-lib/aws-iam';
import { NagSuppressions } from 'cdk-nag';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { LambdaSubscription } from 'aws-cdk-lib/aws-sns-subscriptions';

export interface IncomingWebhookNoticeProps {
    // Slack Workspace ID
    slackWorkspaceId: string;
    // Slack Channel ID
    slackChannelId: string;
}

export class IncomingWebhookNotice extends Construct {
    public readonly topic: sns.Topic;
    public readonly channelConfiguration: chatbot.SlackChannelConfiguration;

    constructor(scope: Construct, id: string, props: IncomingWebhookNoticeProps) {
        super(scope, id);

        // Amazon SNS
        this.topic = new sns.Topic(this, 'SnsTopic', {
            topicName: 'aws-event-incoming_webhook-notice',
        });

        // AWS Lambda
        const func = new lambda.Function(this, 'IncomingWebhookFunction', {
            functionName: 'IncomingWebhookFunction',
            code: lambda.Code.fromAsset('lambda'),
            runtime: lambda.Runtime.NODEJS_20_X,
            handler: 'index.handler',
        });

        this.topic.addSubscription(new LambdaSubscription(func));
    }
}
