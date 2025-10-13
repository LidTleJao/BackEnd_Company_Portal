import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from "typeorm";

@Entity("users_custom")
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    type: "varchar",
    length: 255,
  })
  email!: string;

  @Column({
    type: "varchar",
    length: 30,
  })
  phone!: string;

  // @Column({
  //   type: "varchar",
  //   length: 20,
  //   nullable: true,
  // })
  // nationalId!: string;

  @CreateDateColumn({ type: "timestamptz" })
  createdAt!: Date;
}
