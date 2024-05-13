#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { AwsEventNotigicationsStack } from '../lib/aws-event-notifications-stack';
import { AwsSolutionsChecks } from 'cdk-nag';
import { Aspects } from 'aws-cdk-lib';

const app = new cdk.App();

// // Add the cdk-nag AwsSolutions Pack with extra verbose logging enabled.
// Aspects.of(app).add(new AwsSolutionsChecks({ verbose: true }));

new AwsEventNotigicationsStack(app, 'AwsEventNotigicationsStack', {
    // Slack Workspace ID
    slackWorkspaceId: app.node.tryGetContext('slack_workspace_id') ?? '',
    // Slack Channel ID
    slackChannelId: app.node.tryGetContext('slack_channel_id') ?? '',
});
