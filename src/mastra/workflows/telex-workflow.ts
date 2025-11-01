import { createStep, createWorkflow } from "@mastra/core/workflows";
import { z } from "zod";
import { getMastraIntegrationGuide } from "../tools/telex-tool";
import { getTelexIntegrationGuide } from "../tools/telex-tool";

const mastraSetupStep = createStep({
  id: "mastra-setup-step",
  description:
    "Guides TypeScript developers to setup Mastra and build their agent",
  inputSchema: z.object({
    query: z.string().describe("The user question or setup request"),
  }),
  outputSchema: z.object({
    title: z.string(),
    content: z.string(),
    example: z.string().optional(),
    query: z.string(), // Pass query forward for next step
  }),
  execute: async ({ inputData }) => {
    if (!inputData)
      throw new Error("No input data found for Mastra setup step");

    const result = getMastraIntegrationGuide(inputData.query);

    return {
      ...result,
      query: inputData.query, // Pass query to next step
    };
  },
});

const telexIntegrationStep = createStep({
  id: "telex-integration-step",
  description: "Guides developers on connecting their agents to Telex.im",
  inputSchema: z.object({
    title: z.string(),
    content: z.string(),
    example: z.string().optional(),
    query: z.string().describe("The user question or integration request"),
  }),
  outputSchema: z.object({
    title: z.string(),
    content: z.string(),
    example: z.string().optional(),
  }),
  execute: async ({ inputData }) => {
    if (!inputData)
      throw new Error("No input data found for Telex integration step");

    return getTelexIntegrationGuide(inputData.query);
  },
});

const telexAgentWorkflow = createWorkflow({
  id: "telex-agent-builder-workflow",
  inputSchema: z.object({
    query: z.string().describe("The user question or request for guidance"),
  }),
  outputSchema: z.object({
    mastraSetup: z.object({
      title: z.string(),
      content: z.string(),
      example: z.string().optional(),
      query: z.string(),
    }),
    telexIntegration: z.object({
      title: z.string(),
      content: z.string(),
      example: z.string().optional(),
    }),
  }),
})
  .then(mastraSetupStep)
  .then(telexIntegrationStep);

telexAgentWorkflow.commit();

export { telexAgentWorkflow };
