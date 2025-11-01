import { Mastra } from "@mastra/core/mastra";
import { PinoLogger } from "@mastra/loggers";
import { LibSQLStore } from "@mastra/libsql";
import { telexAgentWorkflow } from "./workflows/telex-workflow";
import { telexAgentBuilder } from "./agents/telex-agent-builder";
import {
  clarityScorer,
  correctnessScorer,
  engagementScorer,
  completenessScorer,
} from "./scorers/telex-scorer";

export const mastra = new Mastra({
  workflows: { telexAgentWorkflow },
  agents: { telexAgentBuilder },
  scorers: {
    clarityScorer,
    correctnessScorer,
    engagementScorer,
    completenessScorer,
  },
  storage: new LibSQLStore({
    url: ":memory:", // change to file:../mastra.db if you want persistence
  }),
  logger: new PinoLogger({
    name: "Mastra-Telex",
    level: "info",
  }),
  telemetry: {
    enabled: false,
  },
  observability: {
    default: { enabled: true },
  },
});

// import { Mastra } from '@mastra/core/mastra';
// import { PinoLogger } from '@mastra/loggers';
// import { LibSQLStore } from '@mastra/libsql';
// import { weatherWorkflow } from './workflows/weather-workflow';
// import { weatherAgent } from './agents/weather-agent';
// import { toolCallAppropriatenessScorer, completenessScorer, translationScorer } from './scorers/weather-scorer';

// export const mastra = new Mastra({
//   workflows: { weatherWorkflow },
//   agents: { weatherAgent },
//   scorers: { toolCallAppropriatenessScorer, completenessScorer, translationScorer },
//   storage: new LibSQLStore({
//     // stores observability, scores, ... into memory storage, if it needs to persist, change to file:../mastra.db
//     url: ":memory:",
//   }),
//   logger: new PinoLogger({
//     name: 'Mastra',
//     level: 'info',
//   }),
//   telemetry: {
//     // Telemetry is deprecated and will be removed in the Nov 4th release
//     enabled: false,
//   },
//   observability: {
//     // Enables DefaultExporter and CloudExporter for AI tracing
//     default: { enabled: true },
//   },
// });
