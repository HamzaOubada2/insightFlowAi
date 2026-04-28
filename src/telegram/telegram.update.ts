import { Ctx, On, Start, Update } from "nestjs-telegraf";
import { Context } from "telegraf";


// Each message comm from telegram pass from here
@Update()
export class TelegramUpdate {

    @Start()
    async onStart(@Ctx() ctx: Context) {
        await ctx.reply('Welcome to InsightFlow Ai! I can Hear you now!')
    }

    // Here The intelegence of InsightFlow Ai
        /*
        -> Analyse Sentitment
        -> Save message in database
        -> link with client
        */
    @On('text')
    async onMessage(@Ctx() ctx: Context) {
        const message = ctx.message as any;
        console.log(`A new message arrived from ${message.from.first_name}: ${message.text}`);
        await ctx.reply('Your message has been received and is being analyzed...')
    }


    @On('voice')
    async onVoice(@Ctx() ctx: Context) {
        await ctx.reply('I have sent an audio recording; I will convert it to text soon.')
    }
}
// ctx: It gives you the context of the message.
