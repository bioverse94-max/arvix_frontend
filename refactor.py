import os
import re

frontend_dir = r'c:\Users\gaumi\Documents\GitHub\arvix_frontend\src'
config_import = 'import {{ API_BASE_URL }} from "{rel_path}config";'

for root, _, files in os.walk(frontend_dir):
    for file in files:
        if not file.endswith(('.ts', '.tsx')): continue
        filepath = os.path.join(root, file)
        
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            
        original = content
        
        # Replace fetch('/api/...) with fetch(`${API_BASE_URL}/...)
        content = re.sub(r'fetch\([\'"]/api/(.*?)[\'"](.*?)\)', r'fetch(`${API_BASE_URL}/\1`\2)', content)
        
        # Replace fetch(`/api/...`) with fetch(`${API_BASE_URL}/...`)
        content = re.sub(r'fetch\(`/api/(.*?)`(.*?)\)', r'fetch(`${API_BASE_URL}/\1`\2)', content)
        
        # Replace fetch(`${API_BASE_URL}/api/...`) with fetch(`${API_BASE_URL}/...`)
        content = re.sub(r'fetch\(`\$\{API_BASE_URL\}/api/(.*?)`(.*?)\)', r'fetch(`${API_BASE_URL}/\1`\2)', content)
        
        if content != original:
            # Calculate relative path to config.ts
            rel = os.path.relpath(frontend_dir, root)
            rel_import = rel.replace(os.sep, '/')
            if rel_import == '.': rel_import = './'
            else: rel_import = rel_import + '/'
            
            lines = content.split('\n')
            
            # Special handling for mlService.ts
            if file == 'mlService.ts':
                lines = [line for line in lines if not line.startswith('const API_BASE_URL =')]
                
            last_import = -1
            for i, line in enumerate(lines):
                if line.startswith('import '):
                    last_import = i
            
            import_statement = config_import.format(rel_path=rel_import)
            
            # Avoid duplicate imports
            if import_statement not in content:
                if last_import != -1:
                    lines.insert(last_import + 1, import_statement)
                else:
                    lines.insert(0, import_statement)
                
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write('\n'.join(lines))
            print(f'Updated {file}')
