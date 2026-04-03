import json
from collections import defaultdict, Counter

CATALOG_PATH = r'C:\Users\dante\Desktop\Laboratorio Colossus\Pipeline OpenArg\datos_pba\catalogo_pba.json'

def main():
    with open(CATALOG_PATH, 'r', encoding='utf-8') as f:
        data = json.load(f)

    datasets_info = {}
    for r in data:
        ds_name = r.get('dataset_title')
        if ds_name not in datasets_info:
            datasets_info[ds_name] = {
                'groups': r.get('groups', []),
                'resources': [],
            }
        
        datasets_info[ds_name]['resources'].append({
            'name': r.get('resource_name'),
            'format': r.get('format')
        })

    target_groups = [
        "Salud",
        "Demografía, territorio y sociedad",
        "Seguridad y justicia",
        "Administración pública",
        "Educación"
    ]

    report = {g: [] for g in target_groups}
    for ds_name, info in datasets_info.items():
        for g in info['groups']:
            if g in target_groups:
                report[g].append({"name": ds_name, "count": len(info['resources'])})

    # write out purely as JSON
    with open('report.json', 'w', encoding='utf-8') as f:
        json.dump(report, f, indent=2, ensure_ascii=False)

if __name__ == '__main__':
    main()
