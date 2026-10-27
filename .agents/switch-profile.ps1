param (
    [string]$Profile = "status"
)

node "$PSScriptRoot/scripts/switch-profile.js" $Profile
