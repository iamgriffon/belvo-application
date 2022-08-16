import { MongoClient } from 'mongodb';

const url = process.env.MONGODB_URL

export const mongoClient = new MongoClient(url)