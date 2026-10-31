 export class Users {
    static createUser(i: number) {
        return {
            "role": `QAE${i}`,
            "email": `test${i}@example.com`,
            "phone": `+38097123456${i}`,
            "isActive": true,
            "lastName": `TestQA${i}`,
            "firstName": `Test${i}`, 
        };
    }
 }
