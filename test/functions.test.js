const prismaFunctions = require("../src");

const tree = {
  user: {
    id: "true",
    name: "true",
    posts: {
      id: "true",
      date: "true",
      category: {
        id: "true",
      },
    },
  },
};

const prisma={ user: {findMany:(...args)=>{return(args)} }}

const args = { user: { id: 1 }, posts: { id: 2 } };

const prismaTree = {
  firstArgument: "user",
  select: {
    id: "true",
    name: "true",
  },
  include: {
    posts: {
      select: { id: "true", date: "true" },
      where: { id: 2 },
      include: { category: { select: { id: "true" } } },
    },
  },
  where: { id: 1 },
};

const Query = () =>
  prisma.user.findMany({
    where: { id: 1 },
    select: {
      id: "true",
      name: "true",
    },
    include: {
      posts: {
        select: { id: "true", date: "true" },
        where: { id: 2 },
        include: { category: { select: { id: "true" } } },
      },
    },
  });

// isEmpty
test("object is empty", () => {
  expect(prismaFunctions.isEmpty({})).toBeTruthy();
});

test("object is not empty", () => {
  expect(prismaFunctions.isEmpty({ id: "1" })).toBeFalsy();
});

// filterEmptyObjects

test("fitler empty", () => {
  expect(
    prismaFunctions.filterEmptyObjects({ where: {}, select: { id: 1 } })
  ).toEqual({ select: { id: 1 } });
});

// isInclude

test("is a include object", () => {
  expect(prismaFunctions.isInclude(tree.user)).toBeTruthy();
});

test("is not a include object", () => {
  expect(prismaFunctions.isInclude(tree.user.id)).toBeFalsy();
});

// getSelect

test("get select objects", () => {
  expect(prismaFunctions.getSelect(tree.user)).toEqual({
    id: "true",
    name: "true",
  });
});

// getWhere

test("get where from args", () => {
  expect(prismaFunctions.getWhere("user", args)).toEqual({ id: 1 });
});

// getInclude

test("getInclude", () => {
  expect(prismaFunctions.getInclude("user", tree, args, 1)).toEqual({
    posts: {
      select: { id: "true", date: "true" },
      where: { id: 2 },
      include: { category: { select: { id: "true" } } },
    },
  });
});

// prismaTree

test("prismaTree", () => {
  expect(prismaFunctions.prismaTree(tree, args)).toEqual({
    firstArgument: "user",
    select: {
      id: "true",
      name: "true",
    },
    include: {
      posts: {
        select: { id: "true", date: "true" },
        where: { id: 2 },
        include: { category: { select: { id: "true" } } },
      },
    },
    where: { id: 1 },
  });
});

// createQuery

test("createQuery", () => {
  const queryFunction = prismaFunctions.createQuery(prismaTree,prisma);
  expect(queryFunction()).toEqual(Query());
});