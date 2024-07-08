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

| 環境変数           | 説明                      |
| ------------------ | ------------------------- |
| backlog_space_name | Backlog のスペース名      |
| backlog_project_id | Backlog のプロジェクト ID |
| backlog_api_key    | Backlog の API キー       |
| backlog_issue_type | Backlog の課題種別        |
| slack_workspace_id | Slack のワークスペース ID |
| slack_channel_id   | Slack のチャンネル ID     |

```sh
backlog_space_name=
backlog_project_id=
backlog_api_key=
backlog_issue_type=

slack_workspace_id=
slack_channel_id=
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
#     -c backlog_api_key=BACKLOG_API_KEY \
#     -c backlog_issue_type=BACKLOG_ISSUE_TYPE
```

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
  - [カテゴリー一覧の取得](https://developer.nulab.com/ja/docs/backlog/api/2/get-category-list/)
  - [カテゴリーの追加](https://developer.nulab.com/ja/docs/backlog/api/2/add-category/)
  - [バージョン(マイルストーン)一覧の取得](https://developer.nulab.com/ja/docs/backlog/api/2/get-version-milestone-list/)
  - [バージョン(マイルストーン)の追加](https://developer.nulab.com/ja/docs/backlog/api/2/add-version-milestone/)
