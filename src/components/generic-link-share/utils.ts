import { UserMetadata } from './types';

type PlaceholderValues = {
  name: string;
  extId: string;
  role: string;
  presenter: boolean;
};

const DEFAULT_PREFIX = 'genericLinkShare';

export function replaceUrlPlaceholders(url: string, values: PlaceholderValues): string {
  return url
    .replace(/{name}/g, encodeURIComponent(values.name))
    .replace(/{extId}/g, encodeURIComponent(values.extId))
    .replace(/{role}/g, encodeURIComponent(values.role))
    .replace(/{presenter}/g, encodeURIComponent(String(values.presenter)));
}

export function replaceUrlPlaceholdersSecure(
  url: string,
  placeholderValues?: PlaceholderValues,
  userdataParams?: UserMetadata[],
): string {
  const allowedUserdataParams = userdataParams?.filter(
    (entry) => entry.parameter.startsWith(DEFAULT_PREFIX),
  );

  let result = replaceUrlPlaceholders(url, placeholderValues);

  allowedUserdataParams.forEach((userdata) => {
    const regexPattern = userdata.parameter.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    result = result.replace(
      new RegExp(regexPattern, 'g'),
      encodeURIComponent(userdata.value),
    );
  });

  return result;
}
