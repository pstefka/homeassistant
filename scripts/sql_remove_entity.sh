#/bin/bash
sqlite3 -line ~/.homeassistant/home-assistant_v2.db 'SELECT * FROM states;'
sqlite3 ~/.homeassistant/home-assistant_v2.db 'SELECT entity_id FROM states GROUP BY entity_id;'

#sqlite3 -line ~/.homeassistant/home-assistant_v2.db "DELETE FROM states WHERE entity_id='sensor.example';"
