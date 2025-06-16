// src/quizzes/quizzes.service.ts
import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Quiz } from './quiz.entity'
import { CreateQuizDto } from './dto/create-quiz.dto'
import { CreateQuizAttemptDto } from './dto/create-quiz-attempt.dto'
import { CreateQuizProgressDto } from './dto/create-quiz-progress.dto'
import { UpdateQuizProgressDto } from './dto/update-quiz-progress.dto'
import { QuizAttempt } from './entities/quiz-attempt.entity'
import { QuizProgress } from './entities/quiz-progress.entity'

@Injectable()
export class QuizzesService {
  constructor(
    @InjectRepository(Quiz)
    private quizRepository: Repository<Quiz>,

    @InjectRepository(QuizAttempt)
    private attemptRepo: Repository<QuizAttempt>,

    @InjectRepository(QuizProgress)
    private progressRepo: Repository<QuizProgress>
  ) {}

  async create(createQuizDto: CreateQuizDto): Promise<Quiz> {
    const quiz = this.quizRepository.create(createQuizDto)
    return this.quizRepository.save(quiz)
  }

  async findByIdAndUser(id: string, userId: string): Promise<Quiz | null> {
    return this.quizRepository.findOne({
      where: { id, user_id: userId },
    })
  }

  async findAllByUser(userId: string): Promise<Quiz[]> {
    return this.quizRepository.find({
      where: { user_id: userId },
      order: { created_at: 'DESC' },
    })
  }

  async updateQuiz(id: string, userId: string, dto: Partial<CreateQuizDto>): Promise<Quiz> {
    const quiz = await this.quizRepository.findOne({ where: { id, user_id: userId } })
    if (!quiz) throw new NotFoundException("Quiz não encontrado")

    Object.assign(quiz, dto)
    return this.quizRepository.save(quiz)
  }

  async findPublicById(id: string): Promise<Quiz | null> {
    const quiz = await this.quizRepository.findOne({ where: { id } })
    if (!quiz) throw new NotFoundException("Quiz não encontrado")
    return quiz
  }

  async saveAttempt(data: CreateQuizAttemptDto, userId?: string) {
    return await this.attemptRepo.save({ ...data, user_id: userId || null })
  }

  async getProgress(quizId: string, progressId: string) {
    return await this.progressRepo.findOneBy({ quiz_id: quizId, progress_id: progressId })
  }

  async saveProgress(data: CreateQuizProgressDto) {
    console.log("📥 DADO RECEBIDO PARA SALVAR PROGRESS:", data)
  
    try {
      const existing = await this.progressRepo.findOneBy({ progress_id: data.progress_id })
  
      if (existing) {
        const merged = this.progressRepo.merge(existing, data)
        console.log("✏️ ATUALIZANDO PROGRESS:", merged)
        const result = await this.progressRepo.save(merged)
        console.log("✅ Progress atualizado com sucesso:", result)
        return result
      }
  
      console.log("🆕 CRIANDO NOVO PROGRESS")
      const { result_node_id, ...rest } = data;
      const cleanedData = {
        ...rest,
        ...(result_node_id ? { result_node_id } : {}),
      };

      const created = await this.progressRepo.save(cleanedData);
      console.log("✅ Novo progress salvo:", created)
      return created
  
    } catch (error) {
      console.error("❌ Erro ao salvar progress:", error)
      throw error
    }
  }

  async completeProgress(data: UpdateQuizProgressDto) {
    return await this.progressRepo.update({ progress_id: data.progress_id }, {
      is_completed: true,
      result_node_id: data.result_node_id,
    })
  }

  async getAttemptsByQuizId(quizId: string) {
    return this.attemptRepo.find({
      where: { quiz_id: quizId },
      order: { created_at: 'DESC' },
    })
  }
  
  async getProgressListByQuizId(quizId: string) {
    return this.progressRepo.find({
      where: { quiz_id: quizId, is_completed: false },
      order: { created_at: 'DESC' },
    } as any)    
  }
  
  async getAnalyticsByQuizId(quizId: string) {
    const attempts = await this.attemptRepo.find({ where: { quiz_id: quizId } })
  
    console.log("📊 Attempts encontrados:", attempts)
  
    const questionAnalytics: Record<string, Record<string, number>> = {}
  
    for (const attempt of attempts) {
      const answers = attempt.answers
      for (const questionId in answers) {
        const answer = answers[questionId]
        questionAnalytics[questionId] ||= {}
        questionAnalytics[questionId][answer] ||= 0
        questionAnalytics[questionId][answer]++
      }
    }
  
    console.log("📈 Análise de perguntas:", questionAnalytics)
  
    const startedCount = await this.progressRepo.count({ where: { quiz_id: quizId } })
    const completedCount = attempts.length

    const funnelSteps = [
      {
        name: "Iniciou o quiz",
        value: startedCount,
        percentage: 100,
      },
      {
        name: "Concluiu o quiz",
        value: completedCount,
        percentage: startedCount > 0 ? Math.round((completedCount / startedCount) * 100) : 0,
      },
    ]
  
    console.log("🚦 Funil de conversão:", funnelSteps)
  
    return {
      questionAnalytics,
      funnelSteps,
    }
  }
  
  async publishQuiz(id: string, userId: string) {
    const quiz = await this.quizRepository.findOne({ where: { id, user_id: userId } })
    if (!quiz) throw new NotFoundException('Quiz não encontrado')
    quiz.status = 'published'
    return this.quizRepository.save(quiz)
  }
  
  async deleteQuiz(id: string, userId: string) {
    const quiz = await this.quizRepository.findOne({ where: { id, user_id: userId } })
    if (!quiz) throw new NotFoundException('Quiz não encontrado')
    return this.quizRepository.remove(quiz)
  }
  
  
}