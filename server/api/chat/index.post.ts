import { ChatPromptTemplate, PromptTemplate } from "@langchain/core/prompts";
import { CheerioWebBaseLoader } from "langchain/document_loaders/web/cheerio";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OllamaEmbeddings } from "@langchain/community/embeddings/ollama";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { ChatOllama } from "@langchain/community/chat_models/ollama";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { createHistoryAwareRetriever } from "langchain/chains/history_aware_retriever";
import { MessagesPlaceholder } from "@langchain/core/prompts";
import { HumanMessage, AIMessage } from "@langchain/core/messages";

import { RunnableSequence } from "@langchain/core/runnables";
import { createModuleResolutionCache, readJsonConfigFile } from "typescript";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const headers = getHeaders(event);

  const loader = new CheerioWebBaseLoader(
    "https://geminglu.github.io/blog/2023/09/29/vue3/%E4%BB%80%E4%B9%88%E6%98%AFvue3/",
  );

  const docs = await loader.load();

  const chatModel = new ChatOllama({
    baseUrl: headers.ollamaurl, // Default value
    model: "gemma:latest",
  });
  // const promptTemplate = PromptTemplate.fromTemplate("Tell me a joke about {topic}");
  // const chain = promptTemplate.pipe(chatModel);

  // const stream = await chain.stream({ topic: "bears" });
  // for await (const chunk of stream) {
  //   console.log(chunk?.content);
  // }
  // return stream;

  const promptTemplate = PromptTemplate.fromTemplate("Tell me a joke about {topic}");
  const chain = RunnableSequence.from([promptTemplate, chatModel]);

  const result = await chain.invoke({ topic: "bears" });

  console.log(result);
});
