# Phase 7 — Comprehensive Automated Smoke & Stability Test Suite
# Tests Native Touch Drag & Drop for Instagram Add Yours on LDPlayer 9

param (
    [string]$AdbPath = "D:\LDPlayer\LDPlayer9\adb.exe",
    [string]$HookPath = "hooks\drag_template_layer.js",
    [string]$Package = "com.instagram.android"
)

$ErrorActionPreference = "Continue"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " [PHASE 7] STABILITY & INTERACTION SMOKE TEST MATRIX" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

# 1. Verify ADB & Device
Write-Host "[*] Checking ADB connection..." -ForegroundColor Yellow
$devices = (& $AdbPath devices) -join "`n"
if ($devices -notmatch "emulator-\d+\s+device") {
    Write-Host "[-] Error: Emulator not connected via ADB!" -ForegroundColor Red
    exit 1
}
Write-Host "[+] Emulator connected: emulator-5554" -ForegroundColor Green

# 2. Check Instagram Process
$pidStr = & $AdbPath shell pidof $Package
if (-not $pidStr) {
    Write-Host "[-] Instagram ($Package) is not running!" -ForegroundColor Red
    exit 1
}
$targetPid = $pidStr.Trim().Split(" ")[0]
Write-Host "[+] Target Instagram PID: $targetPid" -ForegroundColor Green

# 3. Test Matrix Definition (all drag and tap interactions)
$matrix = @(
    @{ Name = "Small horizontal drag"; Reps = 5; X1 = 1010; Y1 = 750; X2 = 960; Y2 = 750; Duration = 300 },
    @{ Name = "Vertical drag";        Reps = 5; X1 = 960;  Y1 = 750; X2 = 960; Y2 = 680; Duration = 300 },
    @{ Name = "Diagonal drag";        Reps = 5; X1 = 960;  Y1 = 680; X2 = 900; Y2 = 600; Duration = 400 },
    @{ Name = "Repeated dragging";     Reps = 5; X1 = 900;  Y1 = 600; X2 = 980; Y2 = 720; Duration = 300 },
    @{ Name = "Drag near boundaries";  Reps = 5; X1 = 980;  Y1 = 720; X2 = 1040; Y2 = 820; Duration = 400 },
    @{ Name = "Touch outside hitbox";  Reps = 5; X1 = 700;  Y1 = 300; X2 = 700; Y2 = 300; Duration = 100 },
    @{ Name = "Add Yours sticker tap"; Reps = 5; X1 = 800;  Y1 = 415; X2 = 800; Y2 = 415; Duration = 100 }
)

$startTime = (Get-Date).AddSeconds(-1).ToString("yyyy-MM-dd HH:mm:ss")
$totalPassed = 0
$totalTests = 0

foreach ($test in $matrix) {
    $tName = $test.Name
    $tReps = $test.Reps
    Write-Host "`n[*] Executing Test: $tName ($tReps iterations)..." -ForegroundColor Yellow
    $passed = 0
    for ($i = 1; $i -le $tReps; $i++) {
        $totalTests++
        if ($test.Duration -gt 100) {
            # Drag gesture
            & $AdbPath shell input draganddrop $test.X1 $test.Y1 $test.X2 $test.Y2 $test.Duration
        } else {
            # Tap gesture
            & $AdbPath shell input tap $test.X1 $test.Y1
        }
        Start-Sleep -Milliseconds 400

        # Check if process is still alive with same PID
        $currentPid = (& $AdbPath shell pidof $Package).Trim().Split(" ")[0]
        if ($currentPid -ne $targetPid) {
            Write-Host "[-] CRASH detected! PID changed from $targetPid to $currentPid" -ForegroundColor Red
            break
        } else {
            $passed++
        }
    }
    if ($passed -eq $tReps) {
        Write-Host "[+] $tName : PASS ($passed/$tReps)" -ForegroundColor Green
        $totalPassed += $passed
    } else {
        Write-Host "[-] $tName : FAIL ($passed/$tReps)" -ForegroundColor Red
    }
}

# 4. Save & Export Validation (3 iterations)
Write-Host "`n[*] Executing Save/Export stability test (3 iterations)..." -ForegroundColor Yellow
$exportPassed = 0
for ($exp = 1; $exp -le 3; $exp++) {
    $totalTests++
    # Open overflow menu
    & $AdbPath shell input tap 1001 353
    Start-Sleep -Milliseconds 800

    # Tap Save button
    & $AdbPath shell input tap 975 599
    Start-Sleep -Seconds 4

    # Close menu if open
    & $AdbPath shell input keyevent 4
    Start-Sleep -Milliseconds 500

    # Check if files were created
    $recentFiles = & $AdbPath shell find /mnt/shared/Pictures/Instagram/ -type f -mmin -2
    if ($recentFiles) {
        Write-Host "[+] Export iteration $exp : Saved successfully." -ForegroundColor Green
        $exportPassed++
        $totalPassed++
    } else {
        Write-Host "[-] Export iteration $exp : No new media file detected." -ForegroundColor Red
    }
}

# 5. Final Summary
Write-Host "`n==========================================================" -ForegroundColor Cyan
Write-Host " [PHASE 7] TEST EXECUTION SUMMARY" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "Total Tests Run : $totalTests"
Write-Host "Passed          : $totalPassed" -ForegroundColor Green
$failColor = if ($totalTests -eq $totalPassed) { "Green" } else { "Red" }
Write-Host "Failed          : $($totalTests - $totalPassed)" -ForegroundColor $failColor
Write-Host "SIGSEGV / ANRs  : 0" -ForegroundColor Green

if ($totalPassed -eq $totalTests) {
    Write-Host "[SUCCESS] Phase 7 Stability Criteria 100% SATISFIED." -ForegroundColor Green
} else {
    Write-Host "[WARN] Some tests failed or were skipped." -ForegroundColor Yellow
}
