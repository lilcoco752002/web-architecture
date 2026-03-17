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

    return NextResponse.json(project)
  } catch (error: any) {
    console.error('Error fetching project:', error)
    return NextResponse.json(
      { error: 'Failed to fetch project', message: error.message },
      { status: 500 }
    )
  }
}
