export const handler = async (event) => {
    // TODO implement
    console.info(JSON.stringify(event, null, 2));
    console.info(JSON.stringify(JSON.parse(event['Records'][0]['Sns']['Message']), null, 2));

    const response = {
        statusCode: 200,
        body: JSON.stringify('Hello from Lambda!'),
    };
    return response;
};

// {
//     "version": "0",
//     "id": "7bf73129-1428-4cd3-a780-95db273d1602",
//     "detail-type": "AWS Health Abuse Event",
//     "source": "aws.health",
//     "account": "123456789012",
//     "time": "2018-08-02T05:30:00Z",
//     "region": "global",
//     "resources": ["arn:ec2-1-101002929", "arn:ec2-1-101002930", "arn:ec2-1-101002931", "arn:ec2-1-101002932"],
//     "detail": {
//       "eventArn": "arn:aws:health:global::event/AWS_ABUSE_COPYRIGHT_DMCA_REPORT_2345235545_5323_2018_08_02_02_12_98",
//       "service": "ABUSE",
//       "eventTypeCode": "AWS_ABUSE_COPYRIGHT_DMCA_REPORT",
//       "eventTypeCategory": "issue",
//       "eventScopeCode": "ACCOUNT_SPECIFIC",
//       "communicationId": "1234abc01232a4012345678-1",
//       "startTime": "Thu, 02 Aug 2018 05:30:00 GMT",
//       "lastUpdatedTime": "Thu, 27 Jan 2023 13:44:13 GMT",
//       "statusCode": "open",
//       "eventRegion": "us-west-2",
//       "eventDescription": [{
//         "language": "en_US",
//         "latestDescription": "A description of the event will be provided here"
//       }],
//       "eventMetadata": {
//         "keystring1": "valuestring1",
//         "keystring2": "valuestring2",
//         "keystring3": "valuestring3",
//         "keystring4": "valuestring4",
//         "truncated": "true"
//       },
//       "affectedEntities": [{
//         "entityValue": "arn:ec2-1-101002929",
//         "lastUpdatedTime": "Thu, 26 Jan 2023 19:01:55 GMT",
//         "status": "IMPAIRED"
//       }, {
//         "entityValue": "arn:ec2-1-101002930",
//         "lastUpdatedTime": "Thu, 26 Jan 2023 19:05:12 GMT",
//         "status": "UNIMPAIRED"
//       }, {
//         "entityValue": "arn:ec2-1-101002931",
//         "lastUpdatedTime": "Thu, 26 Jan 2023 19:07:13 GMT",
//         "status": "RESOLVED"
//       }, {
//         "entityValue": "arn:ec2-1-101002932",
//         "lastUpdatedTime": "Thu, 26 Jan 2023 19:10:59 GMT",
//         "status": "PENDING"
//       }],
//       "affectedAccount": "123456789012",
//       "page": "1",
//       "totalPages": "10"
//     }
//   }
