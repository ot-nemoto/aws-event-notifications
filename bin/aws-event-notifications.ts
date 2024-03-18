#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { AwsEventNotigicationsStack } from '../lib/aws-event-notifications-stack';

const app = new cdk.App();
new AwsEventNotigicationsStack(app, 'AwsEventNotigicationsStack', {
    slackWorkspaceId: app.node.tryGetContext('slack_workspace_id') ?? '',
    slackChannelId: app.node.tryGetContext('slack_channel_id') ?? '',
});
