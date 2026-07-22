import { useState } from 'react'
import Layout from '../components/layout/Layout'
import Card, { CardTitle } from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Select from '../components/ui/Select'
import Textarea from '../components/ui/Textarea'
import { addJob } from '../services/jobService'
import { useToast } from '../contexts/ToastContext'
import { COUNTRIES, CURRENCIES } from '../utils/constants'
import { Zap, Copy, Check } from 'lucide-react'

export default function JobGeneratorPage() {
  const toast = useToast()
  const [loading, setLoading] = useState(false)
  const [generated, setGenerated] = useState(false)
  const [form, setForm] = useState({
    title: '', country: '', salary_min: '', salary_max: '', currency: 'KWD',
    description: '', requirements: '', responsibilities: '', schedule: '', contract_duration: '',
  })

  const templates = [
    { title: 'Driver', description: 'Experienced driver needed for transportation services.', requirements: 'Valid driving license, 3+ years experience, clean driving record', responsibilities: 'Safe transportation of goods/passengers, vehicle maintenance, route planning' },
    { title: 'Security Guard', description: 'Security personnel for commercial/residential properties.', requirements: 'Security training certification, physical fitness, alertness', responsibilities: 'Property surveillance, access control, incident reporting' },
    { title: 'Hotel Staff', description: 'Hospitality staff for hotel operations.', requirements: 'Hospitality experience, customer service skills, presentable', responsibilities: 'Guest services, room service, front desk operations' },
    { title: 'Household Worker', description: 'Domestic helper for household management.', requirements: 'Cooking, cleaning, childcare experience', responsibilities: 'Household cleaning, cooking, laundry, childcare' },
    { title: 'Technician', description: 'Skilled technician for maintenance and repair.', requirements: 'Technical certification, relevant trade experience', responsibilities: 'Equipment maintenance, repair services, quality checks' },
  ]

  function applyTemplate(template) {
    setForm({ ...form, title: template.title, description: template.description, requirements: template.requirements, responsibilities: template.responsibilities })
    toast.success('Template applied!')
  }

  async function handleCreate() {
    if (!form.title) return toast.error('Title is required')
    setLoading(true)
    try {
      await addJob({ ...form, status: 'Active' })
      toast.success('Job created!')
      setGenerated(true)
      setTimeout(() => setGenerated(false), 2000)
    } catch (err) { toast.error(err.message) }
    finally { setLoading(false) }
  }

  return (
    <Layout title="Job Generator">
      <div className="space-y-6 animate-fade-in max-w-3xl">
        <Card>
          <CardTitle>Quick Templates</CardTitle>
          <div className="mt-3 flex flex-wrap gap-2">
            {templates.map((t) => (
              <button key={t.title} onClick={() => applyTemplate(t)} className="rounded-lg border border-cream px-3 py-1.5 text-sm text-text-secondary hover:border-primary hover:bg-primary/5 hover:text-primary transition-colors">
                {t.title}
              </button>
            ))}
          </div>
        </Card>

        <Card>
          <CardTitle>Job Details</CardTitle>
          <div className="mt-4 space-y-4">
            <Input label="Job Title *" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            <Select label="Country" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} options={COUNTRIES} placeholder="Select country" />
            <div className="grid grid-cols-3 gap-3">
              <Input label="Min Salary" value={form.salary_min} onChange={(e) => setForm({ ...form, salary_min: e.target.value })} />
              <Input label="Max Salary" value={form.salary_max} onChange={(e) => setForm({ ...form, salary_max: e.target.value })} />
              <Select label="Currency" value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })} options={CURRENCIES.map((c) => c.code)} />
            </div>
            <Textarea label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <Textarea label="Requirements" value={form.requirements} onChange={(e) => setForm({ ...form, requirements: e.target.value })} />
            <Textarea label="Responsibilities" value={form.responsibilities} onChange={(e) => setForm({ ...form, responsibilities: e.target.value })} />
            <div className="grid grid-cols-2 gap-3">
              <Input label="Schedule" value={form.schedule} onChange={(e) => setForm({ ...form, schedule: e.target.value })} placeholder="e.g., 8am-5pm, 6 days/week" />
              <Input label="Contract Duration" value={form.contract_duration} onChange={(e) => setForm({ ...form, contract_duration: e.target.value })} placeholder="e.g., 2 years" />
            </div>
            <Button onClick={handleCreate} loading={loading}>
              {generated ? <><Check className="h-4 w-4" /> Created!</> : <><Zap className="h-4 w-4" /> Create Job</>}
            </Button>
          </div>
        </Card>
      </div>
    </Layout>
  )
}
