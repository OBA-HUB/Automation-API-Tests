import { test, expect, request,} from '@playwright/test';
import dotenv from 'dotenv';
dotenv.config();
import { getAuthToken } from './helpers/authHelper.js';

test('Get full current list of available books', async ({request}) => {
    const listOfBooks = await request.get('https://restful-booker.herokuapp.com/booking');
    const list= await listOfBooks.json();
expect(listOfBooks.status()).toBe(200);
console.log(list.length);// Log the number of available books, this value is constantly changing due to new books creation by other users
});

test('Create a new booking, updating and deleting', async ({request}) => {
    const myBook = {
        firstname: "Alex",
        lastname: "Bar",
        totalprice: 1500,
        depositpaid: true,
        bookingdates: {
            checkin: "2026-06-01",
            checkout: "2027-06-10"
        },
        additionalneeds: "Need to learn API testing"
    };
    const response = await request.post('https://restful-booker.herokuapp.com/booking', {
        data: myBook
    });
    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    console.log(responseBody.bookingid); // Log the booking ID of the newly created booking

const tenthBookDetails = await request.get(`https://restful-booker.herokuapp.com/booking/${responseBody.bookingid}`);
console.log('Just created booking details:', await tenthBookDetails.json());  // Log the details of the newly created booking

const token = await getAuthToken(request);  // Get authentication token for updating the booking
        console.log(token);
        expect(token).toBeTruthy();
const updateMyBook=await request.put(`https://restful-booker.herokuapp.com/booking/${responseBody.bookingid}`, {
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Cookie': `token=${token}`
    },
    data: {
        firstname: "Alex",
        lastname: "Bar",
        totalprice: 2000,
        depositpaid: true,
        bookingdates: {
            checkin: "2026-06-01",
            checkout: "2027-06-10"
        },
        additionalneeds: "Need to become an API testing guru"
    }
});
console.log('Just updated booking details:', await updateMyBook.json());  

// Deleting the just created booking
const bookDeleting = await request.delete(`https://restful-booker.herokuapp.com/booking/${responseBody.bookingid}`, {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Cookie': `token=${token}`
        }
    });
    expect(bookDeleting.status()).toBe(201);
    console.log('The book with ID', responseBody.bookingid, 'was deleted successfully.');
});