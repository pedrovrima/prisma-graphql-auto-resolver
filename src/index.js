const parseFields = require("graphql-parse-fields");

const isInclude = (object) => typeof object === "object";

const getSelect = (tree) => {
  const select = Object.keys(tree).reduce((select_container, obj) => {
    if (!isInclude(tree[obj])) {
      return { ...select_container, [obj]: tree[obj] };
    } else {
      return select_container;
    }
  }, {});
  return select;
};


const isEmpty =(obj)=>{
    return Object.keys(obj).length===0
}

const filterEmptyObjects =(objects)=>{
    return Object.keys(objects).reduce((obj_container, obj)=>{
        if(isEmpty(objects[obj])){
            return obj_container
        }else{
            return {...obj_container,[obj]:objects[obj]}
        }
    },{})

}


const getWhere = (objectKey, args) => {
  const where = Object.keys(args).reduce((where_container, arg) => {
    if (arg === objectKey) {
      return { ...where_container, ...args[arg] };
    } else {
      return where_container;
    }
  }, {});
  return where
};

const getInclude = (objectKey,tree,args,level)=>{
    const include= Object.keys(tree).reduce((include_container,objs)=>{
        if(isInclude(tree[objs])){
            const where = getWhere(objs,args);
            const select = getSelect(tree[objs]);
            const include = getInclude(objs,tree[objs],args,level+1)
            if(level==1){
                return {...include}
            } else{
                if(where & !select & !include){
                    return {...include_container,[objs]:"true"}
                } else{
                    return {...include_container,[objs]:filterEmptyObjects({where,include,select})}
                }
            }

        }
        else{
            return include_container
        }

    },{})
    return include

}


const prismaTree = (tree, args) => {
  const firstArgument = Object.keys(tree);
  const select = getSelect(tree[firstArgument]);
  const where = getWhere(firstArgument, args);
  return { firstArgument, where, select, include };
};

const prismaAutoResolver = async (parent, args, context, info) => {
  const query_tree = parseFields(info, false);
  const prismaTree = getPrismaTree(tree, args);
  const prismaQuery = createQuery(prismaTree);
  const queryResult = await prismaQuery();
  return queryResult;
};

module.exports = { isInclude, isEmpty, filterEmptyObjects, getSelect, getWhere, getInclude, prismaTree, prismaAutoResolver };
