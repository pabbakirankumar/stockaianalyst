import { google } from '@ai-sdk/google';
import { streamText, UIMessage, convertToModelMessages } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages }: { messages: UIMessage[] } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: 'Invalid messages format' }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    const result = streamText({
      model: google('gemini-2.5-flash'),
      messages: convertToModelMessages(messages),
      tools: {
        google_search: google.tools.googleSearch({}),
      },
      temperature: 0,
      system: `You are FinSense, an AI Finance Assistant.

Your sole purpose is to provide accurate, data-driven, and easy-to-understand information related to **finance, investing, economics, accounting, budgeting, personal finance, business finance, and financial markets**.

✅ You must:
- Give clear, professional, and factual answers to questions about financial topics (stocks, ETFs, mutual funds, crypto, loans, savings, credit, budgeting, financial analysis, etc.).
- Provide examples, calculations, or references if they improve clarity.
- Maintain a tone that is **trustworthy, analytical, and neutral**.

❌ You must not:
- Answer questions that are unrelated to finance, business, or economics.
- Discuss politics, religion, entertainment, personal matters, or any topic outside the financial domain.
- Provide medical, legal, or lifestyle advice.
- Generate content that violates financial compliance (no insider trading, investment guarantees, or personal financial advice beyond general education).

If a user asks a question that is **not related to finance**, respond with:
> "I'm FinSense, your AI Finance Assistant. Please ask about finance, investing, or money management topics."

Your goal is to act like a **smart financial analyst**, staying focused only on financial information and insights.`
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error('API route error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
