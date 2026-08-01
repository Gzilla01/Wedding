import type { CheckoutDraft } from "@/lib/sales-store";
import { jsonError, requireSupabaseAdmin, validateCheckoutPayload } from "@/lib/sales-server";

const onboardingSteps = [
  ["wedding", "Uzupelnij dane wesela"],
  ["theme", "Wybierz motyw i zdjecie glowne"],
  ["guests", "Dodaj liste gosci"],
  ["tables", "Ustaw stoliki i mape sali"],
  ["qr", "Wygeneruj kody QR"],
  ["gallery", "Wlacz galerie i upload zdjec"],
];

export async function POST(request: Request) {
  try {
    const payload = await request.json() as CheckoutDraft;
    const checkout = validateCheckoutPayload(payload);
    const supabase = requireSupabaseAdmin();
    const isPaid = checkout.paymentMode === "paid";

    const weddingRecord = {
      slug: checkout.route.slug,
      couple_names: checkout.coupleNames,
      wedding_date: checkout.weddingDate,
      ceremony_time: "14:00",
      reception_time: "16:00",
      ceremony_location: "Do uzupelnienia",
      reception_location: "Do uzupelnienia",
      hero_message: "Witamy na naszej stronie weselnej.",
      contact_email: checkout.ownerEmail,
      owner_email: checkout.ownerEmail,
      contact_phone: checkout.phone,
      is_published: isPaid,
      plan_id: checkout.plan.id,
      public_url: checkout.route.publicPath,
      storage_limit_mb: checkout.plan.storageGb * 1024,
      video_limit_minutes: checkout.plan.videoMinutes,
      expires_at: checkout.expiresAt.toISOString(),
      privacy_level: "public",
    };

    const { data: wedding, error: weddingError } = await supabase
      .from("weddings")
      .insert(weddingRecord)
      .select("*")
      .single();

    if (weddingError) return jsonError(weddingError.message, 500);

    const { error: subscriptionError } = await supabase.from("wedding_subscriptions").insert({
      wedding_id: wedding.id,
      plan_id: checkout.plan.id,
      status: isPaid ? "active" : "pending_payment",
      amount_pln: checkout.plan.pricePln,
      payment_provider: checkout.paymentMode === "paid" ? "manual-confirmed" : "manual",
      starts_at: checkout.createdAt.toISOString(),
      ends_at: checkout.expiresAt.toISOString(),
    });

    if (subscriptionError) return jsonError(subscriptionError.message, 500);

    const { error: onboardingError } = await supabase.from("wedding_onboarding_steps").insert(
      onboardingSteps.map(([stepKey, label]) => ({
        wedding_id: wedding.id,
        step_key: stepKey,
        label,
        completed_at: null,
      })),
    );

    if (onboardingError) return jsonError(onboardingError.message, 500);

    return Response.json({
      ok: true,
      instance: {
        id: wedding.id,
        coupleNames: wedding.couple_names,
        ownerEmail: wedding.owner_email ?? wedding.contact_email,
        phone: wedding.contact_phone ?? "",
        weddingDate: wedding.wedding_date,
        planId: wedding.plan_id,
        slug: wedding.slug,
        status: wedding.is_published ? "active" : "payment_pending",
        publicPath: checkout.route.publicPath,
        adminPath: checkout.route.adminPath,
        storagePrefix: checkout.route.storagePrefix,
        storageLimitGb: checkout.plan.storageGb,
        expiresAt: wedding.expires_at,
        createdAt: wedding.created_at,
      },
    });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Nie udalo sie utworzyc wesela.", 400);
  }
}
