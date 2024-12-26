'use client';

import Image from "next/image";
import { useRouter } from "next/navigation";
import backArrow from "@/public/svg/back_arrow.svg"

export default function BackArrow() {
  const nextrouter = useRouter();
  return (
    <button type="button" onClick={() => nextrouter.back()}>
      <Image src={backArrow} width={32} height={32} alt="to previous page" />
    </button>
  );
}