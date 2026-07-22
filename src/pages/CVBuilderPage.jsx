import { useState, useEffect } from 'react'
import Layout from '../components/layout/Layout'
import Card, { CardTitle } from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Textarea from '../components/ui/Textarea'
import Modal from '../components/ui/Modal'
import EmptyState from '../components/ui/EmptyState'
import { PageSpinner } from '../components/ui/Spinner'
import { getCVDrafts, addCVDraft, updateCVDraft, deleteCVDraft } from '../services/cvDraftService'
import { useToast } from '../contexts/ToastContext'
import { FileEdit, Plus, Trash2, Eye } from 'lucide-react'

const TEMPLATES = [
  { id: 'professional', name: 'Professional', description: 'Clean, traditional CV layout' },
  { id: 'modern', name: 'Modern', description: 'Contemporary design with sidebar' },
  { id: 'minimal', name: 'Minimal', description: 'Simple, elegant layout' },
]

export default function CVBuilderPage() {
  const toast = useToast()
  const [drafts, setDrafts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showEditor, setShowEditor] = useState(false)
  const [editDraft, setEditDraft] = useState(null)
  const [form, setForm] = useState({
    title: '', template: 'professional', full_name: '', email: '', phone: '',
    objective: '', experience: '', education: '', skills: '', languages: '', references: '',
  })

  useEffect(() => { loadDrafts() }, [])

  async function loadDrafts() {
    setLoading(true)
    try { const data = await getCVDrafts(); setDrafts(data) }
    catch { toast.error('Failed to load drafts') }
    finally { setLoading(false) }
  }

  function openEditor(draft = null) {
    if (draft) { setEditDraft(draft); setForm(draft) }
    else { setEditDraft(null); setForm({ title: '', template: 'professional', full_name: '', email: '', phone: '', objective: '', experience: '', education: '', skills: '', languages: '', references: '' }) }
    setShowEditor(true)
  }

  async function handleSave() {
    if (!form.title) return toast.error('Title is required')
    try {
      if (editDraft) { await updateCVDraft(editDraft.id, form); toast.success('CV updated!') }
      else { await addCVDraft(form); toast.success('CV created!') }
      setShowEditor(false); loadDrafts()
    } catch (err) { toast.error(err.message) }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this CV draft?')) return
    try { await deleteCVDraft(id); toast.success('Deleted'); loadDrafts() }
    catch { toast.error('Delete failed') }
  }

  return (
    <Layout title="CV Builder">
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">My CVs</h3>
          <Button size="sm" onClick={() => openEditor()}><Plus className="h-4 w-4" /> New CV</Button>
        </div>

        {loading ? <PageSpinner /> : drafts.length === 0 ? (
          <EmptyState icon={FileEdit} title="No CV drafts" description="Create your first CV using our templates." action={<Button onClick={() => openEditor()}><Plus className="h-4 w-4" /> Create CV</Button>} />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {drafts.map((draft) => (
              <Card key={draft.id} className="group">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium text-text-primary">{draft.title}</h4>
                    <p className="text-xs text-text-muted capitalize">{draft.template} template</p>
                    <p className="mt-1 text-xs text-text-muted">{draft.full_name || 'No name'}</p>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => openEditor(draft)}>Edit</Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(draft.id)} className="text-danger"><Trash2 className="h-4 w-4" /></Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Modal isOpen={showEditor} onClose={() => setShowEditor(false)} title={editDraft ? 'Edit CV' : 'New CV'} size="xl">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input label="CV Title *" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            <div>
              <label className="mb-1 block text-sm font-medium text-text-secondary">Template</label>
              <div className="flex gap-2">
                {TEMPLATES.map((t) => (
                  <button key={t.id} onClick={() => setForm({ ...form, template: t.id })} className={`flex-1 rounded-lg border p-2 text-center text-xs transition-colors ${form.template === t.id ? 'border-primary bg-primary/10 text-primary' : 'border-cream hover:bg-cream'}`}>
                    {t.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Input label="Full Name" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
            <Input label="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <Input label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>

          <Textarea label="Career Objective" value={form.objective} onChange={(e) => setForm({ ...form, objective: e.target.value })} rows={3} />
          <Textarea label="Work Experience" value={form.experience} onChange={(e) => setForm({ ...form, experience: e.target.value })} rows={4} />
          <Textarea label="Education" value={form.education} onChange={(e) => setForm({ ...form, education: e.target.value })} rows={3} />
          <Textarea label="Skills" value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} rows={3} />
          <Textarea label="Languages" value={form.languages} onChange={(e) => setForm({ ...form, languages: e.target.value })} rows={2} />
          <Textarea label="References" value={form.references} onChange={(e) => setForm({ ...form, references: e.target.value })} rows={2} />

          <div className="flex justify-end gap-3 border-t border-cream pt-4">
            <Button variant="ghost" onClick={() => setShowEditor(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editDraft ? 'Update' : 'Create'} CV</Button>
          </div>
        </div>
      </Modal>
    </Layout>
  )
}
