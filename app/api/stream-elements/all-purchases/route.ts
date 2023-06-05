import { NextRequest, NextResponse } from 'next/server';
import { createApiStreamElements, getTokenChannel } from '~/services/apiStreamElements';
import { getCookies } from '~/utils/getCookies';
import fs from 'fs';

export async function GET(request: NextRequest) {
  if (!fs.existsSync('cache')) {
    fs.mkdirSync('cache');
  }

  const query = request.url.split('?')[1];
  const params = new URLSearchParams(query);
  const productName = params.get('name');

  const cookies = getCookies(request.headers.get('cookie') || '');
  const channel = getTokenChannel(cookies.token);
  const api = createApiStreamElements(cookies.token);

  const limit = 1000;
  let page = 1;

  const files = fs.readdirSync('cache');

  if(files.length > 0) {
    const orderedFiles = files.sort((a, b) => {
      const aNumber = parseInt(a.split('.')[0]);
      const bNumber = parseInt(b.split('.')[0]);

      return aNumber - bNumber;
    });

    const lastFile = orderedFiles[orderedFiles.length - 1];
    const lastFileNumber = parseInt(lastFile.split('.')[0]);
    
    page = lastFileNumber;

    console.log(`Cache encontrado, ultima pagina: ${page}`);
  }

  let totalPages = page+1;

  let offset = page*limit-limit;

  while (page <= totalPages) {
    console.log(`Pagina atual: ${page} - total: ${totalPages}`);

    let fileTxt = '';

    const { data } = await api.get(
      `/kappa/v2/store/${channel}/redemptions/search?from=2019-01-01T20:00:00.000Z&limit=${limit}&offset=${offset}&page=${page}&pending=true&search=${productName}&searchBy=item.name&sort=%7B%22updatedAt%22:-1%7D&to=2099-12-30T00:00:00.000Z`
    )

    totalPages = Math.ceil(data._total / limit);

    for (const item of data.docs) {
      const line = `${item._id} - ${item.redeemer.username} - ${item.item.name} - ${item.createdAt}\n`;
      fileTxt += line;
    }

    await fs.promises.writeFile(
      `cache/${page}.txt`,
      fileTxt,
      {
        encoding: 'utf-8',
      },
    );

    page++;
    offset += limit;
  }

  return NextResponse.json({
    ok:true
  });
}
