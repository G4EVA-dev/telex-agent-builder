# Telex Agent Builder

A production-ready AI agent built with [Mastra](https://mastra.ai) that helps developers build and integrate AI agents with [Telex.im](https://telex.im) using the A2A (Agent-to-Agent) protocol. This agent serves as a knowledgeable mentor, providing step-by-step guidance for creating agents in multiple programming languages and frameworks.

## 🚀 Features

- **Multi-Language Support**: Guides developers building agents in TypeScript/JavaScript (Mastra), Python (FastAPI), Go, PHP, Rust, Java, and C#
- **A2A Protocol Integration**: Full support for the Agent-to-Agent protocol, enabling seamless integration with Telex.im workflows
- **Comprehensive Documentation**: Built-in guides covering installation, setup, deployment, and integration
- **Evaluation System**: Built-in scorers for clarity, correctness, engagement, and completeness
- **Memory & Context**: Conversation history and context management using LibSQL
- **Production Ready**: Configured with logging, observability, and OpenAPI documentation

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 20.9.0 or later
- **npm**, **pnpm**, **yarn**, or **bun** package manager
- An API key from a model provider:
  - Google Gemini (recommended for free tier)
  - OpenAI
  - Anthropic

## 🛠️ Installation

### Quick Start with Create Mastra

The fastest way to get started is using the `create mastra` CLI:

```bash
# Using npm
npm create mastra@latest -y

# Using pnpm
pnpm create mastra@latest -y

# Using yarn
yarn create mastra@latest -y

# Using bun
bun create mastra@latest -y
```

### Manual Installation

If you prefer to set up manually or are adding to an existing project:

1. **Initialize your project:**

```bash
npm init -y
```

2. **Install dependencies:**

```bash
npm install -D typescript @types/node mastra@latest
npm install @mastra/core@latest @mastra/evals@latest @mastra/libsql@latest @mastra/loggers@latest @mastra/memory@latest zod@^4
```

3. **Configure TypeScript:**

Create `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ES2022",
    "moduleResolution": "bundler",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true,
    "noEmit": true,
    "outDir": "dist"
  },
  "include": ["src/**/*"]
}
```

4. **Set up environment variables:**

Create a `.env` file in the root directory:

```env
# Choose your AI provider
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_key
# OR
OPENAI_API_KEY=your_openai_key
# OR
ANTHROPIC_API_KEY=your_anthropic_key

# Optional: Database for memory persistence
LIBSQL_URL=file:./mastra.db
LIBSQL_AUTH_TOKEN=your_token_if_using_cloud
```

5. **Add scripts to `package.json`:**

```json
{
  "scripts": {
    "dev": "mastra dev",
    "build": "mastra build",
    "start": "mastra start"
  }
}
```

## 🏗️ Project Structure

```
telex-agent-builder/
├── src/
│   └── mastra/
│       ├── agents/
│       │   ├── telex-agent-builder.ts    # Main agent implementation
│       │   └── weather-agent.ts          # Example agent (template)
│       ├── tools/
│       │   ├── telex-tool.ts             # Comprehensive integration guide tool
│       │   └── weather-tool.ts           # Example tool (template)
│       ├── workflows/
│       │   ├── telex-workflow.ts         # Telex integration workflow
│       │   └── weather-workflow.ts        # Example workflow (template)
│       ├── scorers/
│       │   ├── telex-scorer.ts           # Evaluation scorers
│       │   └── weather-scorer.ts          # Example scorers (template)
│       ├── routes/
│       │   └── a2a-agent-route.ts        # A2A protocol endpoint
│       └── index.ts                       # Mastra configuration
├── package.json
├── tsconfig.json
└── README.md
```

## 🚀 Getting Started

1. **Start the development server:**

```bash
npm run dev
```

This will start the Mastra dev server and open the Playground at [http://localhost:4111](http://localhost:4111).

2. **Test your agent:**

Open the Playground in your browser and interact with the **Telex Agent Builder** agent. Try asking questions like:

- "How do I set up Mastra?"
- "I want to build an agent in Python"
- "How do I connect my agent to Telex?"
- "Show me a workflow example"

3. **Build for production:**

```bash
npm run build
```

## 🌐 A2A Protocol Integration

This project includes full A2A (Agent-to-Agent) protocol support, enabling integration with Telex.im workflows.

### A2A Endpoint

Once deployed, your agent exposes an A2A endpoint:

```
https://your-domain.com/a2a/agent/telexAgentBuilder
```

### Testing the A2A Endpoint

You can test the endpoint directly using `curl`:

```bash
curl -X POST https://your-domain.com/a2a/agent/telexAgentBuilder \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": "test-001",
    "method": "message/send",
    "params": {
      "message": {
        "kind": "message",
        "role": "user",
        "parts": [
          {
            "kind": "text",
            "text": "How do I set up Mastra?"
          }
        ],
        "messageId": "msg-001",
        "taskId": "task-001"
      },
      "configuration": {
        "blocking": true
      }
    }
  }'
```

## 🚢 Deployment

### Deploy to Mastra Cloud

```bash
# Build the project
npm run build

# Deploy to Mastra Cloud
mastra deploy
```

After deployment, you'll receive a unique A2A endpoint URL for your agent.

### Deploy to Mastra

1. Build the project: `npm run build`
2. Deploy: `mastra deploy`
3. Your A2A endpoint will be like: `https://telex-builder-agent.mastra.cloud/a2a/agent/telexAgentBuilder`

### Deploy to Other Platforms

- **Railway**: `railway up`
- **Render**: Connect your GitHub repo for automatic deployments
- **Fly.io**: `fly launch`

## 🔗 Integrating with Telex.im

1. **Join Telex Organization:**

Run this command in your Slack workspace:

```
/telex-invite your-email@example.com
```

2. **Create a Workflow in Telex:**

In the Telex dashboard, create a new workflow with this node configuration:

```json
{
  "id": "telex_agent_builder",
  "name": "Telex Agent Builder",
  "type": "a2a/mastra-a2a-node",
  "typeVersion": 1,
  "url": "https://your-domain.com/a2a/agent/telexAgentBuilder",
  "position": [400, 200]
}
```

3. **Connect to a Channel:**

Link your workflow to a Slack or Teams channel and start using your agent!

### Monitoring & Debugging

Monitor your agent's logs:

```
https://api.telex.im/agent-logs/{channel-id}.txt
```

## 📚 Key Components

### Agent

The **Telex Agent Builder** agent (`telex-agent-builder.ts`) provides comprehensive guidance on:

- Mastra framework setup and configuration
- Language-specific integration patterns
- A2A protocol implementation
- Telex.im workflow configuration
- Deployment strategies

### Tools

The **telex-tool** (`telex-tool.ts`) is a comprehensive guide system that provides:

- Setup guides for Mastra installation
- Integration templates for Telex.im
- Workflow JSON examples
- Language-specific integration patterns (TypeScript, Python, Go, etc.)
- A2A protocol explanations

### Workflows

The **telex-workflow** (`telex-workflow.ts`) chains multiple steps together:

1. Mastra setup guidance
2. Telex integration guidance

### Scorers

Built-in evaluation system with four scorers:

- **Clarity**: Evaluates response structure and readability
- **Correctness**: Validates technical accuracy and executability
- **Engagement**: Measures tone and developer motivation
- **Completeness**: Uses Mastra's built-in completeness scorer

## 🧪 Development

### Available Scripts

- `npm run dev` - Start development server with Playground
- `npm run build` - Build the project for production
- `npm run start` - Start the production server

### Environment Variables

| Variable                       | Description                 | Required                   |
| ------------------------------ | --------------------------- | -------------------------- |
| `GOOGLE_GENERATIVE_AI_API_KEY` | Google Gemini API key       | Yes (or other provider)    |
| `OPENAI_API_KEY`               | OpenAI API key              | Yes (or other provider)    |
| `ANTHROPIC_API_KEY`            | Anthropic API key           | Yes (or other provider)    |
| `LIBSQL_URL`                   | LibSQL database URL         | No (defaults to in-memory) |
| `LIBSQL_AUTH_TOKEN`            | LibSQL authentication token | No                         |

## 📖 Documentation & Resources

- **Mastra Documentation**: [https://docs.mastra.com](https://docs.mastra.com)
- **Telex Documentation**: [https://docs.telex.im](https://docs.telex.im)
- **A2A Protocol**: [What is A2A? Understanding the Agent-to-Agent Protocol](https://fynix.dev/blog/what-is-a2a)
- **Integration Guide**: [Building Intelligent Workflows: Integrating Mastra A2A Protocol with Telex](https://fynix.dev/blog/telex-x-mastra)
- **Python Guide**: [Building A2A Protocol Agents with Python and FastAPI](https://fynix.dev/blog/a2a-python-fastapi)

## 🤝 Contributing

This is a project template that demonstrates best practices for building Mastra agents with A2A protocol support. Feel free to adapt it for your own use cases.

## 📝 License

ISC

## 🆘 Support

- **Issues**: Report bugs or request features through GitHub Issues
- **Documentation**: Check the [Mastra docs](https://docs.mastra.com) for detailed guides

## 🎯 Next Steps

After setting up this agent:

1. **Customize the Agent**: Modify the instructions in `telex-agent-builder.ts` to match your specific use case
2. **Add More Tools**: Extend functionality by creating additional tools
3. **Create Workflows**: Build complex multi-step workflows using the workflow system
4. **Deploy**: Deploy to Mastra Cloud, Vercel, or your preferred platform
5. **Integrate with Telex**: Connect your deployed agent to Telex.im workflows
6. **Monitor**: Use Telex logs and Mastra observability to monitor and improve your agent

---

Built with ❤️ using [Mastra](https://mastra.ai) and [Telex.im](https://telex.im)
