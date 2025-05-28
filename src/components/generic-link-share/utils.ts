type PlaceholderValues = {
  name: string;
  extId: string;
  role: string;
  presenter: boolean;
};

export function replaceUrlPlaceholders(url: string, values: PlaceholderValues): string {
  return url
    .replace(/{name}/g, encodeURIComponent(values.name))
    .replace(/{extId}/g, encodeURIComponent(values.extId))
    .replace(/{role}/g, encodeURIComponent(values.role))
    .replace(/{presenter}/g, encodeURIComponent(String(values.presenter)));
}
