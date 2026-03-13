import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { email } = (await req.json()) as { email?: string };

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Valid email required" }, { status: 400 });
    }

    const sb = supabaseAdmin();
    if (!sb) {
      return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
    }

    const { error } = await sb
      .from("subscribers")
      .upsert({ email: email.toLowerCase().trim() }, { onConflict: "email" });

    if (error) {
      console.error("Subscribe error:", error.message);
      return NextResponse.json({ error: "Could not subscribe" }, { status: 500 });
    }

    notifyOwner(email).catch(() => {});

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

async function notifyOwner(subscriberEmail: string) {
  const NOTIFY_EMAIL = "mrdeansagate@gmail.com";
  const SITE = "AI Business Dispatch";

  const formspreeId = process.env.FORMSPREE_ID;
  if (formspreeId) {
    await fetch(`https://formspree.io/f/${formspreeId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        email: NOTIFY_EMAIL,
        _replyto: subscriberEmail,
        _subject: `${SITE} — New Subscriber: ${subscriberEmail}`,
        message: `New subscriber: ${subscriberEmail}\nTime: ${new Date().toISOString()}`,
      }),
    });
    return;
  }

  const resendKey = process.env.RESEND_API_KEY;
  if (resendKey) {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "AI Business Dispatch <onboarding@resend.dev>",
        to: NOTIFY_EMAIL,
        subject: `New Subscriber: ${subscriberEmail}`,
        text: `New subscriber to ${SITE}:\n\nEmail: ${subscriberEmail}\nTime: ${new Date().toISOString()}`,
      }),
    });
    return;
  }

  console.log(`[Subscribe] New subscriber: ${subscriberEmail} (no email service configured — stored in Supabase)`);
}
