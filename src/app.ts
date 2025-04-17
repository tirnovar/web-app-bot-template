import express, { Application, Request, Response } from 'express';
import bodyParser from 'body-parser';
import { setTestRoutes } from './routes/testRoutes';
import { CloudAdapter, ConfigurationBotFrameworkAuthentication, TurnContext } from 'botbuilder';
import * as dotenv from 'dotenv';
import { setAdaptiveCardRoutes } from './routes/adaptiveCardRoutes';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;
app.use(bodyParser.json());

const configuration = {
    MicrosoftAppId: process.env.MICROSOFT_APP_ID || '',
    MicrosoftAppPassword: process.env.MICROSOFT_APP_PASSWORD || '',
    MicrosoftAppTenantId: process.env.MICROSOFT_APP_TENANT_ID || '',
    MicrosoftAppType: process.env.MICROSOFT_APP_TYPE || 'SingleTenant',
};

console.log('Bot Framework Configuration:', configuration);

const botFrameworkAuthentication = new ConfigurationBotFrameworkAuthentication(configuration);
const adapter = new CloudAdapter(botFrameworkAuthentication);

setTestRoutes(app);
setAdaptiveCardRoutes(app, adapter);

app.get('/debug/env', (req, res) => {
    res.json({
        id: process.env.MICROSOFT_APP_ID,
        tenant: process.env.MICROSOFT_APP_TENANT_ID,
        type: process.env.MICROSOFT_APP_TYPE
    });
});

app.post('/api/messages', async (req: Request, res: Response) => {
    await adapter.process(req, res, async (context: TurnContext) => {
        await context.sendActivity(`[${context.activity.type} event detected]`);
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});