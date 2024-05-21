#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import 'source-map-support/register';
import { AwsEventNotigicationsStack } from '../lib/aws-event-notifications-stack';

const app = new cdk.App();

// Add the cdk-nag AwsSolutions Pack with extra verbose logging enabled.
// Aspects.of(app).add(new AwsSolutionsChecks({ verbose: true }));

new AwsEventNotigicationsStack(app, 'AwsEventNotigicationsStack', {
    // Slack Workspace ID
    slackWorkspaceId: app.node.tryGetContext('slack_workspace_id') ?? '',
    // Slack Channel ID
    slackChannelId: app.node.tryGetContext('slack_channel_id') ?? '',
});
