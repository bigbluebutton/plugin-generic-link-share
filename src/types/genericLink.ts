export interface RestrictedUrlWithCorrection {
  urlRegex: RegExp;
  tweakFunction: (wrongUrl: string) => string;
}
