import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Show } from '@/components/ui/show'

type ErrorPageElementProps = {
  title: string
  description?: string
  onRetry?: () => void
  onGoHome?: () => void
}

export function ErrorPageElement({
  title,
  description,
  onRetry,
  onGoHome,
}: ErrorPageElementProps) {
  return (
    <Card className="mx-auto w-full max-w-lg">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <Show when={description != null} data={description}>
          {(descriptionText) => (
            <CardDescription>{descriptionText}</CardDescription>
          )}
        </Show>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Попробуйте ещё раз или вернитесь на главную страницу.
        </p>
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2">
        <Show when={onRetry != null} data={onRetry}>
          {(handleRetry) => (
            <Button type="button" onClick={handleRetry}>
              Повторить
            </Button>
          )}
        </Show>
        <Show when={onGoHome != null} data={onGoHome}>
          {(handleGoHome) => (
            <Button type="button" variant="outline" onClick={handleGoHome}>
              На главную
            </Button>
          )}
        </Show>
      </CardFooter>
    </Card>
  )
}
