import {
    DateResolver,
    DateTimeResolver,
    JSONObjectResolver,
} from "graphql-scalars";
import { builder } from "./builder";

builder.addScalarType("Date", DateResolver, {});
builder.addScalarType("DateTime", DateTimeResolver, {});
builder.addScalarType("JSONObject", JSONObjectResolver, {});
