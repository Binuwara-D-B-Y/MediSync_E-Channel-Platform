import React, { useEffect, useState } from 'react';
import {
  Box, Button, Dialog, DialogActions, DialogContent, DialogTitle,
  TextField, Typography, Grid, Paper, IconButton, Tooltip,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Snackbar, Alert, Switch, FormControlLabel, Stack
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { SpecializationsApi } from '../../api/admin/specializations';

function SpecForm({ open, onClose, initial, onSubmit }) {
  const [form, setForm] = useState(initial || { name: '', description: '' });
  useEffect(() => setForm(initial || { name: '', description: '' }), [initial]);
  const isEdit = Boolean(initial?.specializationId);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = () => {
    const payload = {
      name: form.name,
      description: form.description || null,
      ...(isEdit ? { specializationId: initial.specializationId, isActive: initial.isActive ?? true } : {})
    };
    onSubmit(payload);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{isEdit ? 'Edit Specialization' : 'Add Specialization'}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 0.5 }}>
          <Grid item xs={12}>
            <TextField label="Name" name="name" value={form.name} onChange={handleChange} fullWidth required />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Description" name="description" value={form.description} onChange={handleChange} fullWidth multiline minRows={2} />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>{isEdit ? 'Save' : 'Create'}</Button>
      </DialogActions>
    </Dialog>
  );
}

export default function AdminSpecializations() {
  const [rows, setRows] = useState([]);
  const [includeInactive, setIncludeInactive] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  const load = async () => {
    setLoading(true);
    try {
      const res = await SpecializationsApi.list(includeInactive);
      setRows(res?.data || []);
    } catch (e) {
      setToast({ open: true, message: e.message || 'Failed to load specializations', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [includeInactive]); // eslint-disable-line

  const handleCreate = () => { setEditing(null); setFormOpen(true); };
  const handleEdit = (row) => { setEditing(row); setFormOpen(true); };
  const handleDelete = async (row) => {
    if (!confirm(`Delete ${row.name}?`)) return;
    try {
      await SpecializationsApi.remove(row.specializationId);
      setToast({ open: true, message: 'Specialization deleted', severity: 'success' });
      load();
    } catch (e) {
      setToast({ open: true, message: e.message || 'Delete failed', severity: 'error' });
    }
  };

  const submitForm = async (payload) => {
    try {
      if (editing) {
        await SpecializationsApi.update(editing.specializationId, payload);
        setToast({ open: true, message: 'Specialization updated', severity: 'success' });
      } else {
        await SpecializationsApi.create(payload);
        setToast({ open: true, message: 'Specialization created', severity: 'success' });
      }
      setFormOpen(false);
      load();
    } catch (e) {
      setToast({ open: true, message: e.message || 'Save failed', severity: 'error' });
    }
  };

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h5">Specializations</Typography>
        <Box>
          <FormControlLabel control={<Switch checked={includeInactive} onChange={(e) => setIncludeInactive(e.target.checked)} />} label="Include inactive" />
          <Button startIcon={<AddIcon />} variant="contained" onClick={handleCreate} sx={{ ml: 1 }}>Add</Button>
        </Box>
      </Stack>

      <Paper>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Active</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.specializationId} hover>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.description}</TableCell>
                  <TableCell>{row.isActive ? 'Yes' : 'No'}</TableCell>
                  <TableCell align="right">
                    <Tooltip title="Edit"><IconButton onClick={() => handleEdit(row)}><EditIcon /></IconButton></Tooltip>
                    <Tooltip title="Delete"><IconButton color="error" onClick={() => handleDelete(row)}><DeleteIcon /></IconButton></Tooltip>
                  </TableCell>
                </TableRow>
              ))}
              {rows.length === 0 && (
                <TableRow><TableCell colSpan={4} align="center">No data</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <SpecForm open={formOpen} onClose={() => setFormOpen(false)} initial={editing} onSubmit={submitForm} />

      <Snackbar open={toast.open} autoHideDuration={3000} onClose={() => setToast((t) => ({ ...t, open: false }))}>
        <Alert onClose={() => setToast((t) => ({ ...t, open: false }))} severity={toast.severity} sx={{ width: '100%' }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
