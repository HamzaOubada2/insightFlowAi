import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Customer } from "./customer.entity";
import { Repository } from "typeorm";
import { serialize } from "v8";


@Injectable()
export class CustomerService {

    constructor(
        @InjectRepository(Customer)
        private customerRepo: Repository<Customer>,
    ){}


    // check if user exit in database if not create
    async findOrCreate(phoneNumber:string, fullName:string): Promise<Customer> {
        let customer = await this.customerRepo.findOne({where: {phoneNumber}});

        if(!customer) {
            customer = this.customerRepo.create({
                phoneNumber,
                fullName
            });
            await this.customerRepo.save(customer);
            console.log(`[Database] New Customer registered: ${fullName}`)
        }
        return customer;
    }

    async updateSentiment(id:string, sentiment: string) {
        if(!sentiment) {
            console.log(`[Warning] Sentiment is undefined, skipping update`)
        }
        return await this.customerRepo.update(id, {
            lastSentiment: sentiment.toString().toLowerCase()
        })
    }

    async findAll() {
        return await this.customerRepo.find();
    }
}