exports.truck_api = [
  {
    method: 'GET',
    path: 'trucks',
    callback: async (supabase, req, res) => {
      let { data: trucks, trucksResponseError } = await supabase
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
      let { data: statuses, statusResponseError } = await supabase
        .from('status')
        .select('id, name');
      res.send({
        trucks,
        statuses
      });
    }
  },
  {
    method: 'POST',
    path: 'update-truck-status',
    callback: async (supabase, req, res) => {
      const { truckId, statusId } = req.body;
      let { data: truck, error } = await supabase
        .from('truck')
        .update({ status_id: statusId })
        .eq('id', truckId);
      res.send(truck);
    }
  },
  {
    method: 'POST',
    path: 'update-truck-name',
    callback: async (supabase, req, res) => {
      const { truckId, name } = req.body;
      let { data: truck, error } = await supabase
        .from('truck')
        .update({ name })
        .eq('id', truckId);
      res.send(truck);
    }
  },
  {
    method: 'POST',
    path: 'create-truck',
    callback: async (supabase, req, res) => {
      const { truckId, name, statusId } = req.body;
      let { data: truck, error } = await supabase
        .from('truck')
        .insert({ id: truckId, name, status_id: statusId, cargo: 'NA' });
      res.send(truck);
    }
  },
  {
    method: 'POST',
    path: 'delete-truck',
    callback: async (supabase, req, res) => {
      const { truckId } = req.body;
      let { data: truck, error } = await supabase
        .from('truck')
        .delete()
        .eq('id', truckId);
      res.send(truck);
    }
  }
];
