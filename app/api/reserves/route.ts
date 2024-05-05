export async function POST(req: Request) {
  process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'; // Desactiva la verificación del certificado SSL
  const body = await req.json();
  const dataEndpoint = "https://api.bcra.gob.ar/estadisticas/v1/datosVariable/1/" + body.startDate.toString() + "/" + body.endDate.toString();
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

  // Convert to JSON with dates : string[] and values: number[]


  return new Response(JSON.stringify({dates, values}), {status: 200});
}