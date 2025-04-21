const pool = require("../common/common");

// === CREATES ===
const createCustomer = async (name) => {
  const sql = "INSERT INTO customers(c_name) VALUES ($1);";
  const response = await pool.query(sql,[name]);
  return response.rows[0];
};

const createRestaurant = async (name) => {
  const sql = "INSERT INTO restaurants(r_name) VALUES ($1);";
  const response = await pool.query(sql,[name]);
  return response.rows[0];
};

const createReservation = async (id, reservation) => {
  const { restaurant_id, date, party_count } = reservation;

  const sql = `
  INSERT INTO reservations(
   customer_id, restaurant_id, date, party_count
  ) VALUES(
   (SELECT id FROM customers WHERE id=$1),
   (SELECT id FROM restaurants WHERE id=$2),
   $3,$4)
   RETURNING*
  `;
  const response = await pool.query(sql, [id, restaurant_id, date, party_count]);
  return response.rows[0];  
}

// === READ ===
const getAllCustomers = async() => {
  const sql = "SELECT * FROM customers;";
  const response = await pool.query(sql);
  return response.rows;
};

const getAllRestaurants = async() => {
  const sql = "SELECT * FROM restaurants;";
  const response = await pool.query(sql);
  return response.rows;
};

const getAllReservations = async () => {
  const sql = `
    SELECT date, party_count,r_name as restaurant,c_name as customer FROM reservations
    INNER JOIN customers on customers.c_id = customer_id
    INNER JOIN restaurants on restaurants.r_id = restaurant_id
  `;
  const response = await pool.query(sql);
  return response.rows;
};

// === UPDATE ===


// === DELETE ===
const deleteReservation = async (id) => {
  const sql = "DELETE FROM reservations WHERE id=$1"
  await pool.query(sql, [id]);
  return ;
};

const deleteCustomer = async (id) => {
  const sql = "DELETE FROM customers WHERE id=$1";
  const response = await pool.query(sql, [id]);
  return response;
};

const deleteReservationWithCustomerId = async (reservation) => {
  const { id, customer_id } = reservation;
  const sql = "DELETE FROM reservations WHERE id=$1 AND customer_id=$2";
  await pool.query(sql, [id, customer_id])
  return;
}




module.exports = {
  createCustomer, createRestaurant, createReservation,
  getAllCustomers, getAllRestaurants, getAllReservations,
  deleteReservation, deleteCustomer, deleteReservationWithCustomerId
};
