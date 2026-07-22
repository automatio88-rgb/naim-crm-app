import { useState, useEffect } from 'react'
import Input from '../ui/Input'
import Select from '../ui/Select'
import Textarea from '../ui/Textarea'
import Button from '../ui/Button'
import { addCandidate, updateCandidate } from '../../services/candidateService'
import { useToast } from '../../contexts/ToastContext'
import { CANDIDATE_STAGES, COUNTRIES, CURRENCIES } from '../../utils/constants'

export default function CandidateForm({ candidate, onSave, onCancel }) {
  const toast = useToast()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    stage: 'New',
    job_title: '',
    salary: '',
    currency: 'KWD',
    country_applying_to: '',
    passport_number: '',
    nationality: '',
    religion: '',
    date_of_birth: '',
    place_of_birth: '',
    gender: '',
    civil_status: '',
    education_level: '',
    work_position: '',
    work_company: '',
    city: '',
    country: '',
    emergency_contact: '',
    notes: '',
    ...candidate,
  })

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.name) return toast.error('Name is required')
    setLoading(true)
    try {
      if (candidate?.id) {
        await updateCandidate(candidate.id, form)
        toast.success('Candidate updated!')
      } else {
        await addCandidate(form)
        toast.success('Candidate added!')
      }
      onSave()
    } catch (err) {
      toast.error(err.message || 'Failed to save candidate')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h4 className="mb-3 text-sm font-semibold text-primary">Personal Information</h4>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Input label="Full Name *" value={form.name} onChange={(e) => handleChange('name', e.target.value)} required />
          <Input label="Email" type="email" value={form.email} onChange={(e) => handleChange('email', e.target.value)} />
          <Input label="Phone" value={form.phone} onChange={(e) => handleChange('phone', e.target.value)} />
          <Input label="Passport Number" value={form.passport_number} onChange={(e) => handleChange('passport_number', e.target.value)} />
          <Input label="Date of Birth" type="date" value={form.date_of_birth} onChange={(e) => handleChange('date_of_birth', e.target.value)} />
          <Input label="Place of Birth" value={form.place_of_birth} onChange={(e) => handleChange('place_of_birth', e.target.value)} />
          <Select label="Gender" value={form.gender} onChange={(e) => handleChange('gender', e.target.value)} options={['Male', 'Female']} placeholder="Select" />
          <Select label="Civil Status" value={form.civil_status} onChange={(e) => handleChange('civil_status', e.target.value)} options={['Single', 'Married', 'Divorced', 'Widowed']} placeholder="Select" />
          <Input label="Nationality" value={form.nationality} onChange={(e) => handleChange('nationality', e.target.value)} />
          <Input label="Religion" value={form.religion} onChange={(e) => handleChange('religion', e.target.value)} />
          <Input label="Education Level" value={form.education_level} onChange={(e) => handleChange('education_level', e.target.value)} />
        </div>
      </div>

      <div>
        <h4 className="mb-3 text-sm font-semibold text-primary">Recruitment Details</h4>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Select label="Stage" value={form.stage} onChange={(e) => handleChange('stage', e.target.value)} options={CANDIDATE_STAGES} />
          <Input label="Job Title" value={form.job_title} onChange={(e) => handleChange('job_title', e.target.value)} />
          <Select label="Country Applying To" value={form.country_applying_to} onChange={(e) => handleChange('country_applying_to', e.target.value)} options={COUNTRIES} placeholder="Select country" />
          <div className="grid grid-cols-2 gap-2">
            <Input label="Salary" value={form.salary} onChange={(e) => handleChange('salary', e.target.value)} />
            <Select label="Currency" value={form.currency} onChange={(e) => handleChange('currency', e.target.value)} options={CURRENCIES.map((c) => ({ value: c.code, label: `${c.code} - ${c.name}` }))} />
          </div>
        </div>
      </div>

      <div>
        <h4 className="mb-3 text-sm font-semibold text-primary">Work Experience</h4>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Input label="Previous Company" value={form.work_company} onChange={(e) => handleChange('work_company', e.target.value)} />
          <Input label="Work Position" value={form.work_position} onChange={(e) => handleChange('work_position', e.target.value)} />
          <Input label="City" value={form.city} onChange={(e) => handleChange('city', e.target.value)} />
          <Input label="Country" value={form.country} onChange={(e) => handleChange('country', e.target.value)} />
        </div>
      </div>

      <div>
        <h4 className="mb-3 text-sm font-semibold text-primary">Emergency Contact</h4>
        <Input label="Emergency Contact" value={form.emergency_contact} onChange={(e) => handleChange('emergency_contact', e.target.value)} />
      </div>

      <Textarea label="Notes" value={form.notes} onChange={(e) => handleChange('notes', e.target.value)} placeholder="Additional notes about this candidate..." />

      <div className="flex justify-end gap-3 border-t border-cream pt-4">
        <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button type="submit" loading={loading}>{candidate?.id ? 'Update Candidate' : 'Add Candidate'}</Button>
      </div>
    </form>
  )
}
