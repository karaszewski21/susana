import type { IncomingMessage, ServerResponse } from 'http';
import {
  sendRedirect,
  useRawBody,
  appendHeader,
  useBody,
  setCookie,
  useCookie,
} from 'h3';

const API = 'https://susana-api.herokuapp.com';

export default async (req: IncomingMessage, res: ServerResponse) => {
  console.log('server');
  if (req.method === 'POST') {
    switch (req.url) {
      case '/login':
        await login(req, res);
        break;
      case '/register':
        await register(req, res);
        break;
      default:
        break;
    }
  }
};

async function login(req: IncomingMessage, res: ServerResponse) {
  const bodyForm = await useBody(req);
  if (bodyForm) {
    let searchParams = new URLSearchParams(bodyForm);
    const username = searchParams.get('username');
    const password = searchParams.get('password');

    const login = await $fetch<any>(`${API}/auth/login`, {
      method: 'POST',
      body: { username: username, password: password },
    });

    if (login.access_token) {
      setCookie(res, 'user_id', login.access_token, {
        maxAge: 60 * 60 * 24 * 7,
      });

      return await sendRedirect(res, '/');
    }
  }
}

async function register(req: IncomingMessage, res: ServerResponse) {
  const bodyForm = await useBody(req);
  if (bodyForm) {
    let searchParams = new URLSearchParams(bodyForm);
    const username = searchParams.get('username');
    const password = searchParams.get('password');

    const account = await $fetch(`${API}/auth/register`, {
      method: 'POST',
      body: { username: username, password: password },
    });

    console.log('register');
    if (account) {
      return await sendRedirect(res, '/login');
    } else {
      return await sendRedirect(res, '/register');
    }
  }
}
