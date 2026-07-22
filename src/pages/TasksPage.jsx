import { useState, useEffect } from 'react'
import Layout from '../components/layout/Layout'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Select from '../components/ui/Select'
import Textarea from '../components/ui/Textarea'
import Modal from '../components/ui/Modal'
import Table, { Pagination } from '../components/ui/Table'
import Badge from '../components/ui/Badge'
import Tabs from '../components/ui/Tabs'
import { PageSpinner } from '../components/ui/Spinner'
import { getTasks, addTask, updateTask, deleteTask } from '../services/taskService'
import { TASK_STATUSES, TASK_PRIORITIES } from '../utils/constants'
import { formatDate } from '../utils/dateUtils'
import { useToast } from '../contexts/ToastContext'
import { Plus, Trash2, CheckSquare, Clock, AlertTriangle } from 'lucide-react'

export default function TasksPage() {
  const toast = useToast()
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState('')
  const [tab, setTab] = useState('all')
  const [showForm, setShowForm] = useState(false)
  const [editTask, setEditTask] = useState(null)
  const [form, setForm] = useState({ title: '', description: '', status: 'Pending', priority: 'Medium', due_date: '' })

  const pageSize = 20

  useEffect(() => {
    const s = tab === 'all' ? '' : tab
    setStatusFilter(s)
    setPage(1)
  }, [tab])

  useEffect(() => { loadTasks() }, [page, statusFilter])

  async function loadTasks() {
    setLoading(true)
    try {
      const result = await getTasks({ status: statusFilter, page, pageSize })
      setTasks(result.data)
      setTotal(result.count)
    } catch { toast.error('Failed to load tasks') }
    finally { setLoading(false) }
  }

  function openForm(task = null) {
    if (task) { setEditTask(task); setForm(task) }
    else { setEditTask(null); setForm({ title: '', description: '', status: 'Pending', priority: 'Medium', due_date: '' }) }
    setShowForm(true)
  }

  async function handleSave(e) {
    e.preventDefault()
    if (!form.title) return toast.error('Title is required')
    try {
      if (editTask) { await updateTask(editTask.id, form); toast.success('Task updated!') }
      else { await addTask(form); toast.success('Task created!') }
      setShowForm(false); loadTasks()
    } catch (err) { toast.error(err.message) }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this task?')) return
    try { await deleteTask(id); toast.success('Deleted'); loadTasks() }
    catch { toast.error('Delete failed') }
  }

  async function quickStatusChange(id, status) {
    try { await updateTask(id, { status }); toast.success(`Task marked as ${status}`); loadTasks() }
    catch { toast.error('Update failed') }
  }

  const statusVariant = { Pending: 'warning', 'In Progress': 'info', Completed: 'success', Overdue: 'danger' }
  const priorityVariant = { Low: 'default', Medium: 'warning', High: 'danger', Urgent: 'danger' }

  const columns = [
    { header: 'Title', accessor: 'title', render: (r) => <p className="font-medium">{r.title}</p> },
    { header: 'Priority', accessor: 'priority', render: (r) => <Badge variant={priorityVariant[r.priority] || 'default'}>{r.priority}</Badge> },
    { header: 'Status', accessor: 'status', render: (r) => <Badge variant={statusVariant[r.status] || 'default'}>{r.status}</Badge> },
    { header: 'Due Date', accessor: 'due_date', render: (r) => <span className="text-text-secondary">{formatDate(r.due_date) || 'No due date'}</span> },
    { header: '', render: (r) => (
      <div className="flex gap-1">
        {r.status !== 'Completed' && (
          <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); quickStatusChange(r.id, 'Completed') }} className="text-success">
            <CheckSquare className="h-4 w-4" />
          </Button>
        )}
        <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); openForm(r) }}>Edit</Button>
        <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); handleDelete(r.id) }} className="text-danger"><Trash2 className="h-4 w-4" /></Button>
      </div>
    )},
  ]

  const tabs = [
    { id: 'all', label: 'All Tasks', icon: CheckSquare },
    { id: 'Pending', label: 'Pending', icon: Clock },
    { id: 'In Progress', label: 'In Progress', icon: AlertTriangle },
    { id: 'Completed', label: 'Completed', icon: CheckSquare },
  ]

  return (
    <Layout title="Tasks">
      <div className="space-y-4 animate-fade-in">
        <div className="flex items-center justify-between">
          <Tabs tabs={tabs} defaultTab={tab} onChange={setTab} />
          <Button size="sm" onClick={() => openForm()}><Plus className="h-4 w-4" /> New Task</Button>
        </div>

        {loading ? <PageSpinner /> : (
          <>
            <Table columns={columns} data={tasks} onRowClick={(r) => openForm(r)} emptyMessage="No tasks found." />
            <Pagination page={page} pageSize={pageSize} total={total} onPageChange={setPage} />
          </>
        )}
      </div>

      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title={editTask ? 'Edit Task' : 'New Task'}>
        <form onSubmit={handleSave} className="space-y-4">
          <Input label="Title *" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          <Textarea label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <div className="grid grid-cols-2 gap-3">
            <Select label="Status" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} options={TASK_STATUSES} />
            <Select label="Priority" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} options={TASK_PRIORITIES} />
          </div>
          <Input label="Due Date" type="date" value={form.due_date} onChange={(e) => setForm({ ...form, due_date: e.target.value })} />
          <div className="flex justify-end gap-3 border-t border-cream pt-4">
            <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button type="submit">{editTask ? 'Update' : 'Create'} Task</Button>
          </div>
        </form>
      </Modal>
    </Layout>
  )
}
