import { Outlet } from 'react-router'

import { Card, CardContent } from '@/components/ui/card'

export function AuthLayout() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-background px-4 py-10">
      <Card className="w-full max-w-md">
        <CardContent className="p-6">
          <Outlet />
        </CardContent>
      </Card>
    </div>
  )
}
