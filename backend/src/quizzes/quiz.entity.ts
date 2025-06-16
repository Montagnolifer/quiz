import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm'

@Entity('quizzes')
export class Quiz {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  user_id: string

  @Column()
  title: string

  @Column({ nullable: true })
  description: string

  @Column({ default: 'draft' })
  status: 'draft' | 'published'

  @Column({ type: 'jsonb', default: () => "'{}'" })
  flow_data: object

  @Column({ type: 'jsonb', nullable: true })
  theme_settings: object

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date
}
