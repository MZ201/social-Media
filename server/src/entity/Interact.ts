import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Users } from "./Users";



export enum action{
    friendship = 0 , 
    addToGroup  =1 ,
}



@Entity()
export class Interact{
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({
        type : "enum" , 
        enum : action ,
        default : action.friendship
    })
    action: action

    @ManyToOne(() => Users )
    sender : Users

    @ManyToMany(() => Users)
    @JoinTable()
    recepient : Users[]

    @Column({default : false})
    seen? : boolean

    @Column({default : false})
    ignore? : boolean

    @CreateDateColumn()
    createdAt: Date;

    @CreateDateColumn()
    updatedAt: Date;

}

