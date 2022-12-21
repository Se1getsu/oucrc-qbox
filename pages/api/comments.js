import { sendToSlack } from '../../lib/slack';

module.exports = async (req, res) => {
  const { message } = req.body;

  if (!message) {
    res.writeHead(400).end('Invalid body: message');
  }

  if (req.method === 'POST') {
    await sendToSlack(message);
    res.writeHead(201).end('Created');
  } else {
    res.writeHead(405).end('Method Not Allowed');
  }
}