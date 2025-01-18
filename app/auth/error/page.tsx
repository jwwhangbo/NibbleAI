'use server';

export default async function Page({ searchParams } : { searchParams : Promise<{error: string}>}) {
  const error = (await searchParams).error;
  return (
    <div>{error}</div>
  );
}