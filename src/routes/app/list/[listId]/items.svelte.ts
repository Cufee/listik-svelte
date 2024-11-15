import type { ListItem } from "$lib/server/db/types";
import { notificationsStore } from "$lib/stores/notifications.svelte";
import moment from "moment";

let items = $state([] as ListItem[]);
let notifications = notificationsStore();

export function itemStore(initialState?: ListItem[]) {
  const sort = () => {
    items = items.sort((a, b) => {
      // sort by checked/not checked and name
      return (
        (a?.checkedAt?.valueOf() ?? 0) - (b?.checkedAt?.valueOf() ?? 0) ||
        a.name.toLowerCase().localeCompare(b.name.toLowerCase())
      );
    });
  };
  const push = (item: ListItem) => {
    items = items.filter((i) => i.id !== item.id);
    items.push(item);
  };
  const remove = async (id: string) => {
    // Update the UI optimistically
    items = items.filter((i) => i.id !== id);

    // Update the item
    try {
      const response = await fetch("?/delete-item", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `id=${id}`,
      });
      const data = await response.json();
      if (data.type !== "success") {
        notifications.push({
          header: "Error",
          "message": "Failed delete a list item",
          durationSec: 5,
          level: "error",
        });
        console.error("failed to delete a list item", data);
        return;
      }
    } catch (error) {
      // client is most likely offline
      // TODO: some system to sync changes made
      console.error(error);
    }
  };

  const check = async (id: string, sort: boolean) => {
    // Update the UI optimistically
    const item = items.find((i) => i.id === id);
    if (!item) return;

    item.checkedAt = !!item.checkedAt ? null : new Date();
    if (sort) items.sort();

    // Update the item
    try {
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
        notifications.push({
          header: "Error",
          "message": "Failed update a list item",
          durationSec: 5,
          level: "error",
        });
        console.error("failed to update a list item", data);
        return;
      }
    } catch (error) {
      // client is most likely offline
      // TODO: some system to sync changes made
      console.error(error);
    }
  };

  if (initialState) {
    items = initialState;
    sort();
  }

  return {
    get all() {
      return items;
    },
    get active() {
      return items.filter((i) =>
        !i.checkedAt || moment().diff(moment(i.checkedAt), "hours") < 6
      );
    },
    get checked() {
      return items.filter((i) =>
        // Only show recently checked items
        !!i.checkedAt && moment().diff(moment(i.checkedAt), "hours") < 6
      );
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
