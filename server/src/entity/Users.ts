import {
    Entity, Column, PrimaryGeneratedColumn, CreateDateColumn,
    OneToMany, ManyToMany, ManyToOne
} from "typeorm"
import { Message } from "./Message";
import { Post } from "./Post";
import { Page } from "./Page";
import { Status } from "./Status";
import { Comment } from "./Comment";
import { Group } from "./Group";

@Entity()
export class Users {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column({ unique: true })
    email!: string;

    @Column()
    phoneNumber!: string

    @Column({ select: false })
    password!: string;

    @Column({ default: 'nice.png' })
    image?: string;

    @Column({ default: 'background.png' })
    backgroundImage?: string

    @CreateDateColumn()
    createdAt: Date;

    @CreateDateColumn()
    updatedAt: Date;

    @OneToMany(() => Users, user => user.friend)
    friends: Users[]

    @ManyToOne(() => Users, user => user.friends)
    friend: Users

    @ManyToMany(() => Page , page => page.followers)
    page: Page[]


    @ManyToMany(() => Group , group => group.member)
    groupMember: Group[]

    @ManyToMany(() => Group , group => group.admin)
    groupadmin : Users[]

    @OneToMany(() => Post, post => post.creator)
    posts: Post[]

    @OneToMany(() => Comment, comment => comment.creator)
    comments: Comment[]

    @OneToMany(() => Message, message => message.sender)
    messageSender: Message

    @OneToMany(() => Message, message => message.recepient)
    messageRecepient: Message

    @OneToMany(() => Page, page => page.creator)
    pageCreator: Page

    @ManyToMany(() => Post , post => post.share)
    _share : Post[]

    @OneToMany(() => Status, status => status.creator)
    statusCreator: Status

    @ManyToMany(() => Status, status => status.visitor)
    statusVisitor: Status

}