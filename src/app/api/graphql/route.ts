import { createYoga } from "graphql-yoga";
import type { NextApiRequest, NextApiResponse } from "next";
import type { Session } from "next-auth";
import { getSession } from "next-auth/react";
import { schema } from "../../../graphql/schema";
import { createContext } from "../../../graphql/context";

const { handleRequest } = createYoga<
    {
        req: NextApiRequest;
        res: NextApiResponse;
    },
    {
        session: Session;
    }
>({
    schema,
    context: createContext,
    graphqlEndpoint: "/api/graphql",
    fetchAPI: { Response },
});

export {
    handleRequest as GET,
    handleRequest as POST,
    handleRequest as OPTIONS,
};
