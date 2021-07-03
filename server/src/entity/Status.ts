import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Group } from "./Group";
import { Page } from "./Page";
import { body } from "./Post";
import { Users } from "./Users";




@Entity()
export class Status {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column('simple-json', { default: {} })
    body: body

   
    @ManyToOne(() => Users, users => users.statusCreator)
    creator: Users

    @ManyToMany(() => Users, users => users.statusVisitor)
    @JoinTable()
    visitor: Users[]

    @ManyToOne(() => Page, page => page.statusRoom)
    pageRoom?: Page

    @ManyToOne(() => Group, group => group.statusRoom)
    groupRoom?: Group

    @CreateDateColumn()
    createdAt: Date;

    @CreateDateColumn()
    updatedAt: Date;

}

