"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Lock, Unlock, Package, Settings, Trophy, Clock, CheckCircle, ArrowRight, Star, Award } from "lucide-react"
import LogisticsChallenge from "./logistics-challenge"
import SimulatorChallenge from "./simulator-challenge"
import QualityControlChallenge from "./quality-control-challenge"

export default function EscapeGameHub() {
  const [currentRoom, setCurrentRoom] = useState<string | null>(null)
  const [completedRooms, setCompletedRooms] = useState<string[]>([])
  const [gameStarted, setGameStarted] = useState(false)
  const [gameTime, setGameTime] = useState(0)
  const [isTimerActive, setIsTimerActive] = useState(false)
  const [checkpoints, setCheckpoints] = useState<{ [key: string]: number }>({})
  const [totalErrors, setTotalErrors] = useState(0)
  const [gameCompleted, setGameCompleted] = useState(false)

  // Game timer - runs continuously until all rooms are completed
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isTimerActive && !gameCompleted) {
      interval = setInterval(() => {
        setGameTime((prevTime) => prevTime + 1)
      }, 1000)
    } else if (interval) {
      clearInterval(interval)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isTimerActive, gameCompleted])

  // Check if game is completed
  useEffect(() => {
    if (completedRooms.length === 3 && !gameCompleted) {
      setGameCompleted(true)
      setIsTimerActive(false)
    }
  }, [completedRooms, gameCompleted])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const startGame = () => {
    setGameStarted(true)
    setIsTimerActive(true)
    setGameTime(0)
    setCompletedRooms([])
    setCheckpoints({})
    setTotalErrors(0)
    setGameCompleted(false)
  }

  const completeRoom = (roomId: string) => {
    if (!completedRooms.includes(roomId)) {
      const newCompletedRooms = [...completedRooms, roomId]
      setCompletedRooms(newCompletedRooms)

      // Add checkpoint
      const newCheckpoints = { ...checkpoints }
      newCheckpoints[roomId] = gameTime
      setCheckpoints(newCheckpoints)
    }
    setCurrentRoom(null)
  }

  const addErrorPenalty = () => {
    setGameTime((prevTime) => prevTime + 15) // Add 15 seconds penalty
    setTotalErrors((prev) => prev + 1)
  }

  const isRoomUnlocked = (roomId: string) => {
    if (roomId === "room1") return true
    if (roomId === "room2") return completedRooms.includes("room1")
    if (roomId === "room3") return completedRooms.includes("room2")
    return false
  }

  const renderRoom = () => {
    const roomProps = {
      onComplete: () => completeRoom(currentRoom!),
      onError: addErrorPenalty,
      onBack: () => setCurrentRoom(null),
    }

    switch (currentRoom) {
      case "room1":
        return <LogisticsChallenge {...roomProps} />
      case "room2":
        return <SimulatorChallenge {...roomProps} />
      case "room3":
        return <QualityControlChallenge {...roomProps} />
      default:
        return null
    }
  }

  const rooms = [
    {
      id: "room1",
      title: "SALA 1: LOGÍSTICA",
      description: "Análisis de etiquetas y validación de cajas",
      icon: <Package className="w-8 h-8" />,
      color: "from-blue-600 to-purple-600",
      textColor: "text-blue-400",
      borderColor: "border-blue-500/50",
    },
    {
      id: "room2",
      title: "SALA 2: SIMULADOR",
      description: "Reinicio del simulador de prueba defectuoso",
      icon: <Settings className="w-8 h-8" />,
      color: "from-red-600 to-orange-600",
      textColor: "text-red-400",
      borderColor: "border-red-500/50",
    },
    {
      id: "room3",
      title: "SALA 3: CONTROL FINAL",
      description: "Validación del informe de envío",
      icon: <Trophy className="w-8 h-8" />,
      color: "from-green-600 to-teal-600",
      textColor: "text-green-400",
      borderColor: "border-green-500/50",
    },
  ]

  // If a room is selected, render that room
  if (currentRoom) {
    return renderRoom()
  }

  // Game completion screen
  if (gameCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-900 via-blue-900 to-purple-900 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-72 h-72 bg-green-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-2000"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto p-6 space-y-8">
          <div className="text-center space-y-8">
            {/* Success Header */}
            <div className="space-y-4">
              <Award className="w-24 h-24 text-green-400 mx-auto animate-bounce" />
              <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-blue-400 to-purple-400">
                ✅ PRUEBA DE PRODUCTO VALIDADA
              </h1>
            </div>

            {/* Main Message */}
            <Card className="bg-black/40 backdrop-blur-sm border border-green-500/30 shadow-2xl max-w-2xl mx-auto">
              <CardContent className="pt-8 space-y-6">
                <p className="text-xl text-green-200 font-semibold">
                  Acabas de hacerlo mejor que un almacén automatizado y un escáner de 8000€.
                </p>

                <div className="space-y-3 text-lg">
                  <div className="flex items-center gap-3 text-green-300">
                    <CheckCircle className="w-6 h-6" />
                    <span>Has corregido una etiqueta defectuosa</span>
                  </div>
                  <div className="flex items-center gap-3 text-green-300">
                    <CheckCircle className="w-6 h-6" />
                    <span>Has salvado una prueba de producto de una caja defectuosa</span>
                  </div>
                  <div className="flex items-center gap-3 text-green-300">
                    <CheckCircle className="w-6 h-6" />
                    <span>Has desenmascarado un error de stock antes que el café</span>
                  </div>
                </div>

                <div className="bg-blue-900/30 border border-blue-500/50 rounded-lg p-6">
                  <p className="text-2xl font-bold text-blue-300 mb-4">En resumen: estás contratado/a.</p>

                  {/* Performance Stats */}
                  <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                    <div className="bg-black/40 rounded-lg p-3">
                      <p className="text-gray-400">Tiempo total</p>
                      <p className="text-blue-300 font-bold text-lg">{formatTime(gameTime)}</p>
                    </div>
                    <div className="bg-black/40 rounded-lg p-3">
                      <p className="text-gray-400">Errores totales</p>
                      <p className="text-blue-300 font-bold text-lg">{totalErrors}</p>
                    </div>
                  </div>

                  {/* Checkpoints */}
                  <div className="space-y-2">
                    <h4 className="text-blue-300 font-semibold">📊 Tiempo por etapa:</h4>
                    <div className="grid grid-cols-1 gap-2 text-sm">
                      {rooms.map((room) => {
                        const checkpoint = checkpoints[room.id]
                        const isCompleted = completedRooms.includes(room.id)
                        return (
                          <div key={room.id} className="flex justify-between items-center bg-black/40 rounded p-2">
                            <span className={isCompleted ? "text-green-300" : "text-gray-400"}>{room.title}</span>
                            <span className={isCompleted ? "text-green-300 font-mono" : "text-gray-400"}>
                              {isCompleted ? formatTime(checkpoint) : "No completado"}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-lg text-gray-300">→ Puedes salir.</p>
                  <p className="text-lg text-gray-300">
                    → O reiniciar el simulador si quieres impresionar a tus compañeros.
                  </p>
                </div>

                <div className="flex gap-4 justify-center">
                  <Button
                    onClick={() => window.location.reload()}
                    className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                  >
                    <Star className="w-5 h-5 mr-2" />
                    IMPRESIONAR A LOS COMPAÑEROS
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-2000"></div>
      </div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: "radial-gradient(circle at center, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      ></div>

      <div className="relative z-10 max-w-6xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
            DECATHLON ESCAPE GAME
          </h1>
          <p className="text-xl text-blue-200">El Laboratorio del Futuro</p>

          {gameStarted && (
            <div className="flex justify-center gap-6">
              <div className="bg-black/60 backdrop-blur-sm border border-blue-500/50 rounded-lg px-6 py-3">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-400" />
                  <span className="font-mono text-xl font-bold text-blue-300">{formatTime(gameTime)}</span>
                </div>
                <p className="text-xs text-gray-400 text-center">TIEMPO GLOBAL</p>
              </div>

              <div className="bg-black/60 backdrop-blur-sm border border-purple-500/50 rounded-lg px-6 py-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-purple-400" />
                  <span className="font-bold text-purple-300">{completedRooms.length}/3</span>
                </div>
                <p className="text-xs text-gray-400 text-center">SALAS COMPLETADAS</p>
              </div>

              <div className="bg-black/60 backdrop-blur-sm border border-red-500/50 rounded-lg px-6 py-3">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-red-300">{totalErrors}</span>
                </div>
                <p className="text-xs text-gray-400 text-center">ERRORES (+15s)</p>
              </div>
            </div>
          )}
        </div>

        {/* Start Game Screen */}
        {!gameStarted ? (
          <div className="max-w-md mx-auto">
            <Card className="bg-black/40 backdrop-blur-sm border border-blue-500/30 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-center text-blue-300">BIENVENIDO AL ESCAPE GAME</CardTitle>
                <CardDescription className="text-center text-gray-400">
                  Resuelve los enigmas para descubrir el secreto del laboratorio
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm text-gray-300">
                    Estás a punto de entrar en el laboratorio secreto de Decathlon. Tu misión es resolver una serie de
                    enigmas para descubrir el proyecto revolucionario que se esconde allí.
                  </p>
                  <p className="text-sm text-gray-300">
                    Cada sala contiene un desafío único que pondrá a prueba tus habilidades de análisis y resolución de
                    problemas.
                  </p>
                </div>
                <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-3">
                  <p className="text-red-200 text-sm font-semibold">⚠️ ¡Cada error añade 15 segundos al cronómetro!</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={startGame}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  COMENZAR LA AVENTURA
                </Button>
              </CardFooter>
            </Card>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Checkpoints Display */}
            {Object.keys(checkpoints).length > 0 && (
              <Card className="bg-black/40 backdrop-blur-sm border border-green-500/30 max-w-2xl mx-auto">
                <CardHeader>
                  <CardTitle className="text-center text-green-300">🏁 PUNTOS DE CONTROL</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-2">
                    {rooms.map((room) => {
                      const checkpoint = checkpoints[room.id]
                      const isCompleted = completedRooms.includes(room.id)
                      return (
                        <div key={room.id} className="flex justify-between items-center bg-black/40 rounded p-3">
                          <span
                            className={`flex items-center gap-2 ${isCompleted ? "text-green-300" : "text-gray-400"}`}
                          >
                            {room.icon}
                            {room.title}
                          </span>
                          <span className={`font-mono ${isCompleted ? "text-green-300" : "text-gray-400"}`}>
                            {isCompleted ? formatTime(checkpoint) : "En espera..."}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Rooms Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {rooms.map((room) => {
                const isUnlocked = isRoomUnlocked(room.id)
                const isCompleted = completedRooms.includes(room.id)

                return (
                  <Card
                    key={room.id}
                    className={`bg-black/40 backdrop-blur-sm border ${room.borderColor} shadow-xl transition-all duration-300 ${
                      isUnlocked ? "hover:shadow-2xl hover:scale-105" : "opacity-70"
                    }`}
                  >
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <div className={`p-3 rounded-full bg-black/60 ${room.textColor}`}>{room.icon}</div>
                        {isCompleted ? (
                          <Badge className="bg-green-600">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            COMPLETADO
                          </Badge>
                        ) : isUnlocked ? (
                          <Badge className="bg-blue-600">DESBLOQUEADO</Badge>
                        ) : (
                          <Badge variant="outline" className="border-gray-500 text-gray-400">
                            <Lock className="w-3 h-3 mr-1" /> BLOQUEADO
                          </Badge>
                        )}
                      </div>
                      <CardTitle className={room.textColor}>{room.title}</CardTitle>
                      <CardDescription className="text-gray-400">{room.description}</CardDescription>
                      {isCompleted && checkpoints[room.id] && (
                        <div className="text-xs text-green-400 font-mono">
                          Completado en {formatTime(checkpoints[room.id])}
                        </div>
                      )}
                    </CardHeader>
                    <CardFooter>
                      <Button
                        onClick={() => isUnlocked && setCurrentRoom(room.id)}
                        disabled={!isUnlocked}
                        className={`w-full bg-gradient-to-r ${room.color} ${
                          !isUnlocked ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      >
                        {isCompleted ? (
                          <>
                            REJUGAR <ArrowRight className="w-4 h-4 ml-2" />
                          </>
                        ) : isUnlocked ? (
                          <>
                            ACCEDER <Unlock className="w-4 h-4 ml-2" />
                          </>
                        ) : (
                          <>
                            BLOQUEADO <Lock className="w-4 h-4 ml-2" />
                          </>
                        )}
                      </Button>
                    </CardFooter>
                  </Card>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
