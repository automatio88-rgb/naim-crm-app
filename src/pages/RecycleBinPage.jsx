import { useState, useEffect } from 'react'
import Layout from '../components/layout/Layout'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Table from '../components/ui/Table'
import { PageSpinner } from '../components/ui/Spinner'
import EmptyState from '../components/ui/EmptyState'
import { getDeletedCandidates, restoreCandidate, permanentDeleteCandidate } from '../services/candidateService'
import { formatDate } from '../utils/dateUtils'
import { useToast } from '../contexts/ToastContext'
import { Trash2, RotateCcw, AlertTriangle } from 'lucide-react'

export default function RecycleBinPage() {
  const toast = useToast()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadItems() }, [])

  async function loadItems() {
    setLoading(true)
    try { const data = await getDeletedCandidates(); setItems(data) }
    catch { toast.error('Failed to load') }
    finally { setLoading(false) }
  }

  async function handleRestore(id) {
    try { await restoreCandidate(id); toast.success('Restored!'); loadItems() }
    catch { toast.error('Restore failed') }
  }

  async function handlePermanentDelete(id) {
    if (!confirm('Permanently delete? This cannot be undone.')) return
    try { await permanentDeleteCandidate(id); toast.success('Permanently deleted'); loadItems() }
    catch { toast.error('Delete failed') }
  }

  const columns = [
    { header: 'Name', render: (r) => <p className="font-medium">{r.name}</p> },
    { header: 'Email', render: (r) => <span className="text-text-secondary">{r.email || '-'}</span> },
    { header: 'Stage', render: (r) => <span className="text-text-secondary">{r.stage}</span> },
    { header: 'Deleted', render: (r) => <span className="text-xs text-text-muted">{formatDate(r.deleted_at)}</span> },
    { header: '', render: (r) => (
      <div className="flex gap-2">
        <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); handleRestore(r.id) }} className="text-success"><RotateCcw className="h-4 w-4" /> Restore</Button>
        <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); handlePermanentDelete(r.id) }} className="text-danger"><Trash2 className="h-4 w-4" /> Delete</Button>
      </div>
    )},
  ]

  return (
    <Layout title="Recycle Bin">
      <div className="space-y-4 animate-fade-in">
        <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-700">
          <AlertTriangle className="h-4 w-4" /> Deleted items are kept for 30 days before permanent removal.
        </div>
        {loading ? <PageSpinner /> : items.length === 0 ? (
          <EmptyState icon={Trash2} title="Recycle bin is empty" description="No deleted items to show." />
        ) : (
          <Table columns={columns} data={items} emptyMessage="No deleted items." />
        )}
      </div>
    </Layout>
  )
}
