import app from '../app';
import request from 'supertest';
import { DB } from '../AppDatabase';

var createdHospital : any;

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
    passKey: "12345678"
};

let hospitalUpdate = {};

beforeEach(async () => {
  await DB.Models.Hospital.deleteMany({});
  createdHospital = await DB.Models.Hospital.create(hospitalOne);
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

test('should get an hospital', async () => {
  await request(app)
    .get('/hospital/'+createdHospital.id)
    .expect(200);
});


test('should not update hospital because passKey is null', async () => {
  await request(app)
    .put('/hospital/'+createdHospital.id)
    .send((<any>hospitalUpdate)['null'] = {name: "lasuth", passKey:null})
    .expect(400);
});


test('should not update hospital because passKey is incorrect', async () => {
  await request(app)
    .put('/hospital/'+createdHospital.id)
    .send((<any>hospitalUpdate)['incorrect'] = {name: "lasuth", passKey:"1234567"})
    .expect(400);
});

test('should update hospital', async () => {
  await request(app)
    .put('/hospital/'+createdHospital.id)
    .send((<any>hospitalUpdate)['correct'] = {name: "lasuth", passKey:"12345678"})
    .expect(204);
});

test('should not delete hospital because passKey is null', async () => {
  await request(app)
    .del('/hospital/'+createdHospital.id)
    .send((<any>hospitalUpdate)['null'] = {passKey:null})
    .expect(400);
});


test('should not delete hospital because passKey is incorrect', async () => {
  await request(app)
    .del('/hospital/'+createdHospital.id)
    .send((<any>hospitalUpdate)['incorrect'] = {passKey:"1234567"})
    .expect(400);
});

test('should delete hospital', async () => {
  await request(app)
    .del('/hospital/'+createdHospital.id)
    .send((<any>hospitalUpdate)['correct'] = {passKey:"12345678"})
    .expect(204);
});

test('should not get an hospital', async () => {
  await request(app)
    .get('/hospital/'+createdHospital.id)
    .expect(200);
});