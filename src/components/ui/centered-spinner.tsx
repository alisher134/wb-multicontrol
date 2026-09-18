import { Spinner } from './spinner'

export function CenteredSpinner() {
  return (
    <div className="flex min-h-40 items-center justify-center">
      <Spinner className="size-6" />
    </div>
  )
}
