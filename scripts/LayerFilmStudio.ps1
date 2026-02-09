Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

# --- Environment ---
$PYTHON_PATH = "c:\layerfilm\.venv\Scripts\python.exe"
$SD_SCRIPT = "c:\layerfilm\scripts\local-sd-generate.py"
$SVD_SCRIPT = "c:\layerfilm\scripts\generate-recursive-chain.ps1"
$Z_DRIVE = "Z:\layerfilm\studio"
if (!(Test-Path $Z_DRIVE)) { New-Item -ItemType Directory -Path $Z_DRIVE -Force }

# --- Branding & HUD Colors ---
$NEON_CYAN = [Drawing.Color]::FromArgb(0, 245, 255)
$NEON_PURPLE = [Drawing.Color]::FromArgb(160, 32, 240)
$HUD_BG = [Drawing.Color]::FromArgb(5, 7, 10) # Dark Navy Black
$PANEL_BORDER = [Drawing.Color]::FromArgb(40, 40, 40)
$ACCENT_GLOW = [Drawing.Color]::FromArgb(30, 0, 245, 255)

# --- Form Construction ---
$form = New-Object Windows.Forms.Form
$form.Text = "LAYERFILM DIRECTOR OS // CINEMA REACTOR v4.0"
$form.Size = New-Object Drawing.Size(1100, 950)
$form.BackColor = $HUD_BG
$form.ForeColor = [Drawing.Color]::White
$form.Font = New-Object Drawing.Font("Segoe UI Semibold", 10)
$form.StartPosition = "CenterScreen"
$form.FormBorderStyle = "FixedSingle"
$form.MaximizeBox = $false

# 1. HEADER HUD
$pnlHeader = New-Object Windows.Forms.Panel
$pnlHeader.Dock = "Top"
$pnlHeader.Height = 80
$pnlHeader.BackColor = [Drawing.Color]::FromArgb(10, 15, 25)
$form.Controls.Add($pnlHeader)

$lblStatus = New-Object Windows.Forms.Label
$lblStatus.Text = "● SYSTEM OPERATIONAL // CONNECTION: ENCRYPTED // AI CORE: ACTIVE"
$lblStatus.ForeColor = [Drawing.Color]::LimeGreen
$lblStatus.Font = New-Object Drawing.Font("Consolas", 8)
$lblStatus.Location = New-Object Drawing.Point(30, 5)
$lblStatus.AutoSize = $true
$pnlHeader.Controls.Add($lblStatus)

$lblLogo = New-Object Windows.Forms.Label
$lblLogo.Text = "LAYERFILM"
$lblLogo.Font = New-Object Drawing.Font("Segoe UI Black", 28, [Drawing.FontStyle]::Italic)
$lblLogo.ForeColor = $NEON_CYAN
$lblLogo.Location = New-Object Drawing.Point(25, 20)
$lblLogo.Size = New-Object Drawing.Size(300, 50)
$pnlHeader.Controls.Add($lblLogo)

$lblDirector = New-Object Windows.Forms.Label
$lblDirector.Text = "DIRECTOR EDITION"
$lblDirector.Font = New-Object Drawing.Font("Segoe UI Semibold", 10, [Drawing.FontStyle]::Bold)
$lblDirector.ForeColor = $NEON_PURPLE
$lblDirector.Location = New-Object Drawing.Point(285, 45)
$lblDirector.AutoSize = $true
$pnlHeader.Controls.Add($lblDirector)

# 2. MAIN HUB (Center Space)
$mainHub = New-Object Windows.Forms.Panel
$mainHub.Dock = "Fill"
$mainHub.Padding = New-Object Windows.Forms.Padding(30)
$form.Controls.Add($mainHub)

# --- SECTION: THE REACTOR (One-Click Interface) ---
$pnlReactor = New-Object Windows.Forms.Panel
$pnlReactor.Dock = "Top"
$pnlReactor.Height = 280
$pnlReactor.BackColor = [Drawing.Color]::FromArgb(15, 20, 30)
$pnlReactor.BorderStyle = "FixedSingle"
$mainHub.Controls.Add($pnlReactor)

$lblReactorTitle = New-Object Windows.Forms.Label
$lblReactorTitle.Text = "CINEMA REACTOR: ONE-CLICK PRODUCTION"
$lblReactorTitle.Font = New-Object Drawing.Font("Segoe UI", 12, [Drawing.FontStyle]::Bold)
$lblReactorTitle.ForeColor = $NEON_CYAN
$lblReactorTitle.Location = New-Object Drawing.Point(20, 20)
$lblReactorTitle.AutoSize = $true
$pnlReactor.Controls.Add($lblReactorTitle)

$txtMasterPrompt = New-Object Windows.Forms.TextBox
$txtMasterPrompt.Multiline = $true
$txtMasterPrompt.Location = New-Object Drawing.Point(20, 55)
$txtMasterPrompt.Size = New-Object Drawing.Size(1000, 100)
$txtMasterPrompt.BackColor = [Drawing.Color]::FromArgb(5, 5, 5)
$txtMasterPrompt.ForeColor = [Drawing.Color]::White
$txtMasterPrompt.BorderStyle = "FixedSingle"
$txtMasterPrompt.Font = New-Object Drawing.Font("Segoe UI", 14)
$txtMasterPrompt.Text = "A rainy cyberpunk city at night, camera slowly zooming into a neon bar sign..."
$pnlReactor.Controls.Add($txtMasterPrompt)

$btnGenerate = New-Object Windows.Forms.Button
$btnGenerate.Text = "INITIALIZE TOTAL MASTERPIECE PROTOCOL"
$btnGenerate.Font = New-Object Drawing.Font("Segoe UI", 18, [Drawing.FontStyle]::Bold)
$btnGenerate.Location = New-Object Drawing.Point(20, 175)
$btnGenerate.Size = New-Object Drawing.Size(1000, 80)
$btnGenerate.BackColor = $NEON_CYAN
$btnGenerate.ForeColor = [Drawing.Color]::Black
$btnGenerate.FlatStyle = "Flat"
$btnGenerate.Cursor = "Hand"
$pnlReactor.Controls.Add($btnGenerate)

# --- BOTTOM ROW: Preview & Advanced & Logs ---
$pnlBottom = New-Object Windows.Forms.Panel
$pnlBottom.Dock = "Bottom"
$pnlBottom.Height = 520
$mainHub.Controls.Add($pnlBottom)

# Left: Preview (Visual Check)
$pnlVisuals = New-Object Windows.Forms.Panel
$pnlVisuals.Width = 650
$pnlVisuals.Dock = "Left"
$pnlBottom.Controls.Add($pnlVisuals)

$lblPrev = New-Object Windows.Forms.Label
$lblPrev.Text = "LIVE VISUAL MONITOR"
$lblPrev.Location = New-Object Drawing.Point(0, 20); $lblPrev.AutoSize = $true; $pnlVisuals.Controls.Add($lblPrev)

$picPreview = New-Object Windows.Forms.PictureBox
$picPreview.Location = New-Object Drawing.Point(0, 45)
$picPreview.Size = New-Object Drawing.Size(630, 354) # 16:9
$picPreview.BackColor = [Drawing.Color]::Black
$picPreview.BorderStyle = "FixedSingle"
$picPreview.SizeMode = "Zoom"
$pnlVisuals.Controls.Add($picPreview)

# Right: Advanced Controls (Hidden by default or smaller)
$pnlSystem = New-Object Windows.Forms.Panel
$pnlSystem.Dock = "Fill"
$pnlBottom.Controls.Add($pnlSystem)

$lblSettings = New-Object Windows.Forms.Label
$lblSettings.Text = "CORE PARAMETERS"
$lblSettings.Location = New-Object Drawing.Point(20, 20); $lblSettings.AutoSize = $true; $pnlSystem.Controls.Add($lblSettings)

$y_set = 45
$lblD = New-Object Windows.Forms.Label; $lblD.Text = "Duration (s):"; $lblD.Location = New-Object Drawing.Point(20, $y_set); $pnlSystem.Controls.Add($lblD)
$numSec = New-Object Windows.Forms.NumericUpDown; $numSec.Location = New-Object Drawing.Point(130, $y_set); $numSec.Value = 7; $pnlSystem.Controls.Add($numSec)
$y_set += 35
$lblM = New-Object Windows.Forms.Label; $lblM.Text = "Motion Scale:"; $lblM.Location = New-Object Drawing.Point(20, $y_set); $pnlSystem.Controls.Add($lblM)
$numMot = New-Object Windows.Forms.NumericUpDown; $numMot.Location = New-Object Drawing.Point(130, $y_set); $numMot.Value = 40; $numMot.Maximum = 255; $pnlSystem.Controls.Add($numMot)
$y_set += 35
$lblN = New-Object Windows.Forms.Label; $lblN.Text = "Stability:"; $lblN.Location = New-Object Drawing.Point(20, $y_set); $pnlSystem.Controls.Add($lblN)
$numNoi = New-Object Windows.Forms.NumericUpDown; $numNoi.Location = New-Object Drawing.Point(130, $y_set); $numNoi.DecimalPlaces = 1; $numNoi.Value = 0.2; $pnlNoi = 1; $pnlSystem.Controls.Add($numNoi)

