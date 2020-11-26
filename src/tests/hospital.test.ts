import app from '../app';
import request from 'supertest';
import { DB } from '../AppDatabase';

const hospitalOne = {
    name: "Luth",
    phone: "08106723916",
    city: "Ikeja",
    state: "Lagos",
    country: "Nigeria",
    email: "business.tobiloba@gmail.com",
    capacity: 25,
    address: "7 emmanuel keshi street magodo.",
    venue: "LUTH",
    registrationNumber: "230099FED",
    images:["7d7sisjsisnjnskjxsichusisuiscjnxcsij.jpg"],
    lat: "100",
    lng: "200",
    passKey: "12345678"
};

beforeEach(async () => {
  await DB.Models.Hospital.deleteMany({});
  await DB.Models.Hospital.create(hospitalOne);
});

// test('should create a hospital', async () => {
//   await request(app)
//     .post('/hospital')
//     .send(hospitalOne)
//     .expect(201);
// });

test('should not create a hospital because email must be unique', async () => {
    await request(app)
      .post('/hospital')
      .send(hospitalOne)
      .expect(500);
});
