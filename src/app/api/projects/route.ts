import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { ProjectService } from '@/services/project.service'

/**
 * GET /api/projects
 * Get published projects (public) or all projects (authenticated)
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const searchParams = request.nextUrl.searchParams
    
    const published = session ? searchParams.get('published') === 'true' : true
    const featured = searchParams.get('featured') === 'true' || undefined
    const search = searchParams.get('search') || undefined
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '12')

    const result = await ProjectService.listProjects({
      published,
      featured,
      search,
      page,
      pageSize,
    })

    return NextResponse.json(result)
  } catch (error: any) {
    console.error('Error fetching projects:', error)
    return NextResponse.json(
      { error: 'Failed to fetch projects', message: error.message },
      { status: 500 }
    )
  }
}
