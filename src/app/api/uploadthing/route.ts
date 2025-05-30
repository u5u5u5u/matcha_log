import { createRouteHandler } from "uploadthing/server";
import { uploadRouter } from "./core";

const handler = createRouteHandler({ router: uploadRouter });

export const GET = handler;
export const POST = handler;
