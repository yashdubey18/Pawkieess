import OpenAI from "openai";

const systemPrompt = `You are an expert Pet Care Assistant and Veterinary Advisor.
Your responsibilities:
1. Provide accurate information about pet breeds, diets, training, and general care.
2. Analyze any symptoms of poor health provided by the user and suggest possible causes or health conditions.
3. Recommend safe home remedies if applicable and appropriate.
4. IMPORTANT: Always include a disclaimer that you are an AI and that for severe, worsening, or life-threatening symptoms, the user MUST consult a professional veterinarian immediately.
Be warm, comforting, and highly knowledgeable. Use emojis occasionally.`;

// A local rule-based fallback when no API key is provided
function getMockAIResponse(messages) {
    const lastMessage = messages[messages.length - 1].content.toLowerCase();
    
    if (lastMessage.includes('vomit') || lastMessage.includes('stomach') || lastMessage.includes('diarrhea')) {
        return "It sounds like your pet might have an upset stomach. 🐾\n**Possible Causes:** Eating something unusual, sudden diet change, or stress.\n**Home Remedy:** Withhold food for 12-24 hours (but keep fresh water available). Then offer a bland diet of boiled plain chicken and white rice. \n\n⚠️ *Disclaimer: I am an AI. If the vomiting continues for more than 24 hours, or if your pet is lethargic, please bring them to a veterinarian immediately!*";
    } else if (lastMessage.includes('scratch') || lastMessage.includes('itch') || lastMessage.includes('flea')) {
        return "Excessive scratching can be uncomfortable for your furry friend! 🐕\n**Possible Causes:** Fleas, ticks, dry skin, or environmental allergies.\n**Home Remedy:** An oatmeal bath can soothe dry, itchy skin. You can also try applying organic coconut oil to dry patches. Make sure their flea and tick preventative is up to date.\n\n⚠️ *Disclaimer: If you see red spots, hair loss, or open sores, please consult your vet.*";
    } else if (lastMessage.includes('hi') || lastMessage.includes('hello')) {
        return "Hello there! 👋 I am your virtual Pet Care Assistant. You can ask me about breeds, diet, training, or even tell me about any symptoms your pet is experiencing so I can try to help you!";
    } else if (lastMessage.includes('dog diet') || lastMessage.includes('food')) {
        return "A balanced diet is crucial for pets! Dogs generally need a mix of high-quality proteins, healthy fats, and carbohydrates. Keep away from chocolate, grapes, onions, and garlic, as these are toxic! 🦴\n\nIs there a specific breed or age you are asking about?";
    } else {
        return "That's an interesting question! 🐾\nBecause my AI connection (API Key) is currently not configured by the admin, I'm operating in 'Offline Mode'. However, I can still assist you with common symptoms like 'upset stomach' or 'itching', or give general pet food advice. Try asking me about those!";
    }
}

// @desc    Ask AI Assistant
// @route   POST /api/ai/ask
// @access  Private
export const askAssistant = async (req, res) => {
    try {
        const { messages, prompt } = req.body;

        // Setup message history if provided
        let conversation = [];
        if (messages && Array.isArray(messages)) {
            if (messages.length === 0 || messages[0].role !== 'system') {
                conversation.push({ role: "system", content: systemPrompt });
            }
            conversation = [...conversation, ...messages];
        } else if (prompt) {
            conversation = [
                { role: "system", content: systemPrompt },
                { role: "user", content: prompt }
            ];
        } else {
            return res.status(400).json({ message: 'Please provide messages or a prompt' });
        }

        // If OPENAI_API_KEY is not configured, use the mock fallback
        if (!process.env.OPENAI_API_KEY) {
            console.log("No OPENAI_API_KEY found, using rule-based fallback answer.");
            const fallbackReply = getMockAIResponse(conversation);
            return res.json({ answer: fallbackReply });
        }

        // Keep normal OpenAI execution
        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });

        conversation = conversation.map(msg => ({
            role: msg.role === 'assistant' ? 'assistant' : msg.role === 'system' ? 'system' : 'user',
            content: msg.content
        }));

        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: conversation,
        });

        const reply = completion.choices[0].message.content;
        res.json({ answer: reply });
    } catch (error) {
        console.error('AI Error:', error);
        res.status(500).json({ message: 'AI Service Error' });
    }
};
