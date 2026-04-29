import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Groq from 'groq-sdk';

@Injectable()
export class AiService {
    private groq: Groq;

    constructor(private configService: ConfigService){
        // Link with ApiKey Groq From .env
        this.groq = new Groq({
            apiKey: this.configService.get<string>('API_KEY_GROQ')
        });
    }



    async analyzeMessage(content: string) {
        const model = this.configService.get<string>('AI_MODEL') || "llama-3.1-8b-instant";

        const completion = await this.groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: `You are customer service assistant, Analyse the message and return ONLY  a json object with these keys:
                    "Sentiment" (happy, angry, neutral),
                    "intent" (complaint, inquiry, feedback),
                    "summary": (short Arabic Summary). `
                },
                {
                    role: 'user',
                    content: content,
                },
            ],
            model: model,
            response_format: {type: 'json_object'}
        });
        return JSON.parse(completion.choices[0].message.content!);
    }
}
