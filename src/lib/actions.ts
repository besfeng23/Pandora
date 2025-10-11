
"use server";

import { getPersonalizedRecommendations as getPersonalizedRecommendationsFlow, type PersonalizedRecommendationsInput, type PersonalizedRecommendationsOutput } from "@/ai/flows/personalized-recommendations";
import { naturalLanguageLogQuery as naturalLanguageLogQueryFlow, type NaturalLanguageLogQueryInput, type NaturalLanguageLogQueryOutput } from "@/ai/flows/natural-language-log-query";
import { predictAlert as predictAlertFlow, type PredictiveAlertInput, type PredictiveAlertOutput } from "@/ai/flows/predictive-alerting";
import { performRootCauseAnalysis as rootCauseAnalysisFlow, type RootCauseAnalysisInput, type RootCauseAnalysisOutput } from "@/ai/flows/root-cause-analysis";
import { automatedCodeReview as automatedCodeReviewFlow, type AutomatedCodeReviewInput, type AutomatedCodeReviewOutput } from "@/ai/flows/automated-code-review";
import { cloudWastageDetection as cloudWastageDetectionFlow, type CloudWastageDetectionInput, type CloudWastageDetectionOutput } from "@/ai/flows/cloud-wastage-detection";
import { predictEquipmentFailure as predictEquipmentFailureFlow, type PredictiveMaintenanceInput, type PredictiveMaintenanceOutput } from "@/ai/flows/predictive-maintenance";

// Helper to wrap Genkit flows with error handling.
async function handleFlow<I, O>(flow: (input: I) => Promise<O>, input: I, defaultOnError: O): Promise<O> {
    try {
        return await flow(input);
    } catch (error) {
        console.error(`Error in flow ${flow.name}:`, error);
        return defaultOnError;
    }
}

export async function getPersonalizedRecommendations(input: PersonalizedRecommendationsInput): Promise<PersonalizedRecommendationsOutput> {
    return handleFlow(getPersonalizedRecommendationsFlow, input, { recommendations: [], reasoning: "Could not retrieve recommendations at this time." });
}

export async function queryLogs(input: NaturalLanguageLogQueryInput): Promise<NaturalLanguageLogQueryOutput> {
     const result = await handleFlow(naturalLanguageLogQueryFlow, input, { results: "[]" });
      try {
        // The AI might return a string that contains a JSON object with a 'results' key.
        // Or it might return the array directly as a string. We need to handle both.
        const parsed = JSON.parse(result.results);
        if (parsed.results && Array.isArray(parsed.results)) {
            return { results: JSON.stringify(parsed.results) };
        }
        return { results: JSON.stringify(parsed) };
    } catch (e) {
            // If parsing fails, maybe the AI returned the JSON string directly without the outer object.
            return result;
    }
}

export async function predictiveAlert(input: PredictiveAlertInput): Promise<PredictiveAlertOutput | null> {
    return handleFlow(predictAlertFlow, input, null);
}

export async function rootCauseAnalysis(input: RootCauseAnalysisInput): Promise<RootCauseAnalysisOutput | null> {
    return handleFlow(rootCauseAnalysisFlow, input, null);
}

export async function automatedCodeReview(input: AutomatedCodeReviewInput): Promise<AutomatedCodeReviewOutput> {
    return handleFlow(automatedCodeReviewFlow, input, { securityIssues: [], performanceIssues: [], suggestions: ["Could not review code at this time."] });
}

export async function cloudWastageDetection(input: CloudWastageDetectionInput): Promise<CloudWastageDetectionOutput> {
    return handleFlow(cloudWastageDetectionFlow, input, { idleResources: [] });
}

export async function predictEquipmentFailure(input: PredictiveMaintenanceInput): Promise<PredictiveMaintenanceOutput | null> {
    return handleFlow(predictEquipmentFailureFlow, input, null);
}
