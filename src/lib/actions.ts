"use server";

import { getPersonalizedRecommendations, type PersonalizedRecommendationsInput } from "@/ai/flows/personalized-recommendations";
import { naturalLanguageLogQuery, type NaturalLanguageLogQueryInput } from "@/ai/flows/natural-language-log-query";
import { predictAlert, type PredictiveAlertInput } from "@/ai/flows/predictive-alerting";
import { performRootCauseAnalysis, type RootCauseAnalysisInput } from "@/ai/flows/root-cause-analysis";

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
        return result;
    } catch (error) {
        console.error("Error querying logs:", error);
        return { results: "Could not perform search at this time." };
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
