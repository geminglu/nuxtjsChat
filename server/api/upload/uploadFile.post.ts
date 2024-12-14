/**
 * 上传文件
 */

import prisma from "@/server/utils/prisma";
import { uploadIncomingForm } from "~/server/utils";
import type { H3Event, EventHandlerRequest } from "h3";

export default defineEventHandler(async (event) => {
  return await uploadFile(event);
});

function uploadFile(event: H3Event<EventHandlerRequest>) {
  const form = uploadIncomingForm();
  return new Promise((resolve, reject) => {
    form.parse(event.node.req, async (err, _fields, files) => {
      if (err) {
        reject({
          statusCode: 500,
          message: "上传失败",
          statusMessage: err.message,
        });
      } else {
        if (files.file) {
          const { newFilename, originalFilename, mimetype, filepath } = files.file[0];
          try {
            const fileInfo = await prisma.$transaction(async (tx) => {
              const fileInfo = await tx.upload.create({
                data: {
                  uId: event.context.uId,
                  newFilename,
                  originalFilename: originalFilename || "",
                  mimetype: mimetype || "",
                  filepath,
                },
              });
              return fileInfo;
            });

            if (fileInfo) {
              const { id, originalFilename: filename, mimetype: mimetypeAs, createdAt } = fileInfo;
              resolve({ id, filename, mimetype: mimetypeAs, createdAt });
            } else {
              resolve({});
            }
          } catch (error: any) {
            reject({
              statusCode: 500,
              message: "上传失败",
              statusMessage: error.message,
            });
          }
        }
        resolve({});
      }
    });
  });
}
