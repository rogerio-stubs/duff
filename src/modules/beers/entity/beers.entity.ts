import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Beer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, unique: true })
  style: string;

  @Column('integer', { array: true, default: [], nullable: false })
  temperatureRange: number[];
}
