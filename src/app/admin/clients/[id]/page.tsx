import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { ClientService } from '@/services/client.service'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Mail, Phone, Building2, Globe, MapPin } from 'lucide-react'

export default async function ClientDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/admin/login')

  const client = await ClientService.getClientById(params.id)
  if (!client) notFound()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/clients">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{client.name}</h1>
          <p className="text-muted-foreground">Client Details</p>
        </div>
        <Link href={`/admin/clients/${client.id}/edit`}>
          <Button>Edit Client</Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Client Info */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <Mail className="h-4 w-4" />
                    Email
                  </div>
                  <a
                    href={`mailto:${client.email}`}
                    className="text-blue-600 hover:underline"
                  >
                    {client.email}
                  </a>
                </div>
                {client.phone && (
                  <div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <Phone className="h-4 w-4" />
                      Phone
                    </div>
                    <a
                      href={`tel:${client.phone}`}
                      className="text-blue-600 hover:underline"
                    >
                      {client.phone}
                    </a>
                  </div>
                )}
                {client.company && (
                  <div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <Building2 className="h-4 w-4" />
                      Company
                    </div>
                    <p>{client.company}</p>
                  </div>
                )}
                {client.website && (
                  <div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <Globe className="h-4 w-4" />
                      Website
                    </div>
                    <a
                      href={client.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {client.website}
                    </a>
                  </div>
                )}
                {client.address && (
                  <div className="md:col-span-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <MapPin className="h-4 w-4" />
                      Address
                    </div>
                    <p>{client.address}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Projects */}
          <Card>
            <CardHeader>
              <CardTitle>Projects ({client.projects?.length || 0})</CardTitle>
            </CardHeader>
            <CardContent>
              {!client.projects || client.projects.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  No projects yet
                </p>
              ) : (
                <div className="space-y-3">
                  {client.projects.map((project: any) => (
                    <Link
                      key={project.id}
                      href={`/admin/projects/${project.id}`}
                      className="block p-4 border rounded-lg hover:bg-muted/50 transition"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">{project.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {project.status} • {new Date(project.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        {project.budget && (
                          <p className="font-medium">${project.budget.toLocaleString()}</p>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Notes ({client.notes?.length || 0})</CardTitle>
            </CardHeader>
            <CardContent>
              {!client.notes || client.notes.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No notes yet</p>
              ) : (
                <div className="space-y-4">
                  {client.notes.map((note: any) => (
                    <div key={note.id} className="p-4 border rounded-lg">
                      <p className="whitespace-pre-wrap">{note.content}</p>
                      <p className="text-sm text-muted-foreground mt-2">
                        {note.createdBy.name} •{' '}
                        {new Date(note.createdAt).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Client Status</p>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    client.status === 'ACTIVE'
                      ? 'bg-green-100 text-green-800'
                      : client.status === 'NEW'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {client.status}
                </span>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Source</p>
                <p className="font-medium">{client.source}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Created</p>
                <p className="font-medium">
                  {new Date(client.createdAt).toLocaleDateString()}
                </p>
              </div>
              {client.createdBy && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Created By</p>
                  <p className="font-medium">{client.createdBy.name}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Projects</span>
                <span className="font-medium">{client.projects?.length || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Quotations</span>
                <span className="font-medium">{client.quotations?.length || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Bookings</span>
                <span className="font-medium">{client.bookings?.length || 0}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
