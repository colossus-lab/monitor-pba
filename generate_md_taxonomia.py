import json
import csv
import os

pba_json = r'C:\Users\dante\Desktop\Laboratorio Colossus\Pipeline OpenArg\datos_pba\catalogo_pba.json'
abiertos_csv = r'C:\Users\dante\Desktop\Laboratorio Colossus\Pipeline OpenArg\datos_abiertos\download_report.csv'
output_md = r'C:\Users\dante\Desktop\Laboratorio Colossus\Dashboard PBA\lista_taxonomia_pba.md'

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
                'source': 'Portal PBA'
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

# Define taxonomy
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

# Classify PBA items
for item in pba_datasets:
    cat = clasificar(item['org'], item['title'], item['key'])
    taxonomia[cat].append({
        'type': 'pba',
        'data': item
    })

# Classify Abiertos items
for item in abiertos_list:
    # Abiertos uses prefixes in key like 'agroindustria-X'
    prefix = item['key'].split('-')[0] if '-' in item['key'] else item['key']
    cat = clasificar(prefix, item['title'], item['key'])
    taxonomia[cat].append({
        'type': 'abiertos',
        'data': item
    })

# Write to taxonomy md
with open(output_md, 'w', encoding='utf-8') as out:
    out.write('# Catálogo Unificado de Datos de PBA (Taxonomía Jerárquica)\n\n')
    
    for cat_name, items in taxonomia.items():
        if not items:
            continue
        out.write(f'## {cat_name}\n\n')
        
        # Sort alphabetically by title
        items_sorted = sorted(items, key=lambda x: x['data']['title'])
        for item in items_sorted:
            if item['type'] == 'pba':
                data = item['data']
                out.write(f"### {data['title']} ({data['key']}) [Portal PBA]\n")
                out.write(f"- **Organización:** {data['org']}\n")
                desc = data['desc'].replace('\n', ' ').replace('\r', ' ')
                out.write(f"- **Descripción:** {desc}\n\n")
            else:
                data = item['data']
                out.write(f"### {data['title']} ({data['key']}) [Datos Abiertos Nacionales]\n")
                out.write('- **Recursos relevantes:**\n')
                for res in sorted(data['resources']):
                    out.write(f"  - {res}\n")
                out.write('\n')

print('Taxonomy MD file generated successfully.')
