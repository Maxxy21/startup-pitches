// app/api/evaluate/route.ts

import { NextResponse } from "next/server";
import { getOpenAI } from "@/lib/utils";
import { backOff } from "exponential-backoff";

// Constants
export const runtime = "edge";
export const maxDuration = 300;

const EVALUATION_CRITERIA = {
  problemSolution: {
    name: "Problem-Solution Fit",
    aspects: [
      "Problem Definition Clarity",
      "Solution Innovation",
      "Market Understanding",
      "Competitive Advantage",
      "Value Proposition",
    ],
  },
  businessModel: {
    name: "Business Model & Market",
    aspects: [
      "Revenue Model",
      "Market Size & Growth",
      "Go-to-Market Strategy",
      "Customer Acquisition",
      "Scalability Potential",
    ],
  },
  team: {
    name: "Team & Execution",
    aspects: [
      "Team Capability",
      "Domain Expertise",
      "Track Record",
      "Resource Management",
      "Implementation Plan",
    ],
  },
  presentation: {
    name: "Pitch Quality",
    aspects: [
      "Clarity & Structure",
      "Data & Evidence",
      "Story & Engagement",
      "Q&A Performance",
      "Overall Persuasiveness",
    ],
  },
} as const;

const WEIGHTS: Record<string, number> = {
  "Problem-Solution Fit": 0.3,
  "Business Model & Market": 0.3,
  "Team & Execution": 0.25,
  "Pitch Quality": 0.15,
};

// Types
type Evaluation = {
  criteria: string;
  comment: string;
  score: number;
  strengths: string[];
  improvements: string[];
  aspects: string[];
};

type Question = {
  text: string;
  answer: string;
};

// Utility Functions
function parseEvaluationResponse(
  response: string,
  aspects: string[]
): Evaluation {
  const scoreMatch = response.match(/SCORE:\s*(\d+(\.\d+)?)/i);
  const strengthsMatch = response.match(
    /STRENGTHS:([\s\S]*?)(?=IMPROVEMENTS:|$)/i
  );
  const improvementsMatch = response.match(
    /IMPROVEMENTS:([\s\S]*?)(?=ANALYSIS:|$)/i
  );
  const analysisMatch = response.match(/ANALYSIS:([\s\S]*?)$/i);

  const strengths = strengthsMatch
    ? strengthsMatch[1]
        .split("\n")
        .filter((s) => s.trim().startsWith("-"))
        .map((s) => s.replace("-", "").trim())
    : [];

  const improvements = improvementsMatch
    ? improvementsMatch[1]
        .split("\n")
        .filter((s) => s.trim().startsWith("-"))
        .map((s) => s.replace("-", "").trim())
    : [];

  return {
    criteria: "",
    comment: analysisMatch ? analysisMatch[1].trim() : "",
    score: scoreMatch
      ? Math.min(Math.max(parseFloat(scoreMatch[1]), 1), 10)
      : 5,
    strengths,
    improvements,
    aspects,
  };
}

async function makeOpenAIRequest(prompt: string) {
  const openai = getOpenAI();
  try {
    return await backOff(
      () =>
        openai.chat.completions.create({
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content: `You are an experienced venture capitalist known for your thorough, critical, and insightful evaluations of startup pitches. 
                        You have deep expertise in startups, business models, and market analysis. 
                        Your goal is to provide clear, actionable, and investor-focused feedback—identifying both key strengths and areas for improvement. 
                        Be concise, professional, and ensure your analysis helps founders understand how to strengthen their pitch for real-world investment decisions.`,
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.7,
        }),
      {
        numOfAttempts: 3,
        maxDelay: 60000,
        startingDelay: 1000,
        timeMultiple: 2,
        retry: (error: any) => error?.error?.code === "rate_limit_exceeded",
      }
    );
  } catch (error: any) {
    if (error?.error?.code === "rate_limit_exceeded") {
      throw new Error(
        "OpenAI service is currently busy. Please try again in a few moments."
      );
    }
    throw error;
  }
}

function buildFullContent(text: string, questions?: Question[]): string {
  const qna =
    questions
      ?.map((q, i) => `Q${i + 1}: ${q.text}\nA${i + 1}: ${q.answer}`)
      .join("\n\n") || "";
  return `Pitch Presentation:\n"${text}"\n\nFollow-up Q&A:\n${qna}`;
}

function buildPrompt(
  criteriaName: string,
  aspects: string[],
  fullContent: string
): string {
  return `
As an expert startup evaluator, analyze this pitch focusing on ${criteriaName}.

Consider these specific aspects:
${aspects.map((aspect) => `- ${aspect}`).join("\n")}

Content to evaluate:
${fullContent}

Provide:
1. Score (1-10) with specific justification
2. Key strengths (3-5 bullet points)
3. Areas for improvement (3-5 bullet points)
4. Detailed analysis of each aspect
5. Critical insights and recommendations
6. Actionable recommendations for the founder

Format your response as follows:
SCORE: [number]
STRENGTHS:
- [point 1]
- [point 2]
...
IMPROVEMENTS:
- [point 1]
- [point 2]
...
ANALYSIS:
[Your detailed analysis]
`;
}

function calculateOverallScore(evaluations: Evaluation[]): number {
  return Math.round(
    evaluations.reduce((sum, evali) => {
      const weight = WEIGHTS[evali.criteria] || 0.25;
      return sum + evali.score * weight;
    }, 0)
  );
}

// Main Handler
export async function POST(req: Request) {
  try {
    const { text, questions } = await req.json();

    if (!text) {
      return NextResponse.json({ error: "No text provided" }, { status: 400 });
    }

    const openai = getOpenAI();
    const fullContent = buildFullContent(text, questions);

    // Generate evaluations
    const evaluations: Evaluation[] = await Promise.all(
      Object.entries(EVALUATION_CRITERIA).map(async ([, criteria]) => {
        const prompt = buildPrompt(
          criteria.name,
          Array.from(criteria.aspects),
          fullContent
        );
        const completion = await makeOpenAIRequest(prompt);
        const response = completion.choices[0].message.content || "";
        const parsed = parseEvaluationResponse(
          response,
          Array.from(criteria.aspects)
        );
        parsed.criteria = criteria.name;
        return parsed;
      })
    );

    // Generate overall summary
    const summaryPrompt = `
                          Based on the detailed evaluations of ${fullContent.length} characters of pitch content, provide:
                          1. Overall assessment (2-3 sentences)
                          2. Key investment thesis (if applicable)
                          3. Major risks and mitigation strategies
                          4. Next steps recommendation

                         Focus on what would matter most to an investor, referencing the pitch’s main strengths and weaknesses. 
                         Keep it concise but insightful.
                        `;

    const summaryCompletion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are an experienced venture capitalist. Provide a concise, actionable synthesis of the pitch evaluation, 
          focusing on what would matter most to an investor. Highlight the main strengths, weaknesses, and investment considerations in a professional and insightful manner.`,
        },
        {
          role: "user",
          content: summaryPrompt,
        },
      ],
      temperature: 0.7,
    });

    const overallScore = calculateOverallScore(evaluations);

    // Logging for debugging (can be removed in production)
    if (process.env.NODE_ENV !== "production") {
      console.log("API Response:", {
        evaluations,
        overallScore,
        overallFeedback: summaryCompletion.choices[0].message.content || "",
      });
    }

    return NextResponse.json({
      evaluations,
      overallScore,
      overallFeedback: summaryCompletion.choices[0].message.content || "",
    });
  } catch (error) {
    console.error("Evaluation error:", error);
    return NextResponse.json({ error: "Evaluation failed" }, { status: 500 });
  }
}
