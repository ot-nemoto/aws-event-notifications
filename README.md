# aws-health-dashboard-notification

`aws.health` イベントを監視し、Slack に通知する

## deploy

```sh
cdk deploy -c slackWorkspaceId=SLACK_WORKSPACE_ID -c slackChannelId=SLACK_CHANNEL_ID
```
