import json
import csv
import os

pba_json = r'C:\Users\dante\Desktop\Laboratorio Colossus\Pipeline OpenArg\datos_pba\catalogo_pba.json'
abiertos_csv = r'C:\Users\dante\Desktop\Laboratorio Colossus\Pipeline OpenArg\datos_abiertos\download_report.csv'
output_json = r'C:\Users\dante\Desktop\Laboratorio Colossus\Dashboard PBA\src\data\taxonomia_data.json'

os.makedirs(os.path.dirname(output_json), exist_ok=True)

pba_datasets = []
with open(pba_json, 'r', encoding='utf-8') as f:
    data = json.load(f)
    seen = set()
    for entry in data:
        key = entry['dataset']
        if key not in seen:
            seen.add(key)
            pba_datasets.append({
                'key': key,
                'title': entry.get('dataset_title', ''),
                'org': entry.get('organization', ''),
                'desc': entry.get('description', ''),
            })

keywords = ['provincia', 'provincial', 'departamento', 'departamental', 'buenos aires', 'pba']

abiertos_datasets = {}
with open(abiertos_csv, 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        title = row.get('dataset_title', '')
        resource = row.get('resource_name', '')
        
        matches = any(kw.lower() in title.lower() or kw.lower() in resource.lower() for kw in keywords)
        
        if matches:
            key = row.get('dataset_name', '')
            if key not in abiertos_datasets:
                abiertos_datasets[key] = {
                    'title': title,
                    'resources': set(),
                    'key': key
                }
            abiertos_datasets[key]['resources'].add(resource)

abiertos_list = list(abiertos_datasets.values())

taxonomia = {
    'Salud y Bienestar': [],
    'Educación y Cultura': [],
    'Economía, Finanzas y Producción': [],
    'Infraestructura, Transporte y Energía': [],
    'Justicia, Seguridad y Derechos Humanos': [],
    'Medio Ambiente y Territorio': [],
    'Gobierno, Población y Sociedad': [],
    'Otros': []
}

def clasificar(org, title, key):
    org_lower = org.lower()
    title_lower = title.lower()
    
    if any(x in org_lower for x in ['salud', 'ioma', 'hospital', 'médico']) or any(x in title_lower for x in ['salud', 'camas', 'egresos hospitalarios', 'enfermedad', 'obstétrica', 'vacunas', 'médico', 'cirugías']):
        return 'Salud y Bienestar'
    if any(x in org_lower for x in ['educación', 'cineduca', 'cultura', 'universidad', 'educacion']) or any(x in title_lower for x in ['educación', 'escuela', 'escolar', 'cultura', 'museo', 'cine']):
        return 'Educación y Cultura'
    if any(x in org_lower for x in ['economía', 'producción', 'trabajo', 'agro', 'desarrollo agrario', 'banco', 'arba', 'bapro']) or any(x in key.lower() for x in ['agroindustria', 'economia']) or any(x in title_lower for x in ['pymes', 'empleados', 'exportaciones', 'presupuesto']):
        return 'Economía, Finanzas y Producción'
    if any(x in org_lower for x in ['infraestructura', 'transporte', 'obras', 'energía']) or any(x in key.lower() for x in ['energia', 'enacom', 'arsat', 'transporte']) or any(x in title_lower for x in ['vial', 'ferroviario', 'puertos', 'rutas', 'conectividad']):
        return 'Infraestructura, Transporte y Energía'
    if any(x in org_lower for x in ['justicia', 'derechos humanos', 'seguridad', 'policía']) or any(x in key.lower() for x in ['justicia', 'seguridad']) or any(x in title_lower for x in ['delito', 'comisaría', 'juzgado', 'penal', 'abogados']):
        return 'Justicia, Seguridad y Derechos Humanos'
    if any(x in org_lower for x in ['ambiente', 'ign', 'recursos naturales']) or any(x in key.lower() for x in ['ambiente', 'ign', 'habitat']) or any(x in title_lower for x in ['bosques', 'glaciares', 'hidríca', 'territoriales', 'mapas']):
        return 'Medio Ambiente y Territorio'
    if any(x in org_lower for x in ['gobierno', 'jefatura', 'dirección nacional', 'registro provincial', 'personas', 'junta electoral', 'previsión social', 'ips']) or any(x in key.lower() for x in ['jgm', 'desarrollo-social']) or any(x in title_lower for x in ['población', 'elecciones', 'defunciones', 'nacimientos', 'matrimonios']):
        return 'Gobierno, Población y Sociedad'
    
    return 'Otros'

for item in pba_datasets:
    cat = clasificar(item['org'], item['title'], item['key'])
    item['type'] = 'pba'
    taxonomia[cat].append(item)

for item in abiertos_list:
    prefix = item['key'].split('-')[0] if '-' in item['key'] else item['key']
    cat = clasificar(prefix, item['title'], item['key'])
    
    item['type'] = 'abiertos'
    item['resources'] = list(item['resources']) # To be JSON serializable
    taxonomia[cat].append(item)

# Output clean JSON
output_data = []
for cat_name, items in taxonomia.items():
    if items:
        output_data.append({
            'category': cat_name,
            'datasets': sorted(items, key=lambda x: x['title'])
        })

with open(output_json, 'w', encoding='utf-8') as f:
    json.dump(output_data, f, ensure_ascii=False, indent=2)

print('Taxonomy JSON file generated successfully.')
