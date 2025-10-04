"use server";

import { getPersonalizedRecommendations, type PersonalizedRecommendationsInput } from "@/ai/flows/personalized-recommendations";
import { naturalLanguageLogQuery, type NaturalLanguageLogQueryInput } from "@/ai/flows/natural-language-log-query";
import { predictAlert, type PredictiveAlertInput } from "@/ai/flows/predictive-alerting";
import { performRootCauseAnalysis, type RootCauseAnalysisInput } from "@/ai/flows/root-cause-analysis";
import { automatedCodeReview, type AutomatedCodeReviewInput } from "@/ai/flows/automated-code-review";


export async function getRecommendations(input: PersonalizedRecommendationsInput) {
    try {
        const result = await getPersonalizedRecommendations(input);
        return result;
    } catch (error) {
        console.error("Error getting recommendations:", error);
        return { recommendations: [], reasoning: "Could not retrieve recommendations at this time." };
    }
}

export async function queryLogs(input: NaturalLanguageLogQueryInput) {
    try {
        const result = await naturalLanguageLogQuery(input);
        // The AI might return a string that contains a JSON object with a 'results' key.
        // Or it might return the array directly as a string. We need to handle both.
        try {
            const parsed = JSON.parse(result.results);
            if (parsed.results) {
                return { results: JSON.stringify(parsed.results) };
            }
            return { results: JSON.stringify(parsed) };
        } catch (e) {
             // If parsing fails, maybe the AI returned the JSON string directly without the outer object.
             return result;
        }
    } catch (error) {
        console.error("Error querying logs:", error);
        return { results: JSON.stringify([]) };
    }
}

export async function getPredictedAlert(input: PredictiveAlertInput) {
    try {
        const result = await predictAlert(input);
        return result;
    } catch (error) {
        console.error("Error predicting alert:", error);
        return null;
    }
}

export async function analyzeRootCause(input: RootCauseAnalysisInput) {
    try {
        const result = await performRootCauseAnalysis(input);
        return result;
    } catch (error) {
        console.error("Error analyzing root cause:", error);
        return null;
    }
}


export async function reviewCode(input: AutomatedCodeReviewInput) {
    try {
        const result = await automatedCodeReview(input);
        return result;
    } catch (error) {
        console.error("Error reviewing code:", error);
        return { securityIssues: [], performanceIssues: [], suggestions: ["Could not review code at this time."] };
    }
}
