'use strict';

exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTableIfNotExists('counter', (table) => {
      table.increments('id').primary();
      table.string('string',128);
      table.integer('counter');
      table.timestamps();
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTableIfExists('counter')
  ]);
};
