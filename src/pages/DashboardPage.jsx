import { useState, useEffect } from 'react'
import Layout from '../components/layout/Layout'
import Card, { CardTitle } from '../components/ui/Card'
import { PageSpinner } from '../components/ui/Spinner'
import { StageBadge } from '../components/ui/Badge'
import { Users, Briefcase, CheckSquare, Award, TrendingUp, ArrowRight } from 'lucide-react'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { getCandidatesByStage, getCandidatesByCountry, getRecentPlacements, getCandidates } from '../services/candidateService'
import { getActiveJobs } from '../services/jobService'
import { getTaskCounts } from '../services/taskService'

const CHART_COLORS = ['#8b6914', '#b8860b', '#d7a42a', '#e6be8a', '#6b520f', '#9a7009', '#f59e0b', '#16a34a', '#2563eb', '#7c3aed']

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ totalCandidates: 0, activeJobs: 0, pendingTasks: 0, placedThisMonth: 0 })
  const [stageData, setStageData] = useState([])
  const [countryData, setCountryData] = useState([])
  const [recentPlacements, setRecentPlacements] = useState([])

  useEffect(() => {
    loadDashboard()
  }, [])

  async function loadDashboard() {
    try {
      const [stageCounts, countryCounts, placements, candidates, jobs, tasks] = await Promise.all([
        getCandidatesByStage(),
        getCandidatesByCountry(),
        getRecentPlacements(5),
        getCandidates({ pageSize: 1 }),
        getActiveJobs(),
        getTaskCounts(),
      ])

      setStats({
        totalCandidates: candidates.count || 0,
        activeJobs: jobs.length || 0,
        pendingTasks: (tasks['Pending'] || 0) + (tasks['In Progress'] || 0),
        placedThisMonth: stageCounts['Placed'] || 0,
      })

      setStageData(
        Object.entries(stageCounts).map(([name, value]) => ({ name, value }))
      )
      setCountryData(
        Object.entries(countryCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 8)
          .map(([name, value]) => ({ name, value }))
      )
      setRecentPlacements(placements)
    } catch (err) {
      console.error('Dashboard load error:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <Layout title="Dashboard"><PageSpinner /></Layout>

  const statCards = [
    { label: 'Total Candidates', value: stats.totalCandidates, icon: Users, color: 'bg-blue-500' },
    { label: 'Active Jobs', value: stats.activeJobs, icon: Briefcase, color: 'bg-green-500' },
    { label: 'Pending Tasks', value: stats.pendingTasks, icon: CheckSquare, color: 'bg-amber-500' },
    { label: 'Placed', value: stats.placedThisMonth, icon: Award, color: 'bg-[#8b6914]' },
  ]

  return (
    <Layout title="Dashboard">
      <div className="space-y-6 animate-fade-in">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((card) => {
            const Icon = card.icon
            return (
              <Card key={card.label}>
                <div className="flex items-center gap-4">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${card.color} text-white`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm text-text-secondary">{card.label}</p>
                    <p className="text-2xl font-bold text-text-primary">{card.value}</p>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card>
            <CardTitle>Candidate Stage Distribution</CardTitle>
            <div className="mt-4 h-64">
              {stageData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={stageData} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                      {stageData.map((_, i) => (
                        <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-text-muted">No data</div>
              )}
            </div>
          </Card>

          <Card>
            <CardTitle>Applications by Country</CardTitle>
            <div className="mt-4 h-64">
              {countryData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={countryData}>
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#8b6914" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-text-muted">No data</div>
              )}
            </div>
          </Card>
        </div>

        <Card>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Successful Placements</CardTitle>
            <a href="/candidates?stage=Placed" className="flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-hover">
              View All <ArrowRight className="h-4 w-4" />
            </a>
          </div>
          <div className="mt-4">
            {recentPlacements.length > 0 ? (
              <div className="space-y-3">
                {recentPlacements.map((c) => (
                  <div key={c.id} className="flex items-center justify-between rounded-lg border border-cream p-3">
                    <div>
                      <p className="font-medium text-text-primary">{c.name}</p>
                      <p className="text-xs text-text-secondary">{c.email || c.phone}</p>
                    </div>
                    <div className="text-right">
                      <StageBadge stage={c.stage} />
                      <p className="mt-1 text-xs text-text-muted">{c.country_applying_to}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="py-8 text-center text-sm text-text-muted">No placements yet</p>
            )}
          </div>
        </Card>
      </div>
    </Layout>
  )
}
