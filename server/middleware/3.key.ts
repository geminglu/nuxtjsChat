export default defineEventHandler(async (event) => {
  const settings = event.headers.get("settings");
  const { modelaKey } = (JSON.parse(decodeURIComponent(settings || "") || "{}") ||
    {}) as Settings.settings;

  event.context.keys = {
    ...modelaKey,
  };
});
