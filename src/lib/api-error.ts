import { NextResponse } from 'next/server'
import { ZodError } from 'zod'

export function apiError(error: unknown) {
  if (error instanceof ZodError) {
    return NextResponse.json({ error: 'Validation error', details: error.issues }, { status: 400 })
  }
  if (error instanceof SyntaxError) {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }
  const code = (error as { code?: string })?.code
  if (code === 'P2025') return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (code === 'P2002') return NextResponse.json({ error: 'Record already exists' }, { status: 409 })
  if (code === 'P2003') return NextResponse.json({ error: 'Invalid related record' }, { status: 400 })
  return NextResponse.json({ error: 'Request failed' }, { status: 500 })
}
