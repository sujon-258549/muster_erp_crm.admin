import { Button } from "@/components/ui/button"

interface DataTablePaginationProps {
  page: number
  totalPages: number
  total: number
  pageSize: number
  showing: number
  onPageChange: (page: number) => void
}

// Footer used inside DataTable's `footer` slot. Pure presentation —
// it doesn't own state.
//
// Renders nothing when there's a single page (or none) — no point showing
// "Page 1 of 1" with disabled Prev/Next buttons. Every list page picks this
// behavior up automatically via the shared <DataTable footer={...} /> slot.
export function DataTablePagination({
  page,
  totalPages,
  total,
  showing,
  onPageChange,
}: DataTablePaginationProps) {
  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-between border-t bg-muted/20 px-4 py-3 text-xs text-muted-foreground">
      <span>
        Showing <span className="font-medium text-foreground">{showing}</span>{" "}
        of <span className="font-medium text-foreground">{total}</span>
      </span>
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page <= 1}
        >
          Previous
        </Button>
        <span>
          Page {page} of {totalPages}
        </span>
        <Button
          size="sm"
          variant="outline"
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page >= totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  )
}
