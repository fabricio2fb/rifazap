import { createAdminClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import webpush from "web-push";

// Configurar web-push
const vapidDetails = {
  publicKey: process.env.VAPID_PUBLIC_KEY || "",
  privateKey: process.env.VAPID_PRIVATE_KEY || "",
  subject: `mailto:${process.env.VAPID_EMAIL || "contato@apoiefy.com.br"}`
};

if (vapidDetails.publicKey && vapidDetails.privateKey) {
  webpush.setVapidDetails(
    vapidDetails.subject,
    vapidDetails.publicKey,
    vapidDetails.privateKey
  );
}

export async function POST(request: Request) {
  try {
    const { user_id, title, body, url } = await request.json();

    if (!user_id || !title || !body) {
      return NextResponse.json({ error: "user_id, title and body are required" }, { status: 400 });
    }

    const supabase = await createAdminClient();

    // 1. Buscar subscrição do usuário
    const { data: subscriptions, error } = await supabase
      .from('push_subscriptions')
      .select('subscription')
      .eq('user_id', user_id);

    if (error || !subscriptions || subscriptions.length === 0) {
      return NextResponse.json({ error: "Subscription not found for user" }, { status: 404 });
    }

    // 2. Disparar notificações
    const notifications = subscriptions.map(sub => {
      const pushSubscription = sub.subscription as any;
      return webpush.sendNotification(
        pushSubscription,
        JSON.stringify({ title, body, url: url || '/' })
      ).catch((err: any) => {
        console.error("Error sending notification", err);
        // Se a subscrição expirou ou é inválida, poderíamos removê-la aqui
        if (err.statusCode === 404 || err.statusCode === 410) {
           // delete logic...
        }
      });
    });

    await Promise.all(notifications);

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error("Error in notify API:", error);
    return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
  }
}
