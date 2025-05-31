"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  CheckCircle,
  FileText,
  Calculator,
  AlertTriangle,
  XCircle,
  Zap,
  Target,
  ClipboardCheck,
  Package2,
  ArrowLeft,
} from "lucide-react"

interface QualityControlChallengeProps {
  onComplete: () => void
  onError: () => void
  onBack: () => void
}

export default function QualityControlChallenge({ onComplete, onError, onBack }: QualityControlChallengeProps) {
  const [isGameActive, setIsGameActive] = useState(false)
  const [errors, setErrors] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [answers, setAnswers] = useState({
    incorrectLine: "",
    errorField: "",
    correctValue: "",
  })
  const [feedback, setFeedback] = useState("")
  const [isComplete, setIsComplete] = useState(false)
  const [showCalculations, setShowCalculations] = useState(false)

  const maxErrors = 3
  const correctAnswers = {
    incorrectLine: "Zapatillas fitness",
    errorField: "Volumen total",
    correctValue: "15",
  }

  // Shipment data
  const shipmentData = [
    { product: "Short Domyos", code: "43510", quantity: 12, unitVolume: 1.8, totalVolume: 21.6 },
    { product: "Esterilla de yoga", code: "43540", quantity: 5, unitVolume: 7.5, totalVolume: 37.5 },
    { product: "Mancuerna 5 kg", code: "43600", quantity: 8, unitVolume: 1.2, totalVolume: 9.6 },
    { product: "Zapatillas fitness", code: "43580", quantity: 6, unitVolume: 2.5, totalVolume: 12 }, // Error here: should be 15
    { product: "Pelota de gimnasia", code: "43520", quantity: 3, unitVolume: 14, totalVolume: 56 }, // This looks wrong but it's a red herring
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

    const isLineCorrect = answers.incorrectLine === correctAnswers.incorrectLine
    const isFieldCorrect = answers.errorField === correctAnswers.errorField
    const isValueCorrect = answers.correctValue === correctAnswers.correctValue

    if (isLineCorrect && isFieldCorrect && isValueCorrect) {
      setFeedback("✅ ¡VALIDACIÓN EXITOSA! Informe de envío corregido con precisión.")
      setIsComplete(true)
      setIsGameActive(false)
      // Call completion after a short delay to show the success message
      setTimeout(() => {
        onComplete()
      }, 2000)
    } else {
      addError()
      const errorDetails = []
      if (!isLineCorrect) errorDetails.push("línea incorrecta")
      if (!isFieldCorrect) errorDetails.push("campo erróneo")
      if (!isValueCorrect) errorDetails.push("valor correcto")

      setFeedback(
        `❌ ¡ERROR ${errors + 1}/${maxErrors}! Verifica tu análisis. Parámetros incorrectos: ${errorDetails.join(", ")}.`,
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
      incorrectLine: "",
      errorField: "",
      correctValue: "",
    })
  }

  const getRowStatus = (item: any) => {
    const expectedTotal = item.quantity * item.unitVolume
    const actualTotal = item.totalVolume
    const difference = Math.abs(expectedTotal - actualTotal)

    if (difference < 0.01) return "correct"
    if (difference > 2) return "major-error"
    return "minor-error"
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

  const calculateExpected = (quantity: number, unitVolume: number) => {
    return (quantity * unitVolume).toFixed(1)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-teal-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-teal-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-emerald-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-2000"></div>
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
          <Button
            onClick={onBack}
            variant="outline"
            className="border-green-500/50 text-green-300 hover:bg-green-500/20"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            VOLVER AL HUB
          </Button>
        </div>

        {/* Futuristic Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-3 bg-black/40 backdrop-blur-sm border border-green-500/30 rounded-full px-8 py-4">
            <ClipboardCheck className="w-8 h-8 text-green-400" />
            <div>
              <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-teal-400 to-emerald-400">
                CONTROL DE CALIDAD FINAL
              </h1>
              <p className="text-green-200 text-sm">SALA 3 • VALIDACIÓN DE ENVÍO</p>
            </div>
          </div>
        </div>

        {/* Start Game Interface */}
        {!isGameActive && !gameOver && !isComplete && (
          <div className="max-w-2xl mx-auto">
            <Card className="bg-black/40 backdrop-blur-sm border border-green-500/30 shadow-2xl">
              <CardContent className="pt-8 text-center space-y-6">
                <div className="space-y-4">
                  <Package2 className="w-16 h-16 text-green-400 mx-auto animate-pulse" />
                  <h2 className="text-2xl font-bold text-white">CONTROL FINAL REQUERIDO</h2>
                  <p className="text-green-200">
                    Un informe de envío presenta una inconsistencia en los datos. Un bug de software ha modificado un
                    solo valor numérico. Se requiere tu experiencia para identificar y corregir el error.
                  </p>
                </div>

                <div className="bg-green-900/30 border border-green-500/50 rounded-lg p-4">
                  <h3 className="text-green-300 font-semibold mb-2">🎯 MISIÓN FINAL</h3>
                  <div className="text-sm text-green-200 space-y-1">
                    <p>• Analizar el informe de envío n° 0031D</p>
                    <p>• Identificar la línea con la inconsistencia</p>
                    <p>• Determinar el campo erróneo</p>
                    <p>• Corregir el valor incorrecto</p>
                  </div>
                </div>

                <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-4">
                  <h3 className="text-red-300 font-semibold mb-2">⚠️ PARÁMETROS FINALES</h3>
                  <div className="text-sm text-red-200 space-y-1">
                    <p>• Errores permitidos: 3 máximo</p>
                    <p>• Penalización por error: +15 segundos al cronómetro global</p>
                    <p>• Solo un valor ha sido modificado</p>
                  </div>
                </div>

                <Button
                  onClick={startGame}
                  size="lg"
                  className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-bold py-4 px-8 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300"
                >
                  <Zap className="w-5 h-5 mr-2" />
                  COMENZAR EL CONTROL FINAL
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
                    className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700"
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
            {/* Left Panel - Shipment Data */}
            <div className="lg:col-span-2 space-y-4">
              <Card className="bg-black/40 backdrop-blur-sm border border-yellow-500/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-yellow-300">
                    <FileText className="w-5 h-5" />
                    ALBARÁN DE PREPARACIÓN N° 0031D
                    <Badge variant="destructive" className="ml-auto">
                      1 ERROR DETECTADO
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-yellow-300">Producto</TableHead>
                          <TableHead className="text-yellow-300">Código</TableHead>
                          <TableHead className="text-yellow-300">Cant</TableHead>
                          <TableHead className="text-yellow-300">Volumen unitario (L)</TableHead>
                          <TableHead className="text-yellow-300">Volumen total (L)</TableHead>
                          <TableHead className="text-yellow-300">Estado</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {shipmentData.map((item, index) => {
                          const status = getRowStatus(item)
                          return (
                            <TableRow key={index} className={getStatusColor(status)}>
                              <TableCell className="font-medium">{item.product}</TableCell>
                              <TableCell className="font-mono">{item.code}</TableCell>
                              <TableCell>{item.quantity}</TableCell>
                              <TableCell>{item.unitVolume}</TableCell>
                              <TableCell className="font-mono">{item.totalVolume}</TableCell>
                              <TableCell>
                                {status === "correct" && "✅"}
                                {status === "minor-error" && "⚠️"}
                                {status === "major-error" && "❌"}
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
                      <strong>RECORDATORIO:</strong> El volumen total debe ser igual a: cantidad × volumen unitario. Un
                      bug de software ha modificado un solo valor numérico en este informe.
                    </AlertDescription>
                  </Alert>

                  {showCalculations && (
                    <div className="bg-blue-900/30 border border-blue-500/50 rounded-lg p-4">
                      <h4 className="text-blue-300 font-semibold mb-3">📊 VERIFICACIONES</h4>
                      <div className="space-y-2 text-sm">
                        {shipmentData.map((item, index) => {
                          const expected = calculateExpected(item.quantity, item.unitVolume)
                          const isCorrect = Math.abs(Number.parseFloat(expected) - item.totalVolume) < 0.01
                          return (
                            <div key={index} className="flex justify-between items-center">
                              <span className="text-blue-200">{item.product}:</span>
                              <span className={isCorrect ? "text-green-300" : "text-red-300"}>
                                {item.quantity} × {item.unitVolume} = {expected}L{" "}
                                {isCorrect ? "✅" : `❌ (mostrado: ${item.totalVolume}L)`}
                              </span>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  <Button
                    onClick={() => setShowCalculations(!showCalculations)}
                    variant="outline"
                    className="w-full border-blue-500/50 text-blue-300 hover:bg-blue-500/20"
                  >
                    <Calculator className="w-4 h-4 mr-2" />
                    {showCalculations ? "OCULTAR" : "MOSTRAR"} LAS VERIFICACIONES
                  </Button>
                </CardContent>
              </Card>

              {/* Analysis Panel */}
              <Card className="bg-black/40 backdrop-blur-sm border border-green-500/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-300">
                    <Target className="w-5 h-5" />
                    ANÁLISIS Y CORRECCIÓN
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-green-300">Línea incorrecta</label>
                      <Select
                        value={answers.incorrectLine}
                        onValueChange={(value) => setAnswers({ ...answers, incorrectLine: value })}
                      >
                        <SelectTrigger className="bg-black/60 border-green-500/50 text-green-100">
                          <SelectValue placeholder="Seleccionar..." />
                        </SelectTrigger>
                        <SelectContent>
                          {shipmentData.map((item) => (
                            <SelectItem key={item.product} value={item.product}>
                              {item.product}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-green-300">Campo erróneo</label>
                      <Select
                        value={answers.errorField}
                        onValueChange={(value) => setAnswers({ ...answers, errorField: value })}
                      >
                        <SelectTrigger className="bg-black/60 border-green-500/50 text-green-100">
                          <SelectValue placeholder="Seleccionar..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Cantidad">Cantidad</SelectItem>
                          <SelectItem value="Volumen unitario">Volumen unitario</SelectItem>
                          <SelectItem value="Volumen total">Volumen total</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-green-300">Valor correcto</label>
                      <div className="relative">
                        <Input
                          type="number"
                          step="0.1"
                          value={answers.correctValue}
                          onChange={(e) => setAnswers({ ...answers, correctValue: e.target.value })}
                          placeholder="Nuevo valor"
                          className="bg-black/60 border-green-500/50 text-green-100"
                        />
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={validateAnswers}
                    disabled={!answers.incorrectLine || !answers.errorField || !answers.correctValue}
                    className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 disabled:opacity-50"
                  >
                    <ClipboardCheck className="w-5 h-5 mr-2" />
                    VALIDAR LA CORRECCIÓN
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

            {/* Right Panel - Instructions */}
            <div className="lg:col-span-1 space-y-4">
              <Card className="bg-black/40 backdrop-blur-sm border border-blue-500/30">
                <CardHeader>
                  <CardTitle className="text-blue-300 text-sm">CONSIGNA DE MISIÓN</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-xs text-blue-200 space-y-2">
                      <p>
                        <strong>1.</strong> Un bug de software ha modificado un valor numérico único en el informe
                      </p>
                      <p>
                        <strong>2.</strong> Identifica la línea incorrecta
                      </p>
                      <p>
                        <strong>3.</strong> Identifica el campo erróneo
                      </p>
                      <p>
                        <strong>4.</strong> Corrige el valor y justifica la modificación
                      </p>
                    </div>

                    <div className="bg-green-900/30 p-3 rounded border border-green-500/30">
                      <h4 className="text-green-300 font-semibold text-sm mb-2">✔️ RECORDATORIO</h4>
                      <p className="text-xs text-green-200">El volumen total debe ser = cantidad × volumen unitario</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black/40 backdrop-blur-sm border border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-purple-300 text-sm">ESTRATEGIA</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-xs text-purple-200 space-y-2">
                      <p>• Calcula el volumen esperado para cada línea</p>
                      <p>• Compara con el volumen total mostrado</p>
                      <p>• Identifica las inconsistencias</p>
                      <p>• Analiza qué corrección es la más lógica</p>
                      <p>• Recuerda: solo un valor ha sido modificado</p>
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
                    <h2 className="text-3xl font-bold text-green-300 mb-2">¡MISIÓN CUMPLIDA!</h2>
                    <p className="text-green-200">Informe de envío corregido con éxito</p>
                    <p className="text-green-200 mt-2">Redirección al hub en 2 segundos...</p>
                  </div>

                  <div className="bg-black/40 rounded-lg p-6">
                    <h3 className="text-green-300 font-semibold mb-4">INFORME FINAL</h3>
                    <div className="grid grid-cols-1 gap-4 text-sm mb-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-gray-400">Línea corregida</p>
                          <p className="text-green-300 font-bold">{answers.incorrectLine}</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Campo modificado</p>
                          <p className="text-green-300 font-bold">{answers.errorField}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-gray-400">Nuevo valor</p>
                          <p className="text-green-300 font-bold">{answers.correctValue}L</p>
                        </div>
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
