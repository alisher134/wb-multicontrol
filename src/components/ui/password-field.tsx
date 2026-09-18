import { useId, useState } from 'react'
import { EyeIcon, EyeOffIcon } from 'lucide-react'

import type { FormUIProps } from '@/types/form'

import { Field, FieldError, FieldLabel } from './field'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from './input-group'
import { Show } from './show'

export function PasswordField({
  label,
  error,
  className,
  ...props
}: FormUIProps<'input'>) {
  const id = useId()
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const isInvalid = error != null
  const passwordInputType = isPasswordVisible ? 'text' : 'password'

  const handleToggleVisibility = () => {
    setIsPasswordVisible((prev) => !prev)
  }

  return (
    <Field data-invalid={isInvalid ? true : undefined}>
      <Show when={label != null} data={label}>
        {(labelText) => (
          <FieldLabel
            htmlFor={id}
            className="font-normal text-muted-foreground"
          >
            {labelText}
          </FieldLabel>
        )}
      </Show>
      <InputGroup className={className}>
        <InputGroupInput
          autoComplete="off"
          id={id}
          {...props}
          type={passwordInputType}
          aria-invalid={isInvalid ? true : undefined}
        />
        <InputGroupAddon align="inline-end">
          <InputGroupButton size="icon-xs" onClick={handleToggleVisibility}>
            <Show
              when={isPasswordVisible}
              fallback={<EyeIcon className="size-3" aria-hidden />}
            >
              <EyeOffIcon className="size-3" aria-hidden />
            </Show>
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
      <Show when={isInvalid} data={error}>
        {(errorMessage) => <FieldError>{errorMessage}</FieldError>}
      </Show>
    </Field>
  )
}
