require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("../common/common");
const PORT = process.env.SERVER_PORT;
const { createCustomer, createRestaurant, createReservation,
  getAllCustomers, getAllRestaurants, getAllReservations,
  deleteReservation, deleteCustomer, deleteReservationWithCustomerId } = require("./db");

//MIDDLEWARE
app.use(cors());
app.use(express.json());

//SERVER
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`)
})


app.get("/", (req, res) => { 
  res.status(200).json({ message: "Endpoint is working" });
})


// === CUSTOMERS ===
app.get("/api/customers", async (req, res) => {
  try {
    const response = await getAllCustomers();
    res.status(200).json(response);
  } catch (error) {
    console.error(error);
  }
});
app.post('/api/customers', async (req, res, next) => {
  const { name } = req.body;
  const response = await createCustomer(name);
  res.status(201).json(response);
});

app.post('/api/customers/:id/reservations', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { restaurant_id, date, party_count } = req.body;
    let reservation = {
      restaurant_id: restaurant_id,
      date: date,
      party_count: party_count
    }
    const response = await createReservation(id, reservation);
    res.status(201).json(response);
  } catch (error) {
    console.error(error);
  }
  
})

app.delete('/api/customers/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const response = await deleteCustomer(id);
    res.sendStatus(204);
  } catch (error) {
    
  }
  
})

// === RESTAURANTS ===
app.get("/api/restaurants", async (req, res) => {
  try {
    const response = await getAllRestaurants();
    res.status(200).json(response);
  } catch (error) {
    console.error(error);
  }
});

// === RESERVATIONS ===
app.get("/api/reservations", async (req,res,next) => {
  try {
    const response = await getAllReservations();
    res.status(200).json(response);
  } catch (error) {
    console.error(error);
  }
});
app.delete("/api/reservations/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    await deleteReservation(id);
    res.sendStatus(204);
  } catch (error) {
    console.error(error);
  }
});

app.delete("/api/customers/:customer_id/reservations/:id", async (req, res, next) => {
  try {
    await deleteReservationWithCustomerId(req.params);
    res.sendStatus(204);
  } catch (error) {
    console.error(error);
  }
});
