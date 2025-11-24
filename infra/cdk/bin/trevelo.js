const cdk = require("aws-cdk-lib");
const { DbStack } = require("../lib/db-stack");

const app = new cdk.App();

const env = {
    account: process.env.CDK_DEFAULT_ACCOUNT || process.env.AWS_ACCOUNT_ID || "437147519190",
    region: process.env.CDK_DEFAULT_REGION || process.env.AWS_REGION || "us-east-2",
};

new DbStack(app, "Trevelo-DbStack", { env });
