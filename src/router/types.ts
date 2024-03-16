import * as http from "http";

export type RequestHandler = (
  req: http.IncomingMessage,
  res: http.ServerResponse
) => void;

export type CustomReq = http.IncomingMessage & {
  params: Record<string, string>;
};
