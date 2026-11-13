# Database (Oracle 21c XE)

Run order:

| # | File | Run as | Purpose |
|---|------|--------|---------|
| 0 | 00_create_user.sql | SYSTEM | Create the school_transport schema |
| 1 | 01_create_tables.sql | school_transport | Create the 10 tables |
| 2 | 02_sample_data.sql | school_transport | Insert sample data |
| - | reset_drop_tables.sql | school_transport | Drop everything |

Connection: localhost, port 1521, service name XEPDB1, user school_transport.

Notes:
- USERS.Password stores a BCrypt hash, never plain text.
- Sample data uses a placeholder hash.
- Do not commit real passwords.