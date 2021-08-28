exports.up = function (knex) {
  return knex.schema.table("banners", function (table) {
    // table.where({ id: 1 });
    // table.onUpdate({ banner: "Bun!" });

    table.string("command").defaultTo("Bun!");
  });
};

exports.down = function (knex) {};
