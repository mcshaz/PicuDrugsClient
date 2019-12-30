export const enum bootstrapSizes { xs, sm, md, lg, xl }

export function getViewportSize () {
  // https://stackoverflow.com/a/8876069
  const width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0)
  if (width <= 576) { return bootstrapSizes.xs }
  if (width <= 768) { return bootstrapSizes.sm }
  if (width <= 992) { return bootstrapSizes.md }
  if (width <= 1200) { return bootstrapSizes.lg }
  return bootstrapSizes.xl
}
