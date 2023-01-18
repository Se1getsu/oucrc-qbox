import { IncomingWebhook } from '@slack/webhook';

export async function sendToSlack(text: string) {
  const url = process.env.SLACK_WEBHOOK_URL!;
  const webhook = new IncomingWebhook(url);
  await webhook.send({ text });
}
