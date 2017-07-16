'use strict';

const env = process.env.NODE_ENV && process.envNODE_ENV.toLowerCase() === 'prod' ? 'prod' : 'dev';
console.log(`Running on ${env} environment`);

const express = require('express')

const knex = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: `./database/${env}.sqlite3`
  }
});
const app = express()

app.get('/', function (req, res) {
  res.send('Hello World!')
});

app.post('/counter/:word', function(req, res) {
  let word = req.params.word;
  // make sure word is a string
  try {
    word = word.toString().toLowerCase();
  } catch (err) {
    return res.json({ error: err }).status(500);
  }

  // Upsert
  knex.select('*').from('counter')
  .where('string', word)
  .then((result) => {
    if (Array.isArray(result) && result.length === 0) {
      // Insert
      knex.insert({
        'string': word,
        counter: 1,
        created_at: new Date()
      })
      .into('counter')
      .then((result) => {
        return res.status(201).json({ code: 'ok', result });
      })
      .catch((err) => {

      })
    } else {
      // Update
      knex('counter')
      .where('string', word)
      .increment('counter', 1)
      .update({ updated_at: new Date() })
      .then((result2) => {
        return res.status(204).json({ result: result2 });
      }).catch((err) => {
        return res.status(500).json({ error: err });
      })
    }
  }).catch((err) => {
    return res.status(500).json({ error: err });
  });
});

app.get('/counter/:word', function(req, res) {
  let word = req.params.word;
  // make sure word is a string
  try {
    word = word.toString().toLowerCase();
  } catch (err) {
    return res.status(500).json({ error: err });
  }
  knex.select('*').from('counter').where('string', word)
  .then((result) => {
    if (result.length === 0 || !result) {
      return res.json({ code: 'Not Found'}).statusCode(404);
    } else {
      return res.status(200).json(result[0]);
    }
  })
  .catch((err) => {
    return res.status(500).json({ error: err });
  });
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
});
