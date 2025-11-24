import { Router } from "express";
import {authGuard} from "../middleware/authGuard.js";
import {createNewGroup, getGroupDetails, joinGroup} from "../controllers/groups.controller.js";
import {listTripsInGroup, createTripInGroup} from "../controllers/groupTrip.controller.js";
import {voteForTrip, getVoteTally } from "../controllers/votes.controller.js";
import {groupMemberOnly} from "../middleware/groupMemberOnly.js";

const router = Router();

// Groups
router.post("/groups", authGuard, createNewGroup);
router.post("/groups/join", authGuard, joinGroup);
router.get("/groups", authGuard, groupMemberOnly,  getGroupDetails);

// Group Trips
router.get("/groups/:groupId/trips", authGuard, groupMemberOnly, listTripsInGroup);
router.post("/groups/:groudId/trips", authGuard, groupMemberOnly, createTripInGroup);

// Votes
router.post("/groups/:groupId/trips/:tripId/votes", authGuard, groupMemberOnly, voteForTrip);
router.get("/groups/:groupId/trips/:tripId/votes", authGuard, groupMemberOnly, getVoteTally);

export default router;