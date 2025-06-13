import { CurrentUserData, UserMetadata } from './types';

type PlaceholderEntry = {
  placeholder: string;
  value: string | boolean;
}

const DEFAULT_PREFIX = 'genericLinkShare';

export function mergePlaceholdersList(
  currentUserParams?: CurrentUserData,
  userdataParams?: UserMetadata[],
): PlaceholderEntry[] { // nao esqueça de typar a função
  const placeholdersList: PlaceholderEntry[] = [];

  if (currentUserParams) {
    Object.entries(currentUserParams).forEach(([key, value]) => {
      const placeholder = `{${key}}`;
      placeholdersList.push({ placeholder, value });
    });
  }

  if (userdataParams) {
    const allowedUserdataParams = userdataParams?.filter(
      (entry) => entry.parameter.startsWith(DEFAULT_PREFIX),
    );

    allowedUserdataParams.forEach((userdata) => {
      const userdataUrlParameterPattern = `{${userdata.parameter.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}}`;
      const userdataUrlValuePattern = userdata.value.replace(/[.*+?^${}()|[\]\\]/g, '');

      placeholdersList
        .push({ placeholder: userdataUrlParameterPattern, value: userdataUrlValuePattern });
    });
  }

  return placeholdersList;
}

export function replaceUrlPlaceholders(
  url: string,
  placeholdersList: PlaceholderEntry[],
): string {
  let result = url;

  placeholdersList.forEach(({ placeholder, value }) => {
    const regex = new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
    result = result.replace(regex, encodeURIComponent(String(value)));
  });

  return result;
}
