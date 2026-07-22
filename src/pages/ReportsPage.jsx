import { useState, useEffect } from 'react'
import Layout from '../components/layout/Layout'
import Card, { CardTitle } from '../components/ui/Card'
import Button from '../components/ui/Button'
import Tabs from '../components/ui/Tabs'
import { PageSpinner } from '../components/ui/Spinner'
import { getCandidatesByStage, getCandidatesByCountry, getRecentPlacements } from '../services/candidateService'
import { exportToCSV, exportToExcel, exportToPDF } from '../utils/exportUtils'
import { useToast } from '../contexts/ToastContext'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'
import { Download, FileText, BarChart3 } from 'lucide-react'

const COLORS = ['#8b6914', '#b8860b', '#d7a42a', '#e6be8a', '#6b520f', '#9a7009', '#f59e0b', '#16a34a', '#2563eb', '#7c3aed']

export default function ReportsPage() {
  const toast = useToast()
  const [loading, setLoading] = useState(true)
  const [stageData, setStageData] = useState([])
  const [countryData, setCountryData] = useState([])
  const [placements, setPlacements] = useState([])
  const [tab, setTab] = useState('overview')

  useEffect(() => { loadReports() }, [])

  async function loadReports() {
    try {
      const [stages, countries, recentPlacements] = await Promise.all([
        getCandidatesByStage(),
        getCandidatesByCountry(),
        getRecentPlacements(20),
      ])
      setStageData(Object.entries(stages).map(([name, value]) => ({ name, value })))
      setCountryData(Object.entries(countries).sort((a, b) => b[1] - a[1]).map(([name, value]) => ({ name, value })))
      setPlacements(recentPlacements)
    } catch { toast.error('Failed to load reports') }
    finally { setLoading(false) }
  }

  function handleExport(type) {
    const data = placements.map((c) => ({ Name: c.name, Email: c.email, Phone: c.phone, Stage: c.stage, Country: c.country_applying_to }))
    if (type === 'csv') exportToCSV(data, 'candidates-report.csv')
    else if (type === 'xlsx') exportToExcel(data, 'candidates-report.xlsx')
    else exportToPDF(data, 'Candidates Report', 'candidates-report.pdf')
    toast.success('Report exported!')
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'pipeline', label: 'Pipeline', icon: FileText },
    { id: 'geography', label: 'Geography', icon: BarChart3 },
  ]

  if (loading) return <Layout title="Reports & Analytics"><PageSpinner /></Layout>

  return (
    <Layout title="Reports & Analytics">
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <Tabs tabs={tabs} defaultTab={tab} onChange={setTab} />
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => handleExport('csv')}><Download className="h-4 w-4" /> CSV</Button>
            <Button variant="outline" size="sm" onClick={() => handleExport('xlsx')}><Download className="h-4 w-4" /> Excel</Button>
            <Button variant="outline" size="sm" onClick={() => handleExport('pdf')}><Download className="h-4 w-4" /> PDF</Button>
          </div>
        </div>

        {tab === 'overview' && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card>
              <CardTitle>Candidate Stage Distribution</CardTitle>
              <div className="mt-4 h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={stageData} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                      {stageData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>
            <Card>
              <CardTitle>Applications by Country</CardTitle>
              <div className="mt-4 h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={countryData}>
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#8b6914" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        )}

        {tab === 'pipeline' && (
          <Card>
            <CardTitle>Pipeline Funnel</CardTitle>
            <div className="mt-4 space-y-2">
              {stageData.sort((a, b) => b.value - a.value).map((item, i) => (
                <div key={item.name} className="flex items-center gap-3">
                  <span className="w-32 text-sm text-text-secondary">{item.name}</span>
                  <div className="flex-1">
                    <div className="h-6 rounded bg-cream overflow-hidden">
                      <div className="h-full rounded bg-primary transition-all" style={{ width: `${(item.value / Math.max(...stageData.map(s => s.value), 1)) * 100}%` }} />
                    </div>
                  </div>
                  <span className="w-10 text-right text-sm font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </Card>
        )}

        {tab === 'geography' && (
          <Card>
            <CardTitle>Candidates by Country</CardTitle>
            <div className="mt-4 h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={countryData} layout="vertical">
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8b6914" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        )}

        <Card>
          <CardTitle>Recent Placements</CardTitle>
          <div className="mt-4 space-y-2">
            {placements.length > 0 ? placements.map((c) => (
              <div key={c.id} className="flex items-center justify-between rounded-lg border border-cream p-3">
                <div><p className="font-medium">{c.name}</p><p className="text-xs text-text-muted">{c.email || c.phone}</p></div>
                <div className="text-right"><p className="text-sm font-medium text-primary">{c.country_applying_to}</p><p className="text-xs text-text-muted">{c.job_title}</p></div>
              </div>
            )) : <p className="py-8 text-center text-text-muted">No placements yet</p>}
          </div>
        </Card>
      </div>
    </Layout>
  )
}
