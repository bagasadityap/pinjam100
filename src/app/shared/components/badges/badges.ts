export function badge(
  text: string,
  color: 'blue' | 'red' | 'yellow' | 'green' | 'orange' = 'blue',
): string {
  return `
    <span class="badge badge-${color}">
      ${text}
    </span>
  `;
}

export function badgeWithSpan(
  text: string,
  color: 'blue' | 'red' | 'yellow' | 'green' | 'orange' = 'blue',
): string {
  return `
    <span class="badge badge-${color}">
      <span></span>
      ${text}
    </span>
  `;
}
