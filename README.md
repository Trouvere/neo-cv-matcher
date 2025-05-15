# Getting API Keys for OpenAI and Groq

## OpenAI (GPT-3.5, GPT-4)

### Steps:
1. Go to the [OpenAI Platform](https://platform.openai.com/).
2. Sign up or log into your account.
3. Navigate to the **API Keys** section:  
   [https://platform.openai.com/account/api-keys](https://platform.openai.com/account/api-keys)
4. Click **Create new secret key**.
5. Copy the generated key and add it to your `.env` file:

```
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxx
```

---

## Groq (LLaMA 3 8b, 70b, Mistral)

### Steps:
1. Go to [Groq Cloud](https://console.groq.com/).
2. Sign up or log into your account.
3. Navigate to the **API Keys** section:  
   [https://console.groq.com/keys](https://console.groq.com/keys)
4. Click **Generate Key**.
5. Copy the generated key and add it to your `.env` file:

```
GROQ_API_KEY=groq-xxxxxxxxxxxxxxxxxxxxxx
```

---

## ⚠ Important Notes

Groq uses an **OpenAI-compatible API**, allowing it to be used exactly like OpenAI via standard HTTP requests.

**Groq API Endpoint:**

```
https://api.groq.com/openai/v1/chat/completions
```

Available models on Groq:
- `llama3-8b-8192`
- `llama3-70b-8192`
- `mixtral-8x7b-32768`
- `gemma-7b-it`

### Example environment variables:

```
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxx
GROQ_API_KEY=groq-xxxxxxxxxxxxxxxxxxxxxx
```

---

