import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, OneToMany, ManyToMany, JoinColumn, JoinTable } from "typeorm"
import { Comment } from "./Comment";
import { Group } from "./Group";
import { Page } from "./Page";
import { Reaction } from "./Reaction";
import { Users } from "./Users";

export type body =  {
    audio :string , 
    video : string,
    isVideo : boolean , 
    img : string , 
    content : string
}

@Entity()
export class Post {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column('simple-json' , {default : {video :'' , audio : '' , content : '' , img : ''}})
    body:body

    @Column({default : true})
    allow: boolean

    @ManyToOne(() => Users)
    creator: Users

    @OneToMany(() => Comment, comment => comment.post)
    comments: Comment[]

    @OneToMany(() => Reaction, reaction => reaction.post)
    reactions: Reaction[]

    @ManyToMany(() => Users , users => users._share)
    @JoinTable()
    share : Users[]

    @ManyToOne(() => Page, page => page.room)
    pageRoom?: Page

    @ManyToOne(() => Group, group => group.room)
    groupRoom?: Group

    @CreateDateColumn()
    createdAt: Date;

    @CreateDateColumn()
    updatedAt: Date;

}