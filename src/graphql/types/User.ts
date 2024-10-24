import { builder } from "../builder";

builder.prismaObject("User", {
    fields: (t) => ({
        id: t.exposeID("id"),
        name: t.exposeString("name"),
        email: t.exposeString("email"),
        emailVerifiedAt: t.field({ type: "DateTime" }),
        emailVerifToken: t.exposeString("emailVerifToken"),
        createdAt: t.field({ type: "Date" }),
        updatedAt: t.field({ type: "Date" }),
        drones: t.relation("drones", {
            type: "DroneUser",
            list: true,
        }),
        missions: t.relation("missions", {
            type: "MissionUser",
            list: true,
        }),
    }),
});

builder.queryField("user", (t) =>
    t.prismaField({
        type: "User",
        nullable: true,
        resolve: (query, _parent, _args, context) => {
            const { user } = context;

            // if the user is not logged in, return null
            if (!user) {
                return null;
            }

            return prisma.user.findUnique({
                ...query,
                where: {
                    email: user.email, // Assuming email is unique and stored in session
                },
            });
        },
    }),
);

builder.queryField("me", (t) =>
    t.prismaField({
        type: "User",
        resolve: async (query, root, args, ctx) => {
            if (!(await ctx).email) {
                throw new Error(
                    "You have to be logged in to perform this action",
                );
            }

            const me = prisma.user.findUniqueOrThrow({
                ...query,
                where: { email: (await ctx).email ?? "" },
            });

            if (!me) throw Error("User does not exist");

            return me;
        },
    }),
);
