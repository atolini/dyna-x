import { Logger } from "../../../../../utils/logger/logger";
import {
    BatchWriteItemCommand,
    DeleteItemCommand,
    DynamoDBClient,
    GetItemCommand,
    GetItemCommandOutput,
    PutItemCommand,
    QueryCommand,
    UpdateItemCommand
} from "@aws-sdk/client-dynamodb";
import { mockClient } from 'aws-sdk-client-mock';
import { ConditionBuilder } from "../condition-builder/condition-builder";
import { DynaXSchema } from "../schema/dyna-x-schema";
import { UpdateBuilder } from "../update-builder/update-builder";
import { DynaXRepository } from "./dyna-x-repository";

describe("DynaXRepository", () => {
    let repository: DynaXRepository<any>;
    let client: DynamoDBClient;
    let schema: DynaXSchema;
    let ddbMock: any;

    beforeEach(() => {
        client = new DynamoDBClient({});
        schema = { getTableName: jest.fn().mockReturnValue("TestTable") } as unknown as DynaXSchema;
        ddbMock = mockClient(client);
        const logger = new Logger({
            serviceName: "TestingService"
        });
        repository = new DynaXRepository(schema, client,logger);
    });

    test("getItem should retrieve an item", async () => {
        const mockResponse = { Item: { id: { S: "123" }, name: { S: "Test" } } };

        ddbMock.on(GetItemCommand).resolves(mockResponse);

        const result: GetItemCommandOutput = await repository.getItem({
            "id": "123"
        });

        expect(result).toEqual({ id: "123", name: "Test" });
    });

    test("putItem should insert an item", async () => {
        const item = { id: "123", name: "Test" };
        const mockResponse = { Attributes: { id: { S: "123" }, name: { S: "Test" } } };

        ddbMock.on(PutItemCommand).resolves(mockResponse);

        const result = await repository.putItem(item);

        expect(result).toEqual(item);
    });

    test("deleteItem should remove an item", async () => {
        const key = { id: { S: "123" } };

        ddbMock.on(DeleteItemCommand).resolves({ Attributes: undefined });

        expect(repository.deleteItem(key))
            .resolves
            .not.toThrow();
    });

    test("batchWriteItems should handle batch writes", async () => {
        const items = Array.from({ length: 100 }, (_, index) => ({
            id: String(index + 1).padStart(2, '0')
        }));

        ddbMock.on(BatchWriteItemCommand)
            .resolvesOnce({ UnprocessedItems: {} })
            .resolvesOnce({ UnprocessedItems: 
                { 
                    "TestTable": [
                        {
                            PutRequest: {
                                Item: {
                                    "id": {
                                        S: "12"
                                    }
                                }
                            }
                        }
                    ] 
                } 
            })
            .resolvesOnce({ UnprocessedItems: {} })
            .resolvesOnce({ UnprocessedItems: 
                { 
                    "TestTable": [
                        {
                            PutRequest: {
                                Item: {
                                    "id": {
                                        S: "22"
                                    }
                                }
                            }
                        }
                    ] 
                } 
            })
            .resolvesOnce({ UnprocessedItems: 
                { 
                    "TestTable": [
                        {
                            DeleteRequest: {
                                Key: {
                                    "id": {
                                        S: "32"
                                    }
                                }
                            }
                        }
                    ] 
                } 
            })
        
        const result = await repository.batchWriteItems(items, [
            {
                primaryKey: {
                    "id": "32"
                }
            }
        ]);

        expect(result).toEqual([
            {"type":"put","item":{"id":"12"}},
            {"type":"put","item":{"id":"22"}},
            {"type":"delete","item":{"id":"32"}}
        ]);
    });

    test("query should return matching items", async () => {
        const condition = {
            build: jest.fn().mockReturnValue({
                ConditionExpression: "#id = :id",
                ExpressionAttributeNames: { "#id": "id" },
                ExpressionAttributeValues: { ":id": { S: "123" } }
            })
        } as unknown as ConditionBuilder;

        ddbMock.on(QueryCommand).resolves({
            Items: [
                {
                    id: {
                        S: "123"
                    }
                }
            ]
        }); 

        const result = await repository.query(condition);

        expect(result).toEqual([{ "id": "123" }]);
    });

    test("update should modify an item", async () => {
        const key = { primaryKey: "123" };
        const update = {
            build: jest.fn().mockReturnValue({
                UpdateExpression: "SET #name = :name",
                ExpressionAttributeNames: { "#name": "name" },
                ExpressionAttributeValues: { ":name": { S: "Updated" } }
            })
        } as unknown as UpdateBuilder;

        ddbMock.on(UpdateItemCommand).resolves({
           Attributes: {
                "name": {
                    "S": "Updated"
                }
           }
        }); 

        const result = await repository.update(update, key);

        expect(result).toEqual({ name: 'Updated' });
    });
});