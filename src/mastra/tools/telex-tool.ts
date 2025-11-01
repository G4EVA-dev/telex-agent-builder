import { createTool } from "@mastra/core/tools";
import { z } from "zod";

export const telexGuideTool = createTool({
  id: "telex-guide",
  description:
    "Provides comprehensive integration guides, templates, and workflow JSON examples for connecting agents to Telex.im using various programming languages and frameworks.",
  inputSchema: z.object({
    query: z
      .string()
      .describe(
        "User query asking for help with Mastra, Telex integration, or A2A protocol"
      ),
    language: z
      .string()
      .optional()
      .describe("Programming language, e.g. TypeScript, Python, Go, PHP, etc."),
  }),
  outputSchema: z.object({
    title: z.string(),
    category: z.enum([
      "mastra",
      "integration",
      "workflow",
      "general",
      "a2a-protocol",
    ]),
    content: z.string(),
    example: z.string().optional(),
    resources: z
      .array(
        z.object({
          title: z.string(),
          url: z.string(),
          description: z.string(),
        })
      )
      .optional(),
  }),
  execute: async ({ context }) => {
    const query = context.query.toLowerCase();
    const language = (context.language || "").toLowerCase();

    // A2A Protocol explanation
    if (
      query.includes("a2a") ||
      query.includes("agent-to-agent") ||
      query.includes("protocol")
    ) {
      return getA2AProtocolGuide();
    }

    // Python/FastAPI specific
    if (
      language.includes("python") ||
      query.includes("python") ||
      query.includes("fastapi")
    ) {
      return getPythonFastAPIGuide(query);
    }

    // TypeScript/Mastra
    if (
      language.includes("typescript") ||
      language.includes("javascript") ||
      query.includes("mastra")
    ) {
      return getMastraIntegrationGuide(query);
    }

    // Other languages
    if (
      language &&
      ["go", "java", "php", "rust", "c#", "csharp"].some((lang) =>
        language.includes(lang)
      )
    ) {
      return getGenericIntegrationGuide(language);
    }

    // Workflow/JSON examples
    if (
      query.includes("workflow") ||
      query.includes("json") ||
      query.includes("example")
    ) {
      return getWorkflowExample();
    }

    // Telex integration
    if (
      query.includes("connect") ||
      query.includes("integrate") ||
      query.includes("telex")
    ) {
      return getTelexIntegrationGuide(query);
    }

    // Default response
    return {
      title: "Getting Started with Telex Agent Builder",
      category: "general" as const,
      content: `
You can build agents for Telex.im in any language using the **A2A (Agent-to-Agent) Protocol**.

## Quick Start by Language

### TypeScript/JavaScript Developers
Use **Mastra** framework for the easiest integration:
- Built-in A2A protocol support
- Simple deployment options
- Rich tooling and evaluation framework

### Python Developers
Use **FastAPI** to build A2A-compatible agents:
- Lightweight and fast
- Easy to deploy
- Full A2A protocol support

### Other Languages (Go, PHP, Java, Rust, C#)
Build a REST API that implements the A2A protocol:
- Create endpoints that handle A2A message format
- Return responses in A2A-compatible JSON
- Deploy anywhere that supports HTTP

## Get Started

1. **Join the Telex organization on Slack:**
   \`\`\`
   /telex-invite your-email@example.com
   \`\`\`
   
2. **Learn about A2A Protocol:**
   Understanding how agents communicate is key to successful integration.

3. **Build your agent** using your preferred language/framework

4. **Test your integration** using the logs endpoint:
   \`\`\`
   https://api.telex.im/agent-logs/{channel-id}.txt
   \`\`\`

Ask me about specific topics like "mastra setup", "python integration", "a2a protocol", or "workflow examples" for detailed guidance.
      `,
      resources: [
        {
          title: "What is A2A? Understanding the Agent-to-Agent Protocol",
          url: "https://fynix.dev/blog/what-is-a2a",
          description:
            "Learn the fundamentals of how agents communicate with each other",
        },
        {
          title:
            "Building Intelligent Workflows: Integrating Mastra A2A Protocol with Telex",
          url: "https://fynix.dev/blog/telex-x-mastra",
          description: "Complete guide for TypeScript/Mastra developers",
        },
        {
          title: "Building A2A Protocol Agents with Python and FastAPI",
          url: "https://fynix.dev/blog/a2a-python-fastapi",
          description: "Step-by-step guide for Python developers",
        },
      ],
    };
  },
});

// 🤝 A2A Protocol Guide
function getA2AProtocolGuide() {
  return {
    title: "Understanding the A2A (Agent-to-Agent) Protocol",
    category: "a2a-protocol" as const,
    content: `
The **A2A (Agent-to-Agent) Protocol** is a standardized communication format that allows AI agents to work together seamlessly, regardless of the language or framework they're built with.

## What is A2A?

A2A defines:
- **Message format**: How agents send and receive information
- **Action schema**: How agents request actions from each other
- **State management**: How context is maintained across interactions
- **Error handling**: How agents communicate failures and issues

## Why A2A Matters

- **Interoperability**: Agents built in Python can talk to agents built in TypeScript
- **Composability**: Chain multiple specialized agents together into workflows
- **Flexibility**: Use the best tool for each job without compatibility issues
- **Scalability**: Build complex multi-agent systems that work together

## Core Concepts

### 1. Message Structure
\`\`\`json
{
  "message": "User's input or request",
  "context": {
    "channel_id": "unique-channel-identifier",
    "user_id": "user-identifier",
    "thread_id": "conversation-thread-id"
  },
  "metadata": {
    "timestamp": "ISO-8601 timestamp",
    "source": "originating agent or user"
  }
}
\`\`\`

### 2. Response Format
\`\`\`json
{
  "reply": "Agent's text response",
  "actions": [
    {
      "type": "action-type",
      "params": { }
    }
  ],
  "context": {
    "updated_state": "any state changes"
  }
}
\`\`\`

### 3. Workflow Integration
Agents expose an A2A endpoint (typically \`/a2a/agent/{agentName}\`) that:
- Accepts POST requests with A2A message format
- Processes the request using the agent's logic
- Returns responses in A2A format
- Can be chained with other agents in Telex workflows

## Implementation Patterns

**TypeScript/Mastra**: Built-in A2A support via \`a2a/mastra-a2a-node\`
**Python/FastAPI**: Manual implementation of A2A endpoints
**Other languages**: REST API following A2A message schema

## Next Steps

Choose your implementation path:
- **TypeScript** → Ask about "mastra setup"
- **Python** → Ask about "python fastapi integration"
- **Other languages** → Ask about "{language} integration"
    `,
    resources: [
      {
        title: "What is A2A? Understanding the Agent-to-Agent Protocol",
        url: "https://fynix.dev/blog/what-is-a2a",
        description: "Deep dive into A2A protocol fundamentals and use cases",
      },
    ],
  };
}

// 🐍 Python/FastAPI Integration Guide
function getPythonFastAPIGuide(query: string) {
  const q = query.toLowerCase();

  if (q.includes("setup") || q.includes("install") || q.includes("start")) {
    return {
      title: "Building A2A Agents with Python and FastAPI",
      category: "integration" as const,
      content: `
Python developers can build A2A-compatible agents using **FastAPI** - a modern, fast web framework perfect for building agent APIs.

## Quick Setup

### 1. Install Dependencies
\`\`\`bash
pip install fastapi uvicorn pydantic
# Optional: for AI model integration
pip install openai anthropic google-generativeai
\`\`\`

### 2. Create Your Agent Structure
\`\`\`python
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional, List, Dict, Any

app = FastAPI(title="My Telex Agent")

class A2AMessage(BaseModel):
    message: str
    context: Optional[Dict[str, Any]] = None
    metadata: Optional[Dict[str, Any]] = None

class A2AResponse(BaseModel):
    reply: str
    actions: Optional[List[Dict[str, Any]]] = []
    context: Optional[Dict[str, Any]] = None

@app.post("/a2a/agent/myAgent")
async def handle_a2a_message(msg: A2AMessage) -> A2AResponse:
    # Your agent logic here
    response_text = process_message(msg.message, msg.context)
    
    return A2AResponse(
        reply=response_text,
        actions=[],
        context=msg.context
    )

def process_message(message: str, context: dict) -> str:
    # Implement your agent's logic
    # Call AI models, query databases, etc.
    return f"Processed: {message}"
\`\`\`

### 3. Run Your Agent
\`\`\`bash
uvicorn main:app --host 0.0.0.0 --port 8000
# Your A2A endpoint: http://localhost:8000/a2a/agent/myAgent
\`\`\`

### 4. Deploy to Production
Popular options:
- **Railway**: \`railway up\`
- **Render**: Connect your GitHub repo
- **Fly.io**: \`fly launch\`
- **DigitalOcean App Platform**: Deploy from Git

### 5. Connect to Telex
Use your deployed URL in Telex workflow:
\`\`\`json
{
  "type": "a2a/generic-node",
  "url": "https://your-app.railway.app/a2a/agent/myAgent"
}
\`\`\`

## Best Practices

- **Error Handling**: Always wrap your logic in try-catch blocks
- **Logging**: Use Python's logging module for debugging
- **Environment Variables**: Use python-dotenv for API keys
- **Type Safety**: Leverage Pydantic models for validation
- **Async Operations**: Use \`async/await\` for I/O operations

## Testing Your Agent

\`\`\`bash
curl -X POST http://localhost:8000/a2a/agent/myAgent \\
  -H "Content-Type: application/json" \\
  -d '{
    "message": "Hello agent!",
    "context": {"channel_id": "test-123"}
  }'
\`\`\`
      `,
      example: `
# Complete FastAPI A2A Agent Example
from fastapi import FastAPI
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import os

app = FastAPI()

class A2AMessage(BaseModel):
    message: str
    context: Optional[Dict[str, Any]] = None

class A2AResponse(BaseModel):
    reply: str
    actions: List[Dict[str, Any]] = []

@app.post("/a2a/agent/assistant")
async def agent_endpoint(msg: A2AMessage):
    try:
        # Your AI logic here
        reply = f"You said: {msg.message}"
        
        return A2AResponse(
            reply=reply,
            actions=[]
        )
    except Exception as e:
        return A2AResponse(
            reply=f"Error: {str(e)}",
            actions=[]
        )
      `,
      resources: [
        {
          title: "Building A2A Protocol Agents with Python and FastAPI",
          url: "https://fynix.dev/blog/a2a-python-fastapi",
          description: "Complete tutorial with production-ready examples",
        },
        {
          title: "What is A2A? Understanding the Agent-to-Agent Protocol",
          url: "https://fynix.dev/blog/what-is-a2a",
          description: "Learn the protocol that powers agent communication",
        },
      ],
    };
  }

  return {
    title: "Python FastAPI + Telex Integration Overview",
    category: "integration" as const,
    content: `
Build production-ready A2A agents with Python and FastAPI.

**Key Steps:**
1. Install FastAPI and Pydantic
2. Create A2A message handlers with proper schemas
3. Implement your agent logic (AI calls, data processing, etc.)
4. Deploy to Railway, Render, or Fly.io
5. Connect your endpoint to Telex workflows

**Your A2A endpoint structure:**
\`POST /a2a/agent/{agentName}\`

For detailed setup instructions, ask me about "python fastapi setup".
    `,
    resources: [
      {
        title: "Building A2A Protocol Agents with Python and FastAPI",
        url: "https://fynix.dev/blog/a2a-python-fastapi",
        description: "Step-by-step guide with code examples",
      },
    ],
  };
}

export function getMastraIntegrationGuide(query: string) {
  const q = query.toLowerCase();

  if (
    q.includes("setup") ||
    q.includes("install") ||
    q.includes("initialize") ||
    q.includes("start")
  ) {
    return {
      title: "Setting Up Mastra for Telex Integration",
      category: "mastra" as const,
      content: `
Mastra is the easiest way for TypeScript developers to build A2A-compatible agents for Telex.im.

## Installation & Setup

### 1. Create New Mastra Project
\`\`\`bash
npm create mastra@latest -y
# or with pnpm
pnpm create mastra@latest -y
\`\`\`

**Optional flags:**
- \`--no-example\` - Skip the default weather agent
- \`--template <name>\` - Start from a template

### 2. Install Dependencies
\`\`\`bash
cd your-project-name
npm install
\`\`\`

### 3. Configure Environment Variables
Create \`.env\` file:
\`\`\`env
# Choose your AI provider
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_key
# OR
OPENAI_API_KEY=your_openai_key
# OR
ANTHROPIC_API_KEY=your_anthropic_key

# Optional: Database for memory
LIBSQL_URL=file:./mastra.db
LIBSQL_AUTH_TOKEN=your_token_if_using_cloud
\`\`\`

### 4. Project Structure
\`\`\`
src/mastra/
├── agents/        # Your AI agents
│   └── my-agent.ts
├── tools/         # Tools agents can use
│   └── my-tool.ts
├── workflows/     # Multi-step workflows
│   └── my-workflow.ts
└── scorers/       # Evaluation logic (optional)
    └── my-scorer.ts
\`\`\`

### 5. Create Your First Agent
\`\`\`typescript
// src/mastra/agents/telex-agent.ts
import { Agent } from '@mastra/core/agent';

export const myAgent = new Agent({
  name: 'My Telex Agent',
  instructions: 'You are a helpful assistant for Telex users.',
  model: 'google/gemini-2.0-flash-exp',
  tools: {},
});
\`\`\`

### 6. Start Development Server
\`\`\`bash
npm run dev
\`\`\`
Opens playground at: **http://localhost:4111**

### 7. Test Your Agent
- Open the Playground UI
- Select your agent from the dropdown
- Start chatting to test behavior
- Iterate and refine

### 8. Deploy Your Agent
Choose your deployment platform:

**Vercel** (Recommended for Mastra):
\`\`\`bash
npm run build
vercel deploy
\`\`\`

**Render/Railway/Fly.io**:
\`\`\`bash
npm run build
# Follow platform-specific deployment
\`\`\`

**Mastra Cloud**:
\`\`\`bash
mastra deploy
\`\`\`

### 9. Connect to Telex
Your agent's A2A endpoint will be:
\`\`\`
https://your-domain.com/a2a/agent/myAgent
\`\`\`

Add this to your Telex workflow node.

## Requirements

- **Node.js**: 20.x or higher
- **Package Manager**: npm, pnpm, or yarn
- **API Key**: For your chosen AI provider (Gemini, OpenAI, Anthropic)

## Next Steps

- Add tools to extend agent capabilities
- Implement memory for context retention
- Create workflows for complex tasks
- Add scorers for evaluation

For Telex-specific integration, ask about "telex integration" or "workflow examples".
      `,
      example: `
{
  "scripts": {
    "dev": "mastra dev",
    "build": "mastra build",
    "start": "mastra start"
  },
  "dependencies": {
    "@mastra/core": "latest",
    "zod": "^4"
  },
  "devDependencies": {
    "typescript": "latest",
    "@types/node": "latest"
  }
}
      `,
      resources: [
        {
          title:
            "Building Intelligent Workflows: Integrating Mastra A2A Protocol with Telex",
          url: "https://fynix.dev/blog/telex-x-mastra",
          description: "Complete guide to Mastra + Telex integration",
        },
        {
          title: "What is A2A? Understanding the Agent-to-Agent Protocol",
          url: "https://fynix.dev/blog/what-is-a2a",
          description:
            "Learn the protocol powering Mastra's agent communication",
        },
      ],
    };
  }

  return {
    title: "Mastra Framework Overview",
    category: "mastra" as const,
    content: `
Mastra is a TypeScript-first framework for building production-ready AI agents with built-in A2A protocol support.

## Key Features

- **Quick Start**: \`npm create mastra@latest -y\`
- **Built-in A2A**: Native Telex.im integration
- **Multi-Model**: OpenAI, Gemini, Anthropic, and more
- **Playground**: Test at localhost:4111
- **Tools & Memory**: Extend agent capabilities
- **Workflows**: Chain multiple agents together
- **Scorers**: Evaluate agent performance

## For Telex Integration

Mastra agents work seamlessly with Telex through the \`a2a/mastra-a2a-node\` connector.

Ask about:
- "mastra setup" - Detailed installation guide
- "telex integration" - How to connect to Telex.im
- "workflow examples" - Sample configurations
    `,
    resources: [
      {
        title:
          "Building Intelligent Workflows: Integrating Mastra A2A Protocol with Telex",
        url: "https://fynix.dev/blog/telex-x-mastra",
        description: "Official integration guide",
      },
    ],
  };
}

// ⚙️ Generic Integration Guide (for other languages)
function getGenericIntegrationGuide(language: string) {
  return {
    title: `Building a ${language.charAt(0).toUpperCase() + language.slice(1)} Agent for Telex.im`,
    category: "integration" as const,
    content: `
Build an A2A-compatible agent in ${language} by implementing a REST API that follows the A2A protocol.

## Implementation Steps

### 1. Create an HTTP Server
Set up a web server that can handle POST requests.

### 2. Implement A2A Endpoint
\`\`\`
POST /a2a/agent/{your-agent-name}
Content-Type: application/json
\`\`\`

### 3. Handle Request Format
\`\`\`json
{
  "message": "User's input or request",
  "context": {
    "channel_id": "unique-channel-id",
    "user_id": "user-id",
    "thread_id": "thread-id"
  },
  "metadata": {
    "timestamp": "2024-01-01T12:00:00Z"
  }
}
\`\`\`

### 4. Return Response Format
\`\`\`json
{
  "reply": "Your agent's text response",
  "actions": [
    {
      "type": "action-type",
      "params": {}
    }
  ],
  "context": {
    "updated_state": "any state changes"
  }
}
\`\`\`

### 5. Deploy Your Service
Host your API publicly:
- **Cloud Platforms**: AWS, GCP, Azure
- **Platform-as-a-Service**: Heroku, Render, Railway
- **Containerization**: Docker + Kubernetes

### 6. Connect to Telex
Use your public endpoint in Telex workflow:
\`\`\`json
{
  "type": "a2a/generic-node",
  "url": "https://your-api.com/a2a/agent/yourAgent"
}
\`\`\`

## Best Practices

- **Error Handling**: Return meaningful error messages in A2A format
- **Logging**: Track requests for debugging
- **Authentication**: Validate requests from Telex (if needed)
- **Timeouts**: Respond within reasonable time (< 30s)
- **State Management**: Use context to maintain conversation state

## Testing

Test your endpoint locally:
\`\`\`bash
curl -X POST http://localhost:your-port/a2a/agent/yourAgent \\
  -H "Content-Type: application/json" \\
  -d '{
    "message": "test message",
    "context": {"channel_id": "test"}
  }'
\`\`\`

Monitor in production:
\`\`\`
https://api.telex.im/agent-logs/{channel-id}.txt
\`\`\`
    `,
    resources: [
      {
        title: "What is A2A? Understanding the Agent-to-Agent Protocol",
        url: "https://fynix.dev/blog/what-is-a2a",
        description: "Protocol specification and implementation patterns",
      },
    ],
  };
}

// 🧱 Workflow Example
function getWorkflowExample() {
  return {
    title: "Sample Telex Workflow Configurations",
    category: "workflow" as const,
    content: `
Here are example workflow configurations for connecting different types of agents to Telex.im.

## Mastra Agent Workflow

For TypeScript agents built with Mastra:

\`\`\`json
{
  "active": true,
  "category": "developer-tools",
  "description": "AI assistant built with Mastra framework",
  "id": "mastra-agent-workflow",
  "name": "my_mastra_agent",
  "nodes": [
    {
      "id": "mastra_node",
      "name": "My Mastra Agent",
      "type": "a2a/mastra-a2a-node",
      "typeVersion": 1,
      "url": "https://your-app.vercel.app/a2a/agent/myAgent",
      "position": [400, 200]
    }
  ],
  "settings": {
    "executionOrder": "v1"
  },
  "short_description": "Helpful AI assistant"
}
\`\`\`

## Python/FastAPI Agent Workflow

For Python agents using FastAPI:

\`\`\`json
{
  "active": true,
  "category": "automation",
  "description": "Python-based AI agent",
  "id": "python-agent-workflow",
  "name": "my_python_agent",
  "nodes": [
    {
      "id": "python_node",
      "name": "My Python Agent",
      "type": "a2a/generic-node",
      "typeVersion": 1,
      "url": "https://your-app.railway.app/a2a/agent/assistant",
      "position": [400, 200]
    }
  ],
  "settings": {
    "executionOrder": "v1"
  }
}
\`\`\`

## Multi-Agent Workflow

Chain multiple agents together:

\`\`\`json
{
  "active": true,
  "name": "multi_agent_workflow",
  "nodes": [
    {
      "id": "research_agent",
      "name": "Research Agent",
      "type": "a2a/mastra-a2a-node",
      "url": "https://api.example.com/a2a/agent/researcher",
      "position": [200, 200]
    },
    {
      "id": "writer_agent",
      "name": "Writer Agent",
      "type": "a2a/mastra-a2a-node",
      "url": "https://api.example.com/a2a/agent/writer",
      "position": [600, 200]
    }
  ],
  "connections": [
    {
      "source": "research_agent",
      "target": "writer_agent"
    }
  ]
}
\`\`\`

## Key Configuration Fields

- **type**: Node type
  - \`a2a/mastra-a2a-node\` for Mastra agents
  - \`a2a/generic-node\` for other implementations
- **url**: Your agent's A2A endpoint
- **position**: Visual position in workflow editor [x, y]
- **connections**: How agents are linked together

## Testing Your Workflow

After creating a workflow:

1. **Deploy** your agent to get a public URL
2. **Add** the workflow in Telex dashboard
3. **Test** by sending messages in connected channel
4. **Monitor** logs at: \`https://api.telex.im/agent-logs/{channel-id}.txt\`
5. **Iterate** based on logs and user feedback
    `,
    example: `
{
  "type": "a2a/mastra-a2a-node",
  "url": "https://your-deployed-agent.com/a2a/agent/agentName",
  "position": [400, 200]
}
    `,
    resources: [
      {
        title:
          "Building Intelligent Workflows: Integrating Mastra A2A Protocol with Telex",
        url: "https://fynix.dev/blog/telex-x-mastra",
        description: "Deep dive into workflow configuration and best practices",
      },
    ],
  };
}

export function getTelexIntegrationGuide(query: string) {
  const q = query.toLowerCase();

  if (
    q.includes("connect") ||
    q.includes("integrate") ||
    q.includes("deploy") ||
    q.includes("telex") ||
    q.includes("workflow")
  ) {
    return {
      title: "Connecting Your Agent to Telex.im",
      category: "integration" as const,
      content: `
Connect any A2A-compatible agent to Telex.im workflows and enable agent-to-agent collaboration.

## Integration Overview

Telex.im uses the **A2A (Agent-to-Agent) Protocol** to connect agents, regardless of the language or framework they're built with.

## Steps to Integrate

### 1. Build Your Agent
Choose your path:
- **TypeScript** → Use Mastra framework (easiest)
- **Python** → Use FastAPI with A2A endpoints
- **Other languages** → Build REST API following A2A spec

### 2. Deploy Your Agent
Get a public URL for your agent:

**For Mastra (TypeScript):**
\`\`\`bash
# Vercel (recommended)
vercel deploy

# Railway
railway up

# Render
git push origin main  # (auto-deploys)
\`\`\`

**For Python/FastAPI:**
\`\`\`bash
# Railway
railway up

# Render
# Connect GitHub and deploy

# Fly.io
fly launch
\`\`\`

Your A2A endpoint: \`https://your-domain.com/a2a/agent/{agentName}\`

### 3. Join Telex Organization
Run this in your Slack workspace:
\`\`\`
/telex-invite your-email@example.com
\`\`\`

You'll receive an invite to access the Telex dashboard.

### 4. Create Workflow in Telex

**In Telex Dashboard:**
1. Go to **Workflows** → **Add New**
2. Choose **Create New AI Colleague**
3. Configure your agent node:

**For Mastra agents:**
\`\`\`json
{
  "id": "my_agent_node",
  "name": "My Agent",
  "type": "a2a/mastra-a2a-node",
  "url": "https://your-app.vercel.app/a2a/agent/myAgent",
  "position": [400, 200]
}
\`\`\`

**For Python/Other agents:**
\`\`\`json
{
  "id": "my_agent_node",
  "name": "My Agent",
  "type": "a2a/generic-node",
  "url": "https://your-app.railway.app/a2a/agent/assistant",
  "position": [400, 200]
}
\`\`\`

### 5. Connect to a Channel
1. Link your workflow to a Slack/Teams channel
2. Configure triggers (new message, command, webhook)
3. Save and activate the workflow

### 6. Test Your Integration

**Send a test message** in your connected channel:
\`\`\`
@your-agent help
\`\`\`

**Monitor logs** to debug:
\`\`\`bash
# Replace {channel-id} with your actual channel ID
curl https://api.telex.im/agent-logs/{channel-id}.txt
\`\`\`

### 7. Iterate and Improve
- Review logs for errors or unexpected behavior
- Update your agent's logic
- Redeploy
- Test again

## Advanced Features

### Multi-Agent Workflows
Chain agents together:
- Research agent → Writing agent → Publishing agent
- Each agent handles a specialized task

### Context Management
Use the \`context\` field to:
- Maintain conversation state
- Pass data between agents
- Track user preferences

### Error Handling
Always return valid A2A responses:
\`\`\`json
{
  "reply": "I encountered an error: {error_message}",
  "actions": [],
  "context": {"error": true}
}
\`\`\`

## Deployment Best Practices

✅ **Use environment variables** for API keys
✅ **Implement health checks** for monitoring
✅ **Add request logging** for debugging
✅ **Set timeouts** to prevent hanging
✅ **Validate inputs** before processing
✅ **Use HTTPS** for production endpoints
✅ **Version your API** for backward compatibility

## Troubleshooting

**Agent not responding?**
- Check logs: \`https://api.telex.im/agent-logs/{channel-id}.txt\`
- Verify endpoint URL is publicly accessible
- Ensure A2A response format is correct

**Workflow not triggering?**
- Check workflow is activated in Telex dashboard
- Verify channel connection is properly configured
- Test with direct mention: @your-agent

**Getting timeout errors?**
- Optimize your agent's response time
- Move heavy processing to background tasks
- Return acknowledgment quickly, process async

**Context not persisting?**
- Implement proper state management in your agent
- Use the context field to pass state between turns
- Consider adding a database for long-term memory

## Need Help?

Ask me about:
- "mastra setup" - Detailed Mastra installation
- "python integration" - FastAPI implementation guide
- "workflow examples" - More configuration samples
- "a2a protocol" - Understanding agent communication
      `,
      resources: [
        {
          title:
            "Building Intelligent Workflows: Integrating Mastra A2A Protocol with Telex",
          url: "https://fynix.dev/blog/telex-x-mastra",
          description: "Complete integration guide with deployment examples",
        },
        {
          title: "What is A2A? Understanding the Agent-to-Agent Protocol",
          url: "https://fynix.dev/blog/what-is-a2a",
          description:
            "Learn the protocol that powers Telex agent communication",
        },
      ],
    };
  }

  return {
    title: "Telex.im Integration Overview",
    category: "integration" as const,
    content: `
Telex.im connects AI agents through the **A2A (Agent-to-Agent) Protocol**, enabling seamless collaboration between agents built in any language.

## Quick Integration Steps

1. **Build** your agent (Mastra, FastAPI, or custom)
2. **Deploy** to get a public URL
3. **Join** Telex org: \`/telex-invite your-email@example.com\`
4. **Create** workflow in Telex dashboard
5. **Connect** to your Slack/Teams channel
6. **Test** and monitor via logs

## Agent Node Types

- **\`a2a/mastra-a2a-node\`** - For Mastra (TypeScript) agents
- **\`a2a/generic-node\`** - For Python, Go, and other implementations

## Monitoring & Debugging

Check your agent logs:
\`\`\`
https://api.telex.im/agent-logs/{channel-id}.txt
\`\`\`

For detailed integration steps, ask about "telex integration guide" or "connect agent to telex".
    `,
    resources: [
      {
        title:
          "Building Intelligent Workflows: Integrating Mastra A2A Protocol with Telex",
        url: "https://fynix.dev/blog/telex-x-mastra",
        description: "Step-by-step integration tutorial",
      },
      {
        title: "Building A2A Protocol Agents with Python and FastAPI",
        url: "https://fynix.dev/blog/a2a-python-fastapi",
        description: "Python-specific implementation guide",
      },
      {
        title: "What is A2A? Understanding the Agent-to-Agent Protocol",
        url: "https://fynix.dev/blog/what-is-a2a",
        description: "Protocol fundamentals and architecture",
      },
    ],
  };
}
