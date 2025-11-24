const cdk = require("aws-cdk-lib");
const dynamodb = require("aws-cdk-lib/aws-dynamodb");

class DbStack extends cdk.Stack {
    constructor(scope, id, props = {}) {
        super(scope, id, props);

        const table = new dynamodb.Table(this, "TreveloDataTable", {
            tableName: "Trevelo-Data",
            partitionKey: { name: "PK", type: dynamodb.AttributeType.STRING },
            sortKey: { name: "SK", type: dynamodb.AttributeType.STRING },
            billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
            removalPolicy: cdk.RemovalPolicy.RETAIN,
        });

        table.addGlobalSecondaryIndex({
            indexName: "GSIInvite",
            partitionKey: { name: "GSI1PK", type: dynamodb.AttributeType.STRING },
            sortKey:     { name: "GSI1SK", type: dynamodb.AttributeType.STRING },
            projectionType: dynamodb.ProjectionType.ALL,
        });
    }
}

module.exports = { DbStack };
