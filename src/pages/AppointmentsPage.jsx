import { useState, useEffect } from 'react'
import Layout from '../components/layout/Layout'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Select from '../components/ui/Select'
import Textarea from '../components/ui/Textarea'
import Modal from '../components/ui/Modal'
import Table, { Pagination } from '../components/ui/Table'
import Badge from '../components/ui/Badge'
import { PageSpinner } from '../components/ui/Spinner'
import { getAppointments, addAppointment, updateAppointment, deleteAppointment } from '../services/appointmentService'
import { APPOINTMENT_STATUSES } from '../utils/constants'
import { formatDate, formatDateTime } from '../utils/dateUtils'
import { useToast } from '../contexts/ToastContext'
import { Plus, Calendar, Trash2 } from 'lucide-react'

export default function AppointmentsPage() {
  const toast = useToast()
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editAppt, setEditAppt] = useState(null)
  const [form, setForm] = useState({ title: '', candidate_id: '', date: '', time: '', status: 'Scheduled', notes: '', type: 'Interview' })

  const pageSize = 20

  useEffect(() => { loadAppointments() }, [page, statusFilter])

  async function loadAppointments() {
    setLoading(true)
    try {
      const result = await getAppointments({ status: statusFilter, page, pageSize })
      setAppointments(result.data)
      setTotal(result.count)
    } catch { toast.error('Failed to load appointments') }
    finally { setLoading(false) }
  }

  function openForm(appt = null) {
    if (appt) { setEditAppt(appt); setForm(appt) }
    else { setEditAppt(null); setForm({ title: '', candidate_id: '', date: '', time: '', status: 'Scheduled', notes: '', type: 'Interview' }) }
    setShowForm(true)
  }

  async function handleSave(e) {
    e.preventDefault()
    if (!form.title || !form.date) return toast.error('Title and date are required')
    try {
      if (editAppt) { await updateAppointment(editAppt.id, form); toast.success('Appointment updated!') }
      else { await addAppointment(form); toast.success('Appointment scheduled!') }
      setShowForm(false); loadAppointments()
    } catch (err) { toast.error(err.message) }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this appointment?')) return
    try { await deleteAppointment(id); toast.success('Deleted'); loadAppointments() }
    catch { toast.error('Delete failed') }
  }

  const statusVariant = { Scheduled: 'info', Completed: 'success', Cancelled: 'danger', Rescheduled: 'warning' }

  const columns = [
    { header: 'Title', accessor: 'title', render: (r) => <p className="font-medium">{r.title}</p> },
    { header: 'Candidate', render: (r) => <span className="text-text-secondary">{r.candidates?.name || '-'}</span> },
    { header: 'Date', accessor: 'date', render: (r) => <span className="text-text-secondary">{formatDate(r.date)}</span> },
    { header: 'Time', accessor: 'time', render: (r) => <span className="text-text-secondary">{r.time || '-'}</span> },
    { header: 'Type', accessor: 'type', render: (r) => <span className="text-text-secondary">{r.type || '-'}</span> },
    { header: 'Status', accessor: 'status', render: (r) => <Badge variant={statusVariant[r.status] || 'default'}>{r.status}</Badge> },
    { header: '', render: (r) => (
      <div className="flex gap-1">
        <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); openForm(r) }}>Edit</Button>
        <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); handleDelete(r.id) }} className="text-danger"><Trash2 className="h-4 w-4" /></Button>
      </div>
    )},
  ]

  return (
    <Layout title="Appointments">
      <div className="space-y-4 animate-fade-in">
        <div className="flex items-center justify-between">
          <Select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }} options={APPOINTMENT_STATUSES} placeholder="All statuses" className="w-44" />
          <Button size="sm" onClick={() => openForm()}><Plus className="h-4 w-4" /> Schedule Appointment</Button>
        </div>
        {loading ? <PageSpinner /> : (
          <>
            <Table columns={columns} data={appointments} onRowClick={(r) => openForm(r)} emptyMessage="No appointments scheduled." />
            <Pagination page={page} pageSize={pageSize} total={total} onPageChange={setPage} />
          </>
        )}
      </div>

      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title={editAppt ? 'Edit Appointment' : 'Schedule Appointment'}>
        <form onSubmit={handleSave} className="space-y-4">
          <Input label="Title *" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Date *" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
            <Input label="Time" type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
          </div>
          <Select label="Type" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} options={['Interview', 'Follow-up', 'Medical', 'Document Collection', 'Visa', 'Other']} />
          <Select label="Status" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} options={APPOINTMENT_STATUSES} />
          <Textarea label="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          <div className="flex justify-end gap-3 border-t border-cream pt-4">
            <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button type="submit">{editAppt ? 'Update' : 'Schedule'}</Button>
          </div>
        </form>
      </Modal>
    </Layout>
  )
}
