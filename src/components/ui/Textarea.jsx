import { forwardRef } from 'react'

const Textarea = forwardRef(({ label, error, className = '', ...props }, ref) => {
  return (
    <div className="space-y-1">
      {label && <label className="block text-sm font-medium text-text-secondary">{label}</label>}
      <textarea
        ref={ref}
        className={`w-full rounded-lg border border-cream bg-white px-3 py-2 text-sm text-text-primary placeholder-text-muted transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-y ${
          error ? 'border-danger focus:border-danger focus:ring-danger/20' : ''
        } ${className}`}
        rows={4}
        {...props}
      />
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  )
})

Textarea.displayName = 'Textarea'
export default Textarea
