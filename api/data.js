import { sql } from '@vercel/postgres';

export default async function handler(request, response) {
  // Configurar CORS por si acaso
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

  try {
    // Validar nombre de la tabla para prevenir SQL Injection basico (solo chars alfanumericos y underscores)
    if (!/^[a-zA-Z0-9_]+$/.test(table)) {
        return response.status(400).json({ error: 'Nombre de tabla inválido.' });
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);
    const parsedLimit = parseInt(limit);

    // Obtener los datos usando sql interpolado seguro (Limit/Offset). 
    // Ojo, en @vercel/postgres table names dinámicos usualmente deben ser literales,
    // usaremos sql.query para raw queries si es dinámico.
    
    // Consulta 1: Obtener el schema (nombres de las columnas)
    // Para simplificar, hacemos solo un select y sacamos las llaves, 
    // pero Neon lo trae todo empaquetado.

    const rowsResult = await sql.query(
        `SELECT * FROM "${table}" LIMIT $1 OFFSET $2`, 
        [parsedLimit, offset]
    );

    const countResult = await sql.query(
        `SELECT COUNT(*) as total FROM "${table}"`
    );

    return response.status(200).json({
      data: rowsResult.rows,
      meta: {
        total: parseInt(countResult.rows[0].total),
        page: parseInt(page),
        limit: parsedLimit,
        totalPages: Math.ceil(parseInt(countResult.rows[0].total) / parsedLimit)
      }
    });

  } catch (error) {
    // Es posible que la tabla no exista todavía o no terminó de ingestar
    return response.status(500).json({ error: 'Error intenyando acceder a Vercel Postgres.', details: error.message });
  }
}
