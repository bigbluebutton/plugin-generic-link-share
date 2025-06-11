import { UserMetadata } from './types';

type PlaceholderValues = {
  name: string;
  extId: string;
  role: string;
  presenter: boolean;
};

const DEFAULT_PREFIX = 'genericLinkShare';

export function replaceUrlPlaceholdersSecure(
  url: string,
  placeholderValues?: PlaceholderValues,
  userdataParams?: UserMetadata[],
): string {
  let result = url;

  if (placeholderValues) {
    result = result
      .replace(/{name}/g, encodeURIComponent(placeholderValues.name))
      .replace(/{extId}/g, encodeURIComponent(placeholderValues.extId))
      .replace(/{role}/g, encodeURIComponent(placeholderValues.role))
      .replace(/{presenter}/g, encodeURIComponent(String(placeholderValues.presenter)));
  }

  if (userdataParams) {
    const allowedUserdataParams = userdataParams?.filter(
      (entry) => entry.parameter.startsWith(DEFAULT_PREFIX),
    );

    allowedUserdataParams.forEach((userdata) => {
      const userdataUrlParameterPattern = `{${userdata.parameter.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}}`;
      const userdataUrlValuePattern = userdata.value.replace(/[.*+?^${}()|[\]\\]/g, '');

      result = result
        .replace(new RegExp(userdataUrlParameterPattern, 'g'), encodeURIComponent(userdataUrlValuePattern));
    });
  }

  return result;
}
