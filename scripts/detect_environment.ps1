# Environment Detection Script
param(
    [string]$AdbPath = "D:\LDPlayer\LDPlayer9\adb.exe",
    [string]$DeviceSerial = "emulator-5554"
)

Write-Host "=== HOST ENVIRONMENT ==="
Write-Host "OS: Windows (PowerShell)"
$pyVersion = python --version 2>&1
$fridaVersion = frida --version 2>&1
Write-Host "Python: $pyVersion"
Write-Host "Frida Host: $fridaVersion"

Write-Host "`n=== EMULATOR ENVIRONMENT ==="
Write-Host "ADB Path: $AdbPath"
Write-Host "Device: $DeviceSerial"

$androidVersion = & $AdbPath -s $DeviceSerial shell getprop ro.build.version.release
$cpuAbi = & $AdbPath -s $DeviceSerial shell getprop ro.product.cpu.abi
$cpuAbiList = & $AdbPath -s $DeviceSerial shell getprop ro.product.cpu.abilist
$rootId = & $AdbPath -s $DeviceSerial shell "su -c id"

Write-Host "Android Version: $androidVersion"
Write-Host "CPU ABI: $cpuAbi"
Write-Host "Supported ABIs: $cpuAbiList"
Write-Host "Root: $rootId"

Write-Host "`n=== INSTAGRAM PACKAGE ==="
$igPath = & $AdbPath -s $DeviceSerial shell pm path com.instagram.android
$igVersion = & $AdbPath -s $DeviceSerial shell "dumpsys package com.instagram.android | grep versionName"
Write-Host "Package Path: $igPath"
Write-Host "Version: $igVersion"

Write-Host "`n=== FRIDA SERVER ON DEVICE ==="
$fridaServerVer = & $AdbPath -s $DeviceSerial shell "su -c '/data/local/tmp/frida-server --version'"
Write-Host "Frida Server: $fridaServerVer"
