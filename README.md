# db-postgres

Class for working with postgres in node projects

## Installation

```console
npm i @zutatensuppe/db-postgres
```

## Usage

Example usage (not all functions covered yet):

```js
import Db from '@zutatensuppe/db-postgres'

// connect to he database
const connectString = 'postgresql://user:pass@host:port/database'
const db = new Db(connectString)
await db.connect()

// run database patches
const pathToPatchesDir = '/path/to/patches'
await db.patch(pathToPatchesDir)

// insert some users
const id1 = await db.insert('app.user', { name: 'bob', age: 42 }, 'id')
const id2 = await db.insert('app.user', { name: 'alice', age: 19 }, 'id')

// get a user by id
const user = await db.get('app.user', { id: id1 })
// { id: 1, name: 'bob', age: 42 }

// find a user with age > 100
const user = await db.get('app.user', { id: { '$gt': 100 } })
// null

// get all users with age < 100, sorted by name in ascending order
const users = await db.getMany('app.user', { id: { '$lt': 100 } }, [{ name: 1 }])
// [{ id: 2, name: 'alice', age: 19 }, { id: 1, name: 'bob', age: 42 }]
```

## Patches

Patches are used to migrate the database structure or content. They
are applied using the `patch` method. All unapplied patches inside
the `pathToPatchesDir` are applied. The information of which patch
has already be applied is stored in `public.db_patches`.
Inside the directory, create files like this (example):

```sql
-- 01_structure.sql
CREATE SCHEMA app;

CREATE TABLE app.user (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE
);

CREATE TABLE app.book (
  user_id INTEGER NOT NULL,
  title TEXT
);
```

```sql
-- 02_add_age_to_user.sql
ALTER TABLE app.user
  ADD COLUMN age INTEGER DEFAULT NULL;

```

Patches are only applied once. The class internally writes the applied
patch to `public.db_patches`. If a patch should be reapplied, remove
the according entry from that table.
