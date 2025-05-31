"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Clock, Target, Trophy, AlertTriangle, Zap, Search, Eye, EyeOff } from "lucide-react"

type GameState = "intro" | "sala1" | "sala2" | "sala3" | "quiz" | "bonus" | "victory" | "defeat"

export default function DecathlonEscapeGame() {
  const [gameState, setGameState] = useState<GameState>("intro")
  const [timeLeft, setTimeLeft] = useState(3600) // 60 minutes
  const [isGameActive, setIsGameActive] = useState(false)

  // Sala 1 states
  const [obstacle1Complete, setObstacle1Complete] = useState(false)
  const [obstacle2Progress, setObstacle2Progress] = useState(0)
  const [obstacle3Sequence, setObstacle3Sequence] = useState<string[]>([])
  const [currentObstacle, setCurrentObstacle] = useState(1)

  // Sala 2 states
  const [selectedFormula, setSelectedFormula] = useState("")
  const [loupeActive, setLoupeActive] = useState(false)
  const [testTubesClicked, setTestTubesClicked] = useState<number[]>([])

  // Sala 3 states
  const [isGuideMode, setIsGuideMode] = useState(false)
  const [collectedKeys, setCollectedKeys] = useState<string[]>([])
  const [wrongKeyClicked, setWrongKeyClicked] = useState(false)

  // Quiz states
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [quizErrors, setQuizErrors] = useState(0)

  // Bonus states
  const [showBonus, setShowBonus] = useState(false)

  // Timer effect
  useEffect(() => {
    if (!isGameActive) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setGameState("defeat")
          setIsGameActive(false)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isGameActive])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const loseTime = () => {
    setTimeLeft((prev) => Math.max(0, prev - 60)) // Lose 1 minute
  }

  const startGame = () => {
    setIsGameActive(true)
    setGameState("sala1")
  }

  // Sala 1 functions
  const handleObstacle1 = () => {
    setObstacle1Complete(true)
    setCurrentObstacle(2)
  }

  const handleObstacle2Key = (key: string) => {
    const sequence = ["A", "D", "A", "D", "A", "D"]
    if (key === sequence[obstacle2Progress]) {
      const newProgress = obstacle2Progress + 1
      setObstacle2Progress(newProgress)
      if (newProgress >= 6) {
        setCurrentObstacle(3)
      }
    } else {
      setObstacle2Progress(0)
      loseTime()
    }
  }

  const handleObstacle3Key = (direction: string) => {
    const correctSequence = ["←", "←", "→", "→", "←"]
    const newSequence = [...obstacle3Sequence, direction]

    if (direction === correctSequence[obstacle3Sequence.length]) {
      setObstacle3Sequence(newSequence)
      if (newSequence.length >= 5) {
        setGameState("sala2")
      }
    } else {
      setObstacle3Sequence([])
      loseTime()
    }
  }

  // Sala 2 functions
  const checkFormula = () => {
    if (selectedFormula === "O2-Mg-Fe") {
      setGameState("sala3")
    } else {
      loseTime()
    }
  }

  const handleTestTube = (tubeId: number) => {
    if (!testTubesClicked.includes(tubeId)) {
      setTestTubesClicked([...testTubesClicked, tubeId])
    }
  }

  // Sala 3 functions
  const handleKeyClick = (position: string) => {
    const correctKeys = ["B2", "D4", "E1"]
    const wrongKeys = ["A3", "C5"]

    if (wrongKeys.includes(position)) {
      setWrongKeyClicked(true)
      loseTime()
      return
    }

    if (correctKeys.includes(position) && !collectedKeys.includes(position)) {
      const newKeys = [...collectedKeys, position]
      setCollectedKeys(newKeys)
      if (newKeys.length >= 3) {
        setGameState("quiz")
      }
    }
  }

  // Quiz functions
  const quizQuestions = [
    {
      question: "¿En qué año se fundó Decathlon?",
      options: ["1975", "1976", "1977", "1978"],
      correct: 1,
    },
    {
      question: "¿En qué ciudad francesa se encuentra la sede mundial de Decathlon?",
      options: ["París", "Lyon", "Villeneuve-d'Ascq", "Marsella"],
      correct: 2,
    },
    {
      question: "¿Cuál es el nombre de la marca Decathlon especializada en productos acuáticos?",
      options: ["Aquatech", "Nabaiji", "Swimtech", "Waterline"],
      correct: 1,
    },
    {
      question: "¿Qué significa el acrónimo 'KPI', utilizado habitualmente en Decathlon?",
      options: [
        "Key Performance Indicator",
        "Keep Performance Index",
        "Key Product Information",
        "Keep Product Inventory",
      ],
      correct: 0,
    },
  ]

  const handleQuizAnswer = (answerIndex: number) => {
    if (answerIndex === quizQuestions[currentQuestion].correct) {
      setCorrectAnswers((prev) => prev + 1)
    } else {
      setQuizErrors((prev) => prev + 1)
      setTimeLeft((prev) => Math.floor(prev / 2))
    }

    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion((prev) => prev + 1)
    } else {
      if (correctAnswers >= 2) {
        // Need 3 out of 4, but we count from 0
        setShowBonus(true)
      } else {
        setGameState("defeat")
      }
    }
  }

  const handleBonusChoice = (choice: "take" | "risk") => {
    if (choice === "take") {
      setGameState("victory")
    } else {
      setGameState("bonus")
    }
  }

  const handleBonusAnswer = (answer: string) => {
    if (answer === "174") {
      setGameState("victory")
    } else {
      setGameState("defeat")
    }
  }

  const renderGameContent = () => {
    switch (gameState) {
      case "intro":
        return (
          <div className="text-center space-y-8 p-8">
            <div className="space-y-6">
              <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-red-500">
                DECATHLON ESPAÑA
              </h1>
              <h2 className="text-3xl font-bold text-gray-700">EL LABORATORIO DEL FUTURO</h2>

              <div className="bg-gradient-to-r from-blue-100 to-red-100 rounded-lg p-6 max-w-2xl mx-auto">
                <p className="text-lg text-gray-700 mb-4">¡Bienvenidos al proyecto que cambiará la humanidad!</p>
                <p className="text-md text-gray-600">El futuro del deporte está en vuestras manos.</p>
                <p className="text-md text-gray-600 mt-2">
                  ¿Podéis descifrar el secreto antes de que sea demasiado tarde?
                </p>
              </div>

              <div className="bg-red-100 border border-red-300 rounded-lg p-4 max-w-lg mx-auto">
                <div className="flex items-center justify-center gap-2 text-red-700">
                  <Clock className="w-5 h-5" />
                  <p className="font-semibold">⏰ Tenéis 60 minutos - Cada error = -1 minuto</p>
                </div>
              </div>

              <Button
                onClick={startGame}
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-red-600 hover:from-blue-700 hover:to-red-700 text-white font-bold py-4 px-8"
              >
                <Zap className="w-5 h-5 mr-2" />
                INICIAR MISIÓN
              </Button>
            </div>
          </div>
        )

      case "sala1":
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-blue-600">SALA 1: PRUEBAS FÍSICAS</h2>
              <p className="text-gray-600">El obstáculo digital</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Obstacle 1 */}
              <Card
                className={`${obstacle1Complete ? "bg-green-50 border-green-300" : currentObstacle === 1 ? "bg-blue-50 border-blue-300" : "bg-gray-50"}`}
              >
                <CardHeader>
                  <CardTitle className="text-center">Obstáculo 1: Barra Alta</CardTitle>
                  <CardDescription>Salto sincronizado</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  {obstacle1Complete ? (
                    <div className="text-green-600 font-bold">✅ COMPLETADO</div>
                  ) : currentObstacle === 1 ? (
                    <Button onClick={handleObstacle1} className="w-full">
                      Presionar ESPACIO (todos juntos)
                    </Button>
                  ) : (
                    <div className="text-gray-400">Bloqueado</div>
                  )}
                </CardContent>
              </Card>

              {/* Obstacle 2 */}
              <Card
                className={`${obstacle2Progress >= 6 ? "bg-green-50 border-green-300" : currentObstacle === 2 ? "bg-blue-50 border-blue-300" : "bg-gray-50"}`}
              >
                <CardHeader>
                  <CardTitle className="text-center">Obstáculo 2: Muro Escalada</CardTitle>
                  <CardDescription>Alternancia A-D-A-D-A-D</CardDescription>
                </CardHeader>
                <CardContent className="text-center space-y-2">
                  {obstacle2Progress >= 6 ? (
                    <div className="text-green-600 font-bold">✅ COMPLETADO</div>
                  ) : currentObstacle === 2 ? (
                    <>
                      <Progress value={(obstacle2Progress / 6) * 100} className="w-full" />
                      <p>{obstacle2Progress}/6</p>
                      <div className="flex gap-2 justify-center">
                        <Button onClick={() => handleObstacle2Key("A")} variant="outline">
                          A
                        </Button>
                        <Button onClick={() => handleObstacle2Key("D")} variant="outline">
                          D
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="text-gray-400">Bloqueado</div>
                  )}
                </CardContent>
              </Card>

              {/* Obstacle 3 */}
              <Card
                className={`${obstacle3Sequence.length >= 5 ? "bg-green-50 border-green-300" : currentObstacle === 3 ? "bg-blue-50 border-blue-300" : "bg-gray-50"}`}
              >
                <CardHeader>
                  <CardTitle className="text-center">Obstáculo 3: Puente</CardTitle>
                  <CardDescription>Secuencia: ←←→→←</CardDescription>
                </CardHeader>
                <CardContent className="text-center space-y-2">
                  {obstacle3Sequence.length >= 5 ? (
                    <div className="text-green-600 font-bold">✅ COMPLETADO</div>
                  ) : currentObstacle === 3 ? (
                    <>
                      <p>
                        Secuencia: {obstacle3Sequence.join(" ")} ({obstacle3Sequence.length}/5)
                      </p>
                      <div className="flex gap-2 justify-center">
                        <Button onClick={() => handleObstacle3Key("←")} variant="outline">
                          ←
                        </Button>
                        <Button onClick={() => handleObstacle3Key("→")} variant="outline">
                          →
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="text-gray-400">Bloqueado</div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )

      case "sala2":
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-green-600">SALA 2: DESPACHO DEL CIENTÍFICO</h2>
              <p className="text-gray-600">La fórmula escondida</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Documents */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Documentos Dispersos
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-1 gap-2 text-sm">
                    <div className="bg-yellow-100 p-2 rounded border">
                      <strong>Papel 1:</strong> H2O - NaCl - CO2
                    </div>
                    <div className="bg-blue-100 p-2 rounded border">
                      <strong>Papel 2:</strong> Ca - K - Na - Cl
                    </div>
                    <div
                      className={`p-2 rounded border ${loupeActive ? "bg-green-100 border-green-300" : "bg-gray-100"}`}
                    >
                      <strong>Papel 3 {loupeActive ? "⭐" : ""}:</strong> O2 - Mg - Fe
                    </div>
                    <div className="bg-purple-100 p-2 rounded border">
                      <strong>Papel 4:</strong> N2 - O2 - Ar - CO2
                    </div>
                    <div className="bg-pink-100 p-2 rounded border">
                      <strong>Papel 5:</strong> Fe - Cu - Zn - Al - Pb
                    </div>
                  </div>

                  <Button onClick={() => setLoupeActive(!loupeActive)} variant="outline" className="w-full">
                    <Search className="w-4 h-4 mr-2" />
                    {loupeActive ? "Guardar lupa" : "Usar lupa"}
                  </Button>
                </CardContent>
              </Card>

              {/* Test tubes and formula input */}
              <Card>
                <CardHeader>
                  <CardTitle>Eprouvettes y Fórmula</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-center gap-4">
                    {[
                      { id: 1, color: "bg-red-400", element: "Oxígeno (rojo)" },
                      { id: 2, color: "bg-gray-400", element: "Magnesio (gris)" },
                      { id: 3, color: "bg-orange-600", element: "Hierro (naranja)" },
                    ].map((tube) => (
                      <div key={tube.id} className="text-center">
                        <div
                          className={`w-8 h-16 ${tube.color} rounded-b-full border-2 border-gray-300 cursor-pointer ${testTubesClicked.includes(tube.id) ? "ring-2 ring-blue-500" : ""}`}
                          onClick={() => handleTestTube(tube.id)}
                        />
                        <p className="text-xs mt-1">{tube.element}</p>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Fórmula secreta (3 elementos):</label>
                    <Input
                      value={selectedFormula}
                      onChange={(e) => setSelectedFormula(e.target.value)}
                      placeholder="Ej: O2-Mg-Fe"
                      className="text-center"
                    />
                    <Button onClick={checkFormula} className="w-full">
                      VERIFICAR FÓRMULA
                    </Button>
                  </div>

                  <div className="text-xs text-gray-500">
                    Pista: La fórmula correcta tiene exactamente 3 elementos químicos diferentes y está marcada con una
                    estrella.
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )

      case "sala3":
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-purple-600">SALA 3: SALA DE CONTROL</h2>
              <p className="text-gray-600">Oscuridad total</p>
              <Badge variant="destructive" className="mt-2">
                <AlertTriangle className="w-4 h-4 mr-1" />
                ¡Solo quedan 10 minutos!
              </Badge>
            </div>

            <div className="flex justify-center mb-4">
              <Button
                onClick={() => setIsGuideMode(!isGuideMode)}
                variant={isGuideMode ? "default" : "outline"}
                className="flex items-center gap-2"
              >
                {isGuideMode ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                {isGuideMode ? "Modo Guía (VES las claves)" : "Activar Modo Guía"}
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Grilla de Control (5x5)
                </CardTitle>
                <CardDescription>
                  Claves encontradas: {collectedKeys.length}/3
                  {isGuideMode && <span className="text-green-600 ml-2">(Verde = correcta, Rojo = trampa)</span>}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 gap-2 max-w-md mx-auto">
                  {["A", "B", "C", "D", "E"].map((row) =>
                    [1, 2, 3, 4, 5].map((col) => {
                      const position = `${row}${col}`
                      const isCorrectKey = ["B2", "D4", "E1"].includes(position)
                      const isWrongKey = ["A3", "C5"].includes(position)
                      const isCollected = collectedKeys.includes(position)

                      let buttonClass = "h-12 w-12 text-xs "

                      if (isGuideMode) {
                        if (isCorrectKey) buttonClass += "bg-green-500 hover:bg-green-600 text-white"
                        else if (isWrongKey) buttonClass += "bg-red-500 hover:bg-red-600 text-white"
                        else buttonClass += "bg-gray-700 hover:bg-gray-600 text-white"
                      } else {
                        buttonClass += "bg-gray-900 hover:bg-gray-800 text-white"
                      }

                      if (isCollected) {
                        buttonClass = "h-12 w-12 text-xs bg-blue-500 text-white"
                      }

                      return (
                        <Button
                          key={position}
                          onClick={() => handleKeyClick(position)}
                          className={buttonClass}
                          disabled={isCollected}
                        >
                          {isCollected ? "🗝️" : position}
                        </Button>
                      )
                    }),
                  )}
                </div>

                {wrongKeyClicked && (
                  <div className="text-center mt-4 text-red-600 font-semibold">⚠️ ¡Clave trampa activada! -1 minuto</div>
                )}

                <div className="text-center mt-4 text-sm text-gray-600">
                  Claves correctas: B2, D4, E1 | Trampas: A3, C5
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case "quiz":
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-red-600">DESAFÍO CRÍTICO</h2>
              <p className="text-gray-600">Quiz Decathlon - Necesitas 3/4 correctas</p>
              <div className="flex justify-center gap-4 mt-4">
                <Badge variant="outline" className="border-green-500 text-green-600">
                  Correctas: {correctAnswers}
                </Badge>
                <Badge variant="destructive">Errores: {quizErrors}</Badge>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>
                  Pregunta {currentQuestion + 1}/4: {quizQuestions[currentQuestion].question}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {quizQuestions[currentQuestion].options.map((option, index) => (
                  <Button
                    key={index}
                    onClick={() => handleQuizAnswer(index)}
                    variant="outline"
                    className="w-full text-left justify-start"
                  >
                    {String.fromCharCode(65 + index)}. {option}
                  </Button>
                ))}
                <div className="text-center text-sm text-red-600 font-semibold">
                  ⚠️ Cada error divide el tiempo restante por 2
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case "bonus":
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-yellow-600">PREGUNTA BONUS</h2>
              <p className="text-gray-600">¡Todo o nada!</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>¿Cuántas tiendas Decathlon había en España a finales de 2023?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  type="number"
                  placeholder="Número exacto"
                  className="text-center text-lg"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleBonusAnswer((e.target as HTMLInputElement).value)
                    }
                  }}
                />
                <Button
                  onClick={() => {
                    const input = document.querySelector('input[type="number"]') as HTMLInputElement
                    handleBonusAnswer(input.value)
                  }}
                  className="w-full"
                >
                  RESPUESTA FINAL
                </Button>
                <div className="text-center text-sm text-red-600">
                  Si fallas, pierdes todo. Si aciertas, doble puntuación.
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case "victory":
        return (
          <div className="text-center space-y-8">
            <Trophy className="w-32 h-32 text-yellow-500 mx-auto" />
            <h2 className="text-4xl font-bold text-green-600">¡MISIÓN COMPLETADA!</h2>
            <p className="text-lg">¡Habéis encontrado la fórmula secreta y superado todos los desafíos!</p>
            <p className="text-gray-600">El espíritu de equipo de Decathlon ha triunfado.</p>
            <Button onClick={() => window.location.reload()} size="lg">
              JUGAR DE NUEVO
            </Button>
          </div>
        )

      case "defeat":
        return (
          <div className="text-center space-y-8">
            <AlertTriangle className="w-32 h-32 text-red-500 mx-auto" />
            <h2 className="text-4xl font-bold text-red-600">TIEMPO AGOTADO</h2>
            <p className="text-lg">La fórmula secreta permanece oculta...</p>
            <p className="text-gray-600">¡Pero el trabajo en equipo es lo que realmente importa!</p>
            <Button onClick={() => window.location.reload()} size="lg">
              INTENTAR DE NUEVO
            </Button>
          </div>
        )

      default:
        return null
    }
  }

  // Show bonus choice after quiz
  if (showBonus && gameState === "quiz") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-red-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center space-y-6">
              <h2 className="text-3xl font-bold text-yellow-600">¡DECISIÓN FINAL!</h2>
              <p className="text-lg">Una última decisión:</p>
              <p className="text-gray-600">
                El grupo debe elegir entre llevarse la fórmula inmediatamente o arriesgarse con una última pregunta
                bonus para duplicar el éxito.
              </p>
              <p className="text-red-600 font-semibold">Si fallan, se pierde todo.</p>

              <div className="flex gap-4 justify-center">
                <Button onClick={() => handleBonusChoice("take")} size="lg" className="bg-green-600 hover:bg-green-700">
                  TOMAR LA FÓRMULA
                </Button>
                <Button onClick={() => handleBonusChoice("risk")} size="lg" className="bg-red-600 hover:bg-red-700">
                  ARRIESGAR TODO
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-red-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header with timer */}
        {isGameActive && gameState !== "victory" && gameState !== "defeat" && (
          <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-red-600" />
                <span className="font-bold text-lg">{formatTime(timeLeft)}</span>
              </div>
              <div className="text-sm text-gray-600">
                Sala actual:{" "}
                {gameState === "sala1"
                  ? "1/3"
                  : gameState === "sala2"
                    ? "2/3"
                    : gameState === "sala3"
                      ? "3/3"
                      : "Final"}
              </div>
            </div>
          </div>
        )}

        {/* Main game content */}
        <div className="bg-white rounded-lg shadow-lg p-8">{renderGameContent()}</div>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-gray-500">
          <p>Decathlon España - El Laboratorio del Futuro</p>
        </div>
      </div>
    </div>
  )
}
