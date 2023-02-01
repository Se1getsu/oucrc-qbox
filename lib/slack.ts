import { IncomingWebhook } from '@slack/webhook';

export async function sendToSlack(text: string) {
  const url = process.env.SLACK_WEBHOOK_URL;
  if (url) {
    const webhook = new IncomingWebhook(url);
    await webhook.send({ text });
  } else {
    console.error('SLACK_WEBHOOK_URLを設定してください');
  }
}
