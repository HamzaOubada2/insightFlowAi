import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Interactions } from './interaction.entity';
import { InteractionsService } from './interactions.service';

@Module({
    imports: [TypeOrmModule.forFeature([Interactions])],
    providers: [InteractionsService],
    exports: [InteractionsService]
})
export class InteractionsModule {}
