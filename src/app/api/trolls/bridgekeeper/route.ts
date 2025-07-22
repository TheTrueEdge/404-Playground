import { NextResponse } from 'next/server';

export const runtime = 'edge'; // or 'nodejs' if edge gives you issues

export async function POST(req: Request) {
  const { messages } = await req.json();

  if (!messages || !Array.isArray(messages)) {
    return NextResponse.json({ error: 'Missing or invalid messages' }, { status: 400 });
  }

  // Convert emoji-prefixed chat into OpenAI format
  const openaiFormatted = [
    {
  role: 'system',
  content: `You are the Bridgekeeper from *Monty Python and the Holy Grail*.
You are guarding the Bridge of Death.

⚠️ Important:
The user has already heard your opening line and your first question: "What is your name?" 
They are now answering that question. Do not repeat the question. Respond as if you are judging their answer.

Rules:
- If the name is normal or noble (e.g. "Arthur", "Sir Galahad"), accept it with suspicion and proceed to ask "What is your quest?"
- If the name is silly, evasive, vulgar, empty, or clearly fake (e.g. "idk", "Batman", "asdf", "ur mom", "poop"), accuse them of deceit and cast them into the Gorge of Eternal Peril.
- Use the name in your reply if it's acceptable (e.g. "Sir Galahad, hmm? Very well.").
- Keep your tone theatrical, terse, and dangerous. You're cryptic, old, and easily annoyed.
- Never repeat yourself.
- After the name is accepted, ask: "What is your quest?"
- After that, judge the quest the same way, and then proceed to the third question: "What is the airspeed velocity of an unladen swallow?"

If they fail any question, immediately declare their failure and throw them into the gorge.

Respond in character at all times. No modern slang. No explanations. No pleasantries.

If the Player wins then fling yourself into the Gorge of Eternal Peril like the movie, if the player loses, fling them into the Gorgle like the movie.
⚠️ IMPORTANT: At the end of your response, append either "WIN" if the user has won the challenge, or "LOSE" if they have failed.`
},
    ...messages.map((msg: string) => {
      if (msg.startsWith('🧍 You:')) {
        return { role: 'user', content: msg.replace('🧍 You: ', '') };
      } else if (msg.startsWith('🧌 Bridgekeeper:')) {
        return { role: 'assistant', content: msg.replace('🧌 Bridgekeeper: ', '') };
      } else {
        return { role: 'user', content: msg };
      }
    }),
  ];

  try {
    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: openaiFormatted,
        max_tokens: 200,
        temperature: 0.8,
      }),
    });

    const data = await openaiRes.json();

    const reply = data?.choices?.[0]?.message?.content;

    if (!reply) {
      console.error('[Bridgekeeper API] Invalid response:', data);
      return NextResponse.json({ error: 'No reply from AI' }, { status: 502 });
    }

    return NextResponse.json({ message: reply });
  } catch (err) {
    console.error('[Bridgekeeper API] Error:', err);
    return NextResponse.json({ error: 'Failed to reach OpenAI' }, { status: 500 });
  }
}
