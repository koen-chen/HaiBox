import { defineStore } from "pinia"
import { Section, SectionUpdate } from "@/types"

export const useSectionStore = defineStore('section', () => {
  const supabase = useSupabase().value

  const sectionList = ref<Section[] | null>(null)
  const currentSection = ref<Section | null>(null)

  function $reset() {
    sectionList.value = null
  }

  const listSection = async (formId: number): Promise<Section[] | null> => {
    const { data, error } = await supabase
      .from('section')
      .select()
      .eq('form_id', formId)
      .neq('state', 'Delete')

    if (!error) {
      sectionList.value = data
      return sectionList.value
    } else {
      return null
    }
  }

  const addSection = async (info: SectionUpdate): Promise<Section | null> => {
    const { data, error } = await supabase
      .from('section')
      .insert(info)
      .select()

    if (!error) {
      currentSection.value = data[0]
      if (sectionList.value !== null) {
        sectionList.value.push(data[0])
      }
      return currentSection.value
    } else {
      return null
    }
  }

  const updateSection = async (id: number, info: SectionUpdate): Promise<Section | null> => {
    const { data, error } = await supabase
      .from('section')
      .update(info)
      .eq('id', id)
      .select()

    if (!error) {
      currentSection.value = data[0]
      return currentSection.value
    } else {
      return null
    }
  }

  const deleteSection = async (id: number): Promise<void> => {
    const { data, error } = await supabase
      .from('section')
      .update({ state: 'Delete' })
      .eq('id', id)
  }

  const updateOrder = async (formId: number, info: number[]): Promise<void> => {
    const { data, error } = await supabase
      .from('form')
      .update({ 'section_order': info })
      .eq('id', formId)
      .select()
  }

  return {
    $reset,
    sectionList,
    currentSection,
    listSection,
    addSection,
    updateSection,
    deleteSection,
    updateOrder
  }
})