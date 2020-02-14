/**
 * Remove a query key and value from url
 * @param {string} key Query key to remove
 */
export function removeQuery(key) {
  if (
    typeof window === 'undefined' ||
    !window.location.search ||
    window.location.search.indexOf(key) === -1
  ) {
    return
  }

  const urlParams = new URLSearchParams(window.location.search)

  urlParams.delete(key)

  window.history.replaceState(
    null,
    '',
    `${window.location.pathname}${
      urlParams.toString().length ? `?${urlParams}` : ''
    }${location.hash}`
  )
}
