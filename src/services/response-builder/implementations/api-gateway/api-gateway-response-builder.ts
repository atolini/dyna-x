import { APIGatewayProxyResult } from 'aws-lambda';
import { IResponseBuilder } from '@response-builder/contracts';

/**
 *
 */
export class APIGatewayResponseBuilder
  implements IResponseBuilder<APIGatewayProxyResult>
{
  /**
   *
   * @param message
   * @param details
   */
  forbidden(message = 'Forbidden', details?: unknown): APIGatewayProxyResult {
    return {
      statusCode: 403,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: false, message, details }),
    };
  }

  /**
   *
   * @param message
   * @param details
   */
  tooManyRequests(
    message = 'Too Many Requests',
    details?: unknown,
  ): APIGatewayProxyResult {
    return {
      statusCode: 429,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: false, message, details }),
    };
  }

  /**
   *
   * @param data
   */
  ok<T>(data: T): APIGatewayProxyResult {
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: true, data }),
    };
  }

  /**
   *
   * @param data
   */
  created<T>(data: T): APIGatewayProxyResult {
    return {
      statusCode: 201,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: true, data }),
    };
  }

  /**
   *
   * @param message
   * @param details
   */
  badRequest(message: string, details?: unknown): APIGatewayProxyResult {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: false, message, details }),
    };
  }

  /**
   *
   * @param message
   */
  notFound(message: string): APIGatewayProxyResult {
    return {
      statusCode: 404,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: false, message }),
    };
  }

  /**
   *
   * @param message
   * @param details
   */
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

  /**
   *
   * @param statusCode
   * @param success
   * @param payload
   */
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
