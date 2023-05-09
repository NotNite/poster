import { PrismaClient } from "@prisma/client";

let prisma: PrismaClient;
if (global.prisma != undefined) {
  prisma = global.prisma;
} else {
  prisma = new PrismaClient();
}

export default prisma;
