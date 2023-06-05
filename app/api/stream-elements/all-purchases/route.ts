import { NextRequest, NextResponse } from 'next/server';
import { createApiStreamElements, getTokenChannel } from '~/services/apiStreamElements';
import { getCookies } from '~/utils/getCookies';
import fs from 'node:fs';

export async function GET(request: NextRequest) {
  const query = request.url.split('?')[1];
  const params = new URLSearchParams(query);
  const productName = params.get('name');

  const cookies = getCookies(request.headers.get('cookie') || '');

  const channel = getTokenChannel(cookies.token);
  const api = createApiStreamElements(cookies.token);

  const limit:number = Number(params.get('limit') || 50);
  let offset = 0;
  let page = 1;
  let totalPages = 2;

  let responseData = '';

  while (page <= totalPages) {

    console.log({
      pagina_atual: page,
      total_paginas: totalPages,
    })

    const { data } = await api.get(
      `/kappa/v2/store/${channel}/redemptions/search?from=2019-01-01T20:00:00.000Z&limit=${limit}&offset=${offset}&page=${page}&pending=true&search=${productName}&searchBy=item.name&sort=%7B%22updatedAt%22:-1%7D&to=2099-12-30T00:00:00.000Z`
    )

    if (page === 1) {
      responseData += `Total ${data._total}\n\n`;

      totalPages = Math.ceil(data._total / limit);
    }

    for (const item of data.docs) {
      const linha = `${item.redeemer.username} - ${item.item.name} - ${item.createdAt}\n`;
      responseData += linha;

      await fs.promises.appendFile(
        'compras-log.txt',
        linha,
        {
          encoding: 'utf-8',
        },
      );
    }

    page++;
    offset += limit;
  }

  return new Response(responseData);
}
