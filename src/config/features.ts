/**
 * Feature switches. Flip a value and redeploy.
 */
export const features = {
  /**
   * EN | தமிழ் language switch. OFF: the site always renders in English and the switch is hidden.
   * Tamil strings remain in src/i18n/ta.ts, ready to re-enable.
   */
  languageSwitch: false,
} as const;
