const express = require("express");
require('dotenv').config();

const app = express();
app.set('port', (process.env.PORT || 8081));

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

app.get("/api/trucks", async (req, res) => {
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

app.get("/api/status", async (req, res) => {
  let { data: statuses, error } = await supabase
    .from('status')
    .select('id, name');
  res.send(statuses);
});

app.listen(app.get('port'), function() {
  console.log('Express app is running on port', app.get('port'));
});

// Export the Express API
module.exports = app;