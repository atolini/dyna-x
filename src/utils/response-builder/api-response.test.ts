import { ResponseBuilder } from './response-builder';

describe('ApiResponse', () => {
  let responseBuilder: ResponseBuilder;

  beforeEach(() => {
    responseBuilder = new ResponseBuilder();
  });

  it('should return a 200 OK response', () => {
    const data = { message: 'Success' };
    const response = responseBuilder.ok(data);

    expect(response).toEqual({
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: true, data }),
    });
  });

  it('should return a 201 Created response', () => {
    const data = { id: 1, message: 'Resource created' };
    const response = responseBuilder.created(data);

    expect(response).toEqual({
      statusCode: 201,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: true, data }),
    });
  });

  it('should return a 400 Bad Request response', () => {
    const message = 'Invalid request';
    const details = { field: 'email', error: 'Required' };
    const response = responseBuilder.badRequest(message, details);

    expect(response).toEqual({
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: false, message, details }),
    });
  });

  it('should return a 500 Internal Server Error response with default message', () => {
    const response = responseBuilder.internalError();

    expect(response).toEqual({
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: false, message: 'Internal Server Error' }),
    });
  });

  it('should return a 500 Internal Server Error response with custom message', () => {
    const response = responseBuilder.internalError('Unexpected failure');

    expect(response).toEqual({
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: false, message: 'Unexpected failure' }),
    });
  });

  it('should return a custom response with provided status code and payload', () => {
    const statusCode = 418; 
    const success = false;
    const payload = { error: 'This is a teapot' };

    const response = responseBuilder.custom(statusCode, success, payload);

    expect(response).toEqual({
      statusCode,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success, ...payload }),
    });
  });
});
