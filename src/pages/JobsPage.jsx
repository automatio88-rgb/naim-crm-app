import { useState, useEffect } from 'react'
import Layout from '../components/layout/Layout'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Select from '../components/ui/Select'
import Textarea from '../components/ui/Textarea'
import Modal from '../components/ui/Modal'
import Table, { Pagination } from '../components/ui/Table'
import Badge from '../components/ui/Badge'
import { PageSpinner } from '../components/ui/Spinner'
import { getJobs, addJob, updateJob, deleteJob } from '../services/jobService'
import { COUNTRIES, JOB_STATUSES } from '../utils/constants'
import { formatDate } from '../utils/dateUtils'
import { useToast } from '../contexts/ToastContext'
import { Plus, Search, Briefcase, Trash2 } from 'lucide-react'

export default function JobsPage() {
  const toast = useToast()
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editJob, setEditJob] = useState(null)
  const [form, setForm] = useState({ title: '', description: '', country: '', salary_min: '', salary_max: '', currency: 'KWD', status: 'Active', requirements: '' })

  const pageSize = 20

  useEffect(() => { loadJobs() }, [page, statusFilter])

  async function loadJobs() {
    setLoading(true)
    try {
      const result = await getJobs({ search, status: statusFilter, page, pageSize })
      setJobs(result.data)
      setTotal(result.count)
    } catch { toast.error('Failed to load jobs') }
    finally { setLoading(false) }
  }

  function openForm(job = null) {
    if (job) { setEditJob(job); setForm(job) }
    else { setEditJob(null); setForm({ title: '', description: '', country: '', salary_min: '', salary_max: '', currency: 'KWD', status: 'Active', requirements: '' }) }
    setShowForm(true)
  }

  async function handleSave(e) {
    e.preventDefault()
    if (!form.title) return toast.error('Title is required')
    try {
      if (editJob) { await updateJob(editJob.id, form); toast.success('Job updated!') }
      else { await addJob(form); toast.success('Job created!') }
      setShowForm(false); loadJobs()
    } catch (err) { toast.error(err.message) }
  }

  async function handleDelete(id) {
    if (!confirm('Move job to recycle bin?')) return
    try { await deleteJob(id); toast.success('Job deleted'); loadJobs() }
    catch { toast.error('Delete failed') }
  }

  const statusVariant = { Active: 'success', Draft: 'warning', Closed: 'danger' }

  const columns = [
    { header: 'Title', accessor: 'title', render: (r) => <p className="font-medium">{r.title}</p> },
    { header: 'Country', accessor: 'country', render: (r) => <span className="text-text-secondary">{r.country || '-'}</span> },
    { header: 'Salary', accessor: 'salary_min', render: (r) => <span className="text-text-secondary">{r.salary_min ? `${r.salary_min} - ${r.salary_max || ''} ${r.currency || ''}` : '-'}</span> },
    { header: 'Status', accessor: 'status', render: (r) => <Badge variant={statusVariant[r.status] || 'default'}>{r.status}</Badge> },
    { header: 'Created', accessor: 'created_at', render: (r) => <span className="text-xs text-text-muted">{formatDate(r.created_at)}</span> },
    { header: '', render: (r) => (
      <div className="flex gap-1">
        <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); openForm(r) }}>Edit</Button>
        <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); handleDelete(r.id) }} className="text-danger"><Trash2 className="h-4 w-4" /></Button>
      </div>
    )},
  ]

  return (
    <Layout title="Jobs">
      <div className="space-y-4 animate-fade-in">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <form onSubmit={(e) => { e.preventDefault(); setPage(1); loadJobs() }} className="flex items-center gap-2">
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search jobs..." className="w-64 rounded-lg border border-cream bg-white py-2 pl-3 pr-3 text-sm focus:border-primary focus:outline-none" />
              <Button type="submit" size="sm">Search</Button>
            </form>
            <Select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }} options={JOB_STATUSES} placeholder="All statuses" className="w-36" />
          </div>
          <Button size="sm" onClick={() => openForm()}><Plus className="h-4 w-4" /> New Job</Button>
        </div>

        {loading ? <PageSpinner /> : (
          <>
            <Table columns={columns} data={jobs} onRowClick={(r) => openForm(r)} emptyMessage="No jobs found. Create your first job posting!" />
            <Pagination page={page} pageSize={pageSize} total={total} onPageChange={setPage} />
          </>
        )}
      </div>

      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title={editJob ? 'Edit Job' : 'New Job'} size="lg">
        <form onSubmit={handleSave} className="space-y-4">
          <Input label="Job Title *" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          <Select label="Country" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} options={COUNTRIES} placeholder="Select country" />
          <div className="grid grid-cols-3 gap-3">
            <Input label="Min Salary" value={form.salary_min} onChange={(e) => setForm({ ...form, salary_min: e.target.value })} />
            <Input label="Max Salary" value={form.salary_max} onChange={(e) => setForm({ ...form, salary_max: e.target.value })} />
            <Select label="Currency" value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })} options={['KES', 'USD', 'KWD', 'SAR', 'AED', 'QAR']} />
          </div>
          <Select label="Status" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} options={JOB_STATUSES} />
          <Textarea label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <Textarea label="Requirements" value={form.requirements} onChange={(e) => setForm({ ...form, requirements: e.target.value })} />
          <div className="flex justify-end gap-3 border-t border-cream pt-4">
            <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button type="submit">{editJob ? 'Update' : 'Create'} Job</Button>
          </div>
        </form>
      </Modal>
    </Layout>
  )
}