# Log Box at bottom of System Panel
$txtLog = New-Object Windows.Forms.TextBox
$txtLog.Multiline = $true
$txtLog.ReadOnly = $true
$txtLog.ScrollBars = "Vertical"
$txtLog.Location = New-Object Drawing.Point(20, 160)
$txtLog.Size = New-Object Drawing.Size(350, 240)
$txtLog.BackColor = [Drawing.Color]::FromArgb(5, 5, 5)
$txtLog.ForeColor = [Drawing.Color]::LimeGreen
$txtLog.Font = New-Object Drawing.Font("Consolas", 9)
$txtLog.BorderStyle = "FixedSingle"
$txtLog.Text = ">>> DIRECTOR OS ONLINE.`r`n>>> AWAITING COMMAND...`r`n"
$pnlSystem.Controls.Add($txtLog)

# --- EVENTS ---

$btnGenerate.Add_Click({
        $p = $txtMasterPrompt.Text
        if ([string]::IsNullOrWhiteSpace($p)) { return }

        $btnGenerate.Enabled = $false
        $btnGenerate.BackColor = [Drawing.Color]::Gray
        $btnGenerate.Text = "REACTOR HEATING UP... PLEASE WAIT"
    
        $txtLog.Clear()
        $txtLog.AppendText(">>> [1/2] NEURAL RENDERING: BASE IMAGE...`r`n")
    
        $outImg = Join-Path $Z_DRIVE "director_base_$(Get-Date -Format 'HHmmss').png"
        $outVid = Join-Path $Z_DRIVE "masterpiece_$(Get-Date -Format 'HHmmss').mp4"
        $sec = $numSec.Value
        $mot = $numMot.Value
        $noi = $numNoi.Value

        # STEP 1: Image Generation
        $jobImg = Start-Job -ScriptBlock {
            param($py, $sc, $p, $out)
            & $py $sc --prompt $p --output $out --steps 35
        } -ArgumentList $PYTHON_PATH, $SD_SCRIPT, $p, $outImg

        while ($jobImg.State -eq "Running") { [System.Windows.Forms.Application]::DoEvents(); Start-Sleep -Milliseconds 200 }
    
        if (Test-Path $outImg) {
            $picPreview.Image = [Drawing.Image]::FromFile($outImg)
            $txtLog.AppendText(">>> [SUCCESS] IMAGE CAPTURED.`r`n")
            $txtLog.AppendText(">>> [2/2] MOTION CHAINING: 3-SECOND LAW PROTOCOL...`r`n")

            # STEP 2: Video Generation (Chaining)
            $jobVid = Start-Job -ScriptBlock {
                param($sc, $img, $p, $out, $sec, $m, $n)
                powershell -ExecutionPolicy Bypass -File $sc -BaseImage $img -Prompt $p -OutputVideo $out -TotalSeconds $sec
            } -ArgumentList $SVD_SCRIPT, $outImg, $p, $outVid, $sec, $mot, $noi

            # Update log with job progress lines if possible, but for now just wait
            while ($jobVid.State -eq "Running") { [System.Windows.Forms.Application]::DoEvents(); Start-Sleep -Milliseconds 500 }
        
            $txtLog.AppendText(">>> [COMPLETE] MASTERPIECE READY: $outVid`r`n")
            [Windows.Forms.MessageBox]::Show("Production Complete!`nSaved to: $outVid")
        }
        else {
            $txtLog.AppendText(">>> [ERROR] RENDERING FAILED. ABORTED.`r`n")
        }

        $btnGenerate.Enabled = $true
        $btnGenerate.BackColor = $NEON_CYAN
        $btnGenerate.Text = "INITIALIZE TOTAL MASTERPIECE PROTOCOL"
    })

# Launch GUI
$form.ShowDialog()
