import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, OneToMany} from "typeorm"
import { Page } from "./Page";
import { Post } from "./Post";
import { Users } from "./Users";

@Entity()
export class Comment {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    body : string

    @ManyToOne(() => Users , users => users.comments)
    creator: Users

    @ManyToOne(() => Post)
    post : Post
    
    @OneToMany(() => Comment, comment => comment.ref)
    _ref : Comment[]

    @ManyToOne(() => Comment , comment => comment._ref)
    ref : Comment

    @ManyToOne(()=> Page , page =>page.commentRoom )
    pageRoom? : Page

    @CreateDateColumn()
    createdAt: Date;

    @CreateDateColumn()
    updatedAt: Date;


}