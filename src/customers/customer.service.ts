import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Customer } from "./customer.entity";
import { Repository } from "typeorm";


@Injectable()
export class CustomerService {

    constructor(
        @InjectRepository(Customer)
        private customerRepo: Repository<Customer>,
    ){}


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
}