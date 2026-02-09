Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

# --- Configuration ---
$PYTHON_PATH = "c:\layerfilm\.venv\Scripts\python.exe"
$SD_SCRIPT = "c:\layerfilm\scripts\local-sd-generate.py"
$VIDEO_SCRIPT = "c:\layerfilm\scripts\generate-recursive-chain.ps1"
$TEMP_DIR = "Z:\layerfilm\studio"
if (!(Test-Path $TEMP_DIR)) { New-Item -ItemType Directory -Path $TEMP_DIR -Force }

# --- Form Setup ---
$form = New-Object Windows.Forms.Form
$form.Text = "LayerFilm Studio PRO - AI Cinema Engine"
$form.Size = New-Object Drawing.Size(800, 950)
$form.StartPosition = "CenterScreen"
$form.BackColor = [Drawing.Color]::FromArgb(5, 5, 5) # Deep Black
$form.ForeColor = [Drawing.Color]::White
$form.Font = New-Object Drawing.Font("Segoe UI", 10)
$form.FormBorderStyle = "FixedDialog"
$form.MaximizeBox = $false

# --- Header Section ---
$pnlHeader = New-Object Windows.Forms.Panel
$pnlHeader.Dock = "Top"
$pnlHeader.Height = 100
$pnlHeader.BackColor = [Drawing.Color]::FromArgb(15, 15, 15)
$form.Controls.Add($pnlHeader)

$titleLine1 = New-Object Windows.Forms.Label
$titleLine1.Text = "LAYERFILM"
$titleLine1.Font = New-Object Drawing.Font("Segoe UI", 28, [Drawing.FontStyle]::Bold)
$titleLine1.ForeColor = [Drawing.Color]::FromArgb(0, 245, 255) # Neon Cyan
$titleLine1.Size = New-Object Drawing.Size(400, 50)
$titleLine1.Location = New-Object Drawing.Point(30, 25)
$pnlHeader.Controls.Add($titleLine1)

$titleLine2 = New-Object Windows.Forms.Label
$titleLine2.Text = "STUDIO PRO"
$titleLine2.Font = New-Object Drawing.Font("Segoe UI", 14, [Drawing.FontStyle]::Bold)
$titleLine2.ForeColor = [Drawing.Color]::FromArgb(160, 32, 240) # Neon Purple
$titleLine2.Location = New-Object Drawing.Point(260, 45)
$titleLine2.Size = New-Object Drawing.Size(200, 30)
$pnlHeader.Controls.Add($titleLine2)

# --- Scrollable Container ---
$container = New-Object Windows.Forms.Panel
$container.Dock = "Fill"
$container.AutoScroll = $true
$container.Padding = New-Object Windows.Forms.Padding(30)
$form.Controls.Add($container)

$y = 20

# --- STEP 1: IMAGE GENERATION ---
$lblStep1 = New-Object Windows.Forms.Label
$lblStep1.Text = "01. VISUAL FOUNDATION (AI IMAGE)"
$lblStep1.Font = New-Object Drawing.Font("Segoe UI", 12, [Drawing.FontStyle]::Bold)
$lblStep1.ForeColor = [Drawing.Color]::White
$lblStep1.Location = New-Object Drawing.Point(30, $y)
$lblStep1.Size = New-Object Drawing.Size(500, 30)
$container.Controls.Add($lblStep1)
$y += 40

$txtImgPrompt = New-Object Windows.Forms.TextBox
$txtImgPrompt.Multiline = $true
$txtImgPrompt.PlaceholderText = "Describe your base scene (e.g., A rainy cyberpunk street at night...)"
$txtImgPrompt.Location = New-Object Drawing.Point(30, $y)
$txtImgPrompt.Size = New-Object Drawing.Size(500, 60)
$txtImgPrompt.BackColor = [Drawing.Color]::FromArgb(20, 20, 20)
$txtImgPrompt.ForeColor = [Drawing.Color]::White
$txtImgPrompt.BorderStyle = "FixedSingle"
$container.Controls.Add($txtImgPrompt)

