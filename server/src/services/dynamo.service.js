import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
    DynamoDBDocumentClient,
    GetCommand,
    PutCommand,
    QueryCommand,
    DeleteCommand,
    UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { config } from "../config/env.js";

const client = new DynamoDBClient({ region: config.awsRegion });
export const docClient = DynamoDBDocumentClient.from(client);
export const TableName = config.dynamoTable;

export const db = {
    get: (Key) => docClient.send(new GetCommand({ TableName, Key })),
    put: (Item) => docClient.send(new PutCommand({ TableName, Item })),
    query: (params) => docClient.send(new QueryCommand({ TableName, ...params })),
    delete: (Key) => docClient.send(new DeleteCommand({ TableName, Key })),
    update: (params) => docClient.send(new UpdateCommand({ TableName, ...params})),
}