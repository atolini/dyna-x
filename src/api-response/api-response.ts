import { APIGatewayProxyResult } from 'aws-lambda';
import { IApiResponse } from './i-api-response';

export class ApiResponse implements IApiResponse<APIGatewayProxyResult> {
  ok<T>(data: T): APIGatewayProxyResult {
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: true, data }),
    };
  }

  created<T>(data: T): APIGatewayProxyResult {
    return {
      statusCode: 201,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: true, data }),
    };
  }

  badRequest(message: string, details?: unknown): APIGatewayProxyResult {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: false, message, details }),
    };
  }

  internalError(message = 'Internal Server Error', details?: unknown): APIGatewayProxyResult {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: false, message, details }),
    };
  }

  custom<T>(statusCode: number, success: boolean, payload: T): APIGatewayProxyResult {
    return {
      statusCode,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success, ...payload }),
    };
  }
}
