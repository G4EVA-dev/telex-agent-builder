import { createTool } from "@mastra/core/tools";
import { z } from "zod";

export const telexGuideTool = createTool({
  id: "telex-guide",
  description:
    "Provides integration guides, templates, and workflow JSON examples for connecting agents to Telex.im.",
  inputSchema: z.object({
    query: z
      .string()
      .describe("User query asking for help with Mastra or Telex integration"),
    language: z
      .string()
      .optional()
      .describe("Programming language, e.g. TypeScript, Python, Go, PHP, etc."),
  }),
  outputSchema: z.object({
    title: z.string(),
    category: z.enum(["mastra", "integration", "workflow", "general"]),
    content: z.string(),
    example: z.string().optional(),
  }),
  execute: async ({ context }) => {
    const query = context.query.toLowerCase();
    const language = (context.language || "").toLowerCase();

    if (language.includes("typescript") || query.includes("mastra")) {
      return getMastraIntegrationGuide(query);
    } else if (
      language &&
      ["python", "go", "java", "php", "rust", "c#"].some((lang) =>
        language.includes(lang)
      )
    ) {
      return getGenericIntegrationGuide(language);
    } else if (query.includes("workflow") || query.includes("json")) {
      return getWorkflowExample();
    } else if (
      query.includes("connect") ||
      query.includes("integrate") ||
      query.includes("telex")
    ) {
      return getTelexIntegrationGuide(query);
    }

    return {
      title: "Getting Started with Telex Agent Builder",
      category: "general" as const,
      content: `
        You can build agents for Telex.im in any language.
        - For TypeScript/JavaScript → Use **Mastra** to create and deploy your agent.
        - For other languages → Create a REST or WebSocket API that communicates with Telex.im.
        
        Run this command on Slack to join the organization:
        \`/telex-invite your-email@example.com\`
        Swap in your actual email. You'll get added to the organisation and can start testing
        
        Once you're connected, test your agent using the logs endpoint:
        https://api.telex.im/agent-logs/{channel-id}.txt
      `,
    };
  },
});

export function getMastraIntegrationGuide(query: string) {
  // Normalize query for flexible matching
  const q = query.toLowerCase();

  if (
    q.includes("setup") ||
    q.includes("install") ||
    q.includes("initialize")
  ) {
    return {
      title: "Setting Up Mastra Locally",
      category: "mastra" as const,
      content: `
Mastra helps you build, evaluate, and deploy AI agents easily.  
Follow these steps to install and test your first agent:

1. **Install Mastra using the CLI**
   \`\`\`bash
   npm create mastra@latest -y
   # or
   pnpm create mastra@latest -y
   \`\`\`

   You can add flags like:
   - \`--no-example\` to skip the weather agent
   - \`--template <name>\` to start from a specific template

2. **Start the development server**
   \`\`\`bash
   npm run dev
   \`\`\`
   Then open the playground: [http://localhost:4111](http://localhost:4111)

3. **Add your environment variables**
   Create an \`.env\` file and include your model API key:
   \`\`\`env
   GOOGLE_GENERATIVE_AI_API_KEY=<your-api-key>
   \`\`\`
   You can use Gemini, OpenAI, Anthropic, or any supported model.

4. **Project structure**
   After setup, you'll see a \`src/mastra\` folder with:
   - \`/agents\` → your agents (e.g. \`weather-agent.ts\`)
   - \`/tools\` → tools that agents can call (e.g. \`weather-tool.ts\`)
   - \`/scorers\` → evaluation logic for tools (optional)

5. **Build and run**
   \`\`\`bash
   npm run build
   npm run dev
   \`\`\`
   You can now chat with your agent in the Playground UI.

---

🧠 **Note:**  
You'll need Node.js 20+ and a valid model API key.  
Mastra works great with both **TypeScript** and **JavaScript** — you can rename files to \`.js\` if you prefer.
      `,
      example: `
{
  "scripts": {
    "dev": "mastra dev",
    "build": "mastra build"
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
    };
  }

  return {
    title: "Mastra Overview",
    category: "mastra" as const,
    content: `
Mastra is a TypeScript-first framework for building AI agents, tools, and evaluators.

- To start a new project: \`npm create mastra@latest -y\`
- Default port: **4111**
- Supports models from OpenAI, Gemini, Anthropic, and others
- Built-in Playground for testing and evaluation

For integrations (like Telex.im), see the **Telex Integration Guide** function separately.
    `,
  };
}

// ⚙️ Generic Integration Guide (for other languages)
function getGenericIntegrationGuide(language: string) {
  return {
    title: `Building a ${language} Agent for Telex.im`,
    category: "integration" as const,
    content: `
      To integrate your ${language} agent with Telex.im:
      1. Create a REST API endpoint (e.g. /message or /event) that receives JSON messages.
      2. Parse incoming messages from Telex.im and respond with valid JSON actions.
      3. Example request format:
         {
           "sender": "user",
           "message": "get project status",
           "context": { "channel_id": "uuid-here" }
         }

      4. Respond with:
         {
           "reply": "Project is 80% complete.",
           "actions": []
         }

      5. Host your service publicly (e.g. Render, Railway, Vercel).
      6. Share the endpoint URL with your Telex workflow node.

      Keep it simple and consistent — REST or WebSocket both work fine.
    `,
  };
}

// 🧱 Example Workflow JSON Response
function getWorkflowExample() {
  return {
    title: "Sample Telex Workflow JSON",
    category: "workflow" as const,
    content: `
      Here's a sample workflow connecting your Mastra agent to Telex.im:
    `,
    example: `
    {
      "active": true,
      "category": "developer-tools",
      "description": "Workflow for the Telex Agent Builder assistant",
      "id": "AB12x7z3qTelexAgent",
      "name": "telex_agent_builder",
      "nodes": [
        {
          "id": "telex_builder_node",
          "name": "Telex Agent Builder",
          "type": "a2a/mastra-a2a-node",
          "typeVersion": 1,
          "url": "https://telex-mastra.mastra.cloud/a2a/agent/telexAgentBuilder",
          "position": [700, 100]
        }
      ],
      "settings": { "executionOrder": "v1" },
      "short_description": "Helps developers build agents with Mastra and Telex.im"
    }
    `,
  };
}

export function getTelexIntegrationGuide(query: string) {
  const q = query.toLowerCase();

  if (
    q.includes("connect") ||
    q.includes("integrate") ||
    q.includes("telex") ||
    q.includes("workflow")
  ) {
    return {
      title: "Integrating Mastra with Telex.im",
      category: "integration" as const,
      content: `
Mastra agents can integrate directly with **Telex.im** workflows through the **a2a/mastra-a2a-node** connector.  
This allows your Mastra-built agent to respond to messages or automate tasks inside Telex channels.

---

## 🔧 Steps to Integrate

1. **Deploy or expose your Mastra agent**
   - If running locally, ensure your Mastra dev server is live (default: http://localhost:4111).
   - For production, deploy your agent (e.g. on Vercel, Render, Fly.io, or Mastra Cloud).

   Example production URL:
   \`\`\`bash
   https://telex-mastra.mastra.cloud/a2a/agent/telexAgentBuilder
   \`\`\`

2. **Create a Telex workflow**
   Go to your Telex dashboard → **Add New** → **Create a New AI Colleague**.

   Use the node type:
   \`\`\`json
   {
     "id": "telex_agent_node",
     "name": "Telex Agent Builder",
     "type": "a2a/mastra-a2a-node",
     "url": "https://telex-mastra.mastra.cloud/a2a/agent/telexAgentBuilder",
     "position": [400, 200]
   }
   \`\`\`

3. **Connect it to a channel**
   - Add your agent node to an existing Telex workflow.
   - Link it to the appropriate input or event (like new message, command, or webhook).

4. **Test the integration**
   Once connected, test it by sending messages in your Telex channel.  
   You can check logs with:
   \`\`\`bash
   https://api.telex.im/agent-logs/{channel-id}.txt
   \`\`\`

5. **Customize behavior**
   You can extend your agent by:
   - Adding more tools (e.g. \`telex-guide-tool.ts\`)
   - Defining custom scorers for Telex requests
   - Managing long-term state with Mastra's \`Memory\` API (LibSQL or Redis)

---

🧠 **Tips**
- Ensure your Mastra agent exposes a stable public URL (no localhost in production).
- Each agent can handle multiple workflows or channels.
- Use clear agent names (e.g. "Telex Workflow Assistant", "Telex AutoResponder").

---

Example workflow snippet:
\`\`\`json
{
  "name": "telex_agent_builder",
  "description": "Helps developers integrate their agents with Telex.im",
  "nodes": [
    {
      "id": "telex_agent_node",
      "name": "Telex Agent Builder",
      "type": "a2a/mastra-a2a-node",
      "url": "https://telex-mastra.mastra.cloud/a2a/agent/telexAgentBuilder",
      "position": [400, 200]
    }
  ]
}
\`\`\`
      `,
      example: `
{
  "type": "a2a/mastra-a2a-node",
  "url": "https://your-deployed-agent-url/a2a/agent/yourAgentName"
}
      `,
    };
  }

  return {
    title: "Telex Integration Overview",
    category: "integration" as const,
    content: `
Telex.im supports AI agent integrations through "a2a" (agent-to-agent) workflows.

To integrate a Mastra agent:
- Use node type: \`a2a/mastra-a2a-node\`
- Provide your agent's public endpoint (Mastra Cloud or your deployment)
- Monitor logs using: \`https://api.telex.im/agent-logs/{channel-id}.txt\`

See the full integration guide for deployment and configuration details.
    `,
  };
}
