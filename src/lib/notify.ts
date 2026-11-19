import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const payload = z.object({
  kind: z.enum(["booking", "message"]),
  title: z.string().min(1).max(180),
  lines: z.array(z.string().max(400)).max(16),
});

export type NotifyResult = {
  delivered: boolean;
  channel: string;
  reason?: string;
};

function channel() {
  const raw = (process.env.NOTIFY_CHANNEL || "telegram").toLowerCase();
  if (raw === "vk" || raw === "both" || raw === "telegram") return raw;
  return "telegram";
}

function esc(s: string) {
  return s.replace(/&/g, "&").replace(/</g, "<").replace(/>/g, ">");
}

async function sendTelegram(text: string): Promise<NotifyResult> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chat = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chat) return { delivered: false, channel: "telegram", reason: "telegram_env_missing" };
  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      chat_id: chat,
      text: esc(text),
      parse_mode: "HTML",
    }),
  });
  if (!res.ok) return { delivered: false, channel: "telegram", reason: "telegram_failed" };
  return { delivered: true, channel: "telegram" };
}

async function sendVk(text: string): Promise<NotifyResult> {
  const token = process.env.VK_ACCESS_TOKEN;
  const peer = process.env.VK_PEER_ID;
  if (!token || !peer) return { delivered: false, channel: "vk", reason: "vk_env_missing" };
  const body = new URLSearchParams({
    access_token: token,
    peer_id: peer,
    random_id: String(Date.now()),
    message: text,
    v: process.env.VK_API_VERSION || "5.199",
  });
  const res = await fetch("https://api.vk.com/method/messages.send", { method: "POST", body });
  const json = (await res.json()) as { error?: { error_msg?: string } };
  if (!res.ok || json.error) return { delivered: false, channel: "vk", reason: "vk_failed" };
  return { delivered: true, channel: "vk" };
}

export const notifyStatus = createServerFn({ method: "GET" }).handler(async () => ({
  channel: channel(),
  telegram: Boolean(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID),
  vk: Boolean(process.env.VK_ACCESS_TOKEN && process.env.VK_PEER_ID),
  pin: Boolean(process.env.ADMIN_PIN || (process.env.ADMIN_USERNAME && process.env.ADMIN_PASSWORD)),
}));

export const sendNotify = createServerFn({ method: "POST" })
  .validator((data: unknown) => payload.parse(data))
  .handler(async ({ data }): Promise<NotifyResult> => {
    const text = [data.title, ...data.lines].join("\n");
    const mode = channel();
    try {
      if (mode === "vk") return await sendVk(text);
      if (mode === "both") {
        const tg = await sendTelegram(text);
        const vk = await sendVk(text);
        return {
          delivered: tg.delivered || vk.delivered,
          channel: "both",
          reason: tg.delivered || vk.delivered ? undefined : tg.reason || vk.reason,
        };
      }
      return await sendTelegram(text);
    } catch {
      return { delivered: false, channel: mode, reason: "network" };
    }
  });

const adminPayload = z.object({ username: z.string().max(120).optional(), password: z.string().max(120).optional(), pin: z.string().max(80).optional() });

export const checkAdminPin = createServerFn({ method: "POST" })
  .validator((data: unknown) => adminPayload.parse(data))
  .handler(async ({ data }) => {
    const expectedUser = process.env.ADMIN_USERNAME;
    const expectedPass = process.env.ADMIN_PASSWORD;
    const expectedPin = process.env.ADMIN_PIN;
    if (expectedUser && expectedPass) {
      return { ok: data.username === expectedUser && data.password === expectedPass, required: true };
    }
    if (expectedPin) return { ok: data.pin === expectedPin, required: true };
    return { ok: false, required: true };
  });

const newsletterPayload = z.object({ email: z.string().email().max(254), consent: z.literal(true) });
export const subscribeNewsletter = createServerFn({ method: "POST" })
  .validator((data: unknown) => newsletterPayload.parse(data))
  .handler(async ({ data }) => {
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    await sql.query(
      `INSERT INTO newsletter_subscribers (email, consent_version) VALUES ($1, $2) ON CONFLICT (email) DO UPDATE SET active = true, consent_version = EXCLUDED.consent_version`,
      [data.email.trim().toLowerCase(), "newsletter-consent-v1-2026-11"],
    );
    return { ok: true as const };
  });
