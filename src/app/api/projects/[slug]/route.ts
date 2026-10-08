export const dynamic = 'force-dynamic'

import { publicProject } from '@/lib/public-project'
import { apiError } from '@/lib/api-error'
import { NextRequest, NextResponse } from 'next/server'
import { ProjectService } from '@/services/project.service'

/**
 * GET /api/projects/[slug]
 * Get a single project by slug (public endpoint)
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const project = await ProjectService.getProjectBySlug(params.slug)

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // Only return published projects for public access
    if (!project.published) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    return NextResponse.json(publicProject(project))
  } catch (error) {
    console.error(error)
    return apiError(error)
  }
}
