import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as sns from 'aws-cdk-lib/aws-sns';
import { LambdaSubscription } from 'aws-cdk-lib/aws-sns-subscriptions';
import { NagSuppressions } from 'cdk-nag';
import { Construct } from 'constructs';

export interface BacklogNoticeProps {
    // Space Name
    spaceName: string;
    // Project Name
    projectId: string;
    // API Key
    apiKey: string;
    // Issue Type ID
    issueTypeId: string;
}

export class BacklogNotice extends Construct {
    public readonly topic: sns.Topic;

    constructor(scope: Construct, id: string, props: BacklogNoticeProps) {
        super(scope, id);

        // Amazon SNS
        this.topic = new sns.Topic(this, 'SnsTopic', {
            topicName: 'aws-event-backlog-notice',
            enforceSSL: true, // AwsSolutions-SNS3
        });
        NagSuppressions.addResourceSuppressions(this.topic, [
            {
                id: 'AwsSolutions-SNS2',
                reason: 'Encryption is not needed for topics which is used for triggering state machine.',
            },
        ]);

        // AWS Lambda
        const func = new lambda.Function(this, 'BacklogNoticeFunction', {
            functionName: 'BacklogNoticeFunction',
            code: lambda.Code.fromAsset('lambda/backlog-notice/'),
            environment: {
                SPACE_NAME: props.spaceName,
                PROJECT_ID: props.projectId,
                API_KEY: props.apiKey,
                ISSUE_TYPE_ID: props.issueTypeId,
            },
            runtime: lambda.Runtime.NODEJS_20_X,
            handler: 'index.handler',
            timeout: cdk.Duration.seconds(30),
            reservedConcurrentExecutions: 1,
        });
        NagSuppressions.addResourceSuppressions(
            func,
            [
                {
                    id: 'AwsSolutions-IAM4',
                    reason: 'OK to use AWS managed AWSLambdaBasicExecutionRole',
                    appliesTo: [
                        'Policy::arn:<AWS::Partition>:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole',
                    ],
                },
            ],
            true
        );

        this.topic.addSubscription(new LambdaSubscription(func));
    }
}
