"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import LineupEditor from "./LineupEditor"
import InningsSelector from "./InningsSelector"
import { createGame } from "../actions/gameActions"

interface Player {
  id: string
  name: string
  position: string
}

export default function GameSetup() {
  const router = useRouter()
  const [gameId, setGameId] = useState("")
  const [homeTeam, setHomeTeam] = useState("")
  const [awayTeam, setAwayTeam] = useState("")
  const [innings, setInnings] = useState(9)
  const [homeLineup, setHomeLineup] = useState<Player[]>([])
  const [awayLineup, setAwayLineup] = useState<Player[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Generate a random game ID on component mount
    setGameId(`game-${Math.random().toString(36).substring(2, 9)}`)
  }, [])

  const handleStartGame = async () => {
    if (!gameId || !homeTeam || !awayTeam || homeLineup.length === 0 || awayLineup.length === 0) {
      alert("Por favor completa todos los campos requeridos")
      return
    }

    setIsLoading(true)

    try {
      const gameData = {
        gameId,
        homeTeam: {
          name: homeTeam,
          lineup: homeLineup,
        },
        awayTeam: {
          name: awayTeam,
          lineup: awayLineup,
        },
        innings,
        status: "in_progress",
        currentInning: 1,
        isTopInning: true,
        score: {
          home: 0,
          away: 0,
        },
        outs: 0,
        bases: {
          first: false,
          second: false,
          third: false,
        },
      }

      await createGame(gameData)
      router.push(`/game/${gameId}`)
    } catch (error) {
      console.error("Error starting game:", error)
      alert("Error al iniciar el juego. Por favor intenta de nuevo.")
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Configuración del Juego</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="gameId">ID del Juego</Label>
              <Input
                id="gameId"
                value={gameId}
                onChange={(e) => setGameId(e.target.value)}
                placeholder="ID del Juego"
                disabled
              />
              <p className="text-sm text-gray-500 mt-1">ID generado automáticamente</p>
            </div>

            <div>
              <Label htmlFor="homeTeam">Equipo Local</Label>
              <Input
                id="homeTeam"
                value={homeTeam}
                onChange={(e) => setHomeTeam(e.target.value)}
                placeholder="Nombre del Equipo Local"
              />
            </div>

            <div>
              <Label htmlFor="awayTeam">Equipo Visitante</Label>
              <Input
                id="awayTeam"
                value={awayTeam}
                onChange={(e) => setAwayTeam(e.target.value)}
                placeholder="Nombre del Equipo Visitante"
              />
            </div>

            <InningsSelector value={innings} onChange={setInnings} />
          </div>

          <div className="space-y-4">
            <LineupEditor initialLineup={homeLineup} onLineupChange={setHomeLineup} teamName="Equipo Local" />

            <LineupEditor initialLineup={awayLineup} onLineupChange={setAwayLineup} teamName="Equipo Visitante" />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleStartGame} className="w-full" disabled={isLoading}>
          {isLoading ? "Iniciando..." : "Iniciar Juego"}
        </Button>
      </CardFooter>
    </Card>
  )
}
