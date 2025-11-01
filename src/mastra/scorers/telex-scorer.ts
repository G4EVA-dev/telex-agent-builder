import { z } from "zod";
import { createScorer } from "@mastra/core/scores";
import { createCompletenessScorer } from "@mastra/evals/scorers/code";

// 1Clarity Scorer — judges if explanations are structured and easy to follow
export const clarityScorer = createScorer({
  name: "Clarity Scorer",
  description:
    "Evaluates if the assistant provides clear, step-by-step guidance understandable by developers.",
  type: "agent",
  judge: {
    model: "google/gemini-2.5-pro",
    instructions: `
      You are a technical writing evaluator assessing clarity.
      Determine if the assistant's response is logically organized, avoids ambiguity, and uses a helpful tone.
      Focus on structure, readability, and developer friendliness.
      Return a JSON score between 0 and 1 with reasoning.
    `,
  },
})
  .preprocess(({ run }) => {
    const assistantText = (run.output?.[0]?.content as string) || "";
    return { assistantText };
  })
  .analyze({
    description: "Evaluate structure and readability",
    outputSchema: z.object({
      clarity: z.number().min(0).max(1),
      explanation: z.string(),
    }),
    createPrompt: ({ results }) => `
      Evaluate the following assistant response for clarity and structure.
      Response:
      """
      ${results.preprocessStepResult.assistantText}
      """
      Return JSON:
      {
        "clarity": number (0-1),
        "explanation": string
      }
    `,
  })
  .generateScore(({ results }) => results?.analyzeStepResult?.clarity ?? 0)
  .generateReason(
    ({ results, score }) =>
      `Clarity score: ${score}. ${results?.analyzeStepResult?.explanation ?? ""}`
  );

// Correctness Scorer — judges if technical guidance is valid and executable
export const correctnessScorer = createScorer({
  name: "Correctness Scorer",
  description:
    "Evaluates the technical accuracy and executability of the assistant’s code or setup instructions.",
  type: "agent",
  judge: {
    model: "google/gemini-2.5-pro",
    instructions: `
      You are a senior software engineer verifying correctness.
      Check if the response's instructions, commands, or code snippets are valid and technically sound.
      If the advice would lead to working code or a successful integration, score higher.
      Return a JSON score between 0 and 1 with reasoning.
    `,
  },
})
  .preprocess(({ run }) => {
    const assistantText = (run.output?.[0]?.content as string) || "";
    return { assistantText };
  })
  .analyze({
    description: "Check if the code or steps are correct and functional",
    outputSchema: z.object({
      correctness: z.number().min(0).max(1),
      explanation: z.string(),
    }),
    createPrompt: ({ results }) => `
      Evaluate the technical correctness of the assistant’s response.
      Response:
      """
      ${results.preprocessStepResult.assistantText}
      """
      Return JSON:
      {
        "correctness": number (0-1),
        "explanation": string
      }
    `,
  })
  .generateScore(({ results }) => results?.analyzeStepResult?.correctness ?? 0)
  .generateReason(
    ({ results, score }) =>
      `Correctness score: ${score}. ${results?.analyzeStepResult?.explanation ?? ""}`
  );

// Engagement Scorer — measures encouragement, tone, and developer motivation
export const engagementScorer = createScorer({
  name: "Engagement Scorer",
  description:
    "Evaluates whether the assistant maintains an encouraging, helpful tone that motivates developers.",
  type: "agent",
  judge: {
    model: "google/gemini-2.5-pro",
    instructions: `
      You are evaluating tone and engagement.
      Check if the assistant motivates the user, encourages exploration, and maintains an approachable, human-like tone.
      Return a JSON score between 0 and 1 with reasoning.
    `,
  },
})
  .preprocess(({ run }) => {
    const assistantText = (run.output?.[0]?.content as string) || "";
    return { assistantText };
  })
  .analyze({
    description: "Check engagement and tone quality",
    outputSchema: z.object({
      engagement: z.number().min(0).max(1),
      explanation: z.string(),
    }),
    createPrompt: ({ results }) => `
      Evaluate the engagement level of the assistant’s response.
      Response:
      """
      ${results.preprocessStepResult.assistantText}
      """
      Return JSON:
      {
        "engagement": number (0-1),
        "explanation": string
      }
    `,
  })
  .generateScore(({ results }) => results?.analyzeStepResult?.engagement ?? 0)
  .generateReason(
    ({ results, score }) =>
      `Engagement score: ${score}. ${results?.analyzeStepResult?.explanation ?? ""}`
  );

export const completenessScorer = createCompletenessScorer();

export const scorers = {
  clarityScorer,
  correctnessScorer,
  engagementScorer,
  completenessScorer,
};
