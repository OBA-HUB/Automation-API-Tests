import { test, expect, request,} from '@playwright/test';

test('GET request', async ({ request }) => {
const response = await request.get('https://httpbin.org/get');
expect(response.status()).toBe(200);
const result_get = await response.json();
expect(result_get).toHaveProperty('url');
expect(result_get).toHaveProperty('headers');
expect(result_get).toHaveProperty('origin');
expect(result_get).toHaveProperty('args');
expect(result_get.url).toBe('https://httpbin.org/get');
});

test('GET non-existig data', async ({request}) => {
  const responseNonExisting = await request.get('https://httpbin.org/users/test');
  expect(responseNonExisting.status()).toBe(404);
//   const result = await responseNonExisting.text();
  await expect(responseNonExisting.text()).resolves.toContain('404 Not Found');
});

test('POST new data request', async ({ request }) => {
  const response_post = await request.post('https://httpbin.org/post', {
    data: { person1: 'Tester1', 
            person2: 'Tester2',
            person3: 'Tester3'},
});
  expect(response_post.status()).toBe(200);
  const result_post = await response_post.json();
  expect(result_post).toHaveProperty('url');
  expect(result_post).toHaveProperty('headers');
  expect(result_post).toHaveProperty('origin');
  expect(result_post).toHaveProperty('args');
  expect(result_post).toHaveProperty('data');
  expect(result_post).toHaveProperty('json');
  expect(result_post.url).toBe('https://httpbin.org/post');
  expect(result_post.data).toBe(JSON.stringify({ person1: 'Tester1', person2: 'Tester2', person3: 'Tester3' }));
  console.log(result_post);
});

test('DELETE non-existing user', async ({ request }) => {
const response_del = await request.delete(
'https://httpbin.org/users/test'
);
expect(response_del.status()).toBe(404);
await expect(response_del.text()).resolves.toContain('404 Not Found');
});

test('HTTP Basic Authentication', async ({ request }) => {
  const auth_response = await request.get(
    'https://httpbin.org/basic-auth/Oleksii/1234',
    {
      headers: {
        Authorization:
          'Basic ' +
          Buffer.from('Oleksii:1234').toString('base64')
      }
    }
  );
  expect(auth_response.ok()).toBeTruthy();
  const body = await auth_response.json();
  expect(body.authenticated).toBe(true);
  expect(body.user).toBe('Oleksii');
});

test('HTTP Bearer Authentication', async ({ request }) => {
  const bearer_response = await request.get(
    'https://httpbin.org/bearer',
    {
      headers: {
        Authorization: 'Bearer abra-abra-cadabra' 
      }
    }
  );
  expect(bearer_response.ok()).toBeTruthy();
  const body = await bearer_response.json();
  expect(body.authenticated).toBe(true);
  expect(body.token).toBe('abra-abra-cadabra');
});

test('Request inspection - headers', async({request})=>{
  const reqInspectHeadersResult=await request.get('https://httpbin.org/headers');
  expect(reqInspectHeadersResult.status()).toBe(200);
  const result = await reqInspectHeadersResult.headers();
  expect(result).toHaveProperty('content-type');
  expect(result['content-type']).toContain('application/json');
  expect(result).toHaveProperty('content-length');
  expect(result['content-length']).toContain('249');
  expect(result).toHaveProperty('access-control-allow-origin');
  expect(result['access-control-allow-origin']).toBe('*');
  expect(result).toHaveProperty('access-control-allow-credentials');
  expect(result['access-control-allow-credentials']).toBe('true');
  expect(result['date']).toBeDefined();
});
