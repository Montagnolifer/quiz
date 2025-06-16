import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity()
export class QuizProgress {
  @PrimaryColumn()
  progress_id: string

  @Column()
  quiz_id: string

  @Column()
  current_node_id: string

  @Column("simple-array")
  node_history: string[]

  @Column("jsonb", { default: {} })
  answers: Record<string, string>

  @Column("jsonb", { default: {} })
  text_inputs: Record<string, string>

  @Column("float")
  progress_percentage: number

  @Column("boolean", { default: false })
  is_completed: boolean

  @Column({ type: "uuid", nullable: true })
  result_node_id: string | null;

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date
}
