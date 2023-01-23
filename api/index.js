const express = require('express');
require('dotenv').config();

const app = express();
app.set('port', (process.env.PORT || 8081));

app.use(express.json());
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

app.get('/api/trucks', async (req, res) => {
  let { data: trucks, error } = await supabase
    .from('truck')
    .select(`
      id,
      name,
      cargo,
      status (
        id,
        name
      )
    `);
  res.send(trucks);
});

app.get('/api/status', async (req, res) => {
  let { data: statuses, error } = await supabase
    .from('status')
    .select('id, name');
  res.send(statuses);
});

app.post('/api/update-truck-status', async (req, res) => {
  const { truckId, statusId } = req.body;
  let { data: truck, error } = await supabase
    .from('truck')
    .update({ status_id: statusId })
    .eq('id', truckId);
  res.send(truck);
});

app.post('/api/update-truck-name', async (req, res) => {
  const { truckId, name } = req.body;
  let { data: truck, error } = await supabase
    .from('truck')
    .update({ name })
    .eq('id', truckId);
  res.send(truck);
});

app.post('/api/create-truck', async (req, res) => {
  const { truckId, name, statusId } = req.body;
  let { data: truck, error } = await supabase
    .from('truck')
    .insert({ id: truckId, name, status_id: statusId, cargo: 'NA' });
  res.send(truck);
});

app.post('/api/delete-truck', async (req, res) => {
  const { truckId } = req.body;
  let { data: truck, error } = await supabase
    .from('truck')
    .delete()
    .eq('id', truckId);
  res.send(truck);
});

app.post('/api/update-status-name', async (req, res) => {
  const { statusId, name } = req.body;
  let { data: status, error } = await supabase
    .from('status')
    .update({ name })
    .eq('id', statusId);
  res.send(status);
});

app.post('/api/create-status', async (req, res) => {
  const { statusId, name } = req.body;
  let { data: status, error } = await supabase
    .from('status')
    .insert({ id: statusId, name });
  res.send(status);
});

app.listen(app.get('port'), function() {
  console.log('Express app is running on port', app.get('port'));
});

// Export the Express API
module.exports = app;