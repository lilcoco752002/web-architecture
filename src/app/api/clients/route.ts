export const dynamic = 'force-dynamic'

import { apiError } from '@/lib/api-error'
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { ClientService } from '@/services/client.service'
import { createClientSchema } from '@/lib/validations'

/**
 * GET /api/clients
 * List all clients with optional filters
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status') as any
    const source = searchParams.get('source') as any
    const search = searchParams.get('search') || undefined
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '20')

    const result = await ClientService.listClients({
      status,
      source,
      search,
      page,
      pageSize,
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error(error)
    return apiError(error)
  }
}

/**
 * POST /api/clients
 * Create a new client
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    
    // Validate input
    const validatedData = createClientSchema.parse(body)
    
    const client = await ClientService.createClient(validatedData, session.user.id)

    return NextResponse.json(client, { status: 201 })
  } catch (error) {
    console.error(error)
    return apiError(error)
  }
}
