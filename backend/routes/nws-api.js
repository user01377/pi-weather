import express from "express";
import fetch from "node-fetch";
import path from "path";

import dotenv from "dotenv";
dotenv.config({ path: path.resolve("../.env") }); // hard coded .env file location, may cause issues

const router = express.Router();

let cache = {};
const CACHE_DURATION = parseInt(process.env.CACHE_DURATION, 10) * 1000;

console.log(CACHE_DURATION);