'use client';

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    adsbygoogle: any[];
  }
}

import { useEffect } from "react";

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