"use server"

import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function createGame(gameData: any) {
  try {
    // Check if game already exists
    const existingGame = await prisma.game.findUnique({
      where: { id: gameData.gameId },
    })

    if (existingGame) {
      return { success: false, error: "Game ID already exists" }
    }

    // Create the game in the database
    const game = await prisma.game.create({
      data: {
        id: gameData.gameId,
        homeTeamName: gameData.homeTeam.name,
        awayTeamName: gameData.awayTeam.name,
        innings: gameData.innings,
        status: gameData.status,
        currentInning: gameData.currentInning,
        isTopInning: gameData.isTopInning,
        homeScore: gameData.score.home,
        awayScore: gameData.score.away,
        outs: gameData.outs,
        firstBase: gameData.bases.first,
        secondBase: gameData.bases.second,
        thirdBase: gameData.bases.third,
        homeLineup: JSON.stringify(gameData.homeTeam.lineup),
        awayLineup: JSON.stringify(gameData.awayTeam.lineup),
      },
    })

    return { success: true, game }
  } catch (error) {
    console.error("Error creating game:", error)
    return { success: false, error: "Failed to create game" }
  }
}

export async function getGame(gameId: string) {
  try {
    const game = await prisma.game.findUnique({
      where: { id: gameId },
    })

    if (!game) {
      return { success: false, error: "Game not found" }
    }

    // Transform the data to match the expected format
    return {
      success: true,
      game: {
        gameId: game.id,
        homeTeam: {
          name: game.homeTeamName,
          lineup: JSON.parse(game.homeLineup as string),
        },
        awayTeam: {
          name: game.awayTeamName,
          lineup: JSON.parse(game.awayLineup as string),
        },
        innings: game.innings,
        status: game.status,
        currentInning: game.currentInning,
        isTopInning: game.isTopInning,
        score: {
          home: game.homeScore,
          away: game.awayScore,
        },
        outs: game.outs,
        bases: {
          first: game.firstBase,
          second: game.secondBase,
          third: game.thirdBase,
        },
      },
    }
  } catch (error) {
    console.error("Error getting game:", error)
    return { success: false, error: "Failed to get game" }
  }
}

export async function updateGame(gameId: string, gameData: any) {
  try {
    const game = await prisma.game.update({
      where: { id: gameId },
      data: {
        homeTeamName: gameData.homeTeam.name,
        awayTeamName: gameData.awayTeam.name,
        innings: gameData.innings,
        status: gameData.status,
        currentInning: gameData.currentInning,
        isTopInning: gameData.isTopInning,
        homeScore: gameData.score.home,
        awayScore: gameData.score.away,
        outs: gameData.outs,
        firstBase: gameData.bases.first,
        secondBase: gameData.bases.second,
        thirdBase: gameData.bases.third,
        homeLineup: JSON.stringify(gameData.homeTeam.lineup),
        awayLineup: JSON.stringify(gameData.awayTeam.lineup),
      },
    })

    return { success: true, game }
  } catch (error) {
    console.error("Error updating game:", error)
    return { success: false, error: "Failed to update game" }
  }
}
