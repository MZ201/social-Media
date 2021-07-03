import {
    Column, CreateDateColumn, Entity,
    JoinTable,
    ManyToMany, OneToMany, PrimaryGeneratedColumn
} from "typeorm";
import { Post } from "./Post";
import { Status } from "./Status";
import { Users } from "./Users";




@Entity()
export class Group {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name: string

    @Column({ default: 'default.png' })
    image : string 

    @Column({default : 'back.png'})
    backgroundImage : string
    @ManyToMany(() => Users , user => user.groupMember)
    @JoinTable()
    admin : Users[]
 
    @ManyToMany(() => Users , user => user.groupMember)
    @JoinTable()
    member: Users[]

    @OneToMany(() => Post, post => post.groupRoom)
    room: Post

    @OneToMany(() => Status, status => status.groupRoom)
    statusRoom: Status

    @CreateDateColumn()
    createdAt: Date;

    @CreateDateColumn()
    updatedAt: Date;

}

