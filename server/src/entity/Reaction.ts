import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne } from "typeorm"
import { Comment } from "./Comment";
import { Post } from "./Post";
import { Users } from "./Users";

@Entity()
export class Reaction {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    reaction!: string;

    @ManyToOne(() => Users)
    created: Users

    @ManyToOne(() => Post)
    post: Post

    @CreateDateColumn()
    createdAt: Date;

    @CreateDateColumn()
    updatedAt: Date;
}


@Entity()
export class ReactionToComment {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    reaction!: string;

    @ManyToOne(() => Users)
    created: Users

    @ManyToOne(() => Comment)
    comment: Comment

    @CreateDateColumn()
    createdAt: Date;

    @CreateDateColumn()
    updatedAt: Date;
}