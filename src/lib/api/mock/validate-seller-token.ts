import type { SellerAccountStatus } from '../types'

const MIN_TOKEN_LENGTH = 8

export type ValidateSellerTokenResult = {
  status: SellerAccountStatus
  resolvedName: string | null
}

export function validateSellerToken(
  token: string,
  fallbackName: string,
): ValidateSellerTokenResult {
  const trimmedToken = token.trim()

  if (trimmedToken.length < MIN_TOKEN_LENGTH) {
    return {
      status: 'error',
      resolvedName: null,
    }
  }

  if (trimmedToken.toLowerCase().includes('expired')) {
    return {
      status: 'token_expired',
      resolvedName: null,
    }
  }

  return {
    status: 'active',
    resolvedName: fallbackName,
  }
}
