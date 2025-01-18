import { Theme } from "@auth/core/types";
import { EmailConfig } from "next-auth/providers";

function html(info: {expires: Date, url: string, to:string}) {
  const {expires, url, to} = info;
  return `
  <!DOCTYPE html>
  <html>
    <head>
      <style>
        html, body {
          height: 100%;
          margin: 0;
          padding: 0;
          background: #f9f9f9;
        }
      </style>
    </head>
    <body>
      <table
        width="100%"
        height="100%"
        border="0"
        cellspacing="0"
        cellpadding="0"
        style="background: #f9f9f9;"
      >
        <tr>
          <td align="center" valign="middle">
            <table
              width="100%"
              border="0"
              cellspacing="20"
              cellpadding="0"
              style="
                background: #fff;
                max-width: 600px;
                margin: auto;
                border-radius: 10px;
              "
            >
              <tr>
                <td align="center">
                  <img
                    src="https://pub-d1a8b5717b5b4146bf4495d7fdd8a0bd.r2.dev/logo_v2.png"
                    style="width: 250px"
                  />
                </td>
              </tr>
              <tr>
                <td
                  align="center"
                  style="
                    padding: 10px 0px;
                    font-size: 28px;
                    font-family: Helvetica, Arial, sans-serif;
                    color: #444;
                  "
                >
                  <strong>Let's log you in</strong>
                </td>
              </tr>
              <tr>
                <td
                  align="center"
                  style="
                    font-size: 16px;
                    line-height: 22px;
                    font-family: Helvetica, Arial, sans-serif;
                    color: #444;
                  "
                >
                  <p style="display: block; margin: 0">
                    Click the button below to log in to NibbleAI.<br>
                    This link will expire: <br>
                    ${expires}
                  </p>
                </td>
              </tr>
              <tr>
                <td align="center" style="padding: 20px 0">
                  <table border="0" cellspacing="0" cellpadding="0" width="80%">
                    <tr>
                      <td
                        align="center"
                        style="border-radius: 5px"
                        bgcolor="#346df1"
                      >
                        <a
                          href="${url}"
                          target="_blank"
                          style="
                            font-size: 18px;
                            font-family: Helvetica, Arial, sans-serif;
                            color: #fff;
                            text-decoration: none;
                            border-radius: 5px;
                            padding: 15px 20px;
                            border: 1px solid #346df1;
                            display: inline-block;
                            font-weight: lighter;
                            width: 100%;
                            box-sizing: border-box;
                          "
                          >Sign in</a
                        >
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td
                  align="center"
                  style="
                    font-size: 16px;
                    line-height: 22px;
                    font-family: Helvetica, Arial, sans-serif;
                    color: #444;
                  "
                >
                  <p style="display: block; margin: 0">
                    Confirming this email will securely<br>
                    log you in using ${to}
                  </p>
                </td>
              </tr>
              <tr>
                <td
                  align="center"
                  style="
                    padding: 0px 0px 10px 0px;
                    font-size: 16px;
                    line-height: 22px;
                    font-family: Helvetica, Arial, sans-serif;
                    color: #979797;
                  "
                >
                  If you did not request this email you can safely ignore it.
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>

  `;
}

export async function sendVerificationRequest(params:{
    identifier: string;
    url: string;
    expires: Date;
    provider: EmailConfig;
    token: string;
    theme: Theme;
    request: Request;
}) {
  const { identifier: to, provider, url, expires } = params;
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
      subject: `Your sign in link to ${host}`,
      html: html({ expires, url, to }),
      // text: `Please click here to authenticate - ${url}`,
    }),
  });

  if (!res.ok)
    throw new Error("Resend error: " + JSON.stringify(await res.json()));
}
