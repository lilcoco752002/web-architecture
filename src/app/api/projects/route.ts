export const dynamic = 'force-dynamic'

import { publicProject } from '@/lib/public-project'
import { apiError } from '@/lib/api-error'
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
    
    const publishedFilter = searchParams.get('published')
    const published = session ? (publishedFilter === null ? undefined : publishedFilter === 'true') : true
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

    return NextResponse.json(session ? result : { ...result, data: result.data.map(publicProject) })
  } catch (error) {
    console.error(error)
    return apiError(error)
  }
}
