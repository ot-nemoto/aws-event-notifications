#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import * as dotenv from 'dotenv';
import 'source-map-support/register';
import { AwsEventNotigicationsStack } from '../lib/aws-event-notifications-stack';

dotenv.config();
const app = new cdk.App();

// Add the cdk-nag AwsSolutions Pack with extra verbose logging enabled.
// Aspects.of(app).add(new AwsSolutionsChecks({ verbose: true }));

new AwsEventNotigicationsStack(app, 'AwsEventNotigicationsStack', {
    // =========================================================================
    // Slack Notice
    // =========================================================================
    slackWorkspaceId: app.node.tryGetContext('slack_workspace_id') ?? process.env.slack_workspace_id ?? '',
    slackChannelId: app.node.tryGetContext('slack_channel_id') ?? process.env.slack_channel_id ?? '',
    // =========================================================================
    // Backlog Notice
    // =========================================================================
    backlogSpaceName: app.node.tryGetContext('backlog_space_name') ?? process.env.backlog_space_name ?? '',
    backlogProjectId: app.node.tryGetContext('backlog_project_id') ?? process.env.backlog_project_id ?? '',
    backlogApiKey: app.node.tryGetContext('backlog_api_key') ?? process.env.backlog_api_key ?? '',
    backlogIssueTypeId: app.node.tryGetContext('backlog_issue_type_id') ?? process.env.backlog_issue_type_id ?? '',
});
