import { useId, type ReactNode } from 'react'

import { Show } from './show'
import { Field, FieldError, FieldHeader } from './field'
import { Input } from './input'
import type { FormUIProps } from '../../types/form'

type InputFieldProps = FormUIProps<'input'> & {
  action?: ReactNode
}

export function InputField({
  label,
  error,
  action,
  ...props
}: InputFieldProps) {
  const id = useId()
  const isInvalid = error != null

  return (
    <Field data-invalid={isInvalid ? true : undefined}>
      <FieldHeader htmlFor={id} label={label} action={action} />
      <Input
        autoComplete="off"
        id={id}
        {...props}
        aria-invalid={isInvalid ? true : undefined}
      />
      <Show when={isInvalid} data={error}>
        {(errorMessage) => <FieldError>{errorMessage}</FieldError>}
      </Show>
    </Field>
  )
}
