import { getClient } from '@/graphql/client-ssr';
import { GET_SERVER_SOCKET } from '@/graphql/queries/chat-server';

export async function GET(request: Request) {
  const { data } = await getClient().query({ query: GET_SERVER_SOCKET });
  const server = data.getAServerSocket.server;
  return Response.json({ server: server });
  // return new Response('This is my parent route');
}
