import { builder } from "./builder";
import "./scalars";
import "./types/User";
import "./types/Drone";
import "./types/DroneUser";
import "./types/Mission";
import "./types/MissionDrone";
import "./types/MissionUser";
import "./types/Detection";
import "./types/Alert";
import "./types/Rule";

export const schema = builder.toSchema();
