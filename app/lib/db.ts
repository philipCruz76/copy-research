import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
  return new PrismaClient();
};

declare global {
  // eslint-disable-next-line no-var, no-unused-vars
  var cachedPrisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

const db = globalThis.cachedPrisma ?? prismaClientSingleton();

export default db;

if (process.env.NODE_ENV !== "production") globalThis.cachedPrisma = db;
