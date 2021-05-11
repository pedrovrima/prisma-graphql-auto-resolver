const parseFields = require("graphql-parse-fields");

const prismaFunctions = require("../src");

const autoResolver = async (args, info, prisma) => {
  const query_tree = parseFields(info, false);
  const prismaTree = prismaFunctions.getPrismaTree(query_tree, args);
  const prismaQuery = prismaFunctions.createQuery(prismaTree, prisma);
  const queryResult = await prismaQuery();
  return queryResult;
};

module.exports = {
  autoResolver,
};
