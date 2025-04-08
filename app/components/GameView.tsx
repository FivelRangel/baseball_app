"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { updateGame } from "../actions/gameActions"

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

interface GameViewProps {
  initialGameData: GameData
}

export default function GameView({ initialGameData }: GameViewProps) {
  const [gameData, setGameData] = useState<GameData>(initialGameData)
  const [isLoading, setIsLoading] = useState(false)

  const currentTeam = gameData.isTopInning ? gameData.awayTeam : gameData.homeTeam
  const battingTeamName = gameData.isTopInning ? gameData.awayTeam.name : gameData.homeTeam.name
  const currentBatterIndex = 0 // This should be tracked in the game state

  const handlePlayResult = async (result: string) => {
    setIsLoading(true)

    // Clone the current game data
    const updatedGameData = { ...gameData }

    // Update game state based on play result
    // This is a simplified example - you would need more complex logic
    switch (result) {
      case "single":
        // Update bases and potentially score
        if (updatedGameData.bases.third) {
          if (updatedGameData.isTopInning) {
            updatedGameData.score.away += 1
          } else {
            updatedGameData.score.home += 1
          }
          updatedGameData.bases.third = false
        }

        if (updatedGameData.bases.second) {
          updatedGameData.bases.third = true
          updatedGameData.bases.second = false
        }

        if (updatedGameData.bases.first) {
          updatedGameData.bases.second = true
        }

        updatedGameData.bases.first = true
        break

      case "out":
        updatedGameData.outs += 1

        // Check if half-inning is over
        if (updatedGameData.outs >= 3) {
          updatedGameData.outs = 0
          updatedGameData.bases = { first: false, second: false, third: false }

          // Switch between top and bottom of inning
          if (updatedGameData.isTopInning) {
            updatedGameData.isTopInning = false
          } else {
            updatedGameData.isTopInning = true
            updatedGameData.currentInning += 1
          }

          // Check if game is over
          if (updatedGameData.currentInning > updatedGameData.innings) {
            updatedGameData.status = "completed"
          }
        }
        break

      // Add more cases for other play results
    }

    // Save updated game state
    try {
      await updateGame(gameData.gameId, updatedGameData)
      setGameData(updatedGameData)
    } catch (error) {
      console.error("Error updating game:", error)
    } finally {
      setIsLoading(false)
    }
  }

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

          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-2">
            <Button onClick={() => handlePlayResult("single")} disabled={isLoading}>
              Sencillo
            </Button>
            <Button onClick={() => handlePlayResult("double")} disabled={isLoading}>
              Doble
            </Button>
            <Button onClick={() => handlePlayResult("triple")} disabled={isLoading}>
              Triple
            </Button>
            <Button onClick={() => handlePlayResult("homerun")} disabled={isLoading}>
              Jonrón
            </Button>
            <Button onClick={() => handlePlayResult("out")} disabled={isLoading}>
              Out
            </Button>
            <Button onClick={() => handlePlayResult("strikeout")} disabled={isLoading}>
              Ponche
            </Button>
            <Button onClick={() => handlePlayResult("walk")} disabled={isLoading}>
              Base por Bolas
            </Button>
            <Button onClick={() => handlePlayResult("sacrifice")} disabled={isLoading}>
              Sacrificio
            </Button>
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
