# Prisma-GraphQL Auto-Resolver

This package exports a function that automatically creates a Prisma query based on GraphQL query information.

It still has some limitations, that are listed below, but most of those should be solved as soon as an Prisma-GraphQL Auto-Modeler package is available.

## Installation

```javascript
npm install prisma-graphql-auto-resolver
```

## Usage

This package is intended to be used on the resolver part of a GraphQL server. It uses information passed by the query (specifically the _args_ and _info_ parameters) to construct a prisma.io query.

It was designed to serve a unique/master query, responsible for fetching all types. Please see **Limitations** section below for further details.

```javascript
const {autoResolver} = require("prisma-graphql-auto-resolver");
const {PrismaClient} = require ("@prisma/client")

const prisma = new PrismaClient()

const models = `
    type Users {
        id: ID
        name: String
        email: String
        posts: [Posts]
        }

    type Posts {
        id: ID
        title: String
        content: Strings
        user: Users
    }

    type AllTypes {
        users: [Users]
        posts: [Posts]
    }

    type Query {
        masterQuery:AllTypes
    }

}
`

const resolver = {
    Query:{
        masterQuery= async (parent, args, context, info) => {
            const query_result = await autoResolver(parent,args,context, info,prisma)
            return query_result
        }
    }
}

```

Right now, the existence of the type AllTypes (or any other name, obviously) is required since when creating a query it will inform the name of the table prisma needs to query. For example, this GraphQL query:

```
query{
    masterQuery{
        users{
            id
            name
            posts{
                title
            }
        }
    }
}
```

Will generate the Prisma query:

```javascript
prisma.users.findMany({
  select: { id: true, name: true },
  include: { posts: { select: { title: true } } },
});
```


## Limitations

Right now, there are some limitations/rules that the models should follow for this package to work correctly:

1. Types should have the same name as the ones described at the Prisma models;
2. Types should have the same fields and same field names as the ones described at the Prisma models;
3. There needs to be a master Type - somewhere where you connect a type to the name of the table (in prisma lower-case notation) [see AllTypes above]
4. Queries with args are still a work in progress.

Limitation 1 and 2 should be solved as soon as a Prisma-to-GraphQL package is done (and I'm working on it =));
Right now, there are no plans to overcome number 3;
Limitation number 4 is under work.

