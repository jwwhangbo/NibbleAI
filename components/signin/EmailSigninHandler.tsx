"use client";
import { useState } from "react";
import LoadingIndicator from "../ui/LoadingIndicator";
import { signIn } from "next-auth/react";

type SubmissionState = "ready" | "submitting" | "submitted";

export default function EmailSigninHandler({
  callbackUrl,
}: {
  callbackUrl: string;
}) {
  const [submissionState, setSubmissionState] =
    useState<SubmissionState>("ready");
  const [FadeIn, setFadeIn] = useState<boolean>(true); // fadein==false => fading out
  const setStateWrapper = (state: SubmissionState) => {
    setFadeIn(false);
    setTimeout(() => {
      setFadeIn(true);
      setSubmissionState(state);
    }, 500);
  };

  return (
    <form
      onSubmit={async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStateWrapper('submitting')
        const formData = new FormData(e.currentTarget);
        const email = formData.get("email") || "";
        const response = await signIn("resend", {
          email: email,
          redirect: false,
          redirectTo: callbackUrl,
        });
        if (response?.ok) {
          setStateWrapper("submitted");
        }
        setTimeout(() => {
          setStateWrapper("ready");
        }, 3000);
      }}
      className="w-full"
    >
      <div className="w-full flex flex-col gap-[9px]">
        <input
          className="w-full h-[48px] px-[14px] py-[12px] rounded-[6px] border-2 border-gray-300 focus:ring focus:border-blue-500 focus:outline-none"
          placeholder="Email"
          type="email"
          name="email"
          id="email"
          required
        />
        <button
          className="py-[8px] bg-slate-300 rounded-full text-slate-600 disabled:bg-gray-400"
          type="submit"
          disabled={!(submissionState === "ready")}
        >
          <div className={FadeIn ? "animate-fadeIn": "animate-fadeOut opacity-0"}>
            {submissionState === "ready" ? (
              <span>Continue with Email</span>
            ) : submissionState === "submitting" ? (
              <div
                className="flex justify-center items-center gap-2"
                role="status"
              >
                <span className="">Sending Email</span>
                <LoadingIndicator className="w-6 h-6" />
              </div>
            ) : (
              <span>Email Sent</span>
            )}
          </div>
        </button>
      </div>
    </form>
  );
}
