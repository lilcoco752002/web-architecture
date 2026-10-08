export const dynamic = 'force-dynamic'

import { apiError } from '@/lib/api-error'
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { ClientService } from '@/services/client.service'
import { updateClientSchema } from '@/lib/validations'

/**
 * GET /api/clients/[id]
 * Get a single client by ID
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const client = await ClientService.getClientById(params.id)

    if (!client) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 })
    }

    return NextResponse.json(client)
  } catch (error) {
    console.error(error)
    return apiError(error)
  }
}

/**
 * PATCH /api/clients/[id]
 * Update a client
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = updateClientSchema.parse(body)
    
    const client = await ClientService.updateClient(
      params.id,
      validatedData,
      session.user.id
    )

    return NextResponse.json(client)
  } catch (error) {
    console.error(error)
    return apiError(error)
  }
}

/**
 * DELETE /api/clients/[id]
 * Delete a client
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await ClientService.deleteClient(params.id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return apiError(error)
  }
}
