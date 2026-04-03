import json
import os

pba_json = r'C:\Users\dante\Desktop\Laboratorio Colossus\Pipeline OpenArg\datos_pba\catalogo_pba.json'
mapping_json = r'C:\Users\dante\Desktop\Laboratorio Colossus\Dashboard PBA\src\data\db_mapping.json'
output_json = r'C:\Users\dante\Desktop\Laboratorio Colossus\Dashboard PBA\src\data\db_mapping_key.json'

if os.path.exists(mapping_json):
    with open(mapping_json, 'r', encoding='utf-8') as f:
        url_map = json.load(f)
        
    with open(pba_json, 'r', encoding='utf-8') as f:
        catalogo = json.load(f)
        
    key_map = {}
    for entry in catalogo:
        url = entry.get('url')
        if url in url_map:
            key_map[entry['dataset']] = url_map[url]
            
    with open(output_json, 'w', encoding='utf-8') as f:
        json.dump(key_map, f, indent=4)
    print("Mapa de llaves generado con éxito.")
else:
    print("No existe el mapping de urls aun.")
