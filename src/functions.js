const isDeep = (object) => typeof object === "object";

// const getSelect = (tree) => {
//   const select = Object.keys(tree).reduce((select_container, obj) => {
//     if (!isInclude(tree[obj])) {
//       return { ...select_container, [obj]: tree[obj] };
//     } else {
//       return select_container;
//     }
//   }, {});
//   return select;
// };

const isEmpty = (obj) => {
  return Object.keys(obj).length === 0;
};

const filterEmptyObjects = (objects) => {
  return Object.keys(objects).reduce((obj_container, obj) => {
    if (isEmpty(objects[obj])) {
      return obj_container;
    } else {
      return { ...obj_container, [obj]: objects[obj] };
    }
  }, {});
};

const getWhere = (objectKey, args) => {
  const where = Object.keys(args).reduce((where_container, arg) => {
    if (arg === objectKey) {
      return { ...where_container, ...args[arg] };
    } else {
      return where_container;
    }
  }, {});
  return where;
};

const getSelect = (objectKey, tree, args, level) => {
  const select = Object.keys(tree).reduce((select_container, objs) => {
    if (isDeep(tree[objs])) {
      const where = getWhere(objs, args);
      const select = getSelect(objs, tree[objs], args, level + 1);
      if (level == 1) {
        return { ...select };
      } else {
        if (where & !select & !select) {
          return { ...select_container, [objs]: true };
        } else {
          return {
            ...select_container,
            [objs]: filterEmptyObjects({ where, select, select }),
          };
        }
      }
    } else {
      return { ...select_container, [objs]: true };
    }
  }, {});
  return select;
};

const getPrismaTree = (tree, args) => {
  const firstArgument = Object.keys(tree)[0];
  // const select = getSelect(tree[firstArgument]);
  const where = getWhere(firstArgument, args);
  const select = getSelect("user", tree, args, 1);
  return { firstArgument, where, select };
};

const createQuery = (prismaTree, prisma) => {
  const { firstArgument, where, select } = prismaTree;
  return () => prisma[firstArgument].findMany({ select, where });
};

module.exports = {
  isDeep,
  isEmpty,
  filterEmptyObjects,
  getSelect,
  getWhere,
  getPrismaTree,
  createQuery,
};
