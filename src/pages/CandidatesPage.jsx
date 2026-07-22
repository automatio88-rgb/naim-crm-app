import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import Layout from '../components/layout/Layout'
import Modal from '../components/ui/Modal'
import { PageSpinner } from '../components/ui/Spinner'
import CandidateForm from '../components/candidates/CandidateForm'
import StatusDropdown from '../components/candidates/StatusDropdown'
import { isSupabaseConfigured } from '../supabase/client'
import { getCandidates, updateCandidate, deleteCandidate } from '../services/candidateService'
import { demoCandidatesList } from '../services/demoData'
import { exportToCSV, exportToExcel, exportToPDF } from '../utils/exportUtils'
import { useToast } from '../contexts/ToastContext'
import {
  Users, Plus, Search, ChevronDown, ChevronUp, UserRound, FilePenLine,
  Trash2, FileText, FileSpreadsheet, FileDown, RefreshCw, Settings
} from 'lucide-react'

const STAGE_OPTIONS = ['Onboarding', 'Interviewing', 'Offer', 'Hired', 'Rejected']
const PAGE_SIZE = 10

export default function CandidatesPage() {
  const [searchParams] = useSearchParams()
  const toast = useToast()
  const [loading, setLoading] = useState(true)
  const [candidates, setCandidates] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [stageFilter, setStageFilter] = useState('')
  const [selectedIds, setSelectedIds] = useState([])
  const [expandedId, setExpandedId] = useState(null)
  const [showForm, setShowForm] = useState(searchParams.get('add') === '1')
  const [editCandidate, setEditCandidate] = useState(null)
  const [viewCandidate, setViewCandidate] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)

  useEffect(() => {
    loadCandidates()
  }, [page, stageFilter, search])

  async function loadCandidates() {
    setLoading(true)
    try {
      if (!isSupabaseConfigured) {
        // Demo mode — filter/paginate the local demo dataset
        let list = demoCandidatesList.filter((c) => !c.deleted_at)
        if (search) {
          const q = search.toLowerCase()
          list = list.filter((c) =>
            c.name.toLowerCase().includes(q) ||
            (c.email || '').toLowerCase().includes(q) ||
            (c.country || '').toLowerCase().includes(q) ||
            (c.phone || '').includes(q)
          )
        }
        if (stageFilter) list = list.filter((c) => c.stage === stageFilter)
        setTotal(list.length)
        setCandidates(list.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE))
      } else {
        const result = await getCandidates({ search, stage: stageFilter, page, pageSize: PAGE_SIZE })
        setCandidates(result.data || [])
        setTotal(result.count || 0)
      }
    } catch {
      toast.error('Failed to load candidates')
    } finally {
      setLoading(false)
    }
  }

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  function toggleSelect(id) {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]))
  }

  function toggleSelectAll() {
    setSelectedIds(selectedIds.length === candidates.length ? [] : candidates.map((c) => c.id))
  }

  async function handleStatusChange(id, newStage) {
    setCandidates((prev) => prev.map((c) => (c.id === id ? { ...c, stage: newStage, status: newStage } : c)))
    const demo = demoCandidatesList.find((c) => c.id === id)
    if (demo) { demo.stage = newStage; demo.status = newStage }
    if (isSupabaseConfigured) {
      try {
        await updateCandidate(id, { stage: newStage, status: newStage })
        toast.success(`Status updated to ${newStage}`)
      } catch {
        toast.error('Failed to update status')
      }
    } else {
      toast.success(`Status updated to ${newStage}`)
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return
    if (isSupabaseConfigured) {
      try {
        await deleteCandidate(deleteTarget.id)
      } catch {
        toast.error('Failed to delete candidate')
        setDeleteTarget(null)
        return
      }
    } else {
      const demo = demoCandidatesList.find((c) => c.id === deleteTarget.id)
      if (demo) demo.deleted_at = new Date().toISOString()
    }
    toast.success('Candidate moved to Recycle Bin')
    setDeleteTarget(null)
    loadCandidates()
  }

  function exportRows() {
    const source = isSupabaseConfigured ? candidates : demoCandidatesList.filter((c) => !c.deleted_at)
    return source.map((c) => ({
      Name: c.name,
      Phone: c.phone || '',
      Email: c.email || '',
      Emergency: c.emergency_contact || 'N/A',
      Stage: c.stage || '',
      Salary: c.salary || 'N/A',
      Position: c.position || c.job_title || 'N/A',
      Departure: c.departure || 'Not set',
      Company: c.company || c.work_company || 'N/A',
      Country: c.country || 'N/A',
    }))
  }

  function handleExport(type) {
    const rows = exportRows()
    if (!rows.length) return toast.error('No candidates to export')
    if (type === 'csv') exportToCSV(rows, 'candidates.csv')
    if (type === 'excel') exportToExcel(rows, 'candidates.xlsx')
    if (type === 'pdf') exportToPDF(rows, 'All Candidates', 'candidates.pdf')
    toast.success(`Exported ${rows.length} candidates to ${type.toUpperCase()}`)
  }

  const DetailField = ({ label, value, valueClass = 'text-text-primary' }) => (
    <div className="mb-2.5">
      <span className="text-[13px] text-text-secondary">{label}: </span>
      <span className={`text-[13px] ${valueClass}`}>{value}</span>
    </div>
  )

  return (
    <Layout title="Admin Dashboard">
      <div className="animate-fade-in">
        {/* ── Page header ─────────────────────────────── */}
        <header className="mb-5 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-primary">Candidates</h1>
            <p className="mt-1 max-w-xs text-[13px] leading-snug text-text-secondary">
              Manage and track all candidates in your recruitment pipeline
            </p>
          </div>
          <div className="flex flex-1 flex-wrap items-center justify-end gap-3">
            <div className="flex flex-col items-start gap-2">
              <button
                onClick={() => { toast.success('Standard data synced'); loadCandidates() }}
                className="flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-[13px] font-semibold text-white shadow-sm hover:bg-primary-hover transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
                Sync Standard Data
              </button>
              <button
                onClick={() => toast.success('Auto-Delete settings')}
                className="flex items-center gap-2 rounded-full border border-cream bg-white px-4 py-2 text-[13px] font-medium text-primary shadow-sm hover:bg-cream-warm transition-colors"
              >
                <Settings className="h-4 w-4" />
                Auto-Delete
              </button>
            </div>
            <button
              onClick={() => toast.error('Clear Firebase is disabled in this environment')}
              className="flex items-center gap-2 rounded-full border border-red-200 bg-white px-4 py-2 text-[13px] font-medium text-red-600 shadow-sm hover:bg-red-50 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
              Clear Firebase
            </button>
            <div className="flex items-center gap-2">
              <span className="text-[13px] text-text-secondary">Export All:</span>
              <button onClick={() => handleExport('pdf')} className="flex items-center gap-1.5 rounded-full border border-cream bg-white px-3.5 py-2 text-[13px] font-medium text-primary shadow-sm hover:bg-cream-warm transition-colors">
                <FileText className="h-4 w-4" /> PDF
              </button>
              <button onClick={() => handleExport('excel')} className="flex items-center gap-1.5 rounded-full border border-cream bg-white px-3.5 py-2 text-[13px] font-medium text-primary shadow-sm hover:bg-cream-warm transition-colors">
                <FileSpreadsheet className="h-4 w-4" /> Excel
              </button>
              <button onClick={() => handleExport('csv')} className="flex items-center gap-1.5 rounded-full border border-cream bg-white px-3.5 py-2 text-[13px] font-medium text-primary shadow-sm hover:bg-cream-warm transition-colors">
                <FileDown className="h-4 w-4" /> CSV
              </button>
            </div>
          </div>
        </header>

        {/* ── All Candidates card ─────────────────────── */}
        <section id="all-candidates" className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <h2 className="flex items-center gap-2 text-base font-bold text-primary">
              <Users className="h-5 w-5" />
              All Candidates
            </h2>
            <button
              onClick={() => { setEditCandidate(null); setShowForm(true) }}
              className="flex items-center gap-1.5 rounded-full border border-cream bg-white px-4 py-1.5 text-[13px] font-semibold text-primary shadow-sm hover:bg-cream-warm transition-colors"
            >
              <Plus className="h-4 w-4" /> Add Candidate
            </button>
            <div className="relative flex-1 md:max-w-xs">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                id="candidates-search"
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1) }}
                placeholder="Search names, emails, countries, passports..."
                className="h-9 w-full rounded-full border border-gray-200 bg-white pl-9 pr-3 text-[13px] text-text-primary placeholder-gray-400 outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary/30"
              />
            </div>
            <div className="relative">
              <select
                value={stageFilter}
                onChange={(e) => { setStageFilter(e.target.value); setPage(1) }}
                className="h-9 appearance-none rounded-lg border-none bg-transparent pr-7 pl-2 text-[13px] font-medium text-text-primary outline-none cursor-pointer"
              >
                <option value="">All Stages</option>
                {STAGE_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <ChevronDown className="pointer-events-none absolute right-1.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-primary" />
            </div>
          </div>

          {/* Select all */}
          <label className="mb-3 flex w-fit cursor-pointer items-center gap-2 text-xs text-text-secondary">
            <input
              type="checkbox"
              checked={candidates.length > 0 && selectedIds.length === candidates.length}
              onChange={toggleSelectAll}
              className="h-3.5 w-3.5 rounded border-gray-300 accent-primary"
            />
            Select All on Page
          </label>

          {/* ── Candidate rows ─────────────────────────── */}
          {loading ? (
            <PageSpinner />
          ) : (
            <div className="space-y-2.5">
              {candidates.map((c, i) => {
                const rowNum = (page - 1) * PAGE_SIZE + i + 1
                const expanded = expandedId === c.id
                return (
                  <article key={c.id} className="rounded-xl border border-gray-100 bg-white shadow-sm">
                    <div className="flex items-center gap-2.5 p-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(c.id)}
                        onChange={() => toggleSelect(c.id)}
                        className="h-3.5 w-3.5 shrink-0 rounded border-gray-300 accent-primary"
                      />
                      <span className="flex h-7 w-9 shrink-0 items-center justify-center rounded-md bg-gold-light/25 text-[13px] font-bold text-primary">
                        {rowNum}.
                      </span>
                      <div className="w-44 min-w-0 shrink-0">
                        <p className="truncate text-[13px] font-bold text-primary">{c.name}</p>
                        <p className="truncate text-[11px]">
                          <span className="text-emerald-600">{c.phone}</span>
                          <span className="mx-1 text-gray-300">•</span>
                          <span className="text-blue-600">{(c.email || '').split('@')[0].slice(0, 13)}@...</span>
                        </p>
                      </div>
                      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-text-secondary">
                        <span>Emergency: <span className="font-medium text-text-primary">{c.emergency_contact || 'N/A'}</span></span>
                        <StatusDropdown value={c.stage} onChange={(s) => handleStatusChange(c.id, s)} size="xs" />
                        <span>Position: <span className="font-medium text-text-primary">{c.position || c.job_title || 'N/A'}</span></span>
                        <span>Departure: <span className="font-medium text-text-primary">{c.departure || 'Not set'}</span></span>
                        <span>Company: <span className="font-medium text-text-primary">{c.company || c.work_company || 'N/A'}</span></span>
                        <span>Salary: <span className="font-medium text-text-primary">{c.salary || 'N/A'}</span></span>
                      </div>
                      <div className="flex shrink-0 items-center gap-1">
                        <button onClick={() => setViewCandidate(c)} title="View profile" className="rounded-md p-1.5 text-blue-600 hover:bg-blue-50 transition-colors">
                          <UserRound className="h-4 w-4" />
                        </button>
                        <button onClick={() => { setEditCandidate(c); setShowForm(true) }} title="Edit" className="rounded-md p-1.5 text-blue-600 hover:bg-blue-50 transition-colors">
                          <FilePenLine className="h-4 w-4" />
                        </button>
                        <button onClick={() => setDeleteTarget(c)} title="Delete" className="rounded-md p-1.5 text-red-500 hover:bg-red-50 transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setExpandedId(expanded ? null : c.id)}
                          title={expanded ? 'Collapse' : 'Expand'}
                          className="rounded-md p-1.5 text-gray-400 hover:bg-cream-warm hover:text-primary transition-colors"
                        >
                          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    {/* ── Expanded details panel ──────────── */}
                    {expanded && (
                      <div className="mx-3 mb-3 rounded-xl border border-gray-100 bg-white p-5 shadow-sm animate-fade-in">
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                          <div>
                            <h3 className="mb-3 text-[13px] font-bold text-primary">Contact Information</h3>
                            <DetailField label="Email" value={c.email || 'N/A'} valueClass="text-blue-600" />
                            <DetailField label="Phone" value={c.phone || 'N/A'} valueClass="text-emerald-600" />
                            <DetailField label="Emergency Contact" value={c.emergency_contact || 'N/A'} />
                          </div>
                          <div>
                            <h3 className="mb-3 text-[13px] font-bold text-primary">Work Details</h3>
                            <DetailField label="Position" value={c.position || c.job_title || 'N/A'} />
                            <DetailField label="Company" value={c.company || c.work_company || 'N/A'} />
                            <DetailField label="City" value={c.city || 'N/A'} />
                            <DetailField label="Country" value={c.country || 'N/A'} />
                            <DetailField label="Salary" value={c.salary || 'N/A'} />
                          </div>
                          <div>
                            <h3 className="mb-3 text-[13px] font-bold text-primary">Additional Information</h3>
                            <div className="mb-2.5">
                              <span className="text-[13px] text-text-secondary">Stage: </span>
                              <div className="mt-1 inline-block">
                                <StatusDropdown value={c.stage} onChange={(s) => handleStatusChange(c.id, s)} size="xs" />
                              </div>
                            </div>
                            <DetailField label="Departure" value={c.departure || 'Not set'} />
                            <DetailField label="Added" value={c.added || 'Invalid Date'} />
                            <div>
                              <p className="text-[13px] text-text-secondary">Notes:</p>
                              <p className="mt-1 text-[13px] font-medium uppercase leading-relaxed text-text-primary">
                                {c.notes || '—'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </article>
                )
              })}
              {candidates.length === 0 && (
                <p className="py-10 text-center text-sm text-text-muted">No candidates found</p>
              )}
            </div>
          )}

          {/* ── Pagination ─────────────────────────────── */}
          <footer className="mt-5 flex items-center justify-between">
            <p className="text-[13px] text-text-secondary">Page {page} of {totalPages}</p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="rounded-full border border-cream bg-white px-5 py-2 text-[13px] font-medium text-primary shadow-sm hover:bg-cream-warm transition-colors disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="rounded-full border border-cream bg-white px-5 py-2 text-[13px] font-medium text-primary shadow-sm hover:bg-cream-warm transition-colors disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </footer>
        </section>
      </div>

      {/* ── Add / Edit modal ──────────────────────────── */}
      <Modal isOpen={showForm} onClose={() => { setShowForm(false); setEditCandidate(null) }} title={editCandidate ? 'Edit Candidate' : 'Add Candidate'} size="xl">
        <CandidateForm
          candidate={editCandidate}
          onSave={() => { setShowForm(false); setEditCandidate(null); loadCandidates() }}
          onCancel={() => { setShowForm(false); setEditCandidate(null) }}
        />
      </Modal>

      {/* ── View profile modal ────────────────────────── */}
      <Modal isOpen={!!viewCandidate} onClose={() => setViewCandidate(null)} title="Candidate Profile" size="lg">
        {viewCandidate && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-white">
                {viewCandidate.name?.charAt(0)}
              </div>
              <div>
                <p className="font-bold text-text-primary">{viewCandidate.name}</p>
                <StatusDropdown value={viewCandidate.stage} onChange={(s) => { handleStatusChange(viewCandidate.id, s); setViewCandidate({ ...viewCandidate, stage: s }) }} size="xs" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <p><span className="text-text-secondary">Email:</span> <span className="text-blue-600">{viewCandidate.email || 'N/A'}</span></p>
              <p><span className="text-text-secondary">Phone:</span> <span className="text-emerald-600">{viewCandidate.phone || 'N/A'}</span></p>
              <p><span className="text-text-secondary">Position:</span> {viewCandidate.position || 'N/A'}</p>
              <p><span className="text-text-secondary">Company:</span> {viewCandidate.company || 'N/A'}</p>
              <p><span className="text-text-secondary">Country:</span> {viewCandidate.country || 'N/A'}</p>
              <p><span className="text-text-secondary">Salary:</span> {viewCandidate.salary || 'N/A'}</p>
            </div>
            {viewCandidate.notes && (
              <div>
                <p className="text-sm text-text-secondary">Notes:</p>
                <p className="text-sm uppercase text-text-primary">{viewCandidate.notes}</p>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* ── Delete confirm modal ──────────────────────── */}
      <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Candidate" size="sm">
        <p className="text-sm text-text-secondary">
          Are you sure you want to delete <span className="font-bold text-text-primary">{deleteTarget?.name}</span>? The candidate will be moved to the Recycle Bin.
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <button onClick={() => setDeleteTarget(null)} className="rounded-full border border-cream bg-white px-4 py-2 text-[13px] font-medium text-text-primary hover:bg-cream-warm transition-colors">
            Cancel
          </button>
          <button onClick={confirmDelete} className="rounded-full bg-red-600 px-4 py-2 text-[13px] font-semibold text-white hover:bg-red-700 transition-colors">
            Delete
          </button>
        </div>
      </Modal>
    </Layout>
  )
}
