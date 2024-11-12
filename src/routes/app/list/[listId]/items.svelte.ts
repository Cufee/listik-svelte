import type { ListItem } from "$lib/server/db/types";

let items = $state([] as ListItem[]);

export function itemStore(initialState?: ListItem[]) {
  if (initialState) items = initialState;

  const sort = () => {
    items = items.sort((a, b) => {
      // sort by checked/not checked and name
      return (
        (a?.checkedAt?.valueOf() ?? 0) - (b?.checkedAt?.valueOf() ?? 0) ||
        a.name.localeCompare(b.name)
      );
    });
  };
  const push = (item: ListItem) => {
    items = items.filter((i) => i.id !== item.id);
    items.push(item);
  };
  const remove = (id: string) => {
    items = items.filter((i) => i.id !== id);
  };

  const check = async (id: string, sort: boolean) => {
    // Update the UI optimistically
    const item = items.find((i) => i.id === id);
    if (!item) return;

    item.checkedAt = !!item.checkedAt ? null : new Date();
    if (sort) items.sort();

    try {
      // Update the item
      const response = await fetch("?/save-item", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `id=${item.id}&checked=${!!item.checkedAt}`,
      });
      const data = await response.json();
      if (data.type !== "success") {
        // TODO: Handle error - The UI should probably not revert at this point, a user is likely offline
        console.error("failed to update a list item", data);
        return;
      }
    } catch (error) {
      console.error(error);
    }
  };

  return {
    get all() {
      return items;
    },
    get checked() {
      return items.filter((i) => !!i.checkedAt);
    },
    get unchecked() {
      return items.filter((i) => !i.checkedAt);
    },
    set: (newState: ListItem[]) => {
      items = newState;
    },
    remove,
    push,
    sort,
    check,
  };
}
