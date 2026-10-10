# Check Frida connectivity and list processes
param(
    [string]$AdbPath = "D:\LDPlayer\LDPlayer9\adb.exe",
    [string]$DeviceSerial = "emulator-5554"
)

Write-Host "Checking if frida-server is running..."
$fridaProc = & $AdbPath -s $DeviceSerial shell "su -c 'ps -ef | grep frida-server | grep -v grep'"
if (-not $fridaProc) {
    Write-Host "Starting frida-server..."
    & $AdbPath -s $DeviceSerial shell "su -c 'nohup /data/local/tmp/frida-server > /data/local/tmp/frida.log 2>&1 &'"
    Start-Sleep -Seconds 2
}

Write-Host "Running frida-ps -U..."
frida-ps -U | Select-String -Pattern "Instagram|Name"