$btnGenImage = New-Object Windows.Forms.Button
$btnGenImage.Text = "AUTO-GENERATE"
$btnGenImage.Location = New-Object Drawing.Point(540, $y)
$btnGenImage.Size = New-Object Drawing.Size(180, 60)
$btnGenImage.BackColor = [Drawing.Color]::FromArgb(160, 32, 240)
$btnGenImage.FlatStyle = "Flat"
$btnGenImage.Font = New-Object Drawing.Font("Segoe UI", 10, [Drawing.FontStyle]::Bold)
$container.Controls.Add($btnGenImage)
$y += 80

# Image Preview Area
$picPreview = New-Object Windows.Forms.PictureBox
$picPreview.Location = New-Object Drawing.Point(30, $y)
$picPreview.Size = New-Object Drawing.Size(690, 388) # 16:9 aspect ratio
$picPreview.BackColor = [Drawing.Color]::FromArgb(10, 10, 10)
$picPreview.BorderStyle = "FixedSingle"
$picPreview.SizeMode = "Zoom"
$container.Controls.Add($picPreview)
$y += 410

# Path display
$txtImagePath = New-Object Windows.Forms.TextBox
$txtImagePath.ReadOnly = $true
$txtImagePath.Location = New-Object Drawing.Point(30, $y)
$txtImagePath.Size = New-Object Drawing.Size(690, 25)
$txtImagePath.BackColor = [Drawing.Color]::FromArgb(15, 15, 15)
$txtImagePath.ForeColor = [Drawing.Color]::Gray
$txtImagePath.BorderStyle = "None"
$container.Controls.Add($txtImagePath)
$y += 50

# --- STEP 2: VIDEO MOTION ---
$lblStep2 = New-Object Windows.Forms.Label
$lblStep2.Text = "02. CINEMATIC MOTION (3-SECOND LAW)"
$lblStep2.Font = New-Object Drawing.Font("Segoe UI", 12, [Drawing.FontStyle]::Bold)
$lblStep2.ForeColor = [Drawing.Color]::White
$lblStep2.Location = New-Object Drawing.Point(30, $y)
$lblStep2.Size = New-Object Drawing.Size(500, 30)
$container.Controls.Add($lblStep2)
$y += 40

$txtVidPrompt = New-Object Windows.Forms.TextBox
$txtVidPrompt.Multiline = $true
$txtVidPrompt.PlaceholderText = "Describe the motion (e.g., Camera slowly zooms in, neon lights flicker...)"
$txtVidPrompt.Location = New-Object Drawing.Point(30, $y)
$txtVidPrompt.Size = New-Object Drawing.Size(690, 60)
$txtVidPrompt.BackColor = [Drawing.Color]::FromArgb(20, 20, 20)
$txtVidPrompt.ForeColor = [Drawing.Color]::White
$txtVidPrompt.BorderStyle = "FixedSingle"
$container.Controls.Add($txtVidPrompt)
$y += 80

# Settings Row
$panelSettings = New-Object Windows.Forms.Panel
$panelSettings.Location = New-Object Drawing.Point(30, $y)
$panelSettings.Size = New-Object Drawing.Size(690, 60)
$container.Controls.Add($panelSettings)

$lblDur = New-Object Windows.Forms.Label
$lblDur.Text = "DURATION (S)"
$lblDur.Location = New-Object Drawing.Point(0, 0)
$lblDur.ForeColor = [Drawing.Color]::Gray
$panelSettings.Controls.Add($lblDur)

$numSeconds = New-Object Windows.Forms.NumericUpDown
$numSeconds.Location = New-Object Drawing.Point(0, 25)
$numSeconds.Size = New-Object Drawing.Size(80, 25)
$numSeconds.Value = 7
$numSeconds.BackColor = [Drawing.Color]::FromArgb(20, 20, 20)
$numSeconds.ForeColor = [Drawing.Color]::White
$panelSettings.Controls.Add($numSeconds)

$btnExecute = New-Object Windows.Forms.Button
$btnExecute.Text = "EXECUTE CINEMA PROTOCOL"
$btnExecute.Location = New-Object Drawing.Point(120, 0)
$btnExecute.Size = New-Object Drawing.Size(570, 50)
$btnExecute.BackColor = [Drawing.Color]::FromArgb(0, 245, 255)
$btnExecute.ForeColor = [Drawing.Color]::Black
$btnExecute.FlatStyle = "Flat"
$btnExecute.Font = New-Object Drawing.Font("Segoe UI", 14, [Drawing.FontStyle]::Bold)
$panelSettings.Controls.Add($btnExecute)
$y += 80

