"use client";
import React from "react";
import LoadingIndicator from "../ui/LoadingIndicator";

export default function EmailSigninHandler({
  callbackUrl,
}: {
  callbackUrl?: string;
}) {
  enum SubmissionState {
    ready = "ready",
    submitting = "submitting",
    submitted = "submitted",
  }
  const [submissionState, setSubmissionState] = React.useState<SubmissionState>(
    SubmissionState.ready
  );
  const [animationClass, setAnimationClass] = React.useState<string>("");
  React.useEffect(() => {
    // Trigger animation on state change
    setAnimationClass("animate-fadeIn");
    const timeout = setTimeout(() => setAnimationClass(""), 500); // Remove the animation class after animation ends

    return () => clearTimeout(timeout); // Cleanup timeout
  }, [submissionState]);
  return (
    <form
      onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmissionState(SubmissionState.submitting);
        const formData = new FormData(e.currentTarget);
        const email = formData.get("email") || "";
        fetch("/api/auth/csrf")
          .then((response) => response.json())
          .then((data) => {
            const csrfToken = data.csrfToken;
            fetch(`/api/auth/signin/http-email`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email: email,
                callbackUrl: callbackUrl,
                csrfToken: csrfToken,
              }),
            })
              .then((response) => {
                if (response.ok) {
                  console.log("email sent");
                  setSubmissionState(SubmissionState.submitted);
                  setTimeout(() => {
                    setSubmissionState(SubmissionState.ready);
                  }, 3000);
                } else {
                  // Handle sign-in error
                }
              })
              .catch((error) => {
                console.error("Error during sign-in:", error);
                setSubmissionState(SubmissionState.ready);
              });
          })
          .catch((error) => {
            console.error("Error fetching CSRF token:", error);
            setSubmissionState(SubmissionState.ready);
          });
      }}
      className="w-full"
    >
      <div className="w-full flex flex-col gap-[9px]">
        <input
          className="w-full h-[48px] px-[14px] py-[12px] rounded-[6px] border-2 border-black focus:ring focus:border-blue-500 focus:outline-none"
          placeholder="Email"
          type="email"
          name="email"
          id="email"
          required
        />
        <button
          className="py-[8px] bg-gray-800 rounded-md text-white disabled:bg-gray-400"
          type="submit"
          disabled={!(submissionState === "ready")}
        >
          <span className={`transition-opacity duration-500 ${animationClass}`}>
            {submissionState === SubmissionState.ready ? (
              "Continue with Email"
            ) : submissionState === SubmissionState.submitting ? (
              <div className="flex justify-center items-center gap-2" role="status">
                <span className="text-white">Sending Email</span>
                <LoadingIndicator className="w-6 h-6"/>
              </div>
            ) : (
              "Email Sent"
            )}
          </span>
        </button>
      </div>
    </form>
  );
}
