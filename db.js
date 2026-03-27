const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "34.21.140.252:5432",   // from AlloyDB
  database: "postgres",
  password: "Soos@2005",
  port: 5432,
});

module.exports = pool;
