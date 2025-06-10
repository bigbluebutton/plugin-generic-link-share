import { UserMetadata } from './types';

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

export function replaceUrlPlaceholdersSecure(
  url: string,
  placeholderValues?: PlaceholderValues,
  userdataParams?: UserMetadata[],
): string {
  // list available userdata parameters
  const allowedUserdataParams = ['plugin_generic_link_share_mykey'];

  // filter allowed userdata parameters
  const foundUserdataParams = userdataParams?.filter(
    (entry) => allowedUserdataParams.includes(entry.parameter),
  ) || [];

  let result = replaceUrlPlaceholders(url, placeholderValues);

  foundUserdataParams.forEach((userdata) => {
    const regexPattern = userdata.parameter.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    result = result.replace(
      new RegExp(regexPattern, 'g'),
      encodeURIComponent(userdata.value),
    );
  });

  return result;
}
