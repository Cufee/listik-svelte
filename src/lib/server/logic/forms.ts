export function parseForm(form: FormData): Record<string, string> {
  const data: Record<string, string> = {};
  for (const entry of form) {
    data[entry[0]] = entry[1]?.toString() || "";
  }
  return data;
}
