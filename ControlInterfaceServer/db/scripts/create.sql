CREATE TABLE effects
(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    creation_time TIMESTAMP NOT NULL,
    config TEXT NOT NULL,
    timelimit INTEGER,
    priority INTEGER,
    applyToSlavesDevices INTEGER DEFAULT 0
);

CREATE TABLE scheduled_events
(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    config TEXT NOT NULL,
    effectId INTEGER,
    FOREIGN KEY (effectId) REFERENCES effects(id) ON DELETE CASCADE
);