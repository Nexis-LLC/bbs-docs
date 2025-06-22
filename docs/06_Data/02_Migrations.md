# Migrations: Liquibase Strategy

This document defines the **database migration strategy** using Liquibase, ensuring versioned, reversible, and consistent schema changes.

---

## 1. Directory Layout

```
db/migrations/
├── changelog-master.xml
├── changelogs/
│   ├── 001-create-users.xml
│   ├── 002-create-routes-seats.xml
│   ├── 003-create-bookings-payments.xml
│   └── 004-add-indexes.xml
```

## 2. Master Changelog (`changelog-master.xml`)

```xml
<databaseChangeLog
  xmlns="http://www.liquibase.org/xml/ns/dbchangelog"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.liquibase.org/xml/ns/dbchangelog
                      http://www.liquibase.org/xml/ns/dbchangelog/dbchangelog-3.8.xsd">

  <include file="changelogs/001-create-users.xml"/>
  <include file="changelogs/002-create-routes-seats.xml"/>
  <include file="changelogs/003-create-bookings-payments.xml"/>
  <include file="changelogs/004-add-indexes.xml"/>

</databaseChangeLog>
```

## 3. Sample Changeset (`001-create-users.xml`)

```xml
<changeSet id="001" author="dev">
  <createTable tableName="users">
    <column name="id" type="UUID">
      <constraints primaryKey="true" nullable="false"/>
    </column>
    <column name="email" type="VARCHAR(255)">
      <constraints unique="true" nullable="false"/>
    </column>
    <column name="password" type="VARCHAR(255)"/>
    <column name="created_at" type="TIMESTAMPTZ"/>
  </createTable>
</changeSet>
```

## 4. Best Practices

- **Atomic Changesets**: One logical change per file.
- **Idempotency**: Avoid operations that fail on re-run.
- **Rollback Support**: Provide `<rollback>` tags for destructive changes.
- **ChangeSet Metadata**: Include `runOnChange="true"` for reference data updates.

---

* Document Version: 1.0
* Date: 2025-06-23
* Author: ArturChernets