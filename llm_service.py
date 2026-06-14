from groq import Groq
from config import GROQ_API_KEY

client = Groq(api_key=GROQ_API_KEY)

def get_ai_response(query: str):
    try:
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[{"role": "user", "content": query}]
        )
        return response.choices[0].message.content

    except Exception as e:
        return f"Error: {str(e)}"