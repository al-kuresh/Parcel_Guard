import { existsSync } from 'node:fs';

// Load apps/api/.env into process.env, using Node's built-in loader (no dotenv package).
// In production there is no .env file: the hosting platform sets real environment
// variables instead, so we simply skip this.
//
// This lives in its own file and is imported FIRST in main.ts. ES modules run their
// imports in order, so every later module already sees the variables.
if (existsSync('.env')) {
  process.loadEnvFile('.env');
}
