export async function POST(req: Request) {
  process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'; // Desactiva la verificación del certificado SSL
  const body = await req.json();

  let dates: string[] = [];
  let values: number[][] = [];

  // Lo primero que quiero es tener todas las fechas únicas en un solo array y los valores en una matriz cuyo índice corresponda a la fecha
  // Si hay una fecha que no está en uno de los arrays, se reemplaza por un -1
  body.forEach((element: { dates: string[]; values: number[]; }) => {
    element.dates.forEach((date: string) => {
      if (!dates.includes(date)) {
        dates.push(date);
      }
    });
  });

  // Ordenar las fechas
  dates.sort((a: string, b: string) => {
    return new Date(a).getTime() - new Date(b).getTime();
  });

  // Inicializar la matriz con el tamaño del array body
  for (let i = 0; i < body.length; i++) {
    values.push([]);
  }

  dates.forEach((date: string, index: number) => {
    // Iterar sobre cada elemento del body
    body.forEach((element: { dates: string[]; values: number[]; }, i: number) => {
      // Si la fecha está en el array de fechas del elemento, se agrega el valor correspondiente
      if (element.dates.includes(date)) {
        values[i].push(element.values[element.dates.indexOf(date)]);
      } else {
        // Si la fecha no está en el array de fechas del elemento, se agrega un -1
        values[i].push(-1);
      }
    });
  });

  let finalDates: string[] = [];
  let finalValues: number[][] = [];

  // Inicializar la matriz final con el tamaño del array body
  for (let i = 0; i < body.length; i++) {
    finalValues.push([]);
  }

  // Quitar las fechas que tengal al menos un -1 en los valores

  for(let i = 0; i < dates.length; i++){
    let flag = true;
    for(let j = 0; j < values.length; j++){
      if(values[j][i] === -1){
        flag = false;
        break;
      }
    }
    if(flag){
      finalDates.push(dates[i]);
      for(let j = 0; j < values.length; j++){
        finalValues[j].push(values[j][i]);
      }
    }
  }

  dates = finalDates;
  values = finalValues;
  return new Response(JSON.stringify({dates, values}), {status: 200});
}