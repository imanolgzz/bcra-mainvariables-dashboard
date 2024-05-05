export async function POST(req: Request) {
  process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'; // Desactiva la verificación del certificado SSL
  const body = await req.json();
  const dataEndpoint = "https://api.bcra.gob.ar/estadisticas/v1/datosVariable/"+ body.idVariable  + "/" + body.startDate.toString() + "/" + body.endDate.toString();
  console.log(dataEndpoint);
  const response = await fetch(dataEndpoint, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();

  let dates: string[] = [];
  let values: number[] = [];

  data.results.forEach((element: { fecha: string; valor: string; }) => {
    dates.push(element.fecha);
    values.push(parseFloat(element.valor.replace('.', '')));
  });

  // Si está vacío, devolver un error
  if (dates.length === 0 || values.length === 0) {
    return new Response(JSON.stringify({error: "No se encontraron datos en el rango de fechas proporcionado"}), {status: 404});
  }

  // Ir ordenando los datos por fecha
  data.results.sort((a: { fecha: string; }, b: { fecha: string; }) => {
    return new Date(a.fecha).getTime() - new Date(b.fecha).getTime();
  });

  return new Response(JSON.stringify({dates, values}), {status: 200});
}