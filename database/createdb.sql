CREATE DATABASE IF NOT EXISTS libquality_db;
CREATE USER 'libqualityadm'@'localhost' IDENTIFIED WITH mysql_native_password 'cox69leo';
GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, INDEX, DROP, ALTER, CREATE TEMPORARY TABLES, LOCK TABLES ON libquality_db.* TO 'libqualityadm'@'localhost';