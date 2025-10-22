import { db } from "./db_conn";

async function test() {
  // await db.schema.createTable("todos", (table) => {
  //   table.increments("id");
  //   table.text("text");
  //   table.boolean("completed").defaultTo(false);
  //   table.timestamp("createdAt").defaultTo(db.fn.now());
  //   table.timestamp("completedAt").defaultTo(db.fn.now());
  //   console.log("Table 'todos' created ✅");
  // });

  // await db.schema.alterTable("todos", (table) => {
  //   table.string("category").defaultTo("General");
  // });
  // console.log("Added 'category' column ✅");

  await db.schema.createTable("categories", (table) => {
    table.increments("id");
    table.string("name").notNullable().unique();
    table.timestamp("createdAt").defaultTo(db.fn.now());
  });

  console.log("Table 'categories' created ✅");

  await db.destroy();
  console.log("Done");
}

test().catch((err) => {
  console.error("Error:", err);
  db.destroy();
});
