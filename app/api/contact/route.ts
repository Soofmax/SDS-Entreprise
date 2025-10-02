import { NextRequest, NextResponse } from 'next/server';

function sanitize(input: string, max = 1000): string {
  const withoutTags = input.replace(/<[^>]*>/g, '');
  return withoutTags.trim().slice(0, max);
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || '';
    let form: FormData;

    if (contentType.includes('application/json')) {
      const json = await req.json();
      form = new FormData();
      Object.entries(json).forEach(([k, v]) => form.append(k, String(v)));
    } else {
      form = await req.formData();
    }

    // Honeypot
    const honeypot = (form.get('company') || form.get('website') || form.get('hp_field') || '') as string;
    if (honeypot && String(honeypot).trim().length > 0) {
      // Silently accept but drop
      return NextResponse.redirect(new URL('/success', req.url), { status: 303 });
    }

    const name = sanitize(String(form.get('name') || ''), 120);
    const email = sanitize(String(form.get('email') || ''), 200);
    const phone = sanitize(String(form.get('phone') || ''), 30);
    const project = sanitize(String(form.get('project') || ''), 80);
    const budget = sanitize(String(form.get('budget') || ''), 80);
    const message = sanitize(String(form.get('message') || ''), 4000);
    const timeline = sanitize(String(form.get('timeline') || ''), 80);

    const errors: Record<string, string> = {};
    if (!name) errors.name = 'Le nom est requis.';
    if (!email || !isValidEmail(email)) errors.email = 'Email invalide.';
    if (!project) errors.project = 'Le type de projet est requis.';
    if (!message) errors.message = 'Le message est requis.';

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ ok: false, errors }, { status: 400 });
    }

    // TODO: send email via Resend/Mailgun or persist to DB (prisma)
    // For now, log safely
    console.info('New contact request', {
      name, email, phone, project, budget, timeline,
      messagePreview: message.slice(0, 200)
    });

    // Redirect to thank-you page for no-JS fallback
    return NextResponse.redirect(new URL('/success', req.url), { status: 303 });
  } catch (err) {
    console.error('Contact API error', err);
    return NextResponse.json({ ok: false, error: 'Erreur serveur' }, { status: 500 });
  }
}