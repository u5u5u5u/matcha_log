import { createUploadthing, type FileRouter } from "uploadthing/server";

const f = createUploadthing();

export const uploadRouter = {
  postImage: f({ image: { maxFileSize: '4MB', maxFileCount: 5 } })
    .onUploadComplete(async ({ file }) => {
      // ここでファイルURLをDB保存など可能
      return { url: file.url };
    }),
} satisfies FileRouter;

export type UploadRouter = typeof uploadRouter;
