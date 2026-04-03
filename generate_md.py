import json
import csv
import os

pba_json = r'C:\Users\dante\Desktop\Laboratorio Colossus\Pipeline OpenArg\datos_pba\catalogo_pba.json'
abiertos_csv = r'C:\Users\dante\Desktop\Laboratorio Colossus\Pipeline OpenArg\datos_abiertos\download_report.csv'
output_md = r'C:\Users\dante\Desktop\Laboratorio Colossus\Dashboard PBA\lista_unificada_pba.md'

pba_datasets = {}
with open(pba_json, 'r', encoding='utf-8') as f:
    data = json.load(f)
    for entry in data:
        key = entry['dataset']
        if key not in pba_datasets:
            pba_datasets[key] = {
                'title': entry.get('dataset_title', ''),
                'org': entry.get('organization', ''),
                'desc': entry.get('description', '')
            }

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
                    'resources': set()
                }
            abiertos_datasets[key]['resources'].add(resource)

with open(output_md, 'w', encoding='utf-8') as out:
    out.write('# Lista Unificada de Datos de PBA\n\n')
    
    out.write('## 1. Datos del Portal PBA (datos_pba)\n\n')
    for key, info in sorted(pba_datasets.items()):
        out.write(f"### {info['title']} ({key})\n")
        out.write(f"- **Organización:** {info['org']}\n")
        
        # Replace newlines in description with spaces
        desc = info['desc'].replace('\n', ' ').replace('\r', ' ')
        out.write(f"- **Descripción:** {desc}\n\n")
        
    out.write('---\n\n')
        
    out.write('## 2. Datos Abiertos de Argentina con referencia Provincial/Departamental (datos_abiertos)\n\n')
    for key, info in sorted(abiertos_datasets.items()):
        out.write(f"### {info['title']} ({key})\n")
        out.write('- **Recursos relevantes:**\n')
        for res in sorted(info['resources']):
            out.write(f"  - {res}\n")
        out.write('\n')

print('MD file generated successfully.')
