exports.up = function (knex) {
  return knex.schema.createTable("banners", function (table) {
    table.increments("id");
    table.string("banner", 255).notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("banners");
};

exports.config = { transaction: false };
