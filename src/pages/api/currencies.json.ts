const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
  'Access-Control-Allow-Methods': 'GET, POST'
};
const URL = import.meta.env.GOOGLE_SHEETS_CURRENCIES_URL

export async function GET() {
  try {
    const response = await fetch(URL);

    const csvData = await response.text();
    const csvLines = csvData.split('\r\n');

    const currencies = csvLines.map((line: string) => {
      const [
        name,
        code,
        CAD,
        CHF,
        CNY,
        EUR,
        GBP,
        JPY,
        USD
      ] = line.split(',');

      return {
        code,
        currencies: {
          CAD: parseFloat(CAD),
          CHF: parseFloat(CHF),
          CNY: parseFloat(CNY),
          EUR: parseFloat(EUR),
          GBP: parseFloat(GBP),
          JPY: parseFloat(JPY),
          USD: parseFloat(USD)
        },
        name
      };
    });

    return new Response(
      JSON.stringify(currencies, null, 2),
      { 
        headers: {
          ...CORS_HEADERS,
          'Content-Type': 'application/json'
        },
        status: 200
      },
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: {
          ...CORS_HEADERS,
          'Content-Type': 'application/json'
        },
        status: 500
      },
    );
  }
}