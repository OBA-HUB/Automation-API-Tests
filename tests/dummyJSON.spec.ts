import { test, expect, request } from '@playwright/test';
import type { Recipe } from '../models/recipes.ts';
import type { RecipesResponse } from '../models/recipes.ts';

test('GET dummy JSON data', async ({ request }) => {
  const response = await request.get('https://dummyjson.com/recipes');
  expect(response.status()).toBe(200);
  const result: RecipesResponse = await response.json();
  const recipeId=2;
  console.log(result.recipes[recipeId]?.name);
  console.log('for Cooking `' + result.recipes[recipeId]?.name + '` you will need the following ingredients:', result.recipes[recipeId]?.ingredients);
  console.log('Follow instructions:', result.recipes[recipeId]?.instructions);
});