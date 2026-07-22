export default function Card({ children, className = '', padding = true, ...props }) {
  return (
    <div
      className={`rounded-xl border border-cream bg-white shadow-sm ${padding ? 'p-6' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ children, className = '' }) {
  return <div className={`mb-4 flex items-center justify-between ${className}`}>{children}</div>
}

export function CardTitle({ children, className = '' }) {
  return <h3 className={`text-lg font-semibold text-text-primary ${className}`}>{children}</h3>
}

export function CardContent({ children, className = '' }) {
  return <div className={className}>{children}</div>
}
