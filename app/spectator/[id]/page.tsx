import { Suspense } from "react"
import { getGame } from "@/app/actions/gameActions"
import SpectatorView from "@/app/components/SpectatorView"
import { Loader2 } from "lucide-react"

interface SpectatorPageProps {
  params: {
    id: string
  }
}

export default async function SpectatorPage({ params }: SpectatorPageProps) {
  const { id } = params
  const { success, game, error } = await getGame(id)

  if (!success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl font-bold mb-4">Error</h1>
        <p className="text-red-500">{error || "No se pudo cargar el juego"}</p>
      </div>
    )
  }

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Cargando juego...</span>
        </div>
      }
    >
      <SpectatorView initialGameData={game} />
    </Suspense>
  )
}
