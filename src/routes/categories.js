import express from 'express';
import { getAllCategories, getCategory } from '../controllers/categoryController.js';

export const categoriesRouter = express.Router();
categoriesRouter.get('/', getAllCategories);
categoriesRouter.get('/:category', getCategory);
