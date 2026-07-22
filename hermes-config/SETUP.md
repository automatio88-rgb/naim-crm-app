# Hermes Agent + Naim CRM Integration Guide

## Prerequisites
- Hermes Agent installed (`pip install hermes-agent` or via install script)
- Supabase project with the schema from `supabase-schema.sql`
- Telegram bot token from @BotFather

## Step 1: Install Hermes Agent
```bash
curl -sSL https://hermes-agent.nousresearch.com/install.sh | bash
# Or:
pip install hermes-agent
```

## Step 2: Configure Hermes
```bash
# Run the interactive setup
hermes gateway setup
```

Select:
- **LLM Provider**: Your choice (OpenAI, Anthropic, etc.)
- **Messaging Platform**: Telegram
- Enter your Telegram bot token
- Enter your Telegram user ID

## Step 3: Add MCP Server Config
Copy the MCP server section to `~/.hermes/config.yaml`:

```yaml
mcp_servers:
  naim_crm:
    command: "python"
    args: ["/home/riq/naim-crm-app/mcp-server/server.py"]
    env:
      SUPABASE_URL: "https://your-project.supabase.co"
      SUPABASE_KEY: "your-anon-key"
    timeout: 30
    connect_timeout: 10
    tools:
      prompts: false
      resources: false
```

## Step 4: Install MCP Server Dependencies
```bash
cd /home/riq/naim-crm-app/mcp-server
pip install -r requirements.txt
```

## Step 5: Copy SOUL.md
```bash
cp /home/riq/naim-crm-app/hermes-config/SOUL.md ~/.hermes/SOUL.md
```

## Step 6: Start the Gateway
```bash
hermes gateway start
```

## Step 7: Test
Send a message to your Telegram bot:
```
Show me the dashboard stats
```

Hermes will:
1. Receive your message via Telegram
2. Call the `get_dashboard_stats` MCP tool
3. Query your Supabase database
4. Return formatted results

## Example Commands (via Telegram)

| You Say | Hermes Does |
|---------|-------------|
| "Add candidate Ahmed Ali, phone +965-1234, Kuwait driver" | Creates candidate in Supabase |
| "Show all candidates in interview stage" | Queries and lists filtered candidates |
| "Move candidate #abc12345 to visa processing" | Updates candidate stage |
| "Create a security guard job in UAE" | Creates job posting |
| "Schedule appointment for tomorrow 10am" | Creates appointment |
| "Show pending tasks" | Lists pending tasks |
| "Dashboard stats" | Returns overview statistics |

## Troubleshooting

### MCP Server won't connect
```bash
# Test the server manually
cd /home/riq/naim-crm-app/mcp-server
SUPABASE_URL=your_url SUPABASE_KEY=your_key python server.py
```

### Hermes can't find tools
```bash
# Reload MCP servers
/reload-mcp
```

### Telegram bot not responding
```bash
# Check gateway status
hermes gateway status
# Check logs
tail -f ~/.hermes/logs/agent.log
```
