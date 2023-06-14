import { NextRequest, NextResponse } from 'next/server';
import { createApiStreamElements, getTokenChannel } from '~/services/apiStreamElements';
import { getCookies } from '~/utils/getCookies';

export async function GET(request: NextRequest) {
  const query = request.url.split('?')[1];
  const params = new URLSearchParams(query);
  const productName = params.get('name');

  const cookies = getCookies(request.headers.get('cookie') || '');
  const channel = getTokenChannel(cookies.token);
  const api = createApiStreamElements(cookies.token);

  const limit = 100;
  let totalItens = 100;

  while (totalItens > 0) {
    console.log(`Devolvendo ${totalItens} itens`);

    const { data } = await api.get(
      `/kappa/v2/store/${channel}/redemptions/search?from=2019-01-01T20:00:00.000Z&limit=${limit}&offset=0&page=1&pending=true&search=${productName}&searchBy=item.name&sort=%7B%22updatedAt%22:-1%7D&to=2099-12-30T00:00:00.000Z`
    )

    totalItens = data._total;

    for (const item of data.docs) {
      await api.put(
        `/kappa/v2/store/${channel}/redemptions/${item._id}`,
        {
          ...item,
          "rejected": true,
          completed: true,
        }      
      )
    }

    console.log(`Aguardando 5 segundos para evitar rate limit`);
    await new Promise(resolve => setTimeout(resolve, 5000));
  }

  return NextResponse.json({
    ok:true
  });
}
