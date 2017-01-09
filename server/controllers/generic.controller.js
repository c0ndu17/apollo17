import cuid from 'cuid';
import slug from 'limax';
import sanitizeHtml from 'sanitize-html';

/**
 * Get all payment options
 * @param req
 * @param res
 * @returns void
 */
export function getGeneric(req, res) {
  res.json({
    data : []
  });
}


