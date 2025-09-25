import React, { useEffect, useState } from 'react';
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
import { SchedulesApi } from '../../api/admin/schedules';
import { DoctorsApi } from '../../api/admin/doctors';

function ScheduleForm({ open, onClose, initial, onSubmit, doctors }) {
  const [form, setForm] = useState(initial || {
    doctorId: '',
    scheduleDate: new Date().toISOString().slice(0,10),
    startTime: '09:00',
    endTime: '10:00',
    slotDurationMinutes: 30,
    maxPatientsPerSlot: 1,
    notes: ''
  });

  useEffect(() => setForm(initial ? {
    scheduleId: initial.scheduleId,
    doctorId: initial.doctorId,
    scheduleDate: initial.scheduleDate?.slice(0,10) || new Date().toISOString().slice(0,10),
    startTime: initial.startTime?.toString()?.slice(0,5) || '09:00',
    endTime: initial.endTime?.toString()?.slice(0,5) || '10:00',
    slotDurationMinutes: initial.slotDurationMinutes || 30,
    maxPatientsPerSlot: initial.maxPatientsPerSlot || 1,
    notes: initial.notes || ''
  } : {
    doctorId: '',
    scheduleDate: new Date().toISOString().slice(0,10),
    startTime: '09:00',
    endTime: '10:00',
    slotDurationMinutes: 30,
    maxPatientsPerSlot: 1,
    notes: ''
  }), [initial]);

  const isEdit = Boolean(initial?.scheduleId);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = () => {
    const payload = {
      doctorId: Number(form.doctorId),
      scheduleDate: new Date(form.scheduleDate),
      startTime: form.startTime + ':00',
      endTime: form.endTime + ':00',
      slotDurationMinutes: Number(form.slotDurationMinutes),
      maxPatientsPerSlot: Number(form.maxPatientsPerSlot),
      notes: form.notes || null,
      ...(isEdit ? { scheduleId: initial.scheduleId, isActive: initial.isActive ?? true } : {})
    };
    onSubmit(payload);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{isEdit ? 'Edit Schedule' : 'Add Schedule'}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 0.5 }}>
          <Grid item xs={12}>
            <TextField select label="Doctor" name="doctorId" value={form.doctorId} onChange={handleChange} fullWidth required disabled={isEdit}>
              {doctors.map((d) => (
                <MenuItem key={d.doctorId} value={d.doctorId}>{d.fullName} ({d.specializationName})</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField label="Date" type="date" name="scheduleDate" value={form.scheduleDate} onChange={handleChange} fullWidth required InputLabelProps={{ shrink: true }} />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField label="Start Time" type="time" name="startTime" value={form.startTime} onChange={handleChange} fullWidth required InputLabelProps={{ shrink: true }} />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField label="End Time" type="time" name="endTime" value={form.endTime} onChange={handleChange} fullWidth required InputLabelProps={{ shrink: true }} />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField label="Slot Duration (min)" type="number" name="slotDurationMinutes" value={form.slotDurationMinutes} onChange={handleChange} fullWidth required />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField label="Max Patients / Slot" type="number" name="maxPatientsPerSlot" value={form.maxPatientsPerSlot} onChange={handleChange} fullWidth required />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Notes" name="notes" value={form.notes} onChange={handleChange} fullWidth multiline minRows={2} />
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

export default function AdminSchedules() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
  const [doctors, setDoctors] = useState([]);
  const [doctorFilter, setDoctorFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const [docRes, listRes] = await Promise.all([
        DoctorsApi.list({ isActive: true }),
        SchedulesApi.list({ page: page + 1, pageSize, doctorId: doctorFilter || undefined, date: dateFilter || undefined })
      ]);
      const items = listRes?.data || [];
      setRows(items);
      setTotal(listRes?.pagination?.totalCount || items.length);
      setDoctors(docRes?.data || []);
    } catch (e) {
      setToast({ open: true, message: e.message || 'Failed to load schedules', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [page, pageSize]); // eslint-disable-line

  const handleCreate = () => { setEditing(null); setFormOpen(true); };
  const handleEdit = (row) => { setEditing(row); setFormOpen(true); };
  const handleDelete = async (row) => {
    if (!confirm(`Delete schedule ${row.scheduleId}?`)) return;
    try {
      await SchedulesApi.remove(row.scheduleId);
      setToast({ open: true, message: 'Schedule deleted', severity: 'success' });
      load();
    } catch (e) {
      setToast({ open: true, message: e.message || 'Delete failed', severity: 'error' });
    }
  };

  const submitForm = async (payload) => {
    try {
      if (editing) {
        await SchedulesApi.update(editing.scheduleId, payload);
        setToast({ open: true, message: 'Schedule updated', severity: 'success' });
      } else {
        await SchedulesApi.create(payload);
        setToast({ open: true, message: 'Schedule created', severity: 'success' });
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
        <Typography variant="h5">Schedules</Typography>
        <Button startIcon={<AddIcon />} variant="contained" onClick={handleCreate}>Add Schedule</Button>
      </Stack>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <TextField select fullWidth label="Doctor" value={doctorFilter} onChange={(e) => setDoctorFilter(e.target.value)}>
              <MenuItem value="">All</MenuItem>
              {doctors.map((d) => (
                <MenuItem key={d.doctorId} value={d.doctorId}>{d.fullName}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField label="Date" type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} fullWidth InputLabelProps={{ shrink: true }} />
          </Grid>
          <Grid item xs={12} md={4}>
            <Button fullWidth startIcon={<SearchIcon />} variant="outlined" onClick={handleSearch}>Filter</Button>
          </Grid>
        </Grid>
      </Paper>

      <Paper>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Doctor</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Start</TableCell>
                <TableCell>End</TableCell>
                <TableCell>Slot(min)</TableCell>
                <TableCell>Max/Slot</TableCell>
                <TableCell>Available</TableCell>
                <TableCell>Active</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.scheduleId} hover>
                  <TableCell>{row.scheduleId}</TableCell>
                  <TableCell>{row.doctorName || row.doctorId}</TableCell>
                  <TableCell>{new Date(row.scheduleDate).toLocaleDateString()}</TableCell>
                  <TableCell>{row.startTime}</TableCell>
                  <TableCell>{row.endTime}</TableCell>
                  <TableCell>{row.slotDurationMinutes}</TableCell>
                  <TableCell>{row.maxPatientsPerSlot}</TableCell>
                  <TableCell>{row.availableSlots}</TableCell>
                  <TableCell>{row.isActive ? 'Yes' : 'No'}</TableCell>
                  <TableCell align="right">
                    <Tooltip title="Edit"><IconButton onClick={() => handleEdit(row)}><EditIcon /></IconButton></Tooltip>
                    <Tooltip title="Delete"><IconButton color="error" onClick={() => handleDelete(row)}><DeleteIcon /></IconButton></Tooltip>
                  </TableCell>
                </TableRow>
              ))}
              {rows.length === 0 && (
                <TableRow><TableCell colSpan={10} align="center">No data</TableCell></TableRow>
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

      <ScheduleForm open={formOpen} onClose={() => setFormOpen(false)} initial={editing} onSubmit={submitForm} doctors={doctors} />

      <Snackbar open={toast.open} autoHideDuration={3000} onClose={() => setToast((t) => ({ ...t, open: false }))}>
        <Alert onClose={() => setToast((t) => ({ ...t, open: false }))} severity={toast.severity} sx={{ width: '100%' }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
