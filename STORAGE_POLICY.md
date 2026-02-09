# LayerFilm Storage Policy

To keep the repository clean and lightweight for GitHub, and to manage large assets efficiently, we strictly enforce the following storage policy:

## 1. C: Drive (`C:\layerfilm`) - Code & Configuration
- **Content**: Source code (`src/`), scripts (`scripts/`), configuration files, `package.json`.
- **Git**: This directory is tracked by Git.
- **Restrictions**: 
  - NO large binary files (>100MB).
  - NO video renders or intermediate clips.
  - NO AI models (`.safetensors`, `.ckpt`, `.pth`).
  - NO standalone installers (`.exe`, `.msi`).

## 2. Z: Drive (`Z:\layerfilm`) - Assets & Renders
- **Content**: 
  - **Models**: `Z:\layerfilm\models\` (e.g., SVD, RealVisXL).
  - **Assets**: `Z:\layerfilm\drama-assets\` (Images, Audio, Scripts).
  - **Renders**: `Z:\layerfilm\renders\` (Final outputs).
  - **Temp**: `Z:\layerfilm\temp\` (Intermediate processing files).
  - **Programs**: `Z:\layerfilm\programs\` (Portable tools if needed).
- **Git**: This directory is **NOT** tracked by Git.
- **Backup**: Manage backups for this drive separately.

## 3. Script Compliance
All scripts must:
- Reference `Z:` drive paths for inputs/outputs of large assets.
- Fail safety checks if attempting to write large renders to C:.
- Use `C:\layerfilm\.venv` for Python execution (environment is code-adjacent).

## 4. Setup for New Machines
1. Clone repo to `C:\layerfilm`.
2. Map a fast SSD/HDD to `Z:`.
3. Create structure: `Z:\layerfilm\{models, drama-assets, renders}`.
4. Download required models to `Z:\layerfilm\models`.

## 5. GitHub Synchronization
To automatically upload code changes to GitHub, run the following command in PowerShell:
```powershell
.\scripts\sync-github.ps1
```
This will:
1. Check for changes in `C:\layerfilm`.
2. Add all new files (respecting `.gitignore`).
3. Commit with a timestamp.
4. Push to the `main` branch.

### Continuous Auto-Sync
To keep GitHub in sync automatically (checked every 60 seconds), run:
```powershell
.\scripts\watch-and-sync.ps1
```
Keep this window open (or minimized) while you work. It will automatically add, commit, and push any changes you make.


