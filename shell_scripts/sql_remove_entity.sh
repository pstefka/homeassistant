#/bin/bash
#sqlite3 ~/.homeassistant/home-assistant_v2.db 'SELECT entity_id FROM states GROUP BY entity_id;'

#sqlite3 -line ~/.homeassistant/home-assistant_v2.db "DELETE FROM states WHERE entity_id in ('automation.heat_1630_auto_up');"
#sqlite3 -line ~/.homeassistant/home-assistant_v2.db "DELETE FROM states WHERE entity_id like 'automation.heat_2100%';"
sqlite3 -line ~/.homeassistant/home-assistant_v2.db "DELETE FROM states WHERE entity_id='binary_sensor.mqtt_binary_sensor';"

sqlite3 ~/.homeassistant/home-assistant_v2.db 'SELECT entity_id FROM states GROUP BY entity_id;'
