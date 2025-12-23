import { requireUserFromRequest } from '../../../../lib/auth/require-user.js';
import { predictEquipmentFailure } from '@/ai/flows/predictive-maintenance';
import { PredictiveMaintenanceInputSchema } from '@/ai/flows/types';

export async function POST(request: Request) {
  try {
    await requireUserFromRequest(request);
    const body = await request.json();
    const parsed = PredictiveMaintenanceInputSchema.parse(body);
    const result = await predictEquipmentFailure(parsed);
    return Response.json(result, { status: 200 });
  } catch (error: unknown) {
    const message = (error as Error).message || 'Bad request';
    const status = message.toLowerCase().includes('token') ? 401 : 400;
    return Response.json({ error: message }, { status });
  }
}
