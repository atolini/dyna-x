import { APIGatewayProxyResult } from 'aws-lambda';
import { IResponseBuilder } from '../contracts';

export class ResponseBuilder
  implements IResponseBuilder<APIGatewayProxyResult>
{
  
  forbidden(message = 'Forbidden', details?: unknown): APIGatewayProxyResult {
    return {
      statusCode: 403,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: false, message, details }),
    };
  }

  tooManyRequests(message = 'Too Many Requests', details?: unknown): APIGatewayProxyResult {
    return {
      statusCode: 429,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: false, message, details }),
    };
  }
  
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

  notFound(message: string): APIGatewayProxyResult {
    return {
      statusCode: 404,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: false, message }),
    };
  }

  internalError(
    message = 'Internal Server Error',
    details?: unknown,
  ): APIGatewayProxyResult {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: false, message, details }),
    };
  }

  custom<T>(
    statusCode: number,
    success: boolean,
    payload: T,
  ): APIGatewayProxyResult {
    return {
      statusCode,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success, ...payload }),
    };
  }
}
