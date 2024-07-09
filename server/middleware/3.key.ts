export default defineEventHandler(async (event) => {
  const settings = event.headers.get("settings");
  const data = (JSON.parse(decodeURIComponent(settings || "") || "{}").modelaKey ||
    {}) as Settings.ModelaKeyType;
  event.context.keys = {
    ...data,
  };
});
