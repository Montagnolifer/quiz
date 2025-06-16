// src/quizzes/quizzes.controller.ts
import {
  Body, Controller, Get, Param, Patch, Post, Put, Delete, Query, UseGuards, Request
} from '@nestjs/common'
import { QuizzesService } from './quizzes.service'
import { CreateQuizDto } from './dto/create-quiz.dto'
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard'
import { CreateQuizAttemptDto } from './dto/create-quiz-attempt.dto'
import { CreateQuizProgressDto } from './dto/create-quiz-progress.dto'
import { UpdateQuizProgressDto } from './dto/update-quiz-progress.dto'

@Controller('quizzes')
export class QuizzesController {
  constructor(private readonly quizzesService: QuizzesService) {}

  @Get('test-log')
  testLog() {
    console.log('🧪 TESTE DE VIDA: Controller FUNCIONANDO')
    return { ok: true }
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Request() req, @Body() dto: CreateQuizDto) {
    const quiz = await this.quizzesService.create({
      ...dto,
      user_id: req.user.id,
    })
    return { id: quiz.id }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.quizzesService.findPublicById(id)
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Request() req) {
    return this.quizzesService.findAllByUser(req.user.id)
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Request() req, @Body() dto: Partial<CreateQuizDto>) {
    return this.quizzesService.updateQuiz(id, req.user.id, dto)
  }

  @Post(':id/progress')
  async saveProgress(
    @Param('id') quizId: string,
    @Body() body: CreateQuizProgressDto
  ) {
    console.log("🔥 Controller está recebendo o POST!");
    return this.quizzesService.saveProgress({ ...body, quiz_id: quizId })
  }  


  @Get(':id/progress')
  async getProgress(
    @Param('id') quizId: string,
    @Query('progressId') progressId: string
  ) {
    return { progress: await this.quizzesService.getProgress(quizId, progressId) }
  }

  @Patch(':id/progress')
  async completeProgress(
    @Param('id') quizId: string,
    @Body() body: UpdateQuizProgressDto
  ) {
    return this.quizzesService.completeProgress(body)
  }

  @Post('/quiz-attempts')
  async saveAttempt(@Request() req, @Body() body: CreateQuizAttemptDto) {
    const userId = req.user?.id // se tiver auth, pega, se não, manda null
    return this.quizzesService.saveAttempt(body, userId)
  }

  @Get('/quiz-attempts/:quizId')
  async getAttempts(@Param('quizId') quizId: string) {
    return this.quizzesService.getAttemptsByQuizId(quizId)
  }

  @Get('/quiz-progress/:quizId')
  async getProgressList(@Param('quizId') quizId: string) {
    return this.quizzesService.getProgressListByQuizId(quizId)
  }

  @Get('/quiz-analytics/:quizId')
  async getAnalytics(@Param('quizId') quizId: string) {
    return this.quizzesService.getAnalyticsByQuizId(quizId)
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id/publish')
  async publishQuiz(@Param('id') id: string, @Request() req) {
    return this.quizzesService.publishQuiz(id, req.user.id)
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteQuiz(@Param('id') id: string, @Request() req) {
    return this.quizzesService.deleteQuiz(id, req.user.id)
  }


  
}