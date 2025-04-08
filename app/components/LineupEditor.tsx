"use client"

import { useState, useEffect } from "react"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { GripVertical } from "lucide-react"

interface Player {
  id: string
  name: string
  position: string
}

interface LineupEditorProps {
  initialLineup: Player[]
  onLineupChange: (lineup: Player[]) => void
  teamName: string
}

const SortablePlayer = ({ player }: { player: Player }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: player.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-2 p-3 mb-2 bg-white border rounded-md shadow-sm"
    >
      <div {...attributes} {...listeners} className="cursor-grab">
        <GripVertical className="h-5 w-5 text-gray-400" />
      </div>
      <div className="flex-1">
        <div className="font-medium">{player.name}</div>
        <div className="text-sm text-gray-500">{player.position}</div>
      </div>
    </div>
  )
}

export default function LineupEditor({ initialLineup, onLineupChange, teamName }: LineupEditorProps) {
  const [players, setPlayers] = useState<Player[]>(initialLineup)
  const [newPlayer, setNewPlayer] = useState({ name: "", position: "" })

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  useEffect(() => {
    onLineupChange(players)
  }, [players, onLineupChange])

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event

    if (over && active.id !== over.id) {
      setPlayers((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over.id)

        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  const addPlayer = () => {
    if (newPlayer.name.trim() && newPlayer.position.trim()) {
      const player = {
        id: `player-${Date.now()}`,
        name: newPlayer.name,
        position: newPlayer.position,
      }
      setPlayers([...players, player])
      setNewPlayer({ name: "", position: "" })
    }
  }

  const removePlayer = (id: string) => {
    setPlayers(players.filter((player) => player.id !== id))
  }

  return (
    <div className="p-4 border rounded-lg bg-gray-50">
      <h3 className="text-lg font-bold mb-4">{teamName} Lineup</h3>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={players.map((p) => p.id)} strategy={verticalListSortingStrategy}>
          <div className="mb-4">
            {players.map((player, index) => (
              <div key={player.id} className="flex items-center gap-2">
                <div className="w-6 text-center font-bold">{index + 1}</div>
                <div className="flex-1">
                  <SortablePlayer player={player} />
                </div>
                <Button variant="ghost" size="sm" onClick={() => removePlayer(player.id)} className="text-red-500">
                  ×
                </Button>
              </div>
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <div className="grid grid-cols-2 gap-2 mt-4">
        <div>
          <Label htmlFor="playerName">Nombre</Label>
          <Input
            id="playerName"
            value={newPlayer.name}
            onChange={(e) => setNewPlayer({ ...newPlayer, name: e.target.value })}
            placeholder="Nombre del jugador"
          />
        </div>
        <div>
          <Label htmlFor="playerPosition">Posición</Label>
          <Input
            id="playerPosition"
            value={newPlayer.position}
            onChange={(e) => setNewPlayer({ ...newPlayer, position: e.target.value })}
            placeholder="Posición"
          />
        </div>
      </div>
      <Button onClick={addPlayer} className="w-full mt-2">
        Agregar Jugador
      </Button>
    </div>
  )
}
