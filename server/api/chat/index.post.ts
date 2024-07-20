import { Readable } from "stream";
import { createChatModel } from "@/server/utils/models";
interface RequestBody {
  model: string;
  message: {
    role: "user" | "assistant";
    content: string;
  }[];
}

export default defineEventHandler(async (event) => {
  const { model, message } = await readBody<RequestBody>(event);

  const llm = createChatModel(model, event);

  const response = await llm.stream(message.map((i) => [i.role, i.content]));

  const readableStream = Readable.from(
    (async function* () {
      for await (const chunk of response) {
        const message = {
          message: {
            role: "assistant",
            content: chunk?.content,
          },
        };
        yield `${JSON.stringify(message)} \n\n`;
      }
    })(),
  );

  return sendStream(event, readableStream);
});
