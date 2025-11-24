import dotenv from "dotenv";

dotenv.config();

const required = (key) => {
    const v = process.env[key];
    if (!v) throw new Error(`Missing required env var: ${key}`);
    return v;
};

export const config = {
    port: process.env.PORT || 4000,
    nodeEnv: process.env.NODE_ENV || "development",
    frontendOrigin: process.env.FRONTEND_ORIGIN || "http://localhost:5173",
    awsRegion: required("AWS_REGION"),
    cognitoUserPoolId: required("COGNITO_USER_POOL_ID"),
    cognitoJwksUri: required("COGNITO_JWKS_URI"),
    dynamoTable: required("DYNAMO_TABLE"),
    openaiApiKey: required("OPENAI_API_KEY"),
};