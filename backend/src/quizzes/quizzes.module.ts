import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Quiz } from './quiz.entity'
import { QuizAttempt } from './entities/quiz-attempt.entity'
import { QuizProgress } from './entities/quiz-progress.entity'
import { QuizzesService } from './quizzes.service'
import { QuizzesController } from './quizzes.controller'

@Module({
  imports: [
    TypeOrmModule.forFeature([Quiz, QuizAttempt, QuizProgress]),
  ],
  providers: [QuizzesService],
  controllers: [QuizzesController],
})
export class QuizzesModule {}
