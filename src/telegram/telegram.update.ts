import axios from "axios";
import { error } from "console";
import * as fs from 'fs';
import { Ctx, On, Start, Update } from "nestjs-telegraf";
import { AiService } from "src/ai/ai.service";
import { CustomerService } from "src/customers/customer.service";
import { InteractionsService } from "src/interactions/interactions.service";
import { Context } from "telegraf";


// Each message comm from telegram pass from here
@Update()
export class TelegramUpdate {
    constructor(private readonly customerService: CustomerService,
        private readonly interactionsService: InteractionsService,
        private readonly aiService: AiService,
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

        try {
            // get oe create the customer based on the telegram id and name
            const customer = await this.customerService.findOrCreate(
                message.from.id.toString(),
                message.from.first_name,
            );

            // 2. analyze the message content using the AiService (groq)
            console.log(`[AI] Analyzing message from ${customer.fullName}...`);
            const analysis = await this.aiService.analyzeMessage(message.text);

            // 3. save the interaction in the database with the analysis results
            await this.interactionsService.create(message.text, customer, analysis);

            const extractedSentiment = analysis?.sentiment || analysis?.Sentiment || 'neutral';

            // 4. update the customer's latest status using the extracted value (e.g., sentiment)
            await this.customerService.updateSentiment(customer.id, extractedSentiment);

            let response = `Thank You ${customer.fullName}, your message has been received!`;
            
            if (extractedSentiment.toLowerCase() === 'angry') {
                response = `We apologize for any inconvenience ${customer.fullName}, our team will address your complaint immediately! 🛠️`;
            } else if (extractedSentiment.toLowerCase() === 'happy') {
                response = `We are glad you are happy with our service, ${customer.fullName}! 🌟`;
            }

            await ctx.reply(response);
            console.log(`[Database] Message Saved & Status Updated:`, analysis);

        } catch (error) {
            console.error('[Error] Problem in onMessage flow:', error);
            await ctx.reply('Sorry, I am having trouble processing that right now. Please try again later.');
        }
    }


    private async processUserMessage(ctx: Context, text: string, from: any) {
    try {
        // 1. جلب أو إنشاء الزبون
        const customer = await this.customerService.findOrCreate(
            from.id.toString(),
            from.first_name,
        );

        // 2. تحليل النص عبر AI
        const analysis = await this.aiService.analyzeMessage(text);

        // 3. حفظ التفاعل وتحديث الحالة
        await this.interactionsService.create(text, customer, analysis);
        const sentiment = analysis?.sentiment || analysis?.Sentiment || 'neutral';
        await this.customerService.updateSentiment(customer.id, sentiment);

        // 4. الرد على المستخدم
        let response = `Thank You ${customer.fullName}, your message has been received!`;
        if (sentiment.toLowerCase() === 'angry') {
            response = `We apologize ${customer.fullName}, our team will help you immediately! 🛠️`;
        }

        await ctx.reply(response);
        console.log(`[Database] Success:`, analysis);

    } catch (error) {
        console.error('[Error] Processing failed:', error);
        await ctx.reply('Sorry, I had trouble processing that.');
    }
}

@On('voice')
async onVoice(@Ctx() ctx: Context) {
    const message = ctx.message as any;
    const fileId = message.voice.file_id;

    try {
        const fileLink = await ctx.telegram.getFileLink(fileId);
        const filePath = `./temp_${fileId}.ogg`;

        // تحميل الملف
        const response = await axios({ url: fileLink.href, responseType: 'stream' });
        await new Promise((resolve, reject) => {
            response.data.pipe(fs.createWriteStream(filePath)).on('finish', resolve).on('error', reject);
        });

        const transcribedText = await this.aiService.transcribeAudio(filePath);
        await ctx.reply(`📝 *Transcription:* ${transcribedText}`, { parse_mode: 'Markdown' });

        // نرسل الـ ctx الحقيقي مع النص المستخرج
        await this.processUserMessage(ctx, transcribedText, message.from);

        fs.unlinkSync(filePath);
    } catch (error) {
        console.error('Voice Error:', error);
    }
}

}
// ctx: It gives you the context of the message.
