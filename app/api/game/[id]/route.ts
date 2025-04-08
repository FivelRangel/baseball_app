import { type NextRequest, NextResponse } from "next/server"
import { getGame, updateGame } from "@/app/actions/gameActions"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const gameId = params.id

  try {
    const result = await getGame(gameId)

    if (!result.success) {
      return NextResponse.json({ error: result.error || "Game not found" }, { status: 404 })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error fetching game:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const gameId = params.id

  try {
    const body = await request.json()
    const result = await updateGame(gameId, body)

    if (!result.success) {
      return NextResponse.json({ error: result.error || "Failed to update game" }, { status: 400 })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error updating game:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
