import { type ReactNode } from 'react'
import { ErrorAlert } from './error-alert'

type ErrorGateProps = {
  isError: boolean
  errorMessage: string
  errorSlot?: ReactNode
  children?: ReactNode
}

export function ErrorGate({
  isError,
  errorSlot,
  errorMessage,
  children,
}: ErrorGateProps) {
  if (isError) {
    return errorSlot ?? <ErrorAlert errorMessage={errorMessage} />
  }

  return children
}
