import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  Entity,
  Column,
  PrimaryGeneratedColumn,
} from 'typeorm';

// Create a new table in sql db
@Entity()
export class User {
  // Add a column, and id will automatically generated
  @PrimaryGeneratedColumn()
  id: number;

  // Add a column
  @Column()
  email: string;

  @Column()
  password: string;

  @AfterInsert()
  logInsert(): void {
    console.log('Inserted User with id: ', this.id);
  }

  @AfterUpdate()
  logUpdate(): void {
    console.log('Updated User with id: ', this.id);
  }

  @AfterRemove()
  logRemove(): void {
    console.log('Removed User with id: ', this.id);
  }
}
