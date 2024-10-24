import SchemaBuilder from "@pothos/core";
import type PrismaTypes from "@pothos/plugin-prisma/generated";
import prisma from "@/lib/prisma";
import PrismaPlugin from "@pothos/plugin-prisma";
import RelayPlugin from "@pothos/plugin-relay";
import { createContext } from "./context";

export const builder = new SchemaBuilder<{
    PrismaTypes: PrismaTypes;
    Scalars: {
        Date: {
            Input: any;
            Output: any;
        };
        JSONObject: {
            Input: any;
            Output: any;
        };
        DurationType: {
            Input: string;
            Output: string;
        };
    };
    Context: ReturnType<typeof createContext>;
}>({
    plugins: [PrismaPlugin, RelayPlugin],
    relay: {},
    prisma: {
        client: prisma,
        // warn when not using a query parameter correctly
        onUnusedQuery: process.env.NODE_ENV === "production" ? null : "warn",
    },
});

// in GraphQL the Query type and Mutation type can each only be called once. So we call it here and will add fields to them on the go
builder.queryType({
    fields: (t) => ({
        ok: t.boolean({
            resolve: () => true,
        }),
    }),
});

builder.mutationType({
    fields: (t) => ({
        ok: t.boolean({
            resolve: () => true,
        }),
    }),
});
