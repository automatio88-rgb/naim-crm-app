export default function Badge({ children, variant = 'default', className = '' }) {
  const variants = {
    default: 'bg-gray-100 text-gray-700',
    primary: 'bg-primary/10 text-primary',
    success: 'bg-green-100 text-green-700',
    danger: 'bg-red-100 text-red-700',
    warning: 'bg-amber-100 text-amber-700',
    info: 'bg-blue-100 text-blue-700',
  }

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  )
}

export function StageBadge({ stage, className = '' }) {
  const stageColors = {
    New: 'bg-blue-100 text-blue-700',
    Source: 'bg-purple-100 text-purple-700',
    Screening: 'bg-yellow-100 text-yellow-700',
    Interview: 'bg-indigo-100 text-indigo-700',
    Assessment: 'bg-cyan-100 text-cyan-700',
    Shortlist: 'bg-teal-100 text-teal-700',
    Offer: 'bg-green-100 text-green-700',
    'Contract Signing': 'bg-emerald-100 text-emerald-700',
    'Visa Processing': 'bg-orange-100 text-orange-700',
    Onboarding: 'bg-lime-100 text-lime-700',
    Placed: 'bg-[#d7a42a]/20 text-[#8b6914]',
    Completed: 'bg-[#8b6914]/10 text-[#6b520f]',
    Rejected: 'bg-red-100 text-red-700',
    Withdrawn: 'bg-gray-100 text-gray-600',
    Pending: 'bg-amber-100 text-amber-700',
    Draft: 'bg-slate-100 text-slate-600',
  }

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${stageColors[stage] || 'bg-gray-100 text-gray-600'} ${className}`}>
      {stage}
    </span>
  )
}