# --- Log Box ---
$txtLog = New-Object Windows.Forms.TextBox
$txtLog.Multiline = $true
$txtLog.ReadOnly = $true
$txtLog.ScrollBars = "Vertical"
$txtLog.Location = New-Object Drawing.Point(30, $y)
$txtLog.Size = New-Object Drawing.Size(690, 150)
$txtLog.BackColor = [Drawing.Color]::Black
$txtLog.ForeColor = [Drawing.Color]::FromArgb(0, 255, 0)
$txtLog.Font = New-Object Drawing.Font("Consolas", 9)
$txtLog.Text = "LAYERFILM OS [Version 10.0] Ready.`r`n"
$container.Controls.Add($txtLog)
$y += 180

# Dummy spacer for scrolling
$spacer = New-Object Windows.Forms.Label
$spacer.Location = New-Object Drawing.Point(30, $y)
$spacer.Size = New-Object Drawing.Size(10, 20)
$container.Controls.Add($spacer)

# --- Events ---

$btnGenImage.Add_Click({
        $prompt = $txtImgPrompt.Text
        if ([string]::IsNullOrWhiteSpace($prompt)) { 
            [Windows.Forms.MessageBox]::Show("Please enter an image prompt first.")
            return 
        }

        $btnGenImage.Enabled = $false
        $btnGenImage.Text = "GENERATING..."
        $txtLog.AppendText("🎨 Requesting AI Image: '$prompt'...`r`n")

        $outImg = Join-Path $TEMP_DIR "base_$(Get-Date -Format 'HHmmss').png"

        $job = Start-Job -ScriptBlock {
            param($py, $sc, $p, $out)
            & $py $sc --prompt $p --output $out
        } -ArgumentList $PYTHON_PATH, $SD_SCRIPT, $prompt, $outImg

        while ($job.State -eq "Running") {
            [System.Windows.Forms.Application]::DoEvents()
            Start-Sleep -Milliseconds 200
        }

        $results = Receive-Job -Job $job
        if (Test-Path $outImg) {
            $picPreview.Image = [Drawing.Image]::FromFile($outImg)
            $txtImagePath.Text = $outImg
            $txtLog.AppendText("✅ Image Ready: $outImg`r`n")
        }
        else {
            $txtLog.AppendText("❌ Generation Failed: $results`r`n")
        }

        $btnGenImage.Enabled = $true
        $btnGenImage.Text = "AUTO-GENERATE"
    })

$btnExecute.Add_Click({
        $image = $txtImagePath.Text
        $p = $txtVidPrompt.Text
        $sec = $numSeconds.Value
        $outVid = Join-Path $TEMP_DIR "final_$(Get-Date -Format 'HHmmss').mp4"

        if (-not (Test-Path $image)) { 
            [Windows.Forms.MessageBox]::Show("Please generate or select a base image first.")
            return 
        }

        $btnExecute.Enabled = $false
        $btnExecute.Text = "PROTOCOL ACTIVE..."
        $txtLog.AppendText("🎬 Initiating Video Chaining ($sec Seconds)...`r`n")

        $job = Start-Job -ScriptBlock {
            param($sc, $img, $p, $out, $s)
            powershell -ExecutionPolicy Bypass -File $sc -BaseImage $img -Prompt $p -OutputVideo $out -TotalSeconds $s
        } -ArgumentList $VIDEO_SCRIPT, $image, $p, $outVid, $sec

        while ($job.State -eq "Running") {
            [System.Windows.Forms.Application]::DoEvents()
            Start-Sleep -Milliseconds 500
        }

        $results = Receive-Job -Job $job
        $txtLog.AppendText("🔗 Complete: $outVid`r`n")
        [Windows.Forms.MessageBox]::Show("Masterpiece Rendered!`n$outVid")

        $btnExecute.Enabled = $true
        $btnExecute.Text = "EXECUTE CINEMA PROTOCOL"
    })

# Show
$form.ShowDialog()
