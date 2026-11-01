import {test, expect,} from '@playwright/test';
import { Ajv } from 'ajv';
import { dummyJsonUserSchema } from '../schemas/dummyJsonUsers.schema.ts';
import { newUsers } from '../test-data/dummyJsonUsers.js';


test('validate dummyJSON schema for adding users', async ({ request }) => {
  const response = await request.post('https://dummyjson.com/users/add', {
      headers: { 'Content-Type': 'application/json' },  
      data: newUsers[0]
    });
    expect(response.status()).toBe(201);
    const responseBody = await response.json();
    console.log(JSON.stringify(responseBody, null, 1));
    const ajv = new Ajv();
    const validate = ajv.compile(dummyJsonUserSchema);
    const valid = validate(responseBody);
    if (valid === false) {
      await console.error('Validation failed:', validate.errors);
    }
    expect(valid).toBe(true);
    
    });