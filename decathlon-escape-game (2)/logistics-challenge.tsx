"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  CheckCircle,
  Package,
  Database,
  AlertTriangle,
  XCircle,
  Zap,
  Target,
  Truck,
  Scale,
  ArrowLeft,
} from "lucide-react"

interface LogisticsChallengeProps {
  onComplete: () => void
  onError: () => void
  onBack: () => void
}

export default function LogisticsChallenge({ onComplete, onError, onBack }: LogisticsChallengeProps) {
  const [showReference, setShowReference] = useState(false)
  const [isGameActive, setIsGameActive] = useState(false)
  const [errors, setErrors] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [answers, setAnswers] = useState({
    incorrectBox: "",
    expectedWeight: "",
    errorType: "",
  })
  const [feedback, setFeedback] = useState("")
  const [isComplete, setIsComplete] = useState(false)

  const maxErrors = 3
  const correctAnswers = {
    incorrectBox: "D",
    expectedWeight: "3.75",
    errorType: "weight",
  }

  // Carton data
  const cartonData = [
    { id: "A", code: "32870", product: "Espinilleras", quantity: 10, weight: "3,6 kg" },
    { id: "B", code: "32880", product: "Balón de fútbol", quantity: 6, weight: "2,4 kg" },
    { id: "C", code: "32890", product: "Zapatillas fútbol sala", quantity: 4, weight: "3,2 kg" },
    { id: "D", code: "32900", product: "Short entrenamiento", quantity: 15, weight: "4,5 kg" },
  ]

  // Product reference data
  const productReference = [
    { code: "32870", name: "Espinilleras Kipsta", unitWeight: 360 },
    { code: "32880", name: "Balón de fútbol Kipsta", unitWeight: 410 },
    { code: "32890", name: "Zapatillas fútbol sala", unitWeight: 850 },
    { code: "32900", name: "Short entrenamiento", unitWeight: 250 },
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
      setFeedback(`💀 ¡DEMASIADOS ERRORES! Validación fallida después de ${maxErrors} errores.`)
    }
  }

  const validateAnswers = () => {
    if (gameOver) return

    const isBoxCorrect = answers.incorrectBox === correctAnswers.incorrectBox
    const isWeightCorrect =
      Number.parseFloat(answers.expectedWeight) === Number.parseFloat(correctAnswers.expectedWeight)

    if (isBoxCorrect && isWeightCorrect) {
      setFeedback("✅ ¡VALIDACIÓN EXITOSA! Caja incorrecta identificada con precisión.")
      setIsComplete(true)
      setIsGameActive(false)
      // Call completion after a short delay to show the success message
      setTimeout(() => {
        onComplete()
      }, 2000)
    } else {
      addError()
      const errorDetails = []
      if (!isBoxCorrect) errorDetails.push("caja incorrecta")
      if (!isWeightCorrect) errorDetails.push("peso esperado")

      setFeedback(
        `❌ ¡ERROR ${errors + 1}/${maxErrors}! Verifica tus cálculos. Parámetros incorrectos: ${errorDetails.join(", ")}.`,
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
      incorrectBox: "",
      expectedWeight: "",
      errorType: "",
    })
  }

  const getCartonStatus = (cartonId: string) => {
    const carton = cartonData.find((c) => c.id === cartonId)
    const product = productReference.find((p) => p.code === carton?.code)

    if (carton && product) {
      const expectedWeight = (carton.quantity * product.unitWeight) / 1000
      const actualWeight = Number.parseFloat(carton.weight.replace(",", ".").replace(" kg", ""))
      const difference = Math.abs(expectedWeight - actualWeight)

      if (difference < 0.01) return "correct"
      if (difference > 0.5) return "major-error"
      return "minor-error"
    }
    return "unknown"
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "correct":
        return "bg-green-900/30 border-green-500/50 text-green-300"
      case "minor-error":
        return "bg-yellow-900/30 border-yellow-500/50 text-yellow-300"
      case "major-error":
        return "bg-red-900/30 border-red-500/50 text-red-300"
      default:
        return "bg-gray-900/30 border-gray-500/50 text-gray-300"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
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
        {/* Back Button */}
        <div className="flex justify-start">
          <Button onClick={onBack} variant="outline" className="border-blue-500/50 text-blue-300 hover:bg-blue-500/20">
            <ArrowLeft className="w-4 h-4 mr-2" />
            VOLVER AL HUB
          </Button>
        </div>

        {/* Futuristic Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-3 bg-black/40 backdrop-blur-sm border border-blue-500/30 rounded-full px-8 py-4">
            <Truck className="w-8 h-8 text-blue-400" />
            <div>
              <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                CONTROL LOGÍSTICO
              </h1>
              <p className="text-blue-200 text-sm">SALA 1 • VALIDACIÓN DE CAJAS</p>
            </div>
          </div>
        </div>

        {/* Start Game Interface */}
        {!isGameActive && !gameOver && !isComplete && (
          <div className="max-w-2xl mx-auto">
            <Card className="bg-black/40 backdrop-blur-sm border border-blue-500/30 shadow-2xl">
              <CardContent className="pt-8 text-center space-y-6">
                <div className="space-y-4">
                  <Package className="w-16 h-16 text-blue-400 mx-auto animate-bounce" />
                  <h2 className="text-2xl font-bold text-white">CONTROL DE CALIDAD REQUERIDO</h2>
                  <p className="text-blue-200">
                    4 cajas Kipsta están esperando validación. Una de las cajas presenta una anomalía de etiquetado. Se
                    requiere tu experiencia para identificar cuál.
                  </p>
                </div>

                <div className="bg-blue-900/30 border border-blue-500/50 rounded-lg p-4">
                  <h3 className="text-blue-300 font-semibold mb-2">🎯 MISIÓN</h3>
                  <div className="text-sm text-blue-200 space-y-1">
                    <p>• Analizar los datos de cada caja</p>
                    <p>• Calcular el peso esperado según las referencias</p>
                    <p>• Identificar la caja mal etiquetada</p>
                    <p>• Determinar el peso correcto</p>
                  </div>
                </div>

                <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-4">
                  <h3 className="text-red-300 font-semibold mb-2">⚠️ PARÁMETROS</h3>
                  <div className="text-sm text-red-200 space-y-1">
                    <p>• Errores permitidos: 3 máximo</p>
                    <p>• Penalización por error: +15 segundos al cronómetro global</p>
                  </div>
                </div>

                <Button
                  onClick={startGame}
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300"
                >
                  <Zap className="w-5 h-5 mr-2" />
                  COMENZAR EL CONTROL
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
                    <h2 className="text-3xl font-bold text-red-300 mb-2">CONTROL FALLIDO</h2>
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
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    REINTENTAR EL CONTROL
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Game Interface */}
        {isGameActive && !gameOver && !isComplete && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Panel - Carton Data */}
            <div className="lg:col-span-2 space-y-4">
              <Card className="bg-black/40 backdrop-blur-sm border border-yellow-500/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-yellow-300">
                    <Package className="w-5 h-5" />
                    CAJAS EN ESPERA DE VALIDACIÓN
                    <Badge variant="destructive" className="ml-auto">
                      1 ANOMALÍA DETECTADA
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-yellow-300">Caja</TableHead>
                          <TableHead className="text-yellow-300">Código producto</TableHead>
                          <TableHead className="text-yellow-300">Producto</TableHead>
                          <TableHead className="text-yellow-300">Cantidad</TableHead>
                          <TableHead className="text-yellow-300">Peso total</TableHead>
                          <TableHead className="text-yellow-300">Estado</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {cartonData.map((carton) => {
                          const status = getCartonStatus(carton.id)
                          return (
                            <TableRow key={carton.id} className={getStatusColor(status)}>
                              <TableCell className="font-bold">{carton.id}</TableCell>
                              <TableCell className="font-mono">{carton.code}</TableCell>
                              <TableCell>{carton.product}</TableCell>
                              <TableCell>{carton.quantity}</TableCell>
                              <TableCell className="font-mono">{carton.weight}</TableCell>
                              <TableCell>
                                {status === "correct" && "✅"}
                                {status === "minor-error" && "⚠️"}
                                {status === "major-error" && "❌"}
                                {status === "unknown" && "❓"}
                              </TableCell>
                            </TableRow>
                          )
                        })}
                      </TableBody>
                    </Table>
                  </div>

                  <Alert className="bg-orange-900/30 border-orange-500/50">
                    <AlertTriangle className="w-4 h-4 text-orange-400" />
                    <AlertDescription className="text-orange-200">
                      <strong>CONTEXTO:</strong> Cada caja contiene artículos idénticos del mismo código de producto.
                      Una caja presenta una inconsistencia entre el peso declarado y el peso esperado.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>

              {/* Analysis Panel */}
              <Card className="bg-black/40 backdrop-blur-sm border border-purple-500/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-purple-300">
                    <Target className="w-5 h-5" />
                    ANÁLISIS Y VALIDACIÓN
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-purple-300">Caja incorrecta</label>
                      <div className="flex gap-2">
                        {["A", "B", "C", "D"].map((box) => (
                          <Button
                            key={box}
                            variant={answers.incorrectBox === box ? "default" : "outline"}
                            onClick={() => setAnswers({ ...answers, incorrectBox: box })}
                            className={`${
                              answers.incorrectBox === box
                                ? "bg-purple-600 hover:bg-purple-700"
                                : "border-purple-500/50 text-purple-300 hover:bg-purple-500/20"
                            }`}
                          >
                            {box}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-purple-300">Peso esperado (kg)</label>
                      <div className="relative">
                        <Input
                          type="number"
                          step="0.01"
                          value={answers.expectedWeight}
                          onChange={(e) => setAnswers({ ...answers, expectedWeight: e.target.value })}
                          placeholder="X.XX kg"
                          className="bg-black/60 border-purple-500/50 text-purple-100 pr-12"
                        />
                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">
                          kg
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-purple-300">Ayuda para el cálculo</label>
                      <div className="bg-blue-900/30 border border-blue-500/50 rounded-lg p-3">
                        <p className="text-xs text-blue-200 mb-2">
                          💡 Fórmula: Peso esperado = Cantidad × Peso unitario
                        </p>
                        <p className="text-xs text-blue-200">
                          Consulta la ficha de referencia para los pesos unitarios
                        </p>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={validateAnswers}
                    disabled={!answers.incorrectBox || !answers.expectedWeight}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50"
                  >
                    <Scale className="w-5 h-5 mr-2" />
                    VALIDAR EL ANÁLISIS
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

            {/* Right Panel - Reference */}
            <div className="lg:col-span-1 space-y-4">
              <Card className="bg-black/40 backdrop-blur-sm border border-green-500/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-300">
                    <Database className="w-5 h-5" />
                    FICHA DE REFERENCIA
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowReference(!showReference)}
                      className="ml-auto border-green-500/50 text-green-300 hover:bg-green-500/20"
                    >
                      {showReference ? "OCULTAR" : "CONSULTAR"}
                    </Button>
                  </CardTitle>
                </CardHeader>
                {showReference && (
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <h4 className="text-green-300 font-semibold text-sm">PESOS UNITARIOS OFICIALES</h4>
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="text-green-300 text-xs">Código</TableHead>
                              <TableHead className="text-green-300 text-xs">Producto</TableHead>
                              <TableHead className="text-green-300 text-xs">Peso</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {productReference.map((product, index) => (
                              <TableRow key={index}>
                                <TableCell className="text-green-100 text-xs font-mono">{product.code}</TableCell>
                                <TableCell className="text-green-100 text-xs">{product.name}</TableCell>
                                <TableCell className="text-green-100 text-xs font-mono">
                                  {product.unitWeight}g
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>

                    <div className="bg-blue-900/30 p-3 rounded border border-blue-500/30">
                      <h4 className="text-blue-300 font-semibold text-sm mb-2">🧮 FÓRMULA</h4>
                      <div className="text-xs text-blue-200 space-y-1">
                        <p>Peso esperado = Cantidad × Peso unitario</p>
                        <p>Ejemplo: 10 × 360g = 3600g = 3,6 kg</p>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>

              {/* Instructions */}
              <Card className="bg-black/40 backdrop-blur-sm border border-blue-500/30">
                <CardHeader>
                  <CardTitle className="text-blue-300 text-sm">INSTRUCCIONES</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-xs text-blue-200 space-y-2">
                      <p>
                        <strong>1.</strong> Consulta la ficha de referencia para conocer los pesos unitarios
                      </p>
                      <p>
                        <strong>2.</strong> Calcula el peso esperado para cada caja
                      </p>
                      <p>
                        <strong>3.</strong> Compara con el peso declarado en la etiqueta
                      </p>
                      <p>
                        <strong>4.</strong> Identifica la caja con la mayor diferencia
                      </p>
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
                    <h2 className="text-3xl font-bold text-green-300 mb-2">CONTROL VALIDADO</h2>
                    <p className="text-green-200">Anomalía identificada con éxito</p>
                    <p className="text-green-200 mt-2">Redirección al hub en 2 segundos...</p>
                  </div>

                  <div className="bg-black/40 rounded-lg p-6">
                    <h3 className="text-green-300 font-semibold mb-4">INFORME DE VALIDACIÓN</h3>
                    <div className="grid grid-cols-1 gap-4 text-sm mb-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-gray-400">Caja incorrecta</p>
                          <p className="text-green-300 font-bold">Caja {answers.incorrectBox}</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Peso correcto</p>
                          <p className="text-green-300 font-bold">{answers.expectedWeight} kg</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <p className="text-gray-400">Errores cometidos</p>
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
