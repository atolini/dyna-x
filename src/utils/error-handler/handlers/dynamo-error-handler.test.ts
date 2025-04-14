import { ILogger } from "../../logger/i-logger";
import { Logger } from "../../logger/logger";
import {
  ProvisionedThroughputExceededException,
  RequestLimitExceeded
} from "@aws-sdk/client-dynamodb";
import { DynamoErrorHandler } from "./dynamo-error-handler";
import { ErrorHandler } from "../error-handler";
import { IResponseBuilder } from "../../response-builder/i-response-builder";

// Mocked Response Builder to simulate IApiResponse behavior
class MockResponseBuilder implements IResponseBuilder<any> {
  notFound(message: string) {
    return { statusCode: 404, body: JSON.stringify({ message }) };
  }

  ok<T>(data: T) {
    return { statusCode: 200, body: JSON.stringify(data) };
  }

  created<T>(data: T) {
    return { statusCode: 201, body: JSON.stringify(data) };
  }

  badRequest(message: string, details?: unknown) {
    return { statusCode: 400, body: JSON.stringify({ message, details }) };
  }

  internalError(message?: string, details?: unknown) {
    return { statusCode: 500, body: JSON.stringify({ message, details }) };
  }

  custom<T>(statusCode: number, success: boolean, payload: T) {
    return { statusCode, body: JSON.stringify({ success, payload }) };
  }
}

describe("ErrorHandler", () => {
  let errorHandler: ErrorHandler<any, MockResponseBuilder>;
  let logger: ILogger<any>;
  let resBuilder: MockResponseBuilder;

  beforeEach(() => {
    logger = new Logger({
      format: "json"
    });
    resBuilder = new MockResponseBuilder();
    errorHandler = new ErrorHandler(resBuilder, logger, [new DynamoErrorHandler<any, MockResponseBuilder>()]);
  });

  it("should return internal error response when no handler can process the error", () => {
    const error = new Error("Unknown error");
    const result = errorHandler.handleError(error);
    expect(result.statusCode).toBe(500);
    expect(JSON.parse(result.body).message).toBe("Unhandled error");
  });

  it("should handle ProvisionedThroughputExceededException and return an appropriate response", () => {
    const error = new ProvisionedThroughputExceededException({
      $metadata: {},
      message: 'ProvisionedThroughputExceededException'
    });

    const result = errorHandler.handleError(error);
    expect(result.statusCode).toBe(500);
    expect(JSON.parse(result.body).message).toBe("DynamoDB throughput exceeded");
  });


  it("should handle RequestLimitExceeded and return an appropriate response", () => {
    const error = new RequestLimitExceeded({
      $metadata: {},
      message: 'RequestLimitExceeded'
    });
    const result = errorHandler.handleError(error);
    expect(result.statusCode).toBe(500);
    expect(JSON.parse(result.body).message).toBe("DynamoDB request limit exceeded");
  });
});
