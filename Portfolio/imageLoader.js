export default function imageLoader({ src, width, quality }) {
  const basePath = '/Sofienne-Portfolio';
  // If src already starts with basePath, don't add it again
  if (src.startsWith(basePath)) {
    return src;
  }
  // Add basePath to relative URLs
  return `${basePath}${src}`;
}
