export const dynamic = 'force-dynamic'

import { apiError } from '@/lib/api-error'
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { LeadService } from '@/services/lead.service'
import { createLeadSchema } from '@/lib/validations'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '10')
    const status = searchParams.get('status') || undefined
    const source = searchParams.get('source') || undefined
    const search = searchParams.get('search') || undefined

    const result = await LeadService.getAllLeads({
      page,
      pageSize,
      status,
      source,
      search,
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error(error)
    return apiError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createLeadSchema.parse(body)

    const session = await getServerSession(authOptions)
    const lead = await LeadService.createLead(validatedData, session?.user.id)

    return NextResponse.json({ success: true, id: lead.id }, { status: 201 })
  } catch (error) {
    console.error(error)
    return apiError(error)
  }
}
