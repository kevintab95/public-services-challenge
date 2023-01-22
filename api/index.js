const express = require("express");
require('dotenv').config();

const app = express();

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

app.get("/trucks", async (req, res) => {
  let { data: trucks, error } = await supabase
    .from('truck')
    .select(`
      id,
      name,
      cargo,
      status (
      name
      )
    `);
  res.send(trucks);
});

app.get("/status", async (req, res) => {
  let { data: statuses, error } = await supabase
    .from('status')
    .select('id, name');
  res.send(statuses);
});

app.listen(5000, () => {
  console.log("Running on port 5000.");
});

// Export the Express API
module.exports = app;