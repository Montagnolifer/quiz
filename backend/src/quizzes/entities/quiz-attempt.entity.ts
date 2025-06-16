import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm'

@Entity('quiz_attempts')
export class QuizAttempt {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('uuid')
  quiz_id: string

  @Column({ type: 'uuid', nullable: true })
  user_id: string | null

  @Column('uuid')
  result_node_id: string

  @Column({ type: 'jsonb' })
  answers: Record<string, string>

  @CreateDateColumn()
  created_at: Date
}