import { Toaster } from 'react-hot-toast'

export function AppToaster() {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={8}
      toastOptions={{
        duration: 4000,
        className: 'text-sm font-medium',
        style: {
          background: 'var(--card)',
          color: 'var(--card-foreground)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          boxShadow:
            '0 2px 8px color-mix(in oklch, var(--foreground) 12%, transparent)',
        },
        success: {
          duration: 3000,
          iconTheme: {
            primary: 'var(--primary)',
            secondary: 'var(--primary-foreground)',
          },
        },
        error: {
          duration: 5000,
          iconTheme: {
            primary: 'var(--destructive)',
            secondary: 'var(--destructive-foreground)',
          },
        },
      }}
    />
  )
}
