import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  theme: string;  // Exemplo: "dark", "light"

  @Column({ type: 'json', nullable: true })
  settings: any;  // Exemplo: { notifications: true, darkMode: true }
}
