import json
import os

pba_json = r'C:\Users\dante\Desktop\Laboratorio Colossus\Pipeline OpenArg\datos_pba\catalogo_pba.json'
db_mapping_json = r'C:\Users\dante\Desktop\Laboratorio Colossus\Dashboard PBA\src\data\db_mapping.json'
output_key_json = r'C:\Users\dante\Desktop\Laboratorio Colossus\Dashboard PBA\src\data\db_mapping_key.json'

def main():
    print("Leyendo catálogos...")
    
    with open(pba_json, 'r', encoding='utf-8') as f:
        pba_data = json.load(f)
        
    with open(db_mapping_json, 'r', encoding='utf-8') as f:
        db_map = json.load(f)

    # Creamos el nuevo mapeo
    key_map = {}
    for entry in pba_data:
        url = entry.get('url')
        dataset_key = entry.get('dataset')
        
        if url in db_map:
            key_map[dataset_key] = db_map[url]
            
    print(f"Mapeadas {len(key_map)} tablas exitosamente.")
    
    with open(output_key_json, 'w', encoding='utf-8') as f:
        json.dump(key_map, f, indent=4)
        
    print("Guardado en db_mapping_key.json!")

if __name__ == '__main__':
    main()
