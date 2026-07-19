import Groq from "groq-sdk";

// Инициализация через API-ключ Groq
// Не забудь в .env поменять переменную на GROQ_API_KEY
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function main(prompt) {
  try {
    const chatCompletion = await groq.chat.completions.create({
      // Модель llama-3.3-70b-versatile — мощная и бесплатная на Groq
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama3-8b-8192",
    });

    // Извлекаем текст ответа
    return chatCompletion.choices[0]?.message?.content || "";
    
  } catch (error) {
    console.error("Ошибка Groq API:", error.message);
    
    // Обработка типичных ошибок
    if (error.status === 401) {
        return "Ошибка: Неверный API-ключ Groq";
    }
    if (error.status === 429) {
        return "Ошибка: Слишком много запросов (лимит исчерпан)";
    }
    
    return "Ошибка генерации через Groq";
  }
}

export default main;