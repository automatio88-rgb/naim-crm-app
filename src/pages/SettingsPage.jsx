import { useState, useEffect } from 'react'
import Layout from '../components/layout/Layout'
import Card, { CardTitle, CardContent } from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Select from '../components/ui/Select'
import Tabs from '../components/ui/Tabs'
import Table from '../components/ui/Table'
import Badge from '../components/ui/Badge'
import Modal from '../components/ui/Modal'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../contexts/ToastContext'
import { getAppSettings, updateAppSettings, getUsers, updateUserProfile } from '../services/settingsService'
import { COUNTRIES, CURRENCIES, USER_ROLES, PAGE_ACCESS_OPTIONS } from '../utils/constants'
import { Settings, Shield, Users, Palette, Download, Upload } from 'lucide-react'

export default function SettingsPage() {
  const toast = useToast()
  const { user, userProfile, updateProfile } = useAuth()
  const [tab, setTab] = useState('application')
  const [settings, setSettings] = useState({})
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showUserModal, setShowUserModal] = useState(false)
  const [editUser, setEditUser] = useState(null)
  const [userForm, setUserForm] = useState({ display_name: '', role: 'user', page_permissions: [] })

  useEffect(() => { loadSettings(); loadUsers() }, [])

  async function loadSettings() {
    const s = await getAppSettings()
    setSettings(s)
    setLoading(false)
  }

  async function loadUsers() {
    try { const u = await getUsers(); setUsers(u) } catch {}
  }

  async function saveSettings() {
    try { await updateAppSettings(settings); toast.success('Settings saved!') }
    catch { toast.error('Failed to save') }
  }

  function togglePagePermission(page) {
    const perms = userForm.page_permissions || []
    const updated = perms.includes(page) ? perms.filter((p) => p !== page) : [...perms, page]
    setUserForm({ ...userForm, page_permissions: updated })
  }

  async function handleUserSave() {
    if (!editUser) return
    try {
      await updateUserProfile(editUser.id, { role: userForm.role, page_permissions: userForm.page_permissions, display_name: userForm.display_name })
      toast.success('User updated!')
      setShowUserModal(false); loadUsers()
    } catch (err) { toast.error(err.message) }
  }

  const tabs = [
    { id: 'application', label: 'Application', icon: Settings },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'export', label: 'Export/Import', icon: Download },
  ]

  const userColumns = [
    { header: 'Name', render: (r) => <p className="font-medium">{r.display_name || 'No name'}</p> },
    { header: 'Role', render: (r) => <Badge variant={r.role === 'admin' ? 'primary' : r.role === 'manager' ? 'info' : 'default'}>{r.role}</Badge> },
    { header: '', render: (r) => (
      <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setEditUser(r); setUserForm(r); setShowUserModal(true) }}>Edit</Button>
    )},
  ]

  function exportSettings() {
    const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = 'naim-crm-settings.json'; a.click()
    toast.success('Settings exported!')
  }

  function importSettings(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const imported = JSON.parse(ev.target.result)
        setSettings(imported); updateAppSettings(imported); toast.success('Settings imported!')
      } catch { toast.error('Invalid JSON file') }
    }
    reader.readAsText(file)
  }

  return (
    <Layout title="Settings">
      <div className="space-y-6 animate-fade-in">
        <Tabs tabs={tabs} defaultTab={tab} onChange={setTab} />

        {tab === 'application' && (
          <Card>
            <CardTitle>Application Settings</CardTitle>
            <CardContent className="mt-4 space-y-4">
              <Input label="Application Name" value={settings.app_name || ''} onChange={(e) => setSettings({ ...settings, app_name: e.target.value })} />
              <div className="grid grid-cols-2 gap-4">
                <Select label="Default Country" value={settings.default_country || ''} onChange={(e) => setSettings({ ...settings, default_country: e.target.value })} options={COUNTRIES} />
                <Select label="Default Currency" value={settings.default_currency || ''} onChange={(e) => setSettings({ ...settings, default_currency: e.target.value })} options={CURRENCIES.map((c) => c.code)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Data Retention (days)" type="number" value={settings.data_retention_days || ''} onChange={(e) => setSettings({ ...settings, data_retention_days: parseInt(e.target.value) })} />
                <Input label="Auto-Logout (minutes)" type="number" value={settings.auto_logout_minutes || ''} onChange={(e) => setSettings({ ...settings, auto_logout_minutes: parseInt(e.target.value) })} />
              </div>
              <Button onClick={saveSettings}>Save Settings</Button>
            </CardContent>
          </Card>
        )}

        {tab === 'users' && (
          <Card>
            <CardTitle>User Management</CardTitle>
            <Table columns={userColumns} data={users} emptyMessage="No users found." />
          </Card>
        )}

        {tab === 'security' && (
          <Card>
            <CardTitle>Security Settings</CardTitle>
            <CardContent className="mt-4 space-y-4">
              <p className="text-sm text-text-secondary">Password management and session controls are handled through Supabase Auth.</p>
              <Input label="Session Timeout (minutes)" type="number" value={settings.auto_logout_minutes || 30} onChange={(e) => setSettings({ ...settings, auto_logout_minutes: parseInt(e.target.value) })} />
              <Button onClick={saveSettings}>Save</Button>
            </CardContent>
          </Card>
        )}

        {tab === 'export' && (
          <Card>
            <CardTitle>Export / Import Settings</CardTitle>
            <CardContent className="mt-4 space-y-4">
              <div className="flex gap-3">
                <Button variant="outline" onClick={exportSettings}><Download className="h-4 w-4" /> Export Settings</Button>
                <div>
                  <input type="file" accept=".json" onChange={importSettings} className="hidden" id="import-settings" />
                  <Button variant="outline" onClick={() => document.getElementById('import-settings').click()}><Upload className="h-4 w-4" /> Import Settings</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <Modal isOpen={showUserModal} onClose={() => setShowUserModal(false)} title="Edit User">
        <div className="space-y-4">
          <Input label="Display Name" value={userForm.display_name || ''} onChange={(e) => setUserForm({ ...userForm, display_name: e.target.value })} />
          <Select label="Role" value={userForm.role} onChange={(e) => setUserForm({ ...userForm, role: e.target.value })} options={USER_ROLES} />
          <div>
            <p className="mb-2 text-sm font-medium text-text-secondary">Page Access</p>
            <div className="grid grid-cols-2 gap-2">
              {PAGE_ACCESS_OPTIONS.map((page) => (
                <label key={page} className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={(userForm.page_permissions || []).includes(page)} onChange={() => togglePagePermission(page)} className="rounded border-cream" />
                  <span className="capitalize">{page.replace(/-/g, ' ')}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-3 border-t border-cream pt-4">
            <Button variant="ghost" onClick={() => setShowUserModal(false)}>Cancel</Button>
            <Button onClick={handleUserSave}>Save</Button>
          </div>
        </div>
      </Modal>
    </Layout>
  )
}
