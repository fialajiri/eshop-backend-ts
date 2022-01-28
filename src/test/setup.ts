import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import { MongoMemoryReplSet } from "mongodb-memory-server";
import mongoose from "mongoose";
import { jwtService } from "../services/jwt";
import { app } from "../app";


declare global {
  var signin: (isAdmin:boolean, userId?:string) => string[];
}

let mongo: any;
let replset:any

beforeAll(async () => {
  process.env.JWT_SECRET = "my_secret_key";
  process.env.JWT_EXPIRY = '1000'
  process.env.REFRESH_TOKEN_EXPIRY = '1000'
  process.env.COOKIE_SECRET = 'cookie_secret'

  // mongo = await MongoMemoryServer.create();
  // const mongoUri = await mongo.getUri();

   replset = await MongoMemoryReplSet.create({ replSet: { storageEngine: 'wiredTiger' } });
  await replset.waitUntilRunning();
  const uri = replset.getUri();  

  await mongoose.connect(uri);
});

beforeEach(async () => {
  jest.setTimeout(10000)
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  // await mongo.stop();

  await mongoose.connection.close();
  await replset.stop()
  await replset.cleanup()

});

global.signin = (isAdmin:boolean, userId?:string) => {
  // Build a JWT payload.  { id, email }
  const payload = {
    id: userId || new mongoose.Types.ObjectId().toHexString(),
    email: 'test@test.com',
    isAdmin:isAdmin
  };

  // Create the JWT!
  const token = jwtService.getToken(payload)

  // Build session Object. { jwt: MY_JWT }
  const session = { jwt: token };

  // Turn that session into JSON
  const sessionJSON = JSON.stringify(session);

  // Take JSON and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString('base64');

  // return a string thats the cookie with the encoded data
  // return [`session=${base64}`];
  return [`cookie=${sessionJSON}`];
};
