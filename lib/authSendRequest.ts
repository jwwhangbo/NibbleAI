import { Theme } from "@auth/core/types";
import { EmailConfig } from "next-auth/providers";
export async function sendVerificationRequest(params:{
    identifier: string;
    url: string;
    expires: Date;
    provider: EmailConfig;
    token: string;
    theme: Theme;
    request: Request;
}) {
  const { identifier: to, provider, url } = params;
  const { host } = new URL(url);
  const res = await fetch("https://send.api.mailtrap.io/api/send", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${provider.apiKey}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      from: {"email":provider.from},
      to: [{"email":to}],
      subject: `Sign in to ${host}`,
      //   html: html({ url, host, theme }),
      text: `Please click here to authenticate - ${url}`,
    }),
  });

  if (!res.ok)
    throw new Error("Resend error: " + JSON.stringify(await res.json()));
}
