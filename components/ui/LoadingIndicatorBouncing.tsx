export default function LoadingIndicator(
  props: React.HTMLAttributes<HTMLDivElement>
) {
  return (
    <div {...props}>
      <div className="flex gap-2 pt-5">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 24 24"
          className="size-[0.5em] animate-bounceHarder"
        >
          <circle r="12" cx="12" cy="12" />
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 24 24"
          className="size-[0.5em] animate-bounceHarder delay-100"
        >
          <circle r="12" cx="12" cy="12" />
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 24 24"
          className="size-[0.5em] animate-bounceHarder delay-200"
          >
          <circle r="12" cx="12" cy="12" />
        </svg>
      </div>
    </div>
  );
}
