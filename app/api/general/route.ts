export async function POST(req: Request) {
  process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'; // Desactiva la verificación del certificado SSL
  const dataEndpoint = "https://api.bcra.gob.ar/estadisticas/v2.0/PrincipalesVariables";
  
  const response = await fetch(dataEndpoint, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const data = await response.json();

  let internationalReserves = data.results.find((element: { idVariable: number; }) => element.idVariable === 1);
  let retailExchangeRate = data.results.find((element: { idVariable: number; }) => element.idVariable === 4);
  let wholesaleExchangeRate = data.results.find((element: { idVariable: number; }) => element.idVariable === 5);
  let TNA = data.results.find((element: { idVariable: number; }) => element.idVariable === 6);
  let TEA = data.results.find((element: { idVariable: number; }) => element.idVariable === 34);
  let monetaryBase = data.results.find((element: { idVariable: number; }) => element.idVariable === 15);
  let depositsInFinancialEntities = data.results.find((element: { idVariable: number; }) => element.idVariable === 21);
  let loansToPrivateSector = data.results.find((element: { idVariable: number; }) => element.idVariable === 26);
  let monthlyInflation = data.results.find((element: { idVariable: number; }) => element.idVariable === 27);
  let annualInflation = data.results.find((element: { idVariable: number; }) => element.idVariable === 28);
  let reserveRepos = data.results.find((element: { idVariable: number; }) => element.idVariable === 42);

  const output = {
    internationalReserves: {
      value: internationalReserves.valor,
      date: internationalReserves.fecha
    },
    retailExchangeRate: {
      value: retailExchangeRate.valor,
      date: retailExchangeRate.fecha
    },
    wholesaleExchangeRate: {
      value: wholesaleExchangeRate.valor,
      date: wholesaleExchangeRate.fecha
    },
    TNA: {
      value: TNA.valor,
      date: TNA.fecha
    },
    TEA: {
      value: TEA.valor,
      date: TEA.fecha
    },
    monetaryBase: {
      value: monetaryBase.valor,
      date: monetaryBase.fecha
    },
    depositsInFinancialEntities: {
      value: depositsInFinancialEntities.valor,
      date: depositsInFinancialEntities.fecha
    },
    loansToPrivateSector: {
      value: loansToPrivateSector.valor,
      date: loansToPrivateSector.fecha
    },
    monthlyInflation: {
      value: monthlyInflation.valor,
      date: monthlyInflation.fecha
    },
    annualInflation: {
      value: annualInflation.valor,
      date: annualInflation.fecha
    },
    reserveRepos: {
      value: reserveRepos.valor,
      date: reserveRepos.fecha
    }
  }

  return new Response(JSON.stringify(output), {status: 200});
}