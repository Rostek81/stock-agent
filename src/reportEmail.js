import nodemailer from 'nodemailer';

function buildReportBody(results) {
  const header = `Dzienny raport NASDAQ (${new Date().toISOString().slice(0, 10)})`;

  const lines = results.map((result) => (
    `${result.symbol} | decyzja: ${result.decision} | score: ${result.score}\nPowód: ${result.explanation}`
  ));

  return `${header}\n\n${lines.join('\n\n')}\n`;
}

export async function sendReportEmail({ smtp, from, to, results }) {
  const transporter = nodemailer.createTransport({
    host: smtp.host,
    port: smtp.port,
    secure: smtp.secure,
    auth: {
      user: smtp.user,
      pass: smtp.pass
    }
  });

  await transporter.sendMail({
    from,
    to,
    subject: `NASDAQ daily report - ${new Date().toISOString().slice(0, 10)}`,
    text: buildReportBody(results)
  });
}
