import type { InferSelectModel } from "drizzle-orm";
import type {
  listInvites,
  listItems,
  listMembers,
  lists,
  listTags,
  sessions,
  users,
} from "./schema";

export interface User extends InferSelectModel<typeof users> {}
export interface Session extends InferSelectModel<typeof sessions> {}
export interface List extends InferSelectModel<typeof lists> {}
export interface ListMember extends InferSelectModel<typeof listMembers> {}
export interface ListTag extends InferSelectModel<typeof listTags> {}
export interface ListInvite extends InferSelectModel<typeof listInvites> {}
export interface ListItem extends InferSelectModel<typeof listItems> {}
