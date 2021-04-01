export type SurveyResultModel = {
  id: string
  accountId: string
  surveyId: string
  answers: string
  date: Date
}

export type SurveyAnswerModel = {
  image?: string
  answer: string
}
