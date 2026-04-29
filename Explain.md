# Version 1: The Foundation (Infrastructure)
Stack: MySQL, TypeORM, Telegraf (Telegram Bot API), NestJs.
Flow:
Entry Point: The @On("text") decorator in the TelegramUpdate class acts as an event listener for incoming messages.

User Identity: Each message carries a unique Telegram ID and the user's name.

Repository Pattern: We use a dedicated CustomerRepository to abstract database logic.

Logic (findOrCreate): Before saving any message, the system checks if the user exists. If not, it automatically registers them to maintain Data Integrity.

Persistence: The message is saved in the interactions table, linked to the user via a One-to-Many relationship.

# Version 2: The Intelligence (AI Integration)
Stack: Groq AI Cloud, Llama 3 (8B/70B) Model.

Flow:

Unstructured to Structured: We take the "Normal Text" and pass it through a custom-engineered System Prompt.

AI Analysis: The model returns a JSON format containing three key data points: Sentiment (Angry/Happy/Neutral), Intent (Complaint/Inquiry/Feedback), and a short Summary.

Defensive Logic: Since AI output can be unpredictable, we implemented a Normalizer to handle case sensitivity (e.g., Sentiment vs sentiment) and fallback to a "Neutral" state if the AI fails.

State Synchronization: The system doesn't just store the analysis; it updates the lastSentiment field in the Customers table. This allows the Frontend to know the user's status in Real-time without re-calculating old messages.


# Why I chose NestJs:
I chose NestJS because of its Modular Architecture and built-in support for Dependency Injection. This made it very easy to separate the AI logic from the Telegram logic and the Database logic, making the system scalable and easy to test."