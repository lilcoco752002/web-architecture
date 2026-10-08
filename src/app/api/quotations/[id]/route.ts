export const dynamic = 'force-dynamic'

import { updateQuotationSchema } from '@/lib/validations'
import { apiError } from '@/lib/api-error'
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { QuotationService } from '@/services/quotation.service'

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const quotation = await QuotationService.getQuotationById(params.id)

    if (!quotation) {
      return NextResponse.json({ error: 'Quotation not found' }, { status: 404 })
    }

    return NextResponse.json(quotation)
  } catch (error) {
    console.error(error)
    return apiError(error)
  }
}

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
    const quotation = await QuotationService.updateQuotation(params.id, updateQuotationSchema.parse(body))

    return NextResponse.json(quotation)
  } catch (error) {
    console.error(error)
    return apiError(error)
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    await QuotationService.deleteQuotation(params.id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return apiError(error)
  }
}
