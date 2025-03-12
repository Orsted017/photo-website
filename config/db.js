// const { Pool } = require("pg");

// const pool = new Pool({
//   user: "postgres",
//   host: "localhost",
//   database: "yupiter",
//   password: "abduqodir_2005",
//   port: 5433,
// });


// module.exports = pool;


const { Pool } = require("pg");


const pool = new Pool({
  connectionString: "postgresql://abduqodir:kY6lMEsELyV9e4neC4EgPRalNdHdkmHU@dpg-cv4plitds78s73e25cgg-a.oregon-postgres.render.com/yupiter_t585",
  ssl: {
    rejectUnauthorized: false, // Required for Render PostgreSQL
  },
});

module.exports = pool;