import { Ctx, On, Start, Update } from "nestjs-telegraf";
import { CustomerService } from "src/customers/customer.service";
import { InteractionsService } from "src/interactions/interactions.service";
import { Context } from "telegraf";


// Each message comm from telegram pass from here
@Update()
export class TelegramUpdate {
    constructor(private readonly customerService: CustomerService,
        private readonly interactionsService: InteractionsService,
    ){}

    @Start()
    async onStart(@Ctx() ctx: Context) {
        const from = ctx.from; // extract the data to who click start

        
        // Save or featch the customer when pressin start
        await this.customerService.findOrCreate(
            from?.id.toString()!,
            `${from?.first_name} ${from?.last_name ||''}`
        );

        await ctx.reply('Welcome! You have been successfully registred in the system.')
    }

    @On('text')
    async onMessage(@Ctx() ctx: Context) {
        const message = ctx.message as any;

        const customer = await this.customerService.findOrCreate(
            message.from.id.toString(),
            message.from.first_name,
        )


        await this.interactionsService.create(message.text, customer);

        console.log(`[Database] Message coming from customer ${customer.fullName}: ${message.text}`);
        await ctx.reply(`Your message has been received and saved in Your Log!"`)
    }


    @On('voice')
    async onVoice(@Ctx() ctx: Context) {
        await ctx.reply('I have sent an audio recording; I will convert it to text soon.')
    }
}
// ctx: It gives you the context of the message.
