export const CategoryTag = ({ body }: { body: string }) => {
  return (
    <div className="py-1 px-2 w-fit rounded-lg bg-orange-200 text-xs capitalize">
      <p>{body}</p>
    </div>
  );
};
