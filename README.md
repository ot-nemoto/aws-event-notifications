# aws-event-notifications

- Amazon EventBridge を監視し、Slack に通知するインフラを構築する
- 監視するイベント
  - `aws.health`
  - `aws.securityhub`

## デプロイの準備

- AWS CDK のリソースをプロビジョニングする

  ```sh
  cdk bootstrap
  ```

_SlackNotice_

- [AWS Chatbot](https://us-east-2.console.aws.amazon.com/chatbot/home?region=us-east-2#/home)で、クライアントの設定
  - 設定したクライアントから SLACK_WORKSPACE_ID を取得
- 通知先の Slack のチャンネルから SLACK_CHANNEL_ID を取得

_BacklogNotice_

- AWS Security Hub の有効化
- Custom Action の作成
- BacklogAPI のキーを取得
  - Backlog API から API キーを取得
  - スペース名とプロジェクト ID を取得

## .env ファイルの作成

```sh
slack_workspace_id=T06PCDXKBE1
slack_channel_id=C06PGHRS58T
backlog_space_name=kankouyoho
backlog_project_id=145494
backlog_api_key=6aGHdmJZNMixNXljT2YfgKVAw2JGNuX27RJ7NM7Sxi7lJgqydptBqCBKcLwiMpUl
```

## Lambda 用のパッケージインストール

```sh
cd lambda/backlog-notice && npm install
```

## インフラをデプロイ

```sh
mpx cdk deploy

# 環境変数を指定してデプロイ
# npx cdk deploy \
#     -c slack_workspace_id=SLACK_WORKSPACE_ID \
#     -c slack_channel_id=SLACK_CHANNEL_ID \
#     -c backlog_space_name=BACKLOG_SPACE_NAME \
#     -c backlog_project_id=BACKLOG_PROJECT_ID \
#     -c backlog_api_key=BACKLOG_API_KEY
```

| 環境変数           | 説明                      |
| ------------------ | ------------------------- |
| slack_workspace_id | Slack のワークスペース ID |
| slack_channel_id   | Slack のチャンネル ID     |
| backlog_space_name | Backlog のスペース名      |
| backlog_project_id | Backlog のプロジェクト ID |
| backlog_api_key    | Backlog の API キー       |

## その他

### インフラを削除

```sh
npx cdk destroy
```

### 合成されたテンプレートを出力

```sh
npx cdk synth
```

### 差分確認

```sh
npx cdk diff
```

### テスト実行

```sh
tsc && npm test
```

##　参考資料

- Backlog
  - [課題の追加](https://developer.nulab.com/ja/docs/backlog/api/2/add-issue/)
