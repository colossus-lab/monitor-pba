import os
import json
import uuid
import re
import pandas as pd
from sqlalchemy import create_engine
from dotenv import load_dotenv

# Configuración
load_dotenv('.env.local')
db_url = os.environ.get('POSTGRES_URL')
if not db_url:
    print("No se encontró POSTGRES_URL. Abortando.")
    exit(1)

# SQLAlchemy requires 'postgresql://' instead of 'postgres://'
if db_url.startswith("postgres://"):
    db_url = db_url.replace("postgres://", "postgresql://", 1)

print(f"Conectando a Neon Serverless...")
engine = create_engine(db_url)

# Rutas
pba_json = r'C:\Users\dante\Desktop\Laboratorio Colossus\Pipeline OpenArg\datos_pba\catalogo_pba.json'
base_path = r'C:\Users\dante\Desktop\Laboratorio Colossus\Pipeline OpenArg'
output_map = r'C:\Users\dante\Desktop\Laboratorio Colossus\Dashboard PBA\src\data\db_mapping.json'

def sanitize_table_name(name):
    clean = re.sub(r'[^a-zA-Z0-9_]', '_', str(name).lower())
    return clean[:40]

def upload_pba_datasets():
    print("Leyendo catálogo PBA...")
    with open(pba_json, 'r', encoding='utf-8') as f:
        data = json.load(f)
        
    csv_data = [d for d in data if d.get('format', '').upper() == 'CSV' and d.get('local_path')]
    total = len(csv_data)
    print(f"Encontrados {total} recursos CSV en PBA para procesar de forma completa.")
    
    db_map = {}
    
    # Cargar progreso previo si existe
    if os.path.exists(output_map):
        with open(output_map, 'r', encoding='utf-8') as f:
            db_map = json.load(f)
    
    for idx, entry in enumerate(csv_data):
        url_key = entry['url']
        if url_key in db_map:
            print(f"[{idx+1}/{total}] Omitiendo {entry['resource_name']} (Ya inyectado en {db_map[url_key]})")
            continue

        local_path = os.path.join(base_path, entry['local_path'])
        if not os.path.exists(local_path):
            continue
            
        dataset_key = entry['dataset']
        raw_name = entry['resource_name']
        
        table_id = f"pba_{sanitize_table_name(dataset_key)}_{uuid.uuid4().hex[:6]}"
        
        print(f"[{idx+1}/{total}] Subiendo {raw_name} -> Tabla: {table_id}")
        
        try:
            chunksize = 25000 # Chunk más alto para mayor velocidad en subidas en bulk
            for chunk in pd.read_csv(local_path, chunksize=chunksize, sep=None, engine='python', on_bad_lines='skip'):
                chunk.columns = [sanitize_table_name(c) for c in chunk.columns]
                chunk.to_sql(table_id, engine, if_exists='append', index=False)
            
            # Guardar exitosamente mapeado
            db_map[url_key] = table_id
            
            # Guardamos cada vez que haya éxito por si corta a la mitad
            with open(output_map, 'w', encoding='utf-8') as f:
                json.dump(db_map, f, indent=4)
                
        except Exception as e:
            print(f"Error procesando {local_path}: {e}")
            
    print("Inyección masiva completada.")
    return db_map

if __name__ == "__main__":
    db_map = upload_pba_datasets()
    print("Listado completo guardado en src/data/db_mapping.json")
