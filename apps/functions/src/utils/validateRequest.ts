import { FunctionName, FunctionParams, FunctionValidation } from '@kuzpot/core';
import { APIGatewayEvent, Context } from 'aws-lambda';
import { JwtPayload, verify } from 'jsonwebtoken';

interface DecodedToken {
  userId: string;
  defaultRole: string;
  allowedRoles: string[];
  isAnonymous: boolean;
  sub?: string;
  iat?: number;
  exp?: number;
  iss?: string;
}

export function validateRequest<T extends FunctionName>(functionName: T, event: APIGatewayEvent, context: Context) {
  let currentToken: DecodedToken;
  let body;

  try {
    currentToken = getDecodedToken(event);
  } catch (error) {
    throw new Error('User must be authenticated');
  }

  try {
    body = JSON.parse(event.body || '{}');
    FunctionValidation[functionName].parse(body);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    // logtail.error(`${functionName} Invalid data`, {
    //   error: { ...error },
    //   params: { ...data, from: auth?.token?.uid || 'unknown' },
    // });
    throw new Error('Invalid body');
  }

  return { currentToken, body: body as FunctionParams[T] };
}

function getDecodedToken(event: APIGatewayEvent) {
  const authHeader = event.headers.Authorization;
  const token = authHeader?.split(' ')[1];

  if (!token) {
    throw new Error('No token provided');
  }

  const decoded = verify(token, process.env.NHOST_JWT_SECRET || '') as JwtPayload;
  const hasuraClaims = decoded['https://hasura.io/jwt/claims'];

  return {
    userId: hasuraClaims['x-hasura-user-id'] as string,
    defaultRole: hasuraClaims['x-hasura-default-role'] as string,
    allowedRoles: hasuraClaims['x-hasura-allowed-roles'] as string[],
    isAnonymous: hasuraClaims['x-hasura-is-anonymous'] === 'true',
    sub: decoded.sub,
    iat: decoded.iat,
    exp: decoded.exp,
    iss: decoded.iss,
  } as DecodedToken;
}
