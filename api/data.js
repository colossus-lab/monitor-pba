import { sql } from '@vercel/postgres';

export default async function handler(request, response) {
  response.setHeader('Access-Control-Allow-Credentials', true);
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');

  if (request.method === 'OPTIONS') {
    return response.status(200).end();
  }

  const { table, page = 1, limit = 50 } = request.query;

  if (!table) {
    return response.status(400).json({ error: 'Falta proveer el nombre de la tabla.' });
  }

  if (!/^[a-zA-Z0-9_]+$/.test(table)) {
    return response.status(400).json({ error: 'Nombre de tabla inválido.' });
  }

  const parsedPage = Math.max(1, parseInt(page) || 1);
  const parsedLimit = Math.min(parseInt(limit) || 50, 200);
  const offset = (parsedPage - 1) * parsedLimit;

  try {
    const result = await sql.query(
      `SELECT *, COUNT(*) OVER() AS __total_count FROM "${table}" LIMIT $1 OFFSET $2`,
      [parsedLimit, offset]
    );

    const total = result.rows.length > 0 ? parseInt(result.rows[0].__total_count) : 0;
    const data = result.rows.map(({ __total_count, ...row }) => row);

    return response.status(200).json({
      data,
      meta: {
        total,
        page: parsedPage,
        limit: parsedLimit,
        totalPages: Math.ceil(total / parsedLimit) || 1
      }
    });

  } catch (error) {
    return response.status(500).json({ error: 'Error al consultar la base de datos.' });
  }
}
