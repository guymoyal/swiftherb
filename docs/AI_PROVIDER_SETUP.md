# AI Provider Setup Guide

## Why Direct DeepSeek API? 💰

**Cost Comparison:**
- **DeepSeek Direct API**: ~$0.14 per 1M input tokens, ~$0.28 per 1M output tokens
- **OpenRouter (DeepSeek)**: Adds markup (~10-20% more expensive)
- **OpenAI GPT-4**: ~$30 per 1M input tokens (200x more expensive!)

**For a typical conversation:**
- Input: ~500 tokens = $0.00007
- Output: ~1000 tokens = $0.00028
- **Total: ~$0.00035 per conversation** (less than 1 cent!)

## Setup Options

### Option 1: DeepSeek Direct API (RECOMMENDED - Cheapest) ✅

1. **Get API Key:**
   - Go to https://platform.deepseek.com
   - Sign up for free account
   - Navigate to API Keys section
   - Create a new API key

2. **Configure `.env` file:**
   ```env
   DEEPSEEK_API_KEY=sk-your-key-here
   DEEPSEEK_MODEL=deepseek-chat
   ```

3. **Models Available:**
   - `deepseek-chat` - General purpose chat (recommended)
   - `deepseek-coder` - Code-focused (not needed for this project)

**Cost:** ~$0.00035 per conversation

### Option 2: OpenRouter (More Expensive, More Flexible)

**Use only if:**
- You want to switch between multiple AI providers
- You need fallback options
- You're okay paying 10-20% markup

1. **Get API Key:**
   - Go to https://openrouter.ai
   - Sign up and add credits
   - Create API key

2. **Configure `.env` file:**
   ```env
   OPENROUTER_API_KEY=sk-or-v1-your-key-here
   OPENROUTER_MODEL=deepseek/deepseek-chat
   ```

**Cost:** ~$0.00040-0.00045 per conversation (slightly more)

## How It Works

The code automatically detects which API key you've configured:
- If `DEEPSEEK_API_KEY` exists → Uses DeepSeek directly (cheaper)
- If only `OPENROUTER_API_KEY` exists → Uses OpenRouter (fallback)
- If neither exists → Shows placeholder message

## Cost Optimization Tips

1. **Use DeepSeek Direct** - Saves 10-20% vs OpenRouter
2. **Limit `max_tokens`** - Currently set to 2000, can reduce to 1500
3. **Cache responses** - For common queries (future feature)
4. **Monitor usage** - Set up usage alerts on DeepSeek dashboard

## Free Tier

DeepSeek offers:
- **Free tier available** for testing
- Check https://platform.deepseek.com for current free tier limits

## Testing

After setting up your API key:
1. Start dev server: `pnpm dev`
2. Ask a question like "Help with anxiety"
3. You should see real AI responses with 5-10 product recommendations

## Troubleshooting

**Error: "API authentication failed"**
- Check your API key is correct
- Make sure there are no extra spaces
- Verify key is active on DeepSeek platform

**Error: "Rate limit exceeded"**
- You've hit the rate limit
- Wait a moment and try again
- Check your usage limits on DeepSeek dashboard

**Still seeing placeholder messages?**
- Make sure `.env` file exists in project root
- Restart dev server after adding API key
- Check that variable name matches exactly: `DEEPSEEK_API_KEY`
