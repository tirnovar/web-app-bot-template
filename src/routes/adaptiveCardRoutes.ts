import { Application } from 'express';
import { CloudAdapter } from 'botbuilder';
import { createAdaptiveCardController } from '../controllers/adaptiveCardController';

export function setAdaptiveCardRoutes(app: Application, adapter: CloudAdapter) {
    const controller = createAdaptiveCardController(adapter);
    app.post('/api/adaptive-card', controller.sendAdaptiveCard);
}