import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { ClientService } from '@/services/client.service'
import { ProjectService } from '@/services/project.service'
import { BookingService } from '@/services/booking.service'
import { ActivityLogService } from '@/services/activity-log.service'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Briefcase, Calendar, TrendingUp } from 'lucide-react'

export const metadata = {
  title: 'Dashboard | Admin',
}

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions)

  if (!session) redirect('/admin/login')

  // Fetch dashboard statistics
  const [clientStats, projectStats, bookingStats, recentActivity] = await Promise.all([
    ClientService.getClientStats(),
    ProjectService.getProjectStats(),
    BookingService.getBookingStats(),
    ActivityLogService.getRecentActivities(10),
  ])

  const stats = [
    {
      title: 'Total Clients',
      value: clientStats.total,
      change: `+${clientStats.recentClients} this month`,
      icon: Users,
      color: 'text-blue-600',
    },
    {
      title: 'Total Projects',
      value: projectStats.total,
      change: `${projectStats.completedThisMonth} completed this month`,
      icon: Briefcase,
      color: 'text-green-600',
    },
    {
      title: 'Pending Bookings',
      value: bookingStats.pending,
      change: `${bookingStats.thisMonth} total this month`,
      icon: Calendar,
      color: 'text-orange-600',
    },
    {
      title: 'Revenue',
      value: '—',
      change: 'Revenue tracking is not configured',
      icon: TrendingUp,
      color: 'text-purple-600',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {session?.user?.name}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity: any) => (
              <div
                key={activity.id}
                className="flex items-start space-x-4 rounded-lg border p-4"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.description}</p>
                  <p className="text-xs text-muted-foreground">
                    {activity.user.name} •{' '}
                    {new Date(activity.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
