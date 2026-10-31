import type {APIRequestContext} from '@playwright/test';

export async function getAuthToken(request: APIRequestContext): Promise<string> {
    const tokenCreate = await request.post('https://restful-booker.herokuapp.com/auth', {
        headers: {
            'Content-Type': 'application/json'
        },
        data: {
            username: process.env.RESTFUL_USERNAME!,
            password: process.env.RESTFUL_PASSWORD!
        }
    });
    if (!tokenCreate.ok()) {
        throw new Error(`Failed to get auth token: Status is ${tokenCreate.status()}`);
    }
    const responseBody = await tokenCreate.json();

    if ( typeof responseBody.token === 'undefined') {
        throw new Error('Auth token is not obtained');
    }
    return responseBody.token;
}
