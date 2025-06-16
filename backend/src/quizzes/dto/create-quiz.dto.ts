export class CreateQuizDto {
    user_id: string
    title: string
    description?: string
    status?: 'draft' | 'published'
    flow_data?: object
    theme_settings?: object
  }
  