import { Controller, Get } from '@nestjs/common';
import { CustomerService } from './customer.service';

@Controller('customers')
export class CustomerController {
    constructor(
        private readonly customerService: CustomerService,
    ) {}

    @Get()
    async getAll() {
        return await this.customerService.findAll();
    }
}
