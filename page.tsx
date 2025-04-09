'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ConsentDialog } from '@/components/consent-dialog'
import { questions as questionPool, Question, QuestionCategory } from '@/lib/questions'
import { conditionDatabase, Condition } from '@/lib/conditions'
import { secureLocalStorage } from '@/lib/storage'

type ScoredCondition = Condition & { matchScore: number }

export default function MentalHealthAssessment() {
  const [currentQuestionId, setCurrentQuestionId] = useState<string>('q1')
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [showResults, setShowResults] = useState(false)
  const [consentGiven, setConsentGiven] = useState(false)
  const [conditions, setConditions] = useState<ScoredCondition[]>([])

  useEffect(() => {
    const savedConsent = secureLocalStorage.getItem('mh_consent')
    if (savedConsent) {
      setConsentGiven(true)
    }
  }, [])

  const handleConsent = () => {
    setConsentGiven(true)
    secureLocalStorage.setItem('mh_consent', 'true')
  }

  const handleAnswer = (questionId: string, answerValue: number, nextQuestionId?: string) => {
    const updatedAnswers = {
      ...answers,
      [questionId]: answerValue
    }

    setAnswers(updatedAnswers)

    if (nextQuestionId) {
      setCurrentQuestionId(nextQuestionId)
    } else {
      calculateResults(updatedAnswers)
      setShowResults(true)
    }
  }

  const calculateResults = (userAnswers: Record<string, number>) => {
    const categoryScores: Record<QuestionCategory, number> = {
      mood: 0,
      anxiety: 0,
      sleep: 0,
      energy: 0,
      focus: 0
    }

    // Sumar puntuaciones por categoría
    for (const [questionId, value] of Object.entries(userAnswers)) {
      const question = questionPool[questionId]
      if (question) {
        categoryScores[question.category] += value * (question.weight ?? 1)
      }
    }

    const updatedConditions: ScoredCondition[] = conditionDatabase.map(condition => {
      let matchScore = 0
      for (const [category, pattern] of Object.entries(condition.categoryPatterns)) {
        const score = categoryScores[category as QuestionCategory]
        if (
          score >= pattern.expectedScoreRange[0] &&
          score <= pattern.expectedScoreRange[1]
        ) {
          matchScore += pattern.weight
        }
      }

      return {
        ...condition,
        matchScore: parseFloat((matchScore * 100).toFixed(1))
      }
    })

    const sortedConditions = updatedConditions.sort((a, b) => b.matchScore - a.matchScore)
    setConditions(sortedConditions)
  }

  const handleRestart = () => {
    setAnswers({})
    setCurrentQuestionId('q1')
    setShowResults(false)
    setConditions([])
  }

  if (!consentGiven) {
    return <ConsentDialog onConsent={handleConsent} />
  }

  if (showResults) {
    return (
      <div className="p-4">
        <Card>
          <CardContent className="space-y-4">
            <h2 className="text-xl font-semibold">Resultados de la evaluación</h2>
            {conditions.map((condition, index) => (
              <div key={index}>
                <h3 className="text-lg font-bold">{condition.name}</h3>
                <p className="text-sm text-gray-500">Coincidencia: {condition.matchScore}%</p>
                <p>{condition.description}</p>
                <h4 className="font-semibold mt-2">Recursos recomendados</h4>
                <ul className="list-disc list-inside">
                  {condition.resources.map((resource, idx) => (
                    <li key={idx}>
                      <a
                        href={resource}
                        className="underline text-blue-600 hover:text-blue-800"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {resource}
                      </a>
                    </li>
                  ))}
                </ul>
                {condition.emergencyContacts && (
                  <>
                    <h5 className="mt-2 font-semibold">Contactos de emergencia</h5>
                    <ul className="list-disc list-inside">
                      {condition.emergencyContacts.map((contact, idx) => (
                        <li key={idx}>{contact}</li>
                      ))}
                    </ul>
                  </>
                )}
                <hr className="my-4" />
              </div>
            ))}
            <Button onClick={handleRestart} className="mt-4">Reiniciar evaluación</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const currentQuestion: Question = questionPool[currentQuestionId]

  return (
    <div className="p-4 max-w-xl mx-auto">
      <Card>
        <CardContent className="space-y-4">
          <h2 className="text-xl font-semibold">Evaluación de Salud Mental</h2>
          <p className="text-lg">{currentQuestion.text}</p>
          <div className="space-y-2">
            {currentQuestion.options.map((option, index) => (
              <Button
                key={index}
                onClick={() => handleAnswer(currentQuestion.id, option.value, option.nextQuestion)}
                className="w-full text-left"
                aria-label={`Respuesta: ${option.label}`}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
