import { test, expect, request,} from '@playwright/test';
import { randomUUID } from 'crypto';
import dotenv from 'dotenv';
dotenv.config();
test.describe.configure({ mode: 'serial' });

test('Create new user in real DB and verify response', async ({ request }) => {
    for (let i = 0; i < 5; i++) { 
    const user={
        "role": `QAE${i}`,
        "email": `test${i}@example.com`,
        "phone": `+38097123456${i}`,
        "isActive": true,
        "lastName": `TestQA${i}`,
        "firstName": `Test${i}`,    
    };
  const response = await request.post('https://reqres.in/api/collections/users/records?project_id=55312',
  {
    headers: {
        'x-api-key': process.env.API_KEY!,
        'X-Reqres-Env': 'prod',
        'Content-Type': 'application/json',
    },
     data: {
        data:user
        }
    }
);
  expect(response.status()).toBe(201);
  const responseBody = await response.json();
//   console.log(responseBody);
    }
});

test('Check records quantity', async ({ request }) => {
    const response = await request.get('https://reqres.in/api/collections/users/records?project_id=55312',
  {
    headers: {
        'x-api-key': process.env.API_KEY!,
        'X-Reqres-Env': 'prod',
        },
    }
);
expect(response.status()).toBe(200);
const data = await response.json();
expect(data.data.length).toBe(5); // Ensure there is 5 records
});

test('Verify individual record', async ({ request }) => {
    const response = await request.get('https://reqres.in/api/collections/users/records?project_id=55312',
    {
        headers: {
            'x-api-key': process.env.API_KEY!,
            'X-Reqres-Env': 'prod',
        },
    }
    );
    const recordData = await response.json();
    const records = recordData.data;
    
    const randomRecord = records[Math.floor(Math.random() * records.length)];
    const randomId = randomRecord.id;

    const response2 = await request.get(`https://reqres.in/api/collections/users/records/${randomId}?project_id=55312`,
    {
        headers: {
            'x-api-key': process.env.API_KEY!,
            'X-Reqres-Env': 'prod',
        },
    }
    );
    expect(response2.status()).toBe(200);
    const data = await response2.json();
    expect(data.data.id).toBe(randomId);
    console.log(data.data.id)
    });

    test('Update record', async ({ request }) => {
        const response = await request.get('https://reqres.in/api/collections/users/records?project_id=55312',
        {
            headers: {
                'x-api-key': process.env.API_KEY!,
                'X-Reqres-Env': 'prod',
            },
        }
        );
        const recordData = await response.json();
        const records = recordData.data;
        const randomRecord = records[Math.floor(Math.random() * records.length)];
        const randomId = randomRecord.id;

        const updatedUser = {
            "role": `UpdatedRole`,
            "email": `updated@example.com`,
            "phone": `+380971234567`,
            "isActive": false,
            "lastName": `UpdatedLastName`,
            "firstName": `UpdatedFirstName`,
        };

        const response2 = await request.put(`https://reqres.in/api/collections/users/records/${randomId}?project_id=55312`,
        {
            headers: {
                'x-api-key': process.env.API_KEY!,
                'X-Reqres-Env': 'prod',
                'Content-Type': 'application/json',
            },
            data: {
                data: updatedUser
            }
        }
        );
        expect(response2.status()).toBe(200);
        const data = await response2.json();
        expect(data.data.id).toBe(randomId);
        expect(data.data.data.role).toBe(updatedUser.role);
        expect(data.data.data.email).toBe(updatedUser.email);
        expect(data.data.data.phone).toBe(updatedUser.phone);
        expect(data.data.data.isActive).toBe(updatedUser.isActive);
        expect(data.data.data.lastName).toBe(updatedUser.lastName);
        expect(data.data.data.firstName).toBe(updatedUser.firstName);
    });

    test('Delete all records', async ({ request }) => {
    const response = await request.get(
  'https://reqres.in/api/collections/users/records?project_id=55312',
  {
    headers: {
      'x-api-key': process.env.API_KEY!,
      'X-Reqres-Env': 'prod',
    },
  }
);

const data = await response.json();
const records = data.data;
// console.log(records);

for (const item of records) {
    const response2 = await request.delete(`https://reqres.in/api/collections/users/records/${item.id}?project_id=55312`,
    {
        headers: {
            'x-api-key': process.env.API_KEY!,
            'X-Reqres-Env': 'prod',
        },
    }
    );
    expect(response2.status()).toBe(204);
}
    });