const RESEND_API_URL = 'https://api.resend.com/emails';

function json(res, status, payload) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(payload));
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return json(res, 405, { error: 'Method not allowed' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL || 'horizondvlp@gmail.com';
  const from = process.env.CONTACT_FROM_EMAIL;

  if (!apiKey || !from) {
    return json(res, 500, { error: 'Missing email configuration' });
  }

  const {
    first_name = '',
    last_name = '',
    phone = '',
    email = '',
    project_type = '',
    budget_range = '',
    project_details = ''
  } = req.body || {};

  if (!first_name || !last_name || !phone || !email || !project_type || !budget_range || !project_details) {
    return json(res, 400, { error: 'Missing required form fields' });
  }

  const text = [
    'New Website Inquiry',
    '',
    `First Name: ${first_name}`,
    `Last Name: ${last_name}`,
    `Phone: ${phone}`,
    `Email: ${email}`,
    `Project Type: ${project_type}`,
    `Budget Range: ${budget_range}`,
    '',
    'Project Details:',
    project_details
  ].join('\n');

  const resendRes = await fetch(RESEND_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject: 'New Website Inquiry - Horizon Development',
      text,
      reply_to: email
    })
  });

  if (!resendRes.ok) {
    const details = await resendRes.text();
    return json(res, 502, { error: 'Failed to send email', details });
  }

  return json(res, 200, { ok: true });
};
