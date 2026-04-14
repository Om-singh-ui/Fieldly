// lib/errors.ts
import { NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import { ZodError } from 'zod'

/**
 * Custom application error class
 * Used for throwing controlled errors in server-side code
 */
export class AppError extends Error {
  statusCode: number
  code?: string
  details?: Record<string, unknown>
  
  constructor(message: string, statusCode: number = 400, code?: string, details?: Record<string, unknown>) {
    super(message)
    this.statusCode = statusCode
    this.code = code
    this.details = details
    this.name = 'AppError'
  }
}

/**
 * Standardized API error response interface
 */
export interface ApiErrorResponse {
  error: string
  code?: string
  details?: Record<string, unknown> | Array<{ field: string; message: string }>
  statusCode?: number
}

/**
 * Handle errors in API routes and return consistent NextResponse
 * Fixed: Removed the restrictive return type annotation
 */
export function handleError(error: unknown) {
  console.error('[API_ERROR]', error)
  
  // AppError - our custom application errors
  if (error instanceof AppError) {
    return NextResponse.json(
      {
        error: error.message,
        code: error.code,
        details: error.details,
        statusCode: error.statusCode
      } satisfies ApiErrorResponse,
      { status: error.statusCode }
    )
  }
  
  // Zod validation errors
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        error: 'Validation failed',
        code: 'VALIDATION_ERROR',
        details: error.issues.map(issue => ({
          field: issue.path.join('.'),
          message: issue.message
        })),
        statusCode: 400
      } satisfies ApiErrorResponse,
      { status: 400 }
    )
  }
  
  // Prisma database errors
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        return NextResponse.json(
          {
            error: 'A unique constraint violation occurred',
            code: 'UNIQUE_CONSTRAINT',
            details: { fields: error.meta?.target as string[] },
            statusCode: 409
          } satisfies ApiErrorResponse,
          { status: 409 }
        )
        
      case 'P2025':
        return NextResponse.json(
          {
            error: 'Record not found',
            code: 'NOT_FOUND',
            details: { cause: error.meta?.cause as string },
            statusCode: 404
          } satisfies ApiErrorResponse,
          { status: 404 }
        )
        
      case 'P2003':
        return NextResponse.json(
          {
            error: 'Foreign key constraint failed',
            code: 'FOREIGN_KEY',
            details: { field: error.meta?.field_name as string },
            statusCode: 400
          } satisfies ApiErrorResponse,
          { status: 400 }
        )
        
      default:
        return NextResponse.json(
          {
            error: 'Database error occurred',
            code: 'DATABASE_ERROR',
            details: { prismaCode: error.code },
            statusCode: 500
          } satisfies ApiErrorResponse,
          { status: 500 }
        )
    }
  }
  
  // Prisma validation errors
  if (error instanceof Prisma.PrismaClientValidationError) {
    return NextResponse.json(
      {
        error: 'Invalid data provided',
        code: 'INVALID_DATA',
        statusCode: 400
      } satisfies ApiErrorResponse,
      { status: 400 }
    )
  }
  
  // Prisma initialization errors
  if (error instanceof Prisma.PrismaClientInitializationError) {
    return NextResponse.json(
      {
        error: 'Database connection failed',
        code: 'DATABASE_CONNECTION',
        statusCode: 503
      } satisfies ApiErrorResponse,
      { status: 503 }
    )
  }
  
  // Standard Error objects
  if (error instanceof Error) {
    // Handle common error messages
    if (error.message.includes('not found')) {
      return NextResponse.json(
        {
          error: error.message,
          code: 'NOT_FOUND',
          statusCode: 404
        } satisfies ApiErrorResponse,
        { status: 404 }
      )
    }
    
    if (error.message.includes('unauthorized') || error.message.includes('Unauthorized')) {
      return NextResponse.json(
        {
          error: error.message,
          code: 'UNAUTHORIZED',
          statusCode: 401
        } satisfies ApiErrorResponse,
        { status: 401 }
      )
    }
    
    if (error.message.includes('forbidden') || error.message.includes('Forbidden')) {
      return NextResponse.json(
        {
          error: error.message,
          code: 'FORBIDDEN',
          statusCode: 403
        } satisfies ApiErrorResponse,
        { status: 403 }
      )
    }
    
    return NextResponse.json(
      {
        error: error.message,
        code: 'INTERNAL_ERROR',
        statusCode: 500
      } satisfies ApiErrorResponse,
      { status: 500 }
    )
  }
  
  // Unknown errors
  return NextResponse.json(
    {
      error: 'An unexpected error occurred',
      code: 'UNKNOWN_ERROR',
      statusCode: 500
    } satisfies ApiErrorResponse,
    { status: 500 }
  )
}

/**
 * Helper to throw common errors
 */
export const Errors = {
  notFound: (entity: string = 'Resource') => {
    throw new AppError(`${entity} not found`, 404, 'NOT_FOUND')
  },
  
  unauthorized: (message: string = 'Unauthorized') => {
    throw new AppError(message, 401, 'UNAUTHORIZED')
  },
  
  forbidden: (message: string = 'Forbidden') => {
    throw new AppError(message, 403, 'FORBIDDEN')
  },
  
  badRequest: (message: string) => {
    throw new AppError(message, 400, 'BAD_REQUEST')
  },
  
  conflict: (message: string) => {
    throw new AppError(message, 409, 'CONFLICT')
  },
  
  validation: (message: string, details?: Record<string, unknown>) => {
    throw new AppError(message, 400, 'VALIDATION_ERROR', details)
  }
}

/**
 * Type guard to check if an error is an AppError
 */
export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError
}

/**
 * Extract user-friendly error message
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof AppError) {
    return error.message
  }
  
  if (error instanceof ZodError) {
    return 'Validation failed. Please check your input.'
  }
  
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        return 'This record already exists.'
      case 'P2025':
        return 'The requested record was not found.'
      default:
        return 'A database error occurred.'
    }
  }
  
  if (error instanceof Error) {
    return error.message
  }
  
  return 'An unexpected error occurred.'
}