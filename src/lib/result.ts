export type Result<T> = {
  message: string;
  error: unknown;
  ok: false;
} | {
  data: T;
  ok: true;
};
