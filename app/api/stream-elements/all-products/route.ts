import { NextRequest, NextResponse } from 'next/server';
import { createApiStreamElements, getTokenChannel } from '~/services/apiStreamElements';
import { getCookies } from '~/utils/getCookies';

export async function GET(request: NextRequest) {
  const cookies = getCookies(request.headers.get('cookie') || '');

  const channel = getTokenChannel(cookies.token);
  const api = createApiStreamElements(cookies.token);

  const {data} = await api.get(
    `/kappa/v2/store/${channel}/items?source=all`
  )

  return NextResponse.json({
    products: data
  });
}
