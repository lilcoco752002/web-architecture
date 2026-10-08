import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { QuotationService } from '@/services/quotation.service'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Download } from 'lucide-react'

export const metadata = {
  title: 'Quotations | Admin',
}

export default async function QuotationsPage({
  searchParams,
}: {
  searchParams: { page?: string; status?: string }
}) {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/admin/login')

  const page = parseInt(searchParams.page || '1')
  const status = searchParams.status || undefined

  const { quotations, pagination } = await QuotationService.getAllQuotations({
    page,
    pageSize: 20,
    status: status as any,
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Quotations</h1>
          <p className="text-muted-foreground">Manage project quotations and proposals</p>
        </div>
        <div className="flex gap-2">
          <Link href="/api/export/quotations">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </Link>
          <Link href="/admin/quotations/new">
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              New Quotation
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <form className="flex gap-4">
            <select
              name="status"
              defaultValue={status || ''}
              className="px-4 py-2 border rounded-md"
            >
              <option value="">All Status</option>
              <option value="DRAFT">Draft</option>
              <option value="SENT">Sent</option>
              <option value="VIEWED">Viewed</option>
              <option value="ACCEPTED">Accepted</option>
              <option value="REJECTED">Rejected</option>
              <option value="EXPIRED">Expired</option>
            </select>
            <Button type="submit">Filter</Button>
          </form>
        </CardContent>
      </Card>

      {/* Quotations Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Quotations ({pagination.total})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">ID</th>
                  <th className="text-left py-3 px-4">Client</th>
                  <th className="text-left py-3 px-4">Title</th>
                  <th className="text-left py-3 px-4">Amount</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Valid Until</th>
                  <th className="text-left py-3 px-4">Created</th>
                  <th className="text-right py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {quotations.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-8 text-muted-foreground">
                      No quotations found
                    </td>
                  </tr>
                ) : (
                  quotations.map((quotation: any) => (
                    <tr key={quotation.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4 font-mono text-sm">
                        Q-{quotation.id.slice(0, 8)}
                      </td>
                      <td className="py-3 px-4">
                        {quotation.client ? quotation.client.name : 'No client'}
                      </td>
                      <td className="py-3 px-4 font-medium">{quotation.title || 'Untitled'}</td>
                      <td className="py-3 px-4 font-medium">
                        ${quotation.total?.toLocaleString() || '0'}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            quotation.status === 'ACCEPTED'
                              ? 'bg-green-100 text-green-800'
                              : quotation.status === 'SENT' || quotation.status === 'VIEWED'
                              ? 'bg-blue-100 text-blue-800'
                              : quotation.status === 'REJECTED' || quotation.status === 'EXPIRED'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {quotation.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm">
                        {quotation.validUntil
                          ? new Date(quotation.validUntil).toLocaleDateString()
                          : '-'}
                      </td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">
                        {new Date(quotation.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Link href={`/admin/quotations/${quotation.id}`}>
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <p className="text-sm text-muted-foreground">
                Showing {(page - 1) * 20 + 1} to {Math.min(page * 20, pagination.total)} of{' '}
                {pagination.total} quotations
              </p>
              <div className="flex gap-2">
                {page > 1 && (
                  <Link href={`?page=${page - 1}${status ? `&status=${status}` : ''}`}>
                    <Button variant="outline" size="sm">
                      Previous
                    </Button>
                  </Link>
                )}
                {page < pagination.totalPages && (
                  <Link href={`?page=${page + 1}${status ? `&status=${status}` : ''}`}>
                    <Button variant="outline" size="sm">
                      Next
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
