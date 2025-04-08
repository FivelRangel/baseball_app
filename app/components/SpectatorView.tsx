"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Player {
  id: string
  name: string
  position: string
}

interface Team {
  name: string
  lineup: Player[]
}

interface GameData {
  gameId: string
  homeTeam: Team
  awayTeam: Team
  innings: number
  status: string
  currentInning: number
  isTopInning: boolean
  score: {
    home: number
    away: number
  }
  outs: number
  bases: {
    first: boolean
    second: boolean
    third: boolean
  }
}

interface SpectatorViewProps {
  initialGameData: GameData
}

export default function SpectatorView({ initialGameData }: SpectatorViewProps) {
  const [gameData, setGameData] = useState<GameData>(initialGameData)
  const [isLoading, setIsLoading] = useState(false)

  const currentTeam = gameData.isTopInning ? gameData.awayTeam : gameData.homeTeam
  const battingTeamName = gameData.isTopInning ? gameData.awayTeam.name : gameData.homeTeam.name
  const currentBatterIndex = 0 // This should be tracked in the game state

  // Fetch game updates periodically
  useEffect(() => {
    const fetchGameUpdates = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/game/${gameData.gameId}`)

        if (!response.ok) {
          throw new Error("Failed to fetch game updates")
        }

        const data = await response.json()

        if (data.success && data.game) {
          setGameData(data.game)
        }
      } catch (error) {
        console.error("Error fetching game updates:", error)
      } finally {
        setIsLoading(false)
      }
    }

    // Poll for updates every 5 seconds
    const intervalId = setInterval(fetchGameUpdates, 5000)

    // Clean up interval on component unmount
    return () => clearInterval(intervalId)
  }, [gameData.gameId])

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            {gameData.awayTeam.name} vs {gameData.homeTeam.name}
          </CardTitle>
          <div className="text-center text-xl font-bold">
            {gameData.score.away} - {gameData.score.home}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-bold mb-2">Información del Juego</h3>
              <div className="space-y-1">
                <p>
                  Entrada: {gameData.currentInning} {gameData.isTopInning ? "Alta" : "Baja"}
                </p>
                <p>Outs: {gameData.outs}</p>
                <div className="flex space-x-4 mt-2">
                  <div
                    className={`w-8 h-8 rounded-full border ${gameData.bases.first ? "bg-green-500" : "bg-gray-200"}`}
                  ></div>
                  <div
                    className={`w-8 h-8 rounded-full border ${gameData.bases.second ? "bg-green-500" : "bg-gray-200"}`}
                  ></div>
                  <div
                    className={`w-8 h-8 rounded-full border ${gameData.bases.third ? "bg-green-500" : "bg-gray-200"}`}
                  ></div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-bold mb-2">Bateando: {battingTeamName}</h3>
              <p>Bateador Actual: {currentTeam.lineup[currentBatterIndex]?.name || "No disponible"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{gameData.homeTeam.name} (Local)</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1">
              {gameData.homeTeam.lineup.map((player, index) => (
                <li key={player.id} className="flex justify-between">
                  <span>
                    {index + 1}. {player.name}
                  </span>
                  <span className="text-gray-500">{player.position}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{gameData.awayTeam.name} (Visitante)</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1">
              {gameData.awayTeam.lineup.map((player, index) => (
                <li key={player.id} className="flex justify-between">
                  <span>
                    {index + 1}. {player.name}
                  </span>
                  <span className="text-gray-500">{player.position}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
