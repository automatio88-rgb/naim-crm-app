import { useState } from 'react'
import Layout from '../components/layout/Layout'
import Card, { CardTitle } from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Textarea from '../components/ui/Textarea'
import Badge from '../components/ui/Badge'
import { useToast } from '../contexts/ToastContext'
import { MessageCircle, Send, Copy, Check } from 'lucide-react'

const TEMPLATES = [
  { id: 'interview', name: 'Interview Invitation', message: 'Dear {name},\n\nWe are pleased to invite you for an interview for the position of {position}.\n\nDate: {date}\nTime: {time}\nLocation: {location}\n\nPlease bring your original documents.\n\nBest regards,\nNaim Investments' },
  { id: 'offer', name: 'Job Offer', message: 'Dear {name},\n\nCongratulations! We are pleased to offer you the position of {position} in {country}.\n\nSalary: {salary}\n\nPlease confirm your acceptance within 48 hours.\n\nBest regards,\nNaim Investments' },
  { id: 'documents', name: 'Document Request', message: 'Dear {name},\n\nPlease submit the following documents for your application:\n\n{documents}\n\nKindly send them at your earliest convenience.\n\nBest regards,\nNaim Investments' },
  { id: 'followup', name: 'Follow-up', message: 'Dear {name},\n\nWe hope this message finds you well. We wanted to follow up on your application for {position}.\n\nPlease let us know if you have any questions.\n\nBest regards,\nNaim Investments' },
  { id: 'rejection', name: 'Rejection', message: 'Dear {name},\n\nThank you for your interest in the {position} role. After careful consideration, we have decided to move forward with other candidates.\n\nWe wish you all the best in your future endeavors.\n\nBest regards,\nNaim Investments' },
]

export default function WhatsAppPage() {
  const toast = useToast()
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [recipientPhone, setRecipientPhone] = useState('')
  const [variables, setVariables] = useState({})
  const [copied, setCopied] = useState(false)

  function selectTemplate(template) {
    setSelectedTemplate(template)
    setVariables({})
  }

  function getFilledMessage() {
    if (!selectedTemplate) return ''
    let msg = selectedTemplate.message
    Object.entries(variables).forEach(([key, val]) => {
      msg = msg.replace(new RegExp(`\\{${key}\\}`, 'g'), val)
    })
    return msg
  }

  function generateWhatsAppLink() {
    const phone = recipientPhone.replace(/[^0-9]/g, '')
    const message = encodeURIComponent(getFilledMessage())
    return `https://wa.me/${phone}?text=${message}`
  }

  function copyMessage() {
    navigator.clipboard.writeText(getFilledMessage())
    setCopied(true)
    toast.success('Message copied!')
    setTimeout(() => setCopied(false), 2000)
  }

  const variableNames = selectedTemplate
    ? [...new Set(selectedTemplate.message.match(/\{(\w+)\}/g)?.map((m) => m.replace(/[{}]/g, '')) || [])]
    : []

  return (
    <Layout title="WhatsApp Integration">
      <div className="space-y-6 animate-fade-in">
        <Card>
          <CardTitle>Message Templates</CardTitle>
          <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {TEMPLATES.map((t) => (
              <button
                key={t.id}
                onClick={() => selectTemplate(t)}
                className={`rounded-lg border p-3 text-left transition-colors ${selectedTemplate?.id === t.id ? 'border-primary bg-primary/5' : 'border-cream hover:bg-cream'}`}
              >
                <p className="text-sm font-medium">{t.name}</p>
                <p className="mt-1 line-clamp-2 text-xs text-text-muted">{t.message.substring(0, 80)}...</p>
              </button>
            ))}
          </div>
        </Card>

        {selectedTemplate && (
          <>
            <Card>
              <CardTitle>Fill in Variables</CardTitle>
              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Input label="Recipient Phone" value={recipientPhone} onChange={(e) => setRecipientPhone(e.target.value)} placeholder="+254700000000" />
                {variableNames.map((v) => (
                  <Input key={v} label={v.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())} value={variables[v] || ''} onChange={(e) => setVariables({ ...variables, [v]: e.target.value })} />
                ))}
              </div>
            </Card>

            <Card>
              <div className="flex items-center justify-between">
                <CardTitle>Preview Message</CardTitle>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={copyMessage}>
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />} Copy
                  </Button>
                  {recipientPhone && (
                    <Button size="sm" onClick={() => window.open(generateWhatsAppLink(), '_blank')}>
                      <MessageCircle className="h-4 w-4" /> Send via WhatsApp
                    </Button>
                  )}
                </div>
              </div>
              <div className="mt-3 whitespace-pre-wrap rounded-lg border border-cream bg-cream-light p-4 text-sm text-text-primary">
                {getFilledMessage() || 'Select a template and fill in the variables above.'}
              </div>
            </Card>
          </>
        )}
      </div>
    </Layout>
  )
}
