import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { body } from "./Post";
import { Users } from "./Users";




@Entity()
export class Message{
    @PrimaryGeneratedColumn()
    id!: number;

    @Column('simple-json' , {default  : {}})
    body : body

    // the check if the user see the message
    @Column({default :false})
    seen : boolean

    // delete from a user but can see  to other
    @Column({default : false})
    deletedBySender : boolean

    @Column({default : false})
    deletedByRecepient : boolean

    @ManyToOne(() => Users , users => users.messageSender)
    sender :Users
    
    @ManyToOne(() => Users , users => users.messageRecepient)
    recepient :Users

    @OneToOne(() => Message , message => message.to)
    @JoinColumn()
    ref : Message

    @OneToOne(() => Message , message => message.ref)
    to : Message        

    @CreateDateColumn()
    createdAt: Date;

    @CreateDateColumn()
    updatedAt: Date;

}

