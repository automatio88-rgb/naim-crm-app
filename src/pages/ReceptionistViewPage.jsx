import { useState } from 'react'
import Layout from '../components/layout/Layout'
import Card, { CardTitle } from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Select from '../components/ui/Select'
import { StageBadge } from '../components/ui/Badge'
import { getCandidates } from '../services/candidateService'
import { useToast } from '../contexts/ToastContext'
import { CANDIDATE_STAGES, COUNTRIES } from '../utils/constants'
import { Search, User, Phone, Mail, MapPin } from 'lucide-react'

export default function ReceptionistViewPage() {
  const toast = useToast()
  const [search, setSearch] = useState('')
  const [results, setResults] = useState([])
  const [searched, setSearched] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSearch(e) {
    e.preventDefault()
    if (!search.trim()) return
    setLoading(true)
    try {
      const result = await getCandidates({ search, pageSize: 50 })
      setResults(result.data)
      setSearched(true)
    } catch { toast.error('Search failed') }
    finally { setLoading(false) }
  }

  return (
    <Layout title="Receptionist View">
      <div className="space-y-6 animate-fade-in max-w-4xl">
        <Card>
          <CardTitle>Quick Candidate Lookup</CardTitle>
          <form onSubmit={handleSearch} className="mt-3 flex gap-2">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, phone, email, or passport..."
              className="flex-1 rounded-lg border border-cream bg-white px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <Button type="submit" loading={loading}><Search className="h-4 w-4" /> Search</Button>
          </form>
        </Card>

        {searched && (
          <div className="space-y-3">
            <p className="text-sm text-text-secondary">{results.length} candidate(s) found</p>
            {results.map((c) => (
              <Card key={c.id}>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-primary" />
                      <h4 className="font-medium text-text-primary">{c.name}</h4>
                      <StageBadge stage={c.stage} />
                    </div>
                    {c.phone && <div className="flex items-center gap-2 text-sm text-text-secondary"><Phone className="h-3.5 w-3.5" /> {c.phone}</div>}
                    {c.email && <div className="flex items-center gap-2 text-sm text-text-secondary"><Mail className="h-3.5 w-3.5" /> {c.email}</div>}
                    {c.country_applying_to && <div className="flex items-center gap-2 text-sm text-text-secondary"><MapPin className="h-3.5 w-3.5" /> Applying to: {c.country_applying_to}</div>}
                  </div>
                  <div className="text-right text-sm text-text-muted">
                    <p>Job: {c.job_title || '-'}</p>
                    <p>Passport: {c.passport_number || '-'}</p>
                  </div>
                </div>
              </Card>
            ))}
            {results.length === 0 && (
              <Card><p className="py-8 text-center text-text-muted">No candidates found matching your search.</p></Card>
            )}
          </div>
        )}
      </div>
    </Layout>
  )
}
