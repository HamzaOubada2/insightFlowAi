import { Customer } from "src/customers/customer.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity('interactions')
export class Interactions {
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column({type: 'text'})
    content: string;

    @Column({nullable: true})
    audioUrl: string; // If the message is "audio", store the file link here

    @Column({default: 'pending'})
    status: string; // Analysis status: pending, completed, failed

    @Column({type: 'json', nullable: true})
    aiAnalyse:string; // Here we will store the Groq result (Sentiment and Intent)

    @CreateDateColumn()
    createdAt: Date;

    @ManyToOne(() => Customer, (customer) => customer.id)
    customer: Customer; // Customer linking: Each message belongs to one customer (Many-to-One)
}