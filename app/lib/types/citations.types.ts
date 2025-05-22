export type Citation = {
  chunkId: string;
  relevantText: string;
  position: number;
};

export type CitedResponse = {
  answer: string;
  citations: Citation[];
};
