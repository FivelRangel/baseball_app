"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { BeerIcon as Baseball } from "lucide-react"

export default function Home() {
  return (
    <div className="container mx-auto flex flex-col items-center justify-center min-h-screen p-4">
      <div className="flex items-center mb-8">
        <Baseball className="h-12 w-12 mr-4 text-blue-600" />
        <h1 className="text-4xl font-bold">Béisbol App Interactiva</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle>Crear Nuevo Juego</CardTitle>
            <CardDescription>Configura un nuevo juego como anotador</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Como anotador, podrás:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Configurar equipos y alineaciones</li>
              <li>Registrar jugadas en tiempo real</li>
              <li>Llevar el marcador del juego</li>
              <li>Compartir el juego con espectadores</li>
            </ul>
          </CardContent>
          <CardFooter>
            <Link href="/setup" className="w-full">
              <Button className="w-full">Crear Juego</Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ver Juego Existente</CardTitle>
            <CardDescription>Únete como espectador a un juego en progreso</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="gameId">ID del Juego</Label>
              <Input id="gameId" placeholder="Ingresa el ID del juego" />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <Button
              id="joinGameButton"
              className="w-full"
              onClick={() => {
                const gameId = (document.getElementById("gameId") as HTMLInputElement).value
                if (gameId) {
                  window.location.href = `/spectator/${gameId}`
                }
              }}
            >
              Ver Juego
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
