import { log } from 'utils/logging'

/**
 *
 * @param {string} endpoint Endpoint to call
 * @param {string} [method] Request method
 * @param {object | null} [body] Body data
 * @param {object} [extra] Extra params to pass to fetch
 */
export async function clientFetch(
  endpoint,
  method = 'GET',
  body = null,
  extra = {}
) {
  try {
    log.info('Client fetch', {
      body,
      endpoint,
      extra,
      method,
    })

    let headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }

    if (extra.headers) {
      headers = {
        ...headers,
        ...extra.headers,
      }
    }

    let fetchParams = {
      credentials: 'include',
      headers,
      method,
    }

    if (body) {
      fetchParams.body = JSON.stringify(body)
    }

    const response = await fetch(endpoint, fetchParams)

    if (!response.ok) {
      throw new Error('Bad response')
    }

    const data = await response.json()

    return { data }
  } catch (error) {
    log.error('Error in fetch', {
      body,
      endpoint,
      error: error.message,
      extra,
      method,
    })

    return { error: error.message }
  }
}
