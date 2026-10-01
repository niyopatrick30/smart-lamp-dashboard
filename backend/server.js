const express = require("express");
const cors = require("cors");
const pool = require("./database");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

/*
========================================
HOME
========================================
*/
app.get("/", (req, res) => {
  res.json({
    message: "Smart Lamp API is running",
  });
});

/*
========================================
GET ALL 3 LAMPS
========================================
*/
app.get("/api/lamps", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM lamps ORDER BY id"
    );

    res.json(result.rows);
  } catch (error) {
    console.error("GET LAMPS ERROR:", error);

    res.status(500).json({
      error: "Failed to get lamps",
    });
  }
});

/*
========================================
GET ONE LAMP
========================================
*/
app.get("/api/lamps/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "SELECT * FROM lamps WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Lamp not found",
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("GET ONE LAMP ERROR:", error);

    res.status(500).json({
      error: "Failed to get lamp",
    });
  }
});

/*
========================================
UPDATE LAMP STATUS
========================================

Frontend sends:

{
  "status": true
}

or

{
  "status": false
}
========================================
*/
app.put("/api/lamps/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Check that status is TRUE or FALSE
    if (typeof status !== "boolean") {
      return res.status(400).json({
        error: "Status must be true or false",
      });
    }

    const result = await pool.query(
      `UPDATE lamps
       SET status = $1,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING *`,
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Lamp not found",
      });
    }

    res.json(result.rows[0]);

  } catch (error) {
    console.error("UPDATE LAMP ERROR:", error);

    res.status(500).json({
      error: "Failed to update lamp",
    });
  }
});

/*
========================================
START SERVER
========================================
*/
app.listen(PORT, () => {
  console.log(`Smart Lamp API running on port ${PORT}`);
});