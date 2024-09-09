import { RestrictedUrlWithCorrection } from '../types/genericLink';

// Websites that cannot be rendered within an iframe.

// Blocked URLs that cannot be rendered within iframe:
const GITHUB = /https:\/\/github.com\/.*/;
const STACKOVERFLOW = /https:\/\/stackoverflow.com\/.*/;
const CHATGPT = /https:\/\/chatgpt.com\/.*/;

export const blockedUrls: RegExp[] = [
  GITHUB,
  STACKOVERFLOW,
  CHATGPT,
];

// Restricted URLs that can be rendered in an iframe under a circumstance (different foreach type)

const YOUTUBE_VIDEO = /https:\/\/www.youtube.com\/watch?v=[a-zA-Z0-9]{11}/;
const INSTAGRAM_PROFILE_PAGE = /https:\/\/www.instagram.com\/([A-Za-z0-9_](?:(?:[A-Za-z0-9_]|(?:\.(?!\.))){0,28}(?:[A-Za-z0-9_]))?)/;
const INSTAGRAM_POST_PAGE = /https:\/\/www.instagram.com\/p\/(.*?)/;

export const restrictionsInUrl: RestrictedUrlWithCorrection[] = [
  {
    urlRegex: YOUTUBE_VIDEO,
    tweakFunction: (wrongUrl) => {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
      const match = wrongUrl.match(regExp);

      const id = (match && match[2].length === 11)
        ? match[2]
        : null;
      return `http://www.youtube.com/embed/${id}`;
    },
  },
  {
    urlRegex: INSTAGRAM_PROFILE_PAGE,
    tweakFunction: (wrongUrl) => `${wrongUrl}/embed`,
  },
  {
    urlRegex: INSTAGRAM_POST_PAGE,
    tweakFunction: (wrongUrl) => `${wrongUrl}/embed`,
  },
];
