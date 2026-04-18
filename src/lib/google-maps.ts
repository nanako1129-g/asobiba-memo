/**
 * 住所から Google Maps の検索URLを生成（埋め込み地図は使わない）
 */
export function buildGoogleMapsSearchUrl(address: string): string {
  const query = encodeURIComponent(address.trim());
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}
