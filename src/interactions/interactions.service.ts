import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Interactions } from "./interaction.entity";
import { Repository } from "typeorm";
import { Customer } from "src/customers/customer.entity";



@Injectable()
export class InteractionsService {
    constructor(
        @InjectRepository(Interactions)
        private interactionRepo: Repository<Interactions>,
    ){}

    // Link Text with user and save in table interactions
    async create(content: string, customer:Customer) {
        const interaction = this.interactionRepo.create({
            content, 
            customer,
        });
            return await this.interactionRepo.save(interaction);
    }
}