# aws-event-notifications

-   Amazon EventBridge を監視し、Slack に通知するインフラを構築する
-   監視するイベント
    -   `aws.health`
    -   `aws.savingsplans`

## デプロイの準備

-   AWS CDK のリソースをプロビジョニングする

    ```sh
    cdk bootstrap
    ```

-   [AWS Chatbot](https://us-east-2.console.aws.amazon.com/chatbot/home?region=us-east-2#/home)で、クライアントの設定
    -   設定したクライアントから SLACK_WORKSPACE_ID を取得
-   通知先の Slack のチャンネルから SLACK_CHANNEL_ID を取得

## インフラをデプロイ

```sh
cdk deploy \
    -c slack_workspace_id=SLACK_WORKSPACE_ID \
    -c slack_channel_id=SLACK_CHANNEL_ID
```

## インフラを削除

```sh
cdk destroy
```
