import {
    Column, CreateDateColumn, Entity,
    JoinTable,
    ManyToMany,
    ManyToOne, OneToMany, PrimaryGeneratedColumn
} from "typeorm";
import { Comment } from "./Comment";
import { Post } from "./Post";
import { Status } from "./Status";
import { Users } from "./Users";




@Entity()
export class Page {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name: string

    @Column({default : "default.png"})
    image: string

    @Column({default : "defaultBack.png"})
    backgroundImage: string

    @ManyToMany(() => Users , user => user.page)
    @JoinTable()
    followers : Users[]

    @ManyToOne(() => Users, users => users.pageCreator)
    creator: Users

    @OneToMany(() => Post, (post) => post.pageRoom)
    room: Post

    @OneToMany(() => Status, status => status.pageRoom)
    statusRoom: Status

    @OneToMany(() => Comment, Comment => Comment.pageRoom)
    commentRoom: Comment

    @CreateDateColumn()
    createdAt: Date;

    @CreateDateColumn()
    updatedAt: Date;

}


