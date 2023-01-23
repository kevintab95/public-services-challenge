const express = require('express');
require('dotenv').config();

const app = express();
app.set('port', (process.env.PORT || 8081));

app.use(express.json());
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const TRUCK_API = require('./truck');
const STATUS_API = require('./status');

API_LIST = [... TRUCK_API.truck_api, ... STATUS_API.status_api];

API_LIST.forEach(({ method, path, callback }) => {
  app[method.toLowerCase()](`/api/${path}`, callback.bind(null, supabase));
});

app.listen(app.get('port'), function() {
  console.log('Express app is running on port', app.get('port'));
});

// Export the Express API
module.exports = app;