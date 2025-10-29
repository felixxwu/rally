/**
 * Detects if the current device is a mobile device (phone or tablet).
 * Uses a sophisticated check that avoids false positives on touchscreen laptops.
 *
 * @returns true if the device is determined to be a mobile device, false otherwise
 */
export function isMobileDevice(): boolean {
  // Check user agent for mobile device indicators
  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
  const mobileRegex =
    /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile|tablet/i;
  const isMobileUserAgent = mobileRegex.test(userAgent);

  // Check screen size (mobile devices typically have smaller screens)
  const hasSmallScreen = window.innerWidth <= 768 || window.innerHeight <= 768;

  // Check if it's a tablet-sized device (larger than phone but smaller than desktop)
  const isTabletSized = window.innerWidth <= 1024 && window.innerWidth > 768;

  // Touch capability alone isn't enough - combine with other indicators
  const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  // Consider it mobile if:
  // 1. User agent indicates mobile/tablet, OR
  // 2. Has small screen AND touch capability (likely a phone), OR
  // 3. Is tablet-sized AND has touch AND user agent doesn't explicitly indicate desktop
  const isDesktopUserAgent = /windows|macintosh|linux/i.test(userAgent) && !isMobileUserAgent;

  if (isDesktopUserAgent && !hasSmallScreen) {
    // Definitely desktop (Windows/Mac/Linux with large screen)
    return false;
  }

  return (
    isMobileUserAgent ||
    (hasSmallScreen && hasTouch) ||
    (isTabletSized && hasTouch && !isDesktopUserAgent)
  );
}
