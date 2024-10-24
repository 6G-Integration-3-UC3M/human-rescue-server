"use server";

import prisma from "@/lib/prisma";

export const findRulesForMission = async (missionId) => {
    if (!missionId || isNaN(parseInt(missionId))) {
        throw new Error("Invalid mission ID");
    }

    return await prisma.rule.findMany({
        where: {
            missionId: parseInt(missionId), // Ensure missionId is an integer
        },
    });

}

/*
 * Check if there is a match between the detection and the rule condition
 * to determine if an alert should be created
 */
export async function checkRulesForMission(missionId, detection) {
    try {
        // Get all the rules for the mission
        const rules = await prisma.rule.findMany({
            where: { missionId: parseInt(missionId) },
        });

        for (const rule of rules) {
            if (rule.isActive) {
                // For simplicity, assume rule.condition is a string like 'detectedObject = "human" && confidence > 0.8'
                const conditionMatched = evalCondition(rule.condition, detection);

                if (conditionMatched) {
                    // Create an alert if the condition matches
                    await prisma.alert.create({
                        data: {
                            droneId: detection.droneId,
                            missionId: detection.missionId,
                            detectionId: detection.id,
                            ruleId: rule.id,
                            type: 'Detection Alert',
                            message: `Rule triggered: ${rule.condition}`,
                            severity: 'high',
                            isAcknowledged: 0,
                        },
                    });
                }
            }
        }
    } catch (error) {
        console.error('Error checking rules for mission:', error);
    }
}

/*
 * Evaluate the rule condition against the detection
 */
function evalCondition(conditionJSON, detection) {
    const condition = JSON.parse(conditionJSON);

    if (condition.detectedObject && condition.detectedObject !== detection.detectedObject) {
        return false;
    }

    if (condition.confidence) {
        const { operator, value } = condition.confidence;
        const detectionConfidence = detection.confidence;

        switch (operator) {
            case '>=':
                if (!(detectionConfidence >= value)) return false;
                break;
            case '<=':
                if (!(detectionConfidence <= value)) return false;
                break;
            case '>':
                if (!(detectionConfidence > value)) return false;
                break;
            case '<':
                if (!(detectionConfidence < value)) return false;
                break;
            case '==':
                if (!(detectionConfidence == value)) return false;
                break;
            case '!=':
                if (!(detectionConfidence != value)) return false;
                break;
            default:
                console.error(`Unsupported operator: ${operator}`);
                return false;
        }
    }

    return true;
}
