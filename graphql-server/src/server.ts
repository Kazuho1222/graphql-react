import { ApolloServer } from "apollo-server";
import { gql } from "apollo-server";
import { PrismaClient } from "@prisma/client";
import "dotenv/config";

const prisma = new PrismaClient();

type Context = {
  prisma: PrismaClient;
};

const typeDefs = gql`
  type Todo {
    id: ID!
    title: String!
    completed: Boolean!
  }

  type Query {
    getTodos: [Todo!]!
  }

  type Mutation {
    addTodo(title: String!): Todo!
    updateTodo(id: ID!, completed: Boolean!): Todo!
    deleteTodo(id: ID!): Todo!
  }
`;

type AddTodo = {
  title: string;
};

const resolvers = {
  Query: {
    getTodos: async (_: unknown, args: any, context: Context) => {
      return await context.prisma.todo.findMany();
    },
  },
  Mutation: {
    addTodo: async (_: unknown, { title }: { title: string }, context: Context) => {
      return context.prisma.todo.create({
         data: {
          title,
          completed: false,
        },
      });
    },
    updateTodo: async (_: unknown, { id, completed }: { id: string; completed: boolean }, context: Context) => {
      return context.prisma.todo.update({
        where: { id },
        data: { completed },
      });
    },
    deleteTodo: async (_: unknown, { id }: { id: string }, context: Context) => {
      return context.prisma.todo.delete({
        where: { id },
      });
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: () => ({ prisma }),
});

const PORT = process.env.PORT || 4001;
server.listen(PORT, () => {
  console.log(`Server ready at http://localhost:${PORT}`);
}).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
