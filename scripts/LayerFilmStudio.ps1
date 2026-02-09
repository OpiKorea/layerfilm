Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

$Z_ROOT = "Z:\layerfilm\studio"
$IMG_DIR = Join-Path $Z_ROOT "exports\images"
$VID_DIR = Join-Path $Z_ROOT "exports\videos"
$SVD_PS = "c:\layerfilm\scripts\generate-recursive-chain.ps1"
$VENV_PY = "c:\layerfilm\.venv\Scripts\python.exe"
$SD_PY = "c:\layerfilm\scripts\local-sd-generate.py"

foreach ($dir in @($IMG_DIR, $VID_DIR)) {
    if (!(Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }
}

# --- Aesthetic Tokens ---
$COLOR_ACCENT = [Drawing.Color]::FromArgb(0, 245, 255)
$COLOR_PURPLE = [Drawing.Color]::FromArgb(160, 32, 240)
$COLOR_BG = [Drawing.Color]::FromArgb(6, 7, 10)
$COLOR_PANEL = [Drawing.Color]::FromArgb(15, 18, 25)

$form = New-Object Windows.Forms.Form
$form.Text = "LAYERFILM STUDIO v11.0 // PRO DIRECTOR"
$form.Size = New-Object Drawing.Size(1250, 1000)
$form.BackColor = $COLOR_BG
$form.ForeColor = [Drawing.Color]::White
$form.Font = New-Object Drawing.Font("Segoe UI", 10)
$form.StartPosition = "CenterScreen"
$form.FormBorderStyle = "FixedSingle"
$form.MaximizeBox = $false

# -> 1. HEADER
$pnlHeader = New-Object Windows.Forms.Panel
$pnlHeader.Location = New-Object Drawing.Point(0, 0); $pnlHeader.Size = New-Object Drawing.Size(1250, 100); $pnlHeader.BackColor = [Drawing.Color]::FromArgb(8, 8, 10)
$form.Controls.Add($pnlHeader)

$lblLogo = New-Object Windows.Forms.Label; $lblLogo.Text = "LAYERFILM"; $lblLogo.Font = New-Object Drawing.Font("Segoe UI Black", 30, [Drawing.FontStyle]::Italic); $lblLogo.ForeColor = $COLOR_ACCENT; $lblLogo.Location = New-Object Drawing.Point(40, 20); $lblLogo.AutoSize = $true; $pnlHeader.Controls.Add($lblLogo)
$lblSub = New-Object Windows.Forms.Label; $lblSub.Text = "CINEMA ENGINE // v11.0 PRO"; $lblSub.Font = New-Object Drawing.Font("Segoe UI", 10, [Drawing.FontStyle]::Bold); $lblSub.ForeColor = $COLOR_PURPLE; $lblSub.Location = New-Object Drawing.Point(320, 45); $lblSub.AutoSize = $true; $pnlHeader.Controls.Add($lblSub)

$btnOpenFolder = New-Object Windows.Forms.Button; $btnOpenFolder.Text = "📂 Open Video Exports (Z:)"; $btnOpenFolder.Location = New-Object Drawing.Point(950, 35); $btnOpenFolder.Size = New-Object Drawing.Size(240, 40); $btnOpenFolder.BackColor = [Drawing.Color]::FromArgb(25, 25, 35); $btnOpenFolder.ForeColor = [Drawing.Color]::White; $btnOpenFolder.FlatStyle = "Flat"; $btnOpenFolder.Cursor = "Hand"
$pnlHeader.Controls.Add($btnOpenFolder)

# --- Logic ---
$btnOpenFolder.Add_Click({ explorer $VID_DIR })

# -> 2. SIDEBAR (LOGS & SETTINGS)
$pnlSide = New-Object Windows.Forms.Panel; $pnlSide.Location = New-Object Drawing.Point(40, 140); $pnlSide.Size = New-Object Drawing.Size(320, 800); $pnlSide.BackColor = $COLOR_PANEL; $pnlSide.BorderStyle = "FixedSingle"; $form.Controls.Add($pnlSide)

$sy = 20
$lblCfg = New-Object Windows.Forms.Label; $lblCfg.Text = "[ ENGINE CONFIG ]"; $lblCfg.ForeColor = $COLOR_PURPLE; $lblCfg.Location = New-Object Drawing.Point(20, $sy); $pnlSide.Controls.Add($lblCfg); $sy += 40

$lblD = New-Object Windows.Forms.Label; $lblD.Text = "Duration (s):"; $lblD.Location = New-Object Drawing.Point(20, $sy); $pnlSide.Controls.Add($lblD)
$numSec = New-Object Windows.Forms.NumericUpDown; $numSec.Location = New-Object Drawing.Point(180, $sy); $numSec.Size = New-Object Drawing.Size(100, 25); $numSec.Value = 7; $pnlSide.Controls.Add($numSec); $sy += 40

$lblM = New-Object Windows.Forms.Label; $lblM.Text = "Motion Scale:"; $lblM.Location = New-Object Drawing.Point(20, $sy); $pnlSide.Controls.Add($lblM)
$numMot = New-Object Windows.Forms.NumericUpDown; $numMot.Location = New-Object Drawing.Point(180, $sy); $numMot.Size = New-Object Drawing.Size(100, 25); $numMot.Value = 42; $numMot.Maximum = 255; $pnlSide.Controls.Add($numMot); $sy += 40

$lblN = New-Object Windows.Forms.Label; $lblN.Text = "Stability (Noise):"; $lblN.Location = New-Object Drawing.Point(20, $sy); $pnlSide.Controls.Add($lblN)
$numNoi = New-Object Windows.Forms.NumericUpDown; $numNoi.Location = New-Object Drawing.Point(180, $sy); $numNoi.Size = New-Object Drawing.Size(100, 25); $numNoi.DecimalPlaces = 1; $numNoi.Value = 0.2; $numNoi.Maximum = 1; $numNoi.Increment = 0.1; $pnlSide.Controls.Add($numNoi); $sy += 60

$lblL = New-Object Windows.Forms.Label; $lblL.Text = "[ CINEMA LOGS ]"; $lblL.ForeColor = $COLOR_PURPLE; $lblL.Location = New-Object Drawing.Point(20, $sy); $pnlSide.Controls.Add($lblL); $sy += 30
$txtLog = New-Object Windows.Forms.TextBox; $txtLog.Multiline = $true; $txtLog.ReadOnly = $true; $txtLog.ScrollBars = "Vertical"; $txtLog.Location = New-Object Drawing.Point(20, $sy); $txtLog.Size = New-Object Drawing.Size(280, 480); $txtLog.BackColor = [Drawing.Color]::Black; $txtLog.ForeColor = [Drawing.Color]::Lime; $txtLog.BorderStyle = "None"; $txtLog.Font = New-Object Drawing.Font("Consolas", 8)
$txtLog.Text = ">>> ENGINE ONLINE.`r`n>>> CINEMA BRAIN: SYNCED.`r`n>>> READY FOR ONE-CLICK MASTERPIECE.`r`n"
$pnlSide.Controls.Add($txtLog)

# -> 3. PRODUCTION AREA (RIGHT)
$pnlProd = New-Object Windows.Forms.Panel; $pnlProd.Location = New-Object Drawing.Point(400, 140); $pnlProd.Size = New-Object Drawing.Size(800, 800); $form.Controls.Add($pnlProd)

# 3A. MAIN COMMAND (PRIORITY)
$pnlReactor = New-Object Windows.Forms.Panel; $pnlReactor.Location = New-Object Drawing.Point(0, 0); $pnlReactor.Size = New-Object Drawing.Size(800, 200); $pnlReactor.BackColor = [Drawing.Color]::FromArgb(20, 22, 30); $pnlReactor.BorderStyle = "FixedSingle"; $pnlProd.Controls.Add($pnlReactor)

$lblR = New-Object Windows.Forms.Label; $lblR.Text = "DIRECTORIAL PROMPT (ONE-CLICK)"; $lblR.Font = New-Object Drawing.Font("Segoe UI", 12, [Drawing.FontStyle]::Bold); $lblR.ForeColor = $COLOR_ACCENT; $lblR.Location = New-Object Drawing.Point(20, 20); $lblR.AutoSize = $true; $pnlReactor.Controls.Add($lblR)
$txtPrompt = New-Object Windows.Forms.TextBox; $txtPrompt.Multiline = $true; $txtPrompt.Location = New-Object Drawing.Point(20, 55); $txtPrompt.Size = New-Object Drawing.Size(750, 70); $txtPrompt.BackColor = [Drawing.Color]::Black; $txtPrompt.ForeColor = [Drawing.Color]::White; $txtPrompt.Font = New-Object Drawing.Font("Segoe UI", 16); $txtPrompt.Text = "Epic cyberpunk scene..."; $pnlReactor.Controls.Add($txtPrompt)

$btnExec = New-Object Windows.Forms.Button; $btnExec.Text = "START ONE-CLICK AUTOMATION"; $btnExec.Location = New-Object Drawing.Point(20, 135); $btnExec.Size = New-Object Drawing.Size(750, 50); $btnExec.BackColor = $COLOR_ACCENT; $btnExec.ForeColor = [Drawing.Color]::Black; $btnExec.FlatStyle = "Flat"; $btnExec.Font = New-Object Drawing.Font("Segoe UI", 12, [Drawing.FontStyle]::Bold); $pnlReactor.Controls.Add($btnExec)

$lblProgress = New-Object Windows.Forms.Label; $lblProgress.Text = "IDLE"; $lblProgress.ForeColor = $COLOR_ACCENT; $lblProgress.Font = New-Object Drawing.Font("Segoe UI", 9, [Drawing.FontStyle]::Bold); $lblProgress.Location = New-Object Drawing.Point(580, 25); $lblProgress.Size = New-Object Drawing.Size(180, 20); $lblProgress.TextAlign = "MiddleRight"; $pnlReactor.Controls.Add($lblProgress)

# 3B. OPTIONAL ASSETS (BOTTOM)
$pnlOptional = New-Object Windows.Forms.Panel; $pnlOptional.Location = New-Object Drawing.Point(0, 220); $pnlOptional.Size = New-Object Drawing.Size(800, 80); $pnlOptional.BackColor = [Drawing.Color]::FromArgb(10, 12, 16); $pnlProd.Controls.Add($pnlOptional)
$lblOpt = New-Object Windows.Forms.Label; $lblOpt.Text = "OPTIONAL: EXTERNAL IMAGE SOURCE (OVERRIDE AI GENERATION)"; $lblOpt.ForeColor = [Drawing.Color]::Gray; $lblOpt.Font = New-Object Drawing.Font("Segoe UI", 7, [Drawing.FontStyle]::Bold); $lblOpt.Location = New-Object Drawing.Point(20, 10); $lblOpt.AutoSize = $true; $pnlOptional.Controls.Add($lblOpt)
$txtImgPath = New-Object Windows.Forms.TextBox; $txtImgPath.Location = New-Object Drawing.Point(20, 35); $txtImgPath.Size = New-Object Drawing.Size(630, 25); $txtImgPath.BackColor = [Drawing.Color]::Black; $txtImgPath.ForeColor = [Drawing.Color]::Gray; $pnlOptional.Controls.Add($txtImgPath)
$btnBrowse = New-Object Windows.Forms.Button; $btnBrowse.Text = "Browse"; $btnBrowse.Location = New-Object Drawing.Point(670, 33); $btnBrowse.Size = New-Object Drawing.Size(100, 28); $pnlOptional.Controls.Add($btnBrowse)

# 3C. MONITOR
$pnlMonitor = New-Object Windows.Forms.Panel; $pnlMonitor.Location = New-Object Drawing.Point(0, 320); $pnlMonitor.Size = New-Object Drawing.Size(800, 480); $pnlMonitor.BackColor = [Drawing.Color]::Black; $pnlMonitor.BorderStyle = "FixedSingle"; $pnlProd.Controls.Add($pnlMonitor)
$picMon = New-Object Windows.Forms.PictureBox; $picMon.Location = New-Object Drawing.Point(10, 10); $picMon.Size = New-Object Drawing.Size(780, 460); $picMon.SizeMode = "Zoom"; $picMon.BackColor = [Drawing.Color]::Black; $pnlMonitor.Controls.Add($picMon)

# --- Logic ---
$btnBrowse.Add_Click({
        $fd = New-Object Windows.Forms.OpenFileDialog
        if ($fd.ShowDialog() -eq "OK") { $txtImgPath.Text = $fd.FileName; $txtImgPath.ForeColor = [Drawing.Color]::White }
    })

$btnExec.Add_Click({
        $p = $txtPrompt.Text
        $imgPath = $txtImgPath.Text
        $btnExec.Enabled = $false; $txtLog.AppendText(">>> [MSG] Director Initialized...`r`n")
    
        $outBase = Join-Path $IMG_DIR "base_$(Get-Date -Format 'HHmmss').png"
        $outVid = Join-Path $VID_DIR "masterpiece_$(Get-Date -Format 'HHmmss').mp4"
        $targetImg = ""

        # Phase 1: AI Base Establishing
        if (![string]::IsNullOrWhiteSpace($imgPath) -and (Test-Path $imgPath)) {
            $txtLog.AppendText(">>> [INFO] Using External Asset: $(Split-Path $imgPath -Leaf)`r`n")
            $targetImg = $imgPath
        }
        else {
            $txtLog.AppendText(">>> [INFO] AI Generating Cinematic Base...`r`n")
            $jobImg = Start-Job -ScriptBlock { param($py, $sc, $p, $o) & $py $sc --prompt $p --output $o --steps 30 } -ArgumentList $VENV_PY, $SD_PY, $p, $outBase
            
            while ($jobImg.State -eq "Running") {
                [System.Windows.Forms.Application]::DoEvents()
                $out = Receive-Job -Job $jobImg
                if ($out) { 
                    foreach ($line in $out) { 
                        if ($line -match "\[PROGRESS\] (\d+)/(\d+)") {
                            $step = $Matches[1]; $total = $Matches[2]; $pct = [int](($step / $total) * 100)
                            $lblProgress.Text = "GENERATING BASE: $pct%"
                        }
                        else {
                            $txtLog.AppendText(">>> [PY] $line`r`n") 
                        }
                    } 
                }
                Start-Sleep -Milliseconds 300
            }
            $lblProgress.Text = "SYNCING ASSETS..."
            # Final drain
            $finalOut = Receive-Job -Job $jobImg
            if ($finalOut) { foreach ($line in $finalOut) { $txtLog.AppendText(">>> [PY] $line`r`n") } }
            
            if (Test-Path $outBase) { $targetImg = $outBase }
            else {
                $txtLog.AppendText(">>> [ERROR] Base image generation failed. Check Python logs above.`r`n")
            }
        }

        if (![string]::IsNullOrEmpty($targetImg)) {
            $picMon.Image = [Drawing.Image]::FromFile($targetImg)
            $txtLog.AppendText(">>> [INFO] Base Image Synchronized.`r`n")

            # Phase 2: Video Chaining
            $jobVid = Start-Job -ScriptBlock {
                param($sc, $img, $p, $out, $sec, $mot, $noi)
                powershell -ExecutionPolicy Bypass -File $sc -BaseImage $img -Prompt $p -OutputVideo $out -TotalSeconds $sec -Motion $mot -Noise $noi
            } -ArgumentList $SVD_PS, $targetImg, $p, $outVid, $numSec.Value, $numMot.Value, $numNoi.Value

            while ($jobVid.State -eq "Running") {
                [System.Windows.Forms.Application]::DoEvents(); Start-Sleep -Milliseconds 1000
                $f = Get-ChildItem "Z:\layerfilm\temp\chaining\*_last.png" | Sort-Object LastWriteTime -Descending | Select-Object -First 1
                if ($f) { try { $picMon.Image = [Drawing.Image]::FromFile($f.FullName); $txtLog.AppendText(">>> [SYNC] Frame 캡처 완료.`r`n") } catch {} }
            }
            [Windows.Forms.MessageBox]::Show("Masterpiece Production Finalized!`nLocation: $outVid")
        }
        else {
            $txtLog.AppendText(">>> [ERROR] Critical: No Base Image. Check AI logs.`r`n")
        }
        $btnExec.Enabled = $true
    })

$form.ShowDialog() | Out-Null
