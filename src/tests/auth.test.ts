import app from '../app';
import request from 'supertest';
import { DB } from '../AppDatabase';

const userOne = {
  firstName: "Tobiloba",
  lastName: "Owolabi",
  phone: "08206723916",
  city: "Ikeja",
  state: "Lagos",
  country: "Nigeria",
  bloodType:"O-",
  phoneType: "work",
  lat: "200",
  lng: "200",
  email: 'tundey@tunde.com',
  password: 'password',
};

beforeEach(async () => {
  await DB.Models.User.deleteMany({});
  await DB.Models.User.create(userOne);
});

// test('should signup a user', async () => {
//   await request(app)
//     .post('/auth/signup')
//     .send(userOne)
//     .expect(201);
// });

test('should not return a user because no user is signed in', async () => {
  await request(app)
    .get('/auth/me')
    .expect(401);
});

test('should signin a user', async () => {
  await request(app)
    .post('/auth/signin')
    .send({ email: userOne.email, password: userOne.password })
    .expect(200);
});

test('should return a user because no user is signed in', async () => {
  await request(app)
    .get('/auth/me')
    .expect(200);
});

test('should not signin a user with bad credentials', async () => {
  await request(app)
    .post('/auth/signin')
    .send({ email: userOne.email, password: 'wrongpassword' })
    .expect(400);
});

test('should signout a user', async () => {
  await request(app)
    .post('/auth/signout')
    .expect(200);
});