import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async (
  { url },
): Promise<{ redirect: string }> => {
  const listId = url.searchParams.get("continue");
  if (!!listId) {
    return {
      redirect: "/app/list/" + listId,
    };
  }
  return {
    redirect: "/app",
  };
};
