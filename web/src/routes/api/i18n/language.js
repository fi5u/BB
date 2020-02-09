import { serverLog as log } from '../../../utils/logging'

export async function post(req, res) {
  const { langOverride } = req.body

  try {
    log.info(req, 'Switch language', { language: langOverride })

    req.session.langOverride = langOverride

    res.writeHead(200)
    res.end()
  } catch (error) {
    log.error(req, 'Failed to switch language', {
      error: error.message,
      language: langOverride,
    })

    res.writeHead(400)
    res.end()
  }
}
