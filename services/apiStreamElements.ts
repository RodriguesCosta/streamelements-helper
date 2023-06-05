import axios from 'axios';

import jwt from 'jsonwebtoken';

export function createApiStreamElements(token: string) {
  return axios.create({
    baseURL: 'https://api.streamelements.com',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}

export function getTokenChannel(token:string) {
  const tokenDecoded = jwt.decode(token) as any;

  return tokenDecoded.channel as string;
}