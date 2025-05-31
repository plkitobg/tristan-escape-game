"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import {
  CheckCircle,
  Settings,
  Database,
  AlertTriangle,
  XCircle,
  Zap,
  Target,
  FileText,
  Bug,
  ArrowLeft,
} from "lucide-react"

interface SimulatorChallengeProps {
  onComplete: () => void
  onError: () => void
  onBack: () => void
}

export default function SimulatorChallenge({ onComplete, onError, onBack }: SimulatorChallengeProps) {
  const [isGameActive, setIsGameActive] = useState(false)
  const [errors, setErrors] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [answers, setAnswers] = useState({
    abrasion: "",
    frequency: "",
    height: "",
  })
  const [feedback, setFeedback] = useState("")
  const [isComplete, setIsComplete] = useState(false)
  const [showDataCorruption, setShowDataCorruption] = useState(false)

  const maxErrors = 3
  const correctAnswers = {
    abrasion: "48",
    frequency: "4",
    height: "1.5",
  }

  // Corrupted data from the test sheet
  const testData = [
    { parameter: "Resistencia a la abrasión", value: "37 ciclos", status: "corrupted" },
    { parameter: "Frecuencia de uso", value: "7/7", status: "corrupted" },
    { parameter: "Duración media de sesión", value: "3h15", status: "normal" },
    { parameter: "Cliente objetivo", value: "Nivel experto", status: "normal" },
    { parameter: "Temperatura probada", value: "-2°C a +43°C", status: "normal" },
    { parameter: "Masa del producto", value: "1120g", status: "suspicious" },
    { parameter: "Energía de impacto máx", value: "560 Julios", status: "normal" },
    { parameter: "Caída probada (altura)", value: "6,2 metros", status: "corrupted" },
  ]

  const protocolSections = [
    {
      title: "🌡️ RESISTENCIA A LA ABRASIÓN",
      content: [
        "≤ 30°C → mín 35 ciclos",
        "≤ 40°C → mín 40 ciclos",
        "> 40°C → mín 45 + 1 ciclo por grado encima",
        "Ejemplo: 43°C = 45 + (43-40) = 48 ciclos",
      ],
      category: "abrasion",
    },
    {
      title: "⏱️ FRECUENCIA DE USO",
      content: [
        "Uso total/semana = frecuencia × duración diaria",
        "Modelo soporta máx 16h/semana",
        "Más allá = rechazo del producto",
        "Cálculo: 16h ÷ duración diaria = frec. máx",
      ],
      category: "frequency",
    },
    {
      title: "📏 ALTURA DE CAÍDA - ESTÁNDARES",
      content: ["Zapatilla urbana: 1,0 m", "Zapatilla running: 1,2 m", "Zapatilla trail: 1,5 m ✅", "Mochila: 6,0 m"],
      category: "height",
    },
    {
      title: "⚖️ MASA DEL PRODUCTO",
      content: [
        "Kiprun XT9: ~540g por zapatilla",
        "1120g = par mojado (normal)",
        "Este dato es una trampa",
        "Ningún cálculo requerido para este parámetro",
      ],
      category: "mass",
    },
  ]

  const startGame = () => {
    setIsGameActive(true)
  }

  const addError = () => {
    const newErrors = errors + 1
    setErrors(newErrors)
    onError() // Call parent error handler

    if (newErrors >= maxErrors) {
      setGameOver(true)
      setFeedback(`💀 ¡SISTEMA COMPROMETIDO! Demasiados errores de validación. Simulador definitivamente bloqueado.`)
    }
  }

  const validateAnswers = () => {
    if (gameOver) return

    const isAbrasionCorrect = answers.abrasion === correctAnswers.abrasion
    const isFrequencyCorrect = answers.frequency === correctAnswers.frequency
    const isHeightCorrect = answers.height === correctAnswers.height

    if (isAbrasionCorrect && isFrequencyCorrect && isHeightCorrect) {
      setFeedback("✅ VALIDACIÓN DE DATOS: INTEGRIDAD RESTABLECIDA")
      setIsComplete(true)
      setIsGameActive(false)
      // Call completion after a short delay to show the success message
      setTimeout(() => {
        onComplete()
      }, 2000)
    } else {
      addError()
      const errorDetails = []
      if (!isAbrasionCorrect) errorDetails.push("resistencia a la abrasión")
      if (!isFrequencyCorrect) errorDetails.push("frecuencia de uso")
      if (!isHeightCorrect) errorDetails.push("altura de caída")

      setFeedback(
        `❌ ¡ERROR ${errors + 1}/${maxErrors}! Verifica tus cálculos según el protocolo oficial. Parámetros incorrectos: ${errorDetails.join(", ")}.`,
      )
    }
  }

  const resetGame = () => {
    setErrors(0)
    setGameOver(false)
    setIsComplete(false)
    setIsGameActive(false)
    setFeedback("")
    setAnswers({
      abrasion: "",
      frequency: "",
      height: "",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "corrupted":
        return "text-red-400 bg-red-900/30 border-red-500/50"
      case "suspicious":
        return "text-yellow-400 bg-yellow-900/30 border-yellow-500/50"
      case "normal":
        return "text-green-400 bg-green-900/30 border-green-500/50"
      default:
        return "text-gray-400 bg-gray-900/30 border-gray-500/50"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "corrupted":
        return "🔴"
      case "suspicious":
        return "🟡"
      case "normal":
        return "🟢"
      default:
        return "⚪"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900 to-orange-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-72 h-72 bg-red-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-orange-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-2000"></div>
      </div>

      {/* Glitch effect overlay */}
      <div
        className={`absolute inset-0 opacity-5 transition-opacity duration-300 ${showDataCorruption ? "opacity-20" : "opacity-5"}`}
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(255,0,0,0.1) 2px, rgba(255,0,0,0.1) 4px)",
        }}
      ></div>

      <div className="relative z-10 max-w-6xl mx-auto p-6 space-y-8">
        {/* Back Button */}
        <div className="flex justify-start">
          <Button onClick={onBack} variant="outline" className="border-red-500/50 text-red-300 hover:bg-red-500/20">
            <ArrowLeft className="w-4 h-4 mr-2" />
            VOLVER AL HUB
          </Button>
        </div>

        {/* Futuristic Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-3 bg-black/40 backdrop-blur-sm border border-red-500/30 rounded-full px-8 py-4">
            <Settings className="w-8 h-8 text-red-400" />
            <div>
              <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400">
                SIMULADOR DEFECTUOSO
              </h1>
              <p className="text-red-200 text-sm">SALA 2 • REINICIO CRÍTICO</p>
            </div>
            <Bug className={`w-6 h-6 text-red-500 ${showDataCorruption ? "animate-bounce" : ""}`} />
          </div>
        </div>

        {/* Start Game Interface */}
        {!isGameActive && !gameOver && !isComplete && (
          <div className="max-w-2xl mx-auto">
            <Card className="bg-black/40 backdrop-blur-sm border border-red-500/30 shadow-2xl">
              <CardContent className="pt-8 text-center space-y-6">
                <div className="space-y-4">
                  <Settings className="w-16 h-16 text-red-400 mx-auto animate-spin" />
                  <h2 className="text-2xl font-bold text-white">SISTEMA DEFECTUOSO DETECTADO</h2>
                  <p className="text-red-200">
                    El banco de pruebas automatizado KIPRUN XT9 se ha bloqueado después de una corrupción de datos. Se
                    requiere tu experiencia para identificar y corregir los parámetros falsificados.
                  </p>
                </div>

                <div className="bg-orange-900/30 border border-orange-500/50 rounded-lg p-4">
                  <h3 className="text-orange-300 font-semibold mb-2">🔧 MISIÓN CRÍTICA</h3>
                  <div className="text-sm text-orange-200 space-y-1">
                    <p>• Analizar la ficha de prueba corrompida</p>
                    <p>• Identificar 3 parámetros falsificados</p>
                    <p>• Calcular los valores correctos</p>
                    <p>• Reiniciar el simulador</p>
                  </div>
                </div>

                <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-4">
                  <h3 className="text-red-300 font-semibold mb-2">⚠️ PARÁMETROS DE SEGURIDAD</h3>
                  <div className="text-sm text-red-200 space-y-1">
                    <p>• Errores permitidos: 3 máximo</p>
                    <p>• Penalización por error: +15 segundos al cronómetro global</p>
                  </div>
                </div>

                <Button
                  onClick={startGame}
                  size="lg"
                  className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-bold py-4 px-8 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300"
                >
                  <Zap className="w-5 h-5 mr-2" />
                  ACCEDER AL SISTEMA
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Game Over Screen */}
        {gameOver && (
          <div className="max-w-2xl mx-auto">
            <Card className="bg-red-900/40 backdrop-blur-sm border border-red-500/50 shadow-2xl">
              <CardContent className="pt-8">
                <div className="text-center space-y-6">
                  <XCircle className="w-20 h-20 text-red-400 mx-auto animate-pulse" />
                  <div>
                    <h2 className="text-3xl font-bold text-red-300 mb-2">SISTEMA COMPROMETIDO</h2>
                    <p className="text-red-200">{feedback}</p>
                  </div>

                  <div className="bg-black/40 rounded-lg p-4">
                    <div className="grid grid-cols-1 gap-4 text-sm">
                      <div>
                        <p className="text-gray-400">Errores cometidos</p>
                        <p className="text-red-300 font-bold">
                          {errors}/{maxErrors}
                        </p>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={resetGame}
                    className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700"
                  >
                    REINICIAR EL SISTEMA
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Game Interface */}
        {isGameActive && !gameOver && !isComplete && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Panel - Test Data */}
            <div className="lg:col-span-2 space-y-4">
              <Card className="bg-black/40 backdrop-blur-sm border border-yellow-500/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-yellow-300">
                    <FileText className="w-5 h-5" />
                    FICHA DE PRUEBA KIPRUN XT9
                    <Badge variant="destructive" className="ml-auto">
                      DATOS CORROMPIDOS
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-3">
                    {testData.map((item, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded-lg border transition-all duration-300 ${getStatusColor(item.status)} ${
                          showDataCorruption && item.status === "corrupted" ? "animate-pulse" : ""
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{item.parameter}</span>
                          <div className="flex items-center gap-2">
                            <span className="font-mono">{item.value}</span>
                            <span className="text-xs">{getStatusIcon(item.status)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Alert className="bg-red-900/30 border-red-500/50">
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                    <AlertDescription className="text-red-200">
                      <strong>ALERTA:</strong> Algunos valores son inconsistentes o falsificados. Usa tu experiencia
                      para identificar las anomalías.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>

              {/* Input Panel */}
              <Card className="bg-black/40 backdrop-blur-sm border border-orange-500/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-orange-300">
                    <Target className="w-5 h-5" />
                    PARÁMETROS DE REINICIO
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-orange-300">A. Resistencia a la abrasión</label>
                      <div className="relative">
                        <Input
                          type="number"
                          value={answers.abrasion}
                          onChange={(e) => setAnswers({ ...answers, abrasion: e.target.value })}
                          placeholder="XX ciclos"
                          className="bg-black/60 border-orange-500/50 text-orange-100 pr-16"
                        />
                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">
                          ciclos
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-orange-300">B. Frecuencia de uso</label>
                      <div className="relative">
                        <Input
                          type="number"
                          value={answers.frequency}
                          onChange={(e) => setAnswers({ ...answers, frequency: e.target.value })}
                          placeholder="X días"
                          className="bg-black/60 border-orange-500/50 text-orange-100 pr-20"
                        />
                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">
                          d/sem
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-orange-300">C. Altura de caída</label>
                      <div className="relative">
                        <Input
                          type="number"
                          step="0.1"
                          value={answers.height}
                          onChange={(e) => setAnswers({ ...answers, height: e.target.value })}
                          placeholder="X.X metros"
                          className="bg-black/60 border-orange-500/50 text-orange-100 pr-12"
                        />
                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">
                          m
                        </span>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={validateAnswers}
                    disabled={!answers.abrasion || !answers.frequency || !answers.height}
                    className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 disabled:opacity-50"
                  >
                    <Settings className="w-5 h-5 mr-2" />
                    REINICIAR EL SIMULADOR
                  </Button>

                  {/* Feedback */}
                  {feedback && (
                    <Alert
                      className={`${
                        feedback.includes("✅")
                          ? "bg-green-900/30 border-green-500/50"
                          : "bg-red-900/30 border-red-500/50"
                      } backdrop-blur-sm`}
                    >
                      <AlertDescription
                        className={`font-medium ${feedback.includes("✅") ? "text-green-200" : "text-red-200"}`}
                      >
                        {feedback}
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right Panel - Hints */}
            <div className="lg:col-span-1 space-y-4">
              <Card className="bg-black/40 backdrop-blur-sm border border-green-500/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-300">
                    <Database className="w-5 h-5" />
                    PROTOCOLO OFICIAL DE PRUEBA
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {protocolSections.map((section, index) => (
                      <div key={index} className="bg-blue-900/30 p-3 rounded border border-blue-500/30">
                        <h4 className="text-blue-300 font-semibold text-sm mb-2">{section.title}</h4>
                        <div className="text-xs text-blue-200 space-y-1">
                          {section.content.map((line, lineIndex) => (
                            <p key={lineIndex}>{line}</p>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-purple-900/30 p-3 rounded border border-purple-500/30">
                    <h4 className="text-purple-300 font-semibold text-sm mb-2">🧮 CÁLCULOS REQUERIDOS</h4>
                    <div className="text-xs text-purple-200 space-y-1">
                      <p>• Temperatura máx probada: 43°C</p>
                      <p>• Duración diaria: 3h15 = 3,25h</p>
                      <p>• Uso máx permitido: 16h/semana</p>
                      <p>• Tipo producto: Zapatilla trail</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Product Info */}
              <Card className="bg-black/40 backdrop-blur-sm border border-blue-500/30">
                <CardHeader>
                  <CardTitle className="text-blue-300 text-sm">PRODUCTO PROBADO</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg mx-auto mb-2 flex items-center justify-center">
                        <span className="text-white font-bold text-xs">XT9</span>
                      </div>
                      <h3 className="text-blue-200 font-semibold">KIPRUN XT9</h3>
                      <p className="text-xs text-gray-400">Zapatilla de trail</p>
                    </div>

                    <div className="text-xs text-blue-200 space-y-1">
                      <p>• Categoría: Trail running</p>
                      <p>• Nivel: Experto</p>
                      <p>• Uso: Larga distancia</p>
                      <p>• Terreno: Técnico</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Success Screen */}
        {isComplete && (
          <div className="max-w-2xl mx-auto">
            <Card className="bg-green-900/40 backdrop-blur-sm border border-green-500/50 shadow-2xl">
              <CardContent className="pt-8">
                <div className="text-center space-y-6">
                  <CheckCircle className="w-20 h-20 text-green-400 mx-auto animate-pulse" />
                  <div>
                    <h2 className="text-3xl font-bold text-green-300 mb-2">SIMULADOR REINICIADO</h2>
                    <p className="text-green-200">Validación de datos: Integridad restablecida</p>
                    <p className="text-green-200 mt-2">Redirección al hub en 2 segundos...</p>
                  </div>

                  <div className="bg-black/40 rounded-lg p-6">
                    <h3 className="text-green-300 font-semibold mb-4">INFORME DE CORRECCIÓN</h3>
                    <div className="grid grid-cols-1 gap-4 text-sm mb-4">
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <p className="text-gray-400">Abrasión</p>
                          <p className="text-green-300 font-bold">{answers.abrasion} ciclos</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Frecuencia</p>
                          <p className="text-green-300 font-bold">{answers.frequency} d/sem</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Altura</p>
                          <p className="text-green-300 font-bold">{answers.height} m</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <p className="text-gray-400">Errores detectados</p>
                          <p className="text-green-300 font-bold">
                            {errors}/{maxErrors}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
