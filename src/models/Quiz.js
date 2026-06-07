import { ObjectId } from 'mongodb';
import { MongoConfig } from '../config/db.js';

export async function findAllQuizzes() {
  const db = MongoConfig.getDB();
  return await db.collection('quizzes').find().toArray();
}

export async function findQuizById(id) {
  const db = MongoConfig.getDB();
  return await db.collection('quizzes').findOne({ _id: new ObjectId(id) });
}

export async function findQuizBySlug(slug) {
  const db = MongoConfig.getDB();
  return await db.collection('quizzes').findOne({ slug, isActive: true });
}

export async function findQuizByCategory(category) {
  const db = MongoConfig.getDB();
  return await db.collection('quizzes').find({ category, isActive: true }).toArray();
}

export async function incrementViewsQuiz(id) {
  const db = MongoConfig.getDB();
  await db.collection('quizzes').updateOne(
    { _id: new ObjectId(id) },
    { $inc: { 'metadata.views': 1 } }
  );
}

export async function incrementCompletedQuiz(id) {
  const db = MongoConfig.getDB();
  await db.collection('quizzes').updateOne(
    { _id: new ObjectId(id) },
    { $inc: { 'metadata.completed': 1 } }
  );
}

export async function getCategoriesQuiz() {
  const db = MongoConfig.getDB();
  return db.collection('quizzes').aggregate([
    { $match: { isActive: true } },
    {
      $group: {
        _id: '$category',
        title: { $first: '$category' },
        description: { $first: '$description' },
        quizCount: { $sum: 1 },
        quizzes: {
          $push: {
            _id: '$_id',
            title: '$title',
            slug: '$slug',
            description: '$description',
            metadata: '$metadata'
          }
        }
      }
    },
    {
      $project: {
        _id: 0,
        category: '$_id',
        title: 1,
        description: 1,
        quizCount: 1,
        quizzes: 1
      }
    }
  ]).toArray();
}
