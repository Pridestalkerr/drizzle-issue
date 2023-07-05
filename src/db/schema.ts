import {
  pgTable,
  uuid,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

console.log("STUFF IS HEEREEEEEEEEEEEEEEEEEEEEE");

export const defaultField = {
  id: uuid("id").primaryKey().defaultRandom(),
  createdAt: timestamp("created_at", {
    withTimezone: true,
  }).defaultNow(),
  updatedAt: timestamp("updated_at", {
    withTimezone: true,
  }), // null at first, must be updated manually sadly
};

export const users = pgTable(
  "users",
  {
    ...defaultField,
    firstName: text("first_name").notNull(),
    lastName: text("last_name").notNull(),
    email: text("email").notNull(),
    phoneNumber: text("phone_number").notNull(),
    image: text("image"), // optional
  },
  (table) => {
    return {
      uniqueEmail: uniqueIndex("unique_email").on(table.email),
      uniquePhoneNumber: uniqueIndex("unique_phone_number").on(
        table.phoneNumber
      ),
    };
  }
);

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
}));

export const accounts = pgTable(
  "accounts",
  {
    ...defaultField,
    userId: uuid("user_id")
      .references(() => users.id, {
        onDelete: "cascade",
      })
      .notNull(),
    providerId: text("provider_id")
      .$type<"credentials" | "google" | "discord">()
      .notNull(),
    providerAccountId: text("provider_account_id").notNull(), // can be email
    hashedPassword: text("hashed_password"), // optional
    verified: timestamp("verified", {
      withTimezone: true,
    }), // optional, for email usually

    // this is for oauth only
    refreshToken: text("refresh_token"), // optional
    accessToken: text("access_token"), // optional
    accessTokenExpires: timestamp("access_token_expires", {
      withTimezone: true,
    }), // optional
  },
  (table) => {
    return {
      unique_provider: uniqueIndex("unique_provider").on(
        table.providerId,
        table.providerAccountId
      ),
    };
  }
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}));

export const sessions = pgTable("sessions", {
  ...defaultField,
  userId: uuid("user_id")
    .references(() => users.id, {
      onDelete: "cascade",
    })
    .notNull(),
  expires: timestamp("expires", {
    withTimezone: true,
  }).notNull(),
  sessionToken: text("session_token").notNull(),
  accessToken: text("access_token").notNull(),
});

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

// TODO: for 2FA
export const verification_requests = pgTable("verification_requests", {
  ...defaultField,
  identifier: text("identifier").notNull(),
  token: text("token").notNull(),
  expires: timestamp("expires", {
    withTimezone: true,
  }).notNull(),
});
