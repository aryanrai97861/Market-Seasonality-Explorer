import { pgTable, text, serial, integer, boolean, timestamp, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const marketData = pgTable("market_data", {
  id: serial("id").primaryKey(),
  symbol: text("symbol").notNull(),
  date: timestamp("date").notNull(),
  openPrice: decimal("open_price", { precision: 18, scale: 8 }).notNull(),
  closePrice: decimal("close_price", { precision: 18, scale: 8 }).notNull(),
  highPrice: decimal("high_price", { precision: 18, scale: 8 }).notNull(),
  lowPrice: decimal("low_price", { precision: 18, scale: 8 }).notNull(),
  volume: decimal("volume", { precision: 18, scale: 8 }).notNull(),
  volatility: decimal("volatility", { precision: 10, scale: 6 }),
  liquidity: decimal("liquidity", { precision: 18, scale: 8 }),
  performance: decimal("performance", { precision: 10, scale: 6 }),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertMarketDataSchema = createInsertSchema(marketData).omit({
  id: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type MarketData = typeof marketData.$inferSelect;
export type InsertMarketData = z.infer<typeof insertMarketDataSchema>;
