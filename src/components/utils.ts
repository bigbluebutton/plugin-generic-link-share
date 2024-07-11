import { pluginLogger } from 'bigbluebutton-html-plugin-sdk';
import { LinkTag } from './modal-to-share-link/types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function hasRequiredFields(obj: any): obj is LinkTag {
  return typeof obj.title === 'string' && typeof obj.viewer === 'string';
}

function isValidJson(stringfiedObject: string): null | object {
  let jsonObject;
  try {
    jsonObject = JSON.parse(stringfiedObject);
  } catch (error) {
    return null;
  }
  return jsonObject;
}

export function parseTags(text: string) : LinkTag[] {
  const SEARCH_PATTERN = /link\s*({[^}]*})/gmi;
  // to keep the while loop in a finite and sane number of iterations
  // also because the presentation toolbar does not accomodate
  // too many buttons.
  const MAXIMUM_TAGS = 3;

  const linkTags = [];
  let match;
  match = SEARCH_PATTERN.exec(text);
  while ((match !== null) && match.length > 0
    && linkTags.length < MAXIMUM_TAGS) {
    const matchWhitespacesRemoved = match[1].replace(/(\r\n|\n|\r)/gm, '');
    // replaces typographical quotation marks(common on presentations) by straight ones
    const replacedQuotes = matchWhitespacesRemoved.replace(/“|”/g, '"');
    const jsonObject = isValidJson(replacedQuotes);
    if (jsonObject) {
      if (hasRequiredFields(jsonObject)) {
        linkTags.push({
          title: jsonObject.title,
          viewer: jsonObject.viewer,
          presenter: jsonObject?.presenter || jsonObject.viewer,
        });
      } else {
        pluginLogger.error('Link tag does not have the minimum required fields title and viewer');
      }
    } else {
      pluginLogger.error('Link tag found but is not a valid json');
    }
    match = SEARCH_PATTERN.exec(text);
  }
  return linkTags;
}
