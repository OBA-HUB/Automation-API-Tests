import {test, expect} from '@playwright/test';
import { newUsers } from '../test-data/dummyJsonUsers.js';

for (const person of newUsers) {
  test(`Create person ${person.firstName} ${person.lastName}`, async ({ request }) => {
      const response = await request.post('https://dummyjson.com/users/add', {
      headers: { 'Content-Type': 'application/json' },  
      data: person
    });
    expect(response.status()).toBe(201);
    const responseBody = await response.json();
    console.log(`Created person: ${responseBody.firstName} ${responseBody.lastName}`);
    console.log(`Additional info: ${JSON.stringify(responseBody, null, 1)}`);
  });
}


