import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'

export default function Table({ columns, data, onRowClick, emptyMessage = 'No data found', className = '' }) {
  if (!data?.length) {
    return (
      <div className="rounded-xl border border-cream bg-white p-12 text-center">
        <p className="text-text-muted">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className={`overflow-x-auto rounded-xl border border-cream bg-white ${className}`}>
      <table className="w-full">
        <thead>
          <tr className="border-b border-cream bg-cream-light">
            {columns.map((col, i) => (
              <th key={i} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIdx) => (
            <tr
              key={row.id || rowIdx}
              className={`border-b border-cream/50 transition-colors last:border-0 ${onRowClick ? 'cursor-pointer hover:bg-cream-light/50' : ''}`}
              onClick={() => onRowClick?.(row)}
            >
              {columns.map((col, colIdx) => (
                <td key={colIdx} className="px-4 py-3 text-sm text-text-primary">
                  {col.render ? col.render(row) : row[col.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function Pagination({ page, pageSize, total, onPageChange }) {
  const totalPages = Math.ceil(total / pageSize)
  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-between px-4 py-3">
      <p className="text-sm text-text-secondary">
        Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, total)} of {total}
      </p>
      <div className="flex items-center gap-1">
        <PaginationBtn onClick={() => onPageChange(1)} disabled={page === 1}><ChevronsLeft className="h-4 w-4" /></PaginationBtn>
        <PaginationBtn onClick={() => onPageChange(page - 1)} disabled={page === 1}><ChevronLeft className="h-4 w-4" /></PaginationBtn>
        <span className="px-3 py-1 text-sm font-medium text-primary">{page}</span>
        <PaginationBtn onClick={() => onPageChange(page + 1)} disabled={page === totalPages}><ChevronRight className="h-4 w-4" /></PaginationBtn>
        <PaginationBtn onClick={() => onPageChange(totalPages)} disabled={page === totalPages}><ChevronsRight className="h-4 w-4" /></PaginationBtn>
      </div>
    </div>
  )
}

function PaginationBtn({ children, disabled, onClick }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="rounded-lg p-1.5 text-text-secondary transition-colors hover:bg-cream hover:text-primary disabled:opacity-40 disabled:cursor-not-allowed"
    >
      {children}
    </button>
  )
}
