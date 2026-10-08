import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { LeadService } from '@/services/lead.service'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Search, Download } from 'lucide-react'

export const metadata = {
  title: 'Leads | Admin',
}

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: { page?: string; search?: string; status?: string }
}) {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/admin/login')

  const page = parseInt(searchParams.page || '1')
  const search = searchParams.search || ''
  const status = searchParams.status || undefined

  const { data: leads, pagination } = await LeadService.listLeads({
    page,
    pageSize: 20,
    search,
    status: status as any,
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Leads</h1>
          <p className="text-muted-foreground">Track and convert potential clients</p>
        </div>
        <div className="flex gap-2">
          <Link href="/api/export/leads">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </Link>
          <Link href="/admin/leads/new">
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Lead
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <form className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <input
                  type="search"
                  name="search"
                  placeholder="Search leads..."
                  defaultValue={search}
                  className="w-full pl-10 pr-4 py-2 border rounded-md"
                />
              </div>
            </div>
            <select
              name="status"
              defaultValue={status || ''}
              className="px-4 py-2 border rounded-md"
            >
              <option value="">All Status</option>
              <option value="NEW">New</option>
              <option value="CONTACTED">Contacted</option>
              <option value="QUALIFIED">Qualified</option>
              <option value="PROPOSAL_SENT">Proposal Sent</option>
              <option value="NEGOTIATING">Negotiating</option>
              <option value="CONVERTED">Converted</option>
              <option value="LOST">Lost</option>
            </select>
            <Button type="submit">Filter</Button>
          </form>
        </CardContent>
      </Card>

      {/* Leads Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Leads ({pagination.total})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Name</th>
                  <th className="text-left py-3 px-4">Email</th>
                  <th className="text-left py-3 px-4">Phone</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Source</th>
                  <th className="text-left py-3 px-4">Budget</th>
                  <th className="text-left py-3 px-4">Created</th>
                  <th className="text-right py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {leads.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-8 text-muted-foreground">
                      No leads found
                    </td>
                  </tr>
                ) : (
                  leads.map((lead: any) => (
                    <tr key={lead.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4 font-medium">{lead.name}</td>
                      <td className="py-3 px-4">{lead.email}</td>
                      <td className="py-3 px-4">{lead.phone || '-'}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            lead.status === 'CONVERTED'
                              ? 'bg-green-100 text-green-800'
                              : lead.status === 'NEW'
                              ? 'bg-blue-100 text-blue-800'
                              : lead.status === 'QUALIFIED'
                              ? 'bg-purple-100 text-purple-800'
                              : lead.status === 'LOST'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {lead.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">
                        {lead.source}
                      </td>
                      <td className="py-3 px-4">{lead.budget || '-'}</td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">
                        {new Date(lead.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <Link href={`/admin/leads/${lead.id}`}>
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                        </Link>
                        {lead.status !== 'CONVERTED' && lead.status !== 'LOST' && (
                          <form action={`/admin/leads/${lead.id}/convert`} method="POST" className="inline">
                            <Button variant="outline" size="sm" type="submit">
                              Convert
                            </Button>
                          </form>
                        )}
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
                {pagination.total} leads
              </p>
              <div className="flex gap-2">
                {page > 1 && (
                  <Link
                    href={`?page=${page - 1}${search ? `&search=${search}` : ''}${
                      status ? `&status=${status}` : ''
                    }`}
                  >
                    <Button variant="outline" size="sm">
                      Previous
                    </Button>
                  </Link>
                )}
                {page < pagination.totalPages && (
                  <Link
                    href={`?page=${page + 1}${search ? `&search=${search}` : ''}${
                      status ? `&status=${status}` : ''
                    }`}
                  >
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
