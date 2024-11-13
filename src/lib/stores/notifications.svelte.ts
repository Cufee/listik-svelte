import cuid from "cuid";

export interface Notification {
  id: string;
  header: string;
  message: string;
  durationSec: number;
  level: "error" | "warn" | "success" | "info" | "message";
  timer: Timer;
}

let state = $state<Notification[]>([]);

export function notificationsStore() {
  const push = (payload: Omit<Notification, "id" | "timer">) => {
    const id = cuid();
    const timer = setTimeout(() => dismiss(id), payload.durationSec * 1000);
    state.push({ ...payload, id, timer });
    return id;
  };
  const dismiss = (id: string) => {
    const index = state.findIndex((n) => n.id === id);
    if (index === -1) return;

    clearTimeout(state[index].timer);
    state.splice(index, 1);
  };

  return {
    get all() {
      return state;
    },
    dismiss,
    push,
  };
}
