export async function POST(req: Request) {
  process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'; // Desactiva la verificación del certificado SSL
  const body = await req.json();
  const dataEndpoint = "https://api.bcra.gob.ar/estadisticas/v2.0/datosVariable/"+ body.idVariable  + "/" + body.startDate.toString() + "/" + body.endDate.toString();
  console.log(dataEndpoint);
  const response = await fetch(dataEndpoint, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();

  console.log(data);

  // ordenar los datos de acuerdo al campo fecha, vienen en el formato 17/07/2023 DD/MM/YYYY
  data.results.sort((a: { fecha: string; }, b: { fecha: string; }) => {
    let dateA = a.fecha.split('/');
    let dateB = b.fecha.split('/');
    return new Date(parseInt(dateA[2]), parseInt(dateA[1]), parseInt(dateA[0])).getTime() - new Date(parseInt(dateB[2]), parseInt(dateB[1]), parseInt(dateB[0])).getTime();
  });

  let dates: string[] = [];
  let values: number[] = [];

  data.results.forEach((element: { fecha: string; valor: number; }) => {
    dates.push(element.fecha);
    //let aux = element.valor.replace('.', '');
    // quiero que reemplaces todos los puntos por nada
    values.push(element.valor);
  });

  // Si está vacío, devolver un error
  if (dates.length === 0 || values.length === 0) {
    return new Response(JSON.stringify({error: "No se encontraron datos en el rango de fechas proporcionado"}), {status: 404});
  }

  return new Response(JSON.stringify({dates, values}), {status: 200});
}