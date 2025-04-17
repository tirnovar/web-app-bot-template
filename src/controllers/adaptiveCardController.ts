// src/controllers/adaptiveCardController.ts

import { Request, Response } from 'express';
import {
    TurnContext,
    ActivityTypes,
    ConversationReference,
    CardFactory,
    CloudAdapter
} from 'botbuilder';

/**
 * Factory function to create a controller for sending Adaptive Cards
 * using a given CloudAdapter instance in a SingleTenant Azure Bot setup.
 */
export const createAdaptiveCardController = (adapter: CloudAdapter) => {
    return {
        async sendAdaptiveCard(req: Request, res: Response): Promise<Response> {
            const { adaptiveCardDefinition, chatId, serviceUrl } = req.body;

            // Validate required input
            if (!adaptiveCardDefinition || !chatId || !serviceUrl) {
                return res.status(400).json({
                    error: 'adaptiveCardDefinition, chatId, and serviceUrl are required.'
                });
            }

            try {
                // Construct the conversation reference
                const conversationReference: Partial<ConversationReference> = {
                    conversation: {
                        id: chatId,
                        isGroup: true,
                        conversationType: 'channel',
                        name: 'Teams Conversation'
                    },
                    serviceUrl,
                    channelId: 'msteams'
                };

                // Use the new continueConversationAsync method for proactive messaging
                await adapter.continueConversationAsync(
                    process.env.MICROSOFT_APP_ID!, // Required for proactive messaging auth
                    conversationReference,
                    async (context: TurnContext) => {
                        const adaptiveCard = CardFactory.adaptiveCard(adaptiveCardDefinition);
                        await context.sendActivity({
                            type: ActivityTypes.Message,
                            attachments: [adaptiveCard]
                        });
                    }
                );

                return res.status(200).json({ message: 'Adaptive card sent successfully.' });
            } catch (error: unknown) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                console.error('Error sending adaptive card:', errorMessage);
                return res.status(500).json({
                    error: 'Failed to send adaptive card.',
                    details: errorMessage
                });
            }
        }
    };
};