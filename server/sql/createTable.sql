CREATE TABLE "games" (
	"userid"	INTEGER NOT NULL,
	"score"	INTEGER NOT NULL,
	"id"	INTEGER,
	"url"	TEXT NOT NULL,
	"correct"	TEXT NOT NULL,
	PRIMARY KEY("id" AUTOINCREMENT)
)

CREATE TABLE "user" (
	"id"	INTEGER NOT NULL UNIQUE,
	"name"	TEXT NOT NULL,
	"email"	TEXT NOT NULL,
	"password"	TEXT NOT NULL,
	"salt"	TEXT NOT NULL,
	PRIMARY KEY("id")
)
CREATE TABLE "captions" (
	"caption"	TEXT NOT NULL,
	PRIMARY KEY("caption")
)

CREATE TABLE "memes" (
	"url"	TEXT NOT NULL,
	"answer1"	TEXT NOT NULL,
	"answer2"	TEXT NOT NULL,
	"name"	TEXT NOT NULL,
	"id"	INTEGER NOT NULL,
	PRIMARY KEY("id"),
	FOREIGN KEY("answer2") REFERENCES "captions"("caption"),
	FOREIGN KEY("answer1") REFERENCES "captions"("caption")
)