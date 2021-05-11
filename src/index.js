const prismaFunctions = require("../src");

const autoResolver = async (args, info, prisma) => {
  const query_tree = prismaFunctions.parseFields(info, false);
  const prismaTree = prismaFunctions.getPrismaTree(tree, args);
  const prismaQuery = prismaFunctions.createQuery(prismaTree, prisma);
  const queryResult = await prismaQuery();
  return queryResult;
};

module.exports = {
  autoResolver,
};
