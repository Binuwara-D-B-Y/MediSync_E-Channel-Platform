import React, { useEffect, useMemo, useState } from 'react';
import {
  Box, Button, Dialog, DialogActions, DialogContent, DialogTitle,
  TextField, Typography, Grid, Paper, IconButton, Tooltip,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TablePagination, Snackbar, Alert, MenuItem, Stack
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import { DoctorsApi } from '../../api/admin/doctors';
import { SpecializationsApi } from '../../api/admin/specializations';

function DoctorForm({ open, onClose, initial, onSubmit, specializations }) {
  const [form, setForm] = useState(initial || {
    fullName: '', specializationId: '', contactNumber: '', email: '',
    qualifications: '', experienceYears: 0, details: '', hospitalName: '', address: ''
  });

  useEffect(() => setForm(initial || {
    fullName: '', specializationId: '', contactNumber: '', email: '',
    qualifications: '', experienceYears: 0, details: '', hospitalName: '', address: ''
  }), [initial]);

  const isEdit = Boolean(initial?.doctorId);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = () => {
    const payload = {
      fullName: form.fullName,
      specializationId: Number(form.specializationId),
      contactNumber: form.contactNumber,
      email: form.email,
      qualifications: form.qualifications,
      experienceYears: Number(form.experienceYears),
      details: form.details || null,
      hospitalName: form.hospitalName || null,
      address: form.address || null,
      ...(isEdit ? { doctorId: initial.doctorId, isActive: initial.isActive ?? true } : {})
    };
    onSubmit(payload);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>{isEdit ? 'Edit Doctor' : 'Add Doctor'}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 0.5 }}>
          <Grid item xs={12} md={6}>
            <TextField label="Full Name" name="fullName" value={form.fullName} onChange={handleChange} fullWidth required />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField select label="Specialization" name="specializationId" value={form.specializationId} onChange={handleChange} fullWidth required>
              {specializations.map((s) => (
                <MenuItem key={s.specializationId} value={s.specializationId}>{s.name}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField label="Contact Number" name="contactNumber" value={form.contactNumber} onChange={handleChange} fullWidth required />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField label="Email" type="email" name="email" value={form.email} onChange={handleChange} fullWidth required />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Qualifications" name="qualifications" value={form.qualifications} onChange={handleChange} fullWidth required />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField label="Experience (years)" type="number" name="experienceYears" value={form.experienceYears} onChange={handleChange} fullWidth required />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField label="Hospital" name="hospitalName" value={form.hospitalName} onChange={handleChange} fullWidth />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Address" name="address" value={form.address} onChange={handleChange} fullWidth />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Details" name="details" value={form.details} onChange={handleChange} fullWidth multiline minRows={2} />
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

export default function AdminDoctors() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
  const [specs, setSpecs] = useState([]);
  const [search, setSearch] = useState('');
  const [specFilter, setSpecFilter] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const [specRes, listRes] = await Promise.all([
        SpecializationsApi.list(true),
        DoctorsApi.list({ page: page + 1, pageSize, search, specializationId: specFilter || undefined })
      ]);
      const items = listRes?.data || [];
      setRows(items);
      setTotal(listRes?.pagination?.totalCount || items.length);
      setSpecs(specRes?.data || []);
    } catch (e) {
      setToast({ open: true, message: e.message || 'Failed to load doctors', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [page, pageSize]); // eslint-disable-line

  const handleCreate = () => { setEditing(null); setFormOpen(true); };
  const handleEdit = (row) => { setEditing(row); setFormOpen(true); };
  const handleDelete = async (row) => {
    if (!confirm(`Delete ${row.fullName}?`)) return;
    try {
      await DoctorsApi.remove(row.doctorId);
      setToast({ open: true, message: 'Doctor deleted', severity: 'success' });
      load();
    } catch (e) {
      setToast({ open: true, message: e.message || 'Delete failed', severity: 'error' });
    }
  };

  const submitForm = async (payload) => {
    try {
      if (editing) {
        await DoctorsApi.update(editing.doctorId, payload);
        setToast({ open: true, message: 'Doctor updated', severity: 'success' });
      } else {
        await DoctorsApi.create(payload);
        setToast({ open: true, message: 'Doctor created', severity: 'success' });
      }
      setFormOpen(false);
      load();
    } catch (e) {
      setToast({ open: true, message: e.message || 'Save failed', severity: 'error' });
    }
  };

  const handleSearch = async () => {
    setPage(0);
    await load();
  };

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h5">Doctors</Typography>
        <Button startIcon={<AddIcon />} variant="contained" onClick={handleCreate}>Add Doctor</Button>
      </Stack>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField fullWidth placeholder="Search name, qualifications, hospital" value={search} onChange={(e) => setSearch(e.target.value)} />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField select fullWidth label="Specialization" value={specFilter} onChange={(e) => setSpecFilter(e.target.value)}>
              <MenuItem value="">All</MenuItem>
              {specs.map((s) => (
                <MenuItem key={s.specializationId} value={s.specializationId}>{s.name}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={2}>
            <Button fullWidth startIcon={<SearchIcon />} variant="outlined" onClick={handleSearch}>Filter</Button>
          </Grid>
        </Grid>
      </Paper>

      <Paper>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Specialization</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Contact</TableCell>
                <TableCell>Experience</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.doctorId} hover>
                  <TableCell>{row.fullName}</TableCell>
                  <TableCell>{row.specializationName}</TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>{row.contactNumber}</TableCell>
                  <TableCell>{row.experienceYears} yrs</TableCell>
                  <TableCell align="right">
                    <Tooltip title="Edit"><IconButton onClick={() => handleEdit(row)}><EditIcon /></IconButton></Tooltip>
                    <Tooltip title="Delete"><IconButton color="error" onClick={() => handleDelete(row)}><DeleteIcon /></IconButton></Tooltip>
                  </TableCell>
                </TableRow>
              ))}
              {rows.length === 0 && (
                <TableRow><TableCell colSpan={6} align="center">No data</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={total}
          page={page}
          onPageChange={(_, p) => setPage(p)}
          rowsPerPage={pageSize}
          onRowsPerPageChange={(e) => { setPageSize(parseInt(e.target.value, 10)); setPage(0); }}
          rowsPerPageOptions={[5,10,25]}
        />
      </Paper>

      <DoctorForm open={formOpen} onClose={() => setFormOpen(false)} initial={editing} onSubmit={submitForm} specializations={specs} />

      <Snackbar open={toast.open} autoHideDuration={3000} onClose={() => setToast((t) => ({ ...t, open: false }))}>
        <Alert onClose={() => setToast((t) => ({ ...t, open: false }))} severity={toast.severity} sx={{ width: '100%' }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
