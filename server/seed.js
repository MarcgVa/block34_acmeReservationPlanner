require("dotenv").config();
const pg = require("pg");
const client = new pg.Client(process.env.DATABASE_URL);

const init = async () => {
  try {
    await client.connect();

    const sql = `
      DROP TABLE IF EXISTS customers CASCADE;
      DROP TABLE IF EXISTS restaurants CASCADE;
      DROP TABLE IF EXISTS reservations CASCADE;

      CREATE TABLE customers (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        c_name VARCHAR(100)
      );

      INSERT INTO customers(c_name) VALUES ('Marc');
      INSERT INTO customers(c_name) VALUES ('Michelle');

      CREATE TABLE restaurants (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        r_name VARCHAR(100)
      );

      INSERT INTO restaurants(r_name) VALUES ('Texas Roadhouse');
      INSERT INTO restaurants(r_name) VALUES ('Logans Roadhouse');
      INSERT INTO restaurants(r_name) VALUES ('Firebirds');
      INSERT INTO restaurants(r_name) VALUES ('Bravos');
      
      CREATE TABLE reservations (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        date DATE NOT NULL,
        party_count INTEGER NOT NULL,
        restaurant_id UUID REFERENCES restaurants(id) NOT NULL,
        customer_id UUID REFERENCES customers(id) NOT NULL
      );

      INSERT INTO reservations(
        date,
        party_count,
        restaurant_id,
        customer_id
      )VALUES (
        '2025-04-24',
        2,
        (SELECT id FROM restaurants WHERE r_name='Texas Roadhouse'),
        (SELECT id FROM customers WHERE c_name='Marc')
      );
    `;
    await client.query(sql);
    console.log("Seed completed");
    await client.end();
  } catch (error) {
    console.error(error);
  }
};

init();