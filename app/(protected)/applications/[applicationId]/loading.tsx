// app/(protected)/applications/[applicationId]/loading.tsx
import { Loader2 } from 'lucide-react'

export default function Loading() {
  return (
    <div className="container max-w-5xl py-8">
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mx-auto" />
          <p className="text-muted-foreground">Loading application details...</p>
        </div>
      </div>
    </div>
  )
}