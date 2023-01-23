exports.status_api = [
  {
    method: 'GET',
    path: 'status',
    callback: async (supabase, req, res) => {
      let { data: statuses, error } = await supabase
        .from('status')
        .select('id, name');
      res.send(statuses);
    }
  },
  {
    method: 'POST',
    path: 'create-status',
    callback: async (supabase, req, res) => {
      const { statusId, name } = req.body;
      let { data: status, error } = await supabase
        .from('status')
        .insert({ id: statusId, name });
      res.send(status);
    }
  },
  {
    method: 'POST',
    path: 'update-status-name',
    callback: async (supabase, req, res) => {
      const { statusId, name } = req.body;
      let { data: status, error } = await supabase
        .from('status')
        .update({ name })
        .eq('id', statusId);
      res.send(status);
    }
  }
];
