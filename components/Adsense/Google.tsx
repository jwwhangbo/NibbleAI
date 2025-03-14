'use client';

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    adsbygoogle: any[];
  }
}

import { FunctionComponent, useEffect } from "react";
import Script from "next/script";

export const GoogleAdSense: FunctionComponent = () => {
  if (process.env.NODE_ENV !== "production") {
    return null;
  }
  return (
    <Script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2511010321424649`}
      crossOrigin="anonymous"
      strategy="lazyOnload"
    />
  );
};

export function AdComponent({
  client,
  slot,
  format,
  layout,
  style,
  responsive
}: {
  client: string;
  slot: string;
  format: string;
  layout?: string;
  style?: React.CSSProperties;
  responsive?: boolean;
}) {
  useEffect(() => {
    const pushAd = () => {
      try {
        const adsbygoogle = window.adsbygoogle;
        adsbygoogle.push({});
      } catch (e) {
        console.error(e);
      }
    };

    const interval = setInterval(() => {
      if (window.adsbygoogle) {
        pushAd();
        clearInterval(interval);
      }
    }, 300);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={{ display: "block", ...style }}
      data-ad-client={client}
      data-ad-slot={slot}
      data-ad-format={format}
      {...(layout && { 'data-ad-layout': layout })}
      {...(responsive && { 'data-full-width-responsive': responsive })}
    ></ins>
  );
}