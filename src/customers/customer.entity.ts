import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";



@Entity('customers')
export class Customer {
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column({unique: true}) // The phone number must be unique for each customer.
    phoneNumber: string;

    @Column({nullable: true}) // Customer name (we may not know it at first)
    fullName: string;


    @Column({default: 0, type: 'decimal', precision: 10, scale: 2})
    totalSpent: string;// Total amount spent (to determine if he is a VIP or not)

    @Column({default: 'natural'})
    lastSentiment: string; // Last impression left by the customer (will be spoken automatically by AI)


    @CreateDateColumn()
    createdAt: Date; // Date you first contacted us
}