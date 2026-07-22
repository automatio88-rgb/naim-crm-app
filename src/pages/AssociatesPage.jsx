import { useState, useEffect } from 'react'
import Layout from '../components/layout/Layout'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Select from '../components/ui/Select'
import Table from '../components/ui/Table'
import Badge from '../components/ui/Badge'
import { PageSpinner } from '../components/ui/Spinner'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../contexts/ToastContext'
import { getUsers } from '../services/settingsService'
import Avatar from '../components/ui/Avatar'
import { UserPlus, Mail, Shield } from 'lucide-react'

export default function AssociatesPage() {
  const toast = useToast()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadUsers() }, [])

  async function loadUsers() {
    setLoading(true)
    try { const data = await getUsers(); setUsers(data) }
    catch { toast.error('Failed to load associates') }
    finally { setLoading(false) }
  }

  const columns = [
    { header: 'User', render: (r) => (
      <div className="flex items-center gap-3">
        <Avatar name={r.display_name} size="md" />
        <div>
          <p className="font-medium">{r.display_name || 'No name'}</p>
          <p className="text-xs text-text-muted">{r.email || ''}</p>
        </div>
      </div>
    )},
    { header: 'Role', render: (r) => <Badge variant={r.role === 'admin' ? 'primary' : r.role === 'manager' ? 'info' : 'default'}>{r.role}</Badge> },
    { header: 'Access', render: (r) => (
      <div className="flex flex-wrap gap-1">
        {(r.page_permissions || []).slice(0, 3).map((p) => (
          <Badge key={p} variant="default">{p}</Badge>
        ))}
        {(r.page_permissions || []).length > 3 && <Badge>+{(r.page_permissions || []).length - 3}</Badge>}
      </div>
    )},
  ]

  return (
    <Layout title="Associates">
      <div className="space-y-4 animate-fade-in">
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Team Members</h3>
          </div>
          {loading ? <PageSpinner /> : (
            <Table columns={columns} data={users} emptyMessage="No team members found." />
          )}
        </Card>
      </div>
    </Layout>
  )
}
