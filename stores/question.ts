import { defineStore } from "pinia"
import { QuestionType, QuestionInsertType, QuestionUpdateType } from "~/types"

export const useQuestionStore = defineStore('question', () => {
  const supabase = useSupabase().value

  const questionList = ref<QuestionType[]>([])
  const questionOrder = ref<{ [key: number]: number[] }>({})

  const $reset = () => {
    questionList.value = []
    questionOrder.value = {}
  }

  const addQuestion = async (info: QuestionInsertType): Promise<QuestionType> => {
    const { data, error } = await supabase
      .from('question')
      .insert(info)
      .select()
      .single()

    if (!error) {
      const order = questionOrder.value[info.section_id]
      await updateOrder(info.section_id, [...order, data.id])
      questionList.value.push(data)
    }

    return data
  }

  const updateQuestion = async (id: number, info: QuestionUpdateType): Promise<QuestionType> => {
    const { data, error } = await supabase
      .from('question')
      .update(info)
      .eq('id', id)
      .select()
      .single()

    if (!error) {
      questionList.value = questionList.value.map(item => {
        if (item.id == data.id) {
          return data
        } else {
          return item
        }
      })
    }

    return data
  }

  const deleteQuestion = async (id: number): Promise<void> => {
    const { data, error } = await supabase
      .from('question')
      .update({ state: 'Delete' })
      .eq('id', id)
      .select()
      .single()

    if (!error) {
      const order = questionOrder.value[data.section_id].filter(item => item == id)
      await updateOrder(data.section_id, order)

      questionList.value = questionList.value && questionList.value.filter(item => item.id !== id)
    }
  }

  const deleteQuestionBy = async (filters: { [key: string]: string | number }): Promise<void> => {
    let query = supabase.from('question').update({ state: 'Delete' })

    for (const key in filters) {
      query.eq(key, filters[key])
    }

    const { data, error } = await query.select()

    if (!error && data.length > 0) {
      let order = questionOrder.value[data[0].section_id]

      data.forEach((record) => {
        order = order.filter(item => item == record.id)
      })

      await updateOrder(data[0].section_id, order)
    }
  }

  const updateOrder = async (sectionId: number, info: number[]): Promise<void> => {
    const { error } = await supabase
      .from('section')
      .update({ 'question_order': info })
      .eq('id', sectionId)
      .select()

    if (!error) {
      questionOrder.value[sectionId] = info
    }
  }

  return {
    $reset,
    questionOrder,
    questionList,
    addQuestion,
    updateQuestion,
    deleteQuestion,
    deleteQuestionBy,
    updateOrder
  }
})