import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import Layout from '../components/layout/Layout'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Select from '../components/ui/Select'
import Modal from '../components/ui/Modal'
import Table, { Pagination } from '../components/ui/Table'
import { StageBadge } from '../components/ui/Badge'
import Spinner, { PageSpinner } from '../components/ui/Spinner'
import EmptyState from '../components/ui/EmptyState'
import CandidateForm from '../components/candidates/CandidateForm'
import { getCandidates, addCandidate, updateCandidate, deleteCandidate, bulkUpdateCandidates } from '../services/candidateService'
import { CANDIDATE_STAGES, COUNTRIES } from '../utils/constants'
import { exportToCSV, exportToExcel } from '../utils/exportUtils'
import { formatDate } from '../utils/dateUtils'
import { Plus, Search, Filter, Download, Trash2, ArrowUpDown, Users } from 'lucide-react'
import { useToast } from '../contexts/ToastContext'

export default function CandidatesPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const toast = useToast()
  const [candidates, setCandidates] = useState([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [stageFilter, setStageFilter] = useState(searchParams.get('stage') || '')
  const [countryFilter, setCountryFilter] = useState(searchParams.get('country') || '')
  const [sortBy, setSortBy] = useState('created_at')
  const [sortDir, setSortDir] = useState('desc')
  const [selectedIds, setSelectedIds] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editCandidate, setEditCandidate] = useState(null)
  const [showFilters, setShowFilters] = useState(false)

  const pageSize = 20

  useEffect(() => {
    loadCandidates()
  }, [page, stageFilter, countryFilter, sortBy, sortDir])

  async function loadCandidates() {
    setLoading(true)
    try {
      const result = await getCandidates({
        search,
        stage: stageFilter,
        country: countryFilter,
        page,
        pageSize,
        sortBy,
        sortDir,
      })
      setCandidates(result.data)
      setTotal(result.count)
    } catch (err) {
      toast.error('Failed to load candidates')
    } finally {
      setLoading(false)
    }
  }

  function handleSearch(e) {
    e.preventDefault()
    setPage(1)
    loadCandidates()
  }

  function handleSort(column) {
    if (sortBy === column) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(column)
      setSortDir('asc')
    }
  }

  function toggleSelect(id) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  function toggleSelectAll() {
    if (selectedIds.length === candidates.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(candidates.map((c) => c.id))
    }
  }

  async function handleBulkStageChange(newStage) {
    if (!selectedIds.length) return
    try {
      await bulkUpdateCandidates(selectedIds, { stage: newStage })
      toast.success(`${selectedIds.length} candidates moved to ${newStage}`)
      setSelectedIds([])
      loadCandidates()
    } catch (err) {
      toast.error('Bulk update failed')
    }
  }

  async function handleDelete(id) {
    if (!confirm('Move this candidate to recycle bin?')) return
    try {
      await deleteCandidate(id)
      toast.success('Candidate moved to recycle bin')
      loadCandidates()
    } catch (err) {
      toast.error('Delete failed')
    }
  }

  function handleExport(format) {
    const exportData = candidates.map((c) => ({
      Name: c.name,
      Email: c.email,
      Phone: c.phone,
      Stage: c.stage,
      Country: c.country_applying_to,
      Nationality: c.nationality,
      JobTitle: c.job_title,
      Created: formatDate(c.created_at),
    }))
    if (format === 'csv') exportToCSV(exportData, 'candidates.csv')
    else exportToExcel(exportData, 'candidates.xlsx')
    toast.success(`Exported ${exportData.length} candidates`)
  }

  function handleEdit(candidate) {
    setEditCandidate(candidate)
    setShowForm(true)
  }

  function handleFormClose() {
    setShowForm(false)
    setEditCandidate(null)
  }

  function handleFormSave() {
    handleFormClose()
    loadCandidates()
  }

  const columns = [
    {
      header: (
        <input
          type="checkbox"
          checked={selectedIds.length === candidates.length && candidates.length > 0}
          onChange={toggleSelectAll}
          className="rounded border-cream"
        />
      ),
      render: (row) => (
        <input
          type="checkbox"
          checked={selectedIds.includes(row.id)}
          onChange={() => toggleSelect(row.id)}
          onClick={(e) => e.stopPropagation()}
          className="rounded border-cream"
        />
      ),
    },
    {
      header: 'Name',
      accessor: 'name',
      render: (row) => (
        <div>
          <p className="font-medium text-text-primary">{row.name}</p>
          <p className="text-xs text-text-muted">{row.email}</p>
        </div>
      ),
    },
    {
      header: 'Phone',
      accessor: 'phone',
      render: (row) => <span className="text-text-secondary">{row.phone || '-'}</span>,
    },
    {
      header: 'Stage',
      accessor: 'stage',
      render: (row) => <StageBadge stage={row.stage} />,
    },
    {
      header: 'Country',
      accessor: 'country_applying_to',
      render: (row) => <span className="text-text-secondary">{row.country_applying_to || '-'}</span>,
    },
    {
      header: 'Job Title',
      accessor: 'job_title',
      render: (row) => <span className="text-text-secondary">{row.job_title || '-'}</span>,
    },
    {
      header: 'Created',
      accessor: 'created_at',
      render: (row) => <span className="text-xs text-text-muted">{formatDate(row.created_at)}</span>,
    },
    {
      header: '',
      render: (row) => (
        <div className="flex gap-1">
          <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); handleEdit(row) }}>Edit</Button>
          <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); handleDelete(row.id) }} className="text-danger hover:text-danger">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <Layout title="Candidates">
      <div className="space-y-4 animate-fade-in">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <form onSubmit={handleSearch} className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search candidates..."
                className="w-64 rounded-lg border border-cream bg-white py-2 pl-9 pr-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <Button type="submit" size="sm">Search</Button>
          </form>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)}>
              <Filter className="h-4 w-4" /> Filters
            </Button>

            <div className="relative group">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4" /> Export
              </Button>
              <div className="absolute right-0 top-full z-10 mt-1 hidden w-32 rounded-lg border border-cream bg-white py-1 shadow-lg group-hover:block">
                <button onClick={() => handleExport('csv')} className="block w-full px-3 py-2 text-left text-sm hover:bg-cream">CSV</button>
                <button onClick={() => handleExport('xlsx')} className="block w-full px-3 py-2 text-left text-sm hover:bg-cream">Excel</button>
              </div>
            </div>

            <Button size="sm" onClick={() => { setEditCandidate(null); setShowForm(true) }}>
              <Plus className="h-4 w-4" /> Add Candidate
            </Button>
          </div>
        </div>

        {showFilters && (
          <Card className="flex flex-wrap items-end gap-3 animate-fade-in">
            <Select
              label="Stage"
              value={stageFilter}
              onChange={(e) => { setStageFilter(e.target.value); setPage(1) }}
              options={CANDIDATE_STAGES}
              placeholder="All stages"
              className="w-44"
            />
            <Select
              label="Country"
              value={countryFilter}
              onChange={(e) => { setCountryFilter(e.target.value); setPage(1) }}
              options={COUNTRIES}
              placeholder="All countries"
              className="w-44"
            />
            <Button variant="ghost" size="sm" onClick={() => { setStageFilter(''); setCountryFilter(''); setPage(1) }}>
              Clear Filters
            </Button>
          </Card>
        )}

        {selectedIds.length > 0 && (
          <div className="flex items-center gap-3 rounded-lg border border-primary/20 bg-primary/5 px-4 py-2 animate-fade-in">
            <span className="text-sm font-medium text-primary">{selectedIds.length} selected</span>
            <Select
              options={CANDIDATE_STAGES}
              placeholder="Change stage to..."
              onChange={(e) => e.target.value && handleBulkStageChange(e.target.value)}
              className="w-44"
            />
            <Button variant="ghost" size="sm" onClick={() => setSelectedIds([])}>Clear</Button>
          </div>
        )}

        {loading ? (
          <PageSpinner />
        ) : (
          <>
            <Table columns={columns} data={candidates} onRowClick={handleEdit} emptyMessage="No candidates found. Add your first candidate!" />
            <Pagination page={page} pageSize={pageSize} total={total} onPageChange={setPage} />
          </>
        )}
      </div>

      <Modal isOpen={showForm} onClose={handleFormClose} title={editCandidate ? 'Edit Candidate' : 'Add Candidate'} size="lg">
        <CandidateForm candidate={editCandidate} onSave={handleFormSave} onCancel={handleFormClose} />
      </Modal>
    </Layout>
  )
}
