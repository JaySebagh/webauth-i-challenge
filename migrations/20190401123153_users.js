exports.up = function(knex, Promise) {
    return knex.schema.createTable("users", (tbl) => {
        tbl.increments(); // primary key
        tbl
          .string("name", 128)
          .notNullable()
          .unique()
        tbl
          .string("pass", 128)
          .notNullable();
    })
  };
  
  exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists("users")
  };