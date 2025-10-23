const express = require('express');
const dotenv = require('dotenv');
const controller = require('./controller');
dotenv.config();

import { Request, Response, Application } from 'express';

const app: Application = express();
const port = process.env.PORT || 3000;

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//routes
app.post('/strings', controller.createString);

app.get(
  '/strings/filter-by-natural-language',
  controller.filterStringByNaturalLanguage,
);
app.get('/strings/:value', controller.retrieveStringByValue);

app.get('/strings', controller.retrieveAllStringWithfilter);
app.delete('/strings', controller.deleteStringByValue);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
