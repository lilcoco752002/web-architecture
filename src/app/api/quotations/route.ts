export const dynamic = 'force-dynamic'

import { createQuotationSchema } from '@/lib/validations'
import { apiError } from '@/lib/api-error'
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { QuotationService } from '@/services/quotation.service'

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
    const clientId = searchParams.get('clientId') || undefined

    const result = await QuotationService.getAllQuotations({
      page,
      pageSize,
      status,
      clientId,
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error(error)
    return apiError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const quotation = await QuotationService.createQuotation(createQuotationSchema.parse(body))

    return NextResponse.json(quotation, { status: 201 })
  } catch (error) {
    console.error(error)
    return apiError(error)
  }
}
