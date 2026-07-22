import { useState, useEffect, useRef } from 'react'
import Layout from '../components/layout/Layout'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Select from '../components/ui/Select'
import EmptyState from '../components/ui/EmptyState'
import { PageSpinner } from '../components/ui/Spinner'
import { getDocuments, uploadDocument, deleteDocument, downloadDocument } from '../services/documentService'
import { DOCUMENT_TYPES } from '../utils/constants'
import { useToast } from '../contexts/ToastContext'
import { Upload, FileText, Download, Trash2, FolderOpen } from 'lucide-react'

export default function DocumentsPage() {
  const toast = useToast()
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)
  const [typeFilter, setTypeFilter] = useState('')
  const [uploading, setUploading] = useState(false)
  const [candidateId, setCandidateId] = useState('')
  const [docType, setDocType] = useState('Passport')
  const fileRef = useRef(null)

  useEffect(() => { loadDocuments() }, [typeFilter])

  async function loadDocuments() {
    setLoading(true)
    try {
      const result = await getDocuments({ documentType: typeFilter || undefined })
      setDocuments(result)
    } catch { toast.error('Failed to load documents') }
    finally { setLoading(false) }
  }

  async function handleUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return
    if (!candidateId) return toast.error('Enter a candidate ID first')
    setUploading(true)
    try {
      await uploadDocument(file, candidateId, docType)
      toast.success('Document uploaded!')
      loadDocuments()
      if (fileRef.current) fileRef.current.value = ''
    } catch (err) { toast.error(err.message) }
    finally { setUploading(false) }
  }

  async function handleDelete(id, filePath) {
    if (!confirm('Delete this document?')) return
    try { await deleteDocument(id, filePath); toast.success('Deleted'); loadDocuments() }
    catch { toast.error('Delete failed') }
  }

  function formatSize(bytes) {
    if (!bytes) return ''
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / 1048576).toFixed(1) + ' MB'
  }

  return (
    <Layout title="Documents">
      <div className="space-y-6 animate-fade-in">
        <Card>
          <h3 className="mb-3 text-sm font-semibold text-primary">Upload Document</h3>
          <div className="flex flex-wrap items-end gap-3">
            <input type="text" value={candidateId} onChange={(e) => setCandidateId(e.target.value)} placeholder="Candidate ID" className="w-40 rounded-lg border border-cream bg-white px-3 py-2 text-sm focus:border-primary focus:outline-none" />
            <Select value={docType} onChange={(e) => setDocType(e.target.value)} options={DOCUMENT_TYPES} className="w-48" />
            <div>
              <input ref={fileRef} type="file" onChange={handleUpload} className="hidden" id="file-upload" />
              <Button onClick={() => fileRef.current?.click()} loading={uploading} size="sm">
                <Upload className="h-4 w-4" /> Choose File
              </Button>
            </div>
          </div>
        </Card>

        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">All Documents</h3>
          <Select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} options={DOCUMENT_TYPES} placeholder="All types" className="w-48" />
        </div>

        {loading ? <PageSpinner /> : documents.length === 0 ? (
          <EmptyState icon={FolderOpen} title="No documents" description="Upload your first document above." />
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {documents.map((doc) => (
              <Card key={doc.id} className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-text-primary">{doc.file_name}</p>
                  <p className="text-xs text-text-muted">{doc.document_type} &middot; {formatSize(doc.file_size)}</p>
                  <div className="mt-2 flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => downloadDocument(doc.file_path, doc.file_name)}>
                      <Download className="h-3.5 w-3.5" /> Download
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(doc.id, doc.file_path)} className="text-danger">
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}
