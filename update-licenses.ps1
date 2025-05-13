# Script to update LacunaPkiLicense.config and API keys across the repository
# Based on commit: https://github.com/LacunaSoftware/PkiSuiteSamples/commit/0bbddf513715e0013787649eecf3a2edbcb98cda
# If this script is not working, refer to the commit above and verify the file structure.

# Function to validate XML content
function Test-XmlContent {
    param (
        [string]$XmlContent
    )
    try {
        [xml]$XmlContent | Out-Null
        return $true
    }
    catch {
        Write-Host "Error: Invalid XML content. Please provide valid XML." -ForegroundColor Red
        return $false
    }
}

# Function to update API keys in configuration files
function Update-ApiKeys {
    param (
        [string]$RestPkiApiKey,
        [string]$RestPkiCoreApiKey,
        [string]$AmpliaApiKey,
        [string]$ExpiryDate
    )

    # Initialize counter for modified files
    $script:modifiedFilesCount = 0

    # Function to update content and increment counter
    function Update-FileContent {
        param (
            [string]$FilePath,
            [string]$Content,
            [string]$FileType
        )
        # Ensure we're not adding extra empty lines at the end of the file
        $content = $content.TrimEnd()
        Set-Content -Path $FilePath -Value $content
        $script:modifiedFilesCount++
        Write-Host "Updated API keys and expiry dates in $FilePath" -ForegroundColor Green
    }

    # Update REST PKI API key in Web.config
    $webConfigPath = "dotnet/mvc/PkiSuiteAspNetMvcSample/Web.config"
    if (Test-Path $webConfigPath) {
        $content = Get-Content $webConfigPath -Raw
        
        # Per commit diff: update the specific keys by their XML key name
        $content = $content -replace '(key="RestPkiApiKey"\s+value=")[^"]*(")', "`${1}$RestPkiApiKey`$2"
        $content = $content -replace '(key="RestPkiAccessToken"\s+value=")[^"]*(")', "`${1}$RestPkiApiKey`$2"
        $content = $content -replace '(key="RestPkiCoreApiKey"\s+value=")[^"]*(")', "`${1}$RestPkiCoreApiKey`$2"
        $content = $content -replace '(key="AmpliaApiKey"\s+value=")[^"]*(")', "`${1}$AmpliaApiKey`$2"
        
        # Update expiry date comments
        $content = $content -replace '<!-- This is a TRIAL token\. It will expire at \d{2}/\d{2}/\d{4}\. -->', "<!-- This is a TRIAL token. It will expire at $ExpiryDate. -->"
        $content = $content -replace '<!-- This is a TRIAL key\. It will expire at \d{2}/\d{2}/\d{4} -->', "<!-- This is a TRIAL key. It will expire at $ExpiryDate -->"
        
        Update-FileContent -FilePath $webConfigPath -Content $content -FileType "Web.config"
    }

    # Update appsettings.json
    $appSettingsPath = "dotnet/spa/PkiSuiteAspNetSpaSample/appsettings.json"
    if (Test-Path $appSettingsPath) {
        $content = Get-Content $appSettingsPath -Raw
        
        # Fix for the appsettings.json structure - "AccessToken" is directly under "RestPki"
        $content = $content -replace '("RestPki":[^}]*"AccessToken":\s*")[^"]*(")', "`${1}$RestPkiApiKey`$2"

        # Ensure the expiry date comment is present and up-to-date after the AccessToken line
        $content = $content -replace '("AccessToken":\s*"[^"]*"\s*)(// This is a TRIAL token\. It will expire at \d{2}/\d{2}/\d{4}\.)?',
            "`$1// This is a TRIAL token. It will expire at $ExpiryDate."

        # For completeness, include the other patterns in case the file structure changes
        $content = $content -replace '("RestPki":[^}]*"apiKey":\s*")[^"]*(")', "`${1}$RestPkiApiKey`$2"
        $content = $content -replace '("RestPkiCore":[^}]*"apiKey":\s*")[^"]*(")', "`${1}$RestPkiCoreApiKey`$2"
        $content = $content -replace '("Amplia":[^}]*"apiKey":\s*")[^"]*(")', "`${1}$AmpliaApiKey`$2"
        
        # Update expiry date comments for other possible comment lines
        $content = $content -replace '// This is a TRIAL API KEY\. It will be expired at \d{2}/\d{2}/\d{4}\.', "// This is a TRIAL API KEY. It will be expired at $ExpiryDate."
        $content = $content -replace '// This is a TRIAL token\. It will be expired at \d{2}/\d{2}/\d{4}\.', "// This is a TRIAL token. It will be expired at $ExpiryDate."
        
        Update-FileContent -FilePath $appSettingsPath -Content $content -FileType "appsettings.json"
    }

    # Update application.yml with proper YAML formatting preservation
    $applicationYmlPath = "java/springmvc/src/main/resources/application.yml"
    if (Test-Path $applicationYmlPath) {
        # Read the original file to extract needed values
        $originalContent = Get-Content -Path $applicationYmlPath -Raw
        
        
        # Commented out as it's not needed for the script
        # $cloudHubApiKey = "test-rest-api-key"  # Default fallback value
        # if ($originalContent -match "cloudhub:[^`r`n]*[`r`n]+\s*#[^`r`n]*[`r`n]+\s*#[^`r`n]*[`r`n]+\s*#[^`r`n]*[`r`n]+\s*apiKey:\s*([^`r`n]+)") {
        #     $cloudHubApiKey = $matches[1].Trim()
        # }
        
        # Create properly formatted YAML with updated values and correct line endings
        $yamlContent = @"
# --------------------------------------------------------------------------------------------------
# General Configuration
# --------------------------------------------------------------------------------------------------

# Server parameters
server:
  port: 60695
  error.include-stacktrace: always

# Maximum upload and request sizes
multipart:
  maxFileSize: '10Mb'
  maxRequestSize: '10Mb'

# Spring parameters
spring:
  profiles.active: 'dev'
  http.converters.preferred-json-mapper: gson

# Proxy parameters (With you want there is problem to connect to REST PKI, cased by a proxy)
proxy:
  host: null
  port: null
  # Authentication
  username: null
  password: null

# --------------------------------------------------------------------------------------------------
# Lacuna Configuration
# --------------------------------------------------------------------------------------------------

# Trust in Lacuna Test PKI (for development purposes only!)
trustLacunaTestRoot: false
# THIS SHOULD NEVER BE USED ON A PRODUCTION ENVIRONMENT!

# REST PKI parameters
rest-pki:
  # ======================================================
  #   >>>> PASTE YOUR REST PKI ACCESS TOKEN BELOW <<<<
  # ======================================================
  accessToken: '$RestPkiApiKey'
  # This is a TRIAL token. It will expire at $ExpiryDate.
  # If the REST PKI's samples do not work, please contact our support by
  # email: suporte@lacunasoftware.com

  # In order to use this sample on a "on premises" installation of REST PKI, fill the field below
  # with the URL address of your REST PKI installation (with the trailing '/' character)
  endpoint: null

# REST PKI Core parameters
rest-pki-core:
  # ======================================================
  #     >>>> PASTE YOUR REST PKI API KEY BELOW <<<<
  # ======================================================
  apiKey: $RestPkiCoreApiKey
  # This is a TRIAL key. It will expire at $ExpiryDate
  # If the REST PKI's samples do not work, please contact our support by
  # email: suporte@lacunasoftware.com

  # In order to use this sample on a "on premises" installation of REST PKI, fill the field below
  # with the URL address of your REST PKI Core installation (with the trailing '/' character)
  endpoint: null

# Amplia parameters
amplia:

  # The CA's id that will be used to issue a certificate using Amplia. We have configured to the
  # sample CA from sample subscription for these samples.
  caId: 'eaffa754-1fb5-474a-b9ef-efe43101e89f'

  # ======================================================
  #       >>>> PASTE YOUR AMPLIA API KEY BELOW <<<<
  # ======================================================
  apiKey: $AmpliaApiKey
  # This is a TRIAL API key to use Amplia. It will expire at $ExpiryDate.
  # If the Amplia's samples do not work please contact our support by email:
  # suporte@lacunasoftware.com

  # In order to use this sample on a "on premises" installation of Amplia, fill the field below
  # with the URL address of your REST PKI installation (with the trailing '/' character)
  endpoint: null

# PKI Express parameters
pki-express:
  # List of custom trusted roots. In this sample, we will get the certificate files on
  # resources/static folder
  trustedRoots: null

  # Offline mode. Set this, if you want to PKI Express to run on offline mode. This mode is useful
  # when there is no network available
  offline: false

  # Default password to be used on generating a PKCS #12 file.
  pkcs12Password: 'AdF7Hf3XQTEjtFbeQxPQ8j2SudAzFf9cDfY4gLne8UTvLKp7sqT7mMaVEyme2PymsqUWtyTYQsy7AMjRjvghejqcA4CbSZTRuf4ZZSNKXrusDUtuWaJAWGeB8m8Tqmak'

cloudhub:
  # ======================================================
  #     >>>> PASTE YOUR Cloudhub API KEY BELOW <<<<
  # ======================================================
  apiKey: 'mR1j0v7L12lBHnxpgxVkIdikCN9Gm89rn8I9qet3UHo='
  # If the Cloudhub's samples do not work, please contact our support by
  # email: suporte@lacunasoftware.com

  # In order to use this sample on a "on premises" installation of Cloudhub, fill the field below
  # with the URL address of your Cloudhub installation (with the trailing '/' character)
  endpoint: null


# Web PKI parameters
web-pki:
  # Base64-encoded binary license for the Web PKI. This value is passed to Web PKI component's
  # constructor on JavaScript
  license: null
"@
        
        # Convert all line endings to Linux style (LF) which is standard for YAML
        $yamlContent = $yamlContent -replace "`r`n", "`n"
        
        # Write the file with UTF8 encoding (no BOM)
        $utf8NoBom = New-Object System.Text.UTF8Encoding $false
        [System.IO.File]::WriteAllText($applicationYmlPath, $yamlContent, $utf8NoBom)
        
        $script:modifiedFilesCount++
        Write-Host "Updated API keys and expiry dates in $applicationYmlPath" -ForegroundColor Green
    }

    # Update default.js
    $defaultJsPath = "nodejs/expressmvc/config/default.js"
    if (Test-Path $defaultJsPath) {
        $content = Get-Content $defaultJsPath -Raw
        
        # Updated patterns for JavaScript format
        # REST PKI uses accessToken in default.js
        $content = $content -replace "(accessToken:\s*)'[^']*'", "`${1}'$RestPkiApiKey'"
        # Alternatively may use double quotes
        $content = $content -replace '(accessToken:\s*)"[^"]*"', "`${1}`"$RestPkiApiKey`""
        
        # REST PKI Core (not sure which pattern it uses, but including for completeness)
        $content = $content -replace "(restPkiCore:[^}]*apiKey:\s*)'[^']*'", "`${1}'$RestPkiCoreApiKey'"
        $content = $content -replace '(restPkiCore:[^}]*apiKey:\s*)"[^"]*"', "`${1}`"$RestPkiCoreApiKey`""
        
        # Amplia - ensure we match the correct pattern
        $content = $content -replace "(amplia:[^}]*apiKey:\s*)'[^']*'", "`${1}'$AmpliaApiKey'"
        $content = $content -replace '(amplia:[^}]*apiKey:\s*)"[^"]*"', "`${1}`"$AmpliaApiKey`""
        
        # Skip updating CloudHub API key
        # $content = $content -replace "(cloudhub:[^}]*apiKey:\s*)'[^']*'", "`${1}'$CloudHubApiKey'"
        # $content = $content -replace '(cloudhub:[^}]*apiKey:\s*)"[^"]*"', "`${1}`"$CloudHubApiKey`""
        
        # Update expiry date comments
        $content = $content -replace '// This is a TRIAL API KEY\. It will be expired at \d{2}/\d{2}/\d{4}\.', "// This is a TRIAL API KEY. It will be expired at $ExpiryDate."
        $content = $content -replace '// This is a TRIAL token\. It will be expired at \d{2}/\d{2}/\d{4}\.', "// This is a TRIAL token. It will be expired at $ExpiryDate."
        $content = $content -replace '// This is a TRIAL API key to use Amplia\. It will expire at \d{2}/\d{2}/\d{4}\.', "// This is a TRIAL API key to use Amplia. It will expire at $ExpiryDate."
        
        Update-FileContent -FilePath $defaultJsPath -Content $content -FileType "default.js"
    }

    # Update config.php with extremely precise pattern matching
    $configPhpPath = "php/plain/config.php"
    if (Test-Path $configPhpPath) {
        $content = Get-Content $configPhpPath -Raw -Encoding UTF8
        
        # Define extremely precise patterns for each section to ensure we don't touch CloudHub
        
        # REST PKI section - update the access token value
        $restPkiPattern = "('restPki'\s*=>\s*\[\s*(?:[^']*'[^']*'\s*=>\s*[^,]*,\s*)*?(?:\/\/[^\n]*\n\s*)*?'accessToken'\s*=>\s*)'[^']*'"
        if ($content -match $restPkiPattern) {
            $content = $content -replace $restPkiPattern, "`$1'$RestPkiApiKey'"
        } else {
            Write-Host "Warning: Could not locate REST PKI access token in $configPhpPath" -ForegroundColor Yellow
        }
        
        # REST PKI NG section - update the API key value
        $restPkiNgPattern = "('restPkiNg'\s*=>\s*\[\s*(?:[^']*'[^']*'\s*=>\s*[^,]*,\s*)*?(?:\/\/[^\n]*\n\s*)*?'apiKey'\s*=>\s*)'[^']*'"
        if ($content -match $restPkiNgPattern) {
            $content = $content -replace $restPkiNgPattern, "`$1'$RestPkiCoreApiKey'"
        } else {
            Write-Host "Warning: Could not locate REST PKI NG API key in $configPhpPath" -ForegroundColor Yellow
        }
        
        # Amplia section - update the API key value with much more precise pattern
        # This pattern ensures we're specifically targeting the 'amplia' section and not the 'cloudHub' section
        $ampliaPattern = "(?s)('amplia'\s*=>\s*\[\s*(?:.*?)\s*//\s*======+\s*//\s*>>>>\s*PASTE\s*YOUR\s*AMPLIA\s*API\s*KEY[^\n]*\s*//\s*======+\s*'apiKey'\s*=>\s*)'[^']*'"
        if ($content -match $ampliaPattern) {
            $content = $content -replace $ampliaPattern, "`$1'$AmpliaApiKey'"
        } else {
            Write-Host "Warning: Could not locate Amplia API key in $configPhpPath" -ForegroundColor Yellow
        }
        
        # Update expiry dates in comments - being careful not to touch CloudHub section
        $content = $content -replace '(\/\/ This is a TRIAL token\. It will be expired at) \d{2}\/\d{2}\/\d{4}\.', "`$1 $ExpiryDate."
        $content = $content -replace '(\/\/ This is a TRIAL API KEY\. It will be expired at) \d{2}\/\d{2}\/\d{4}\.', "`$1 $ExpiryDate."
        $content = $content -replace '(\/\/ This is a TRIAL API key to use Amplia\. It will expire at) \d{2}\/\d{2}\/\d{4}\.', "`$1 $ExpiryDate."
        
        # Write back the content, preserving formatting
        $content = $content.TrimEnd()
        
        # Use UTF8 encoding to ensure proper handling of special characters
        $utf8NoBom = New-Object System.Text.UTF8Encoding $false
        [System.IO.File]::WriteAllText($configPhpPath, $content, $utf8NoBom)
        
        $script:modifiedFilesCount++
        Write-Host "Updated API keys in $configPhpPath" -ForegroundColor Green
    }

    # Update config.py (Django)
    $djangoConfigPath = "python/django/sample/config.py"
    if (Test-Path $djangoConfigPath) {
        $content = Get-Content $djangoConfigPath -Raw
        
        # Updated patterns for Python Django format - using uppercase variable names
        # REST PKI Access Token with single quotes and no spaces
        $content = $content -replace "(REST_PKI_ACCESS_TOKEN=)'[^']*'", "`${1}'$RestPkiApiKey'"
        
        # Amplia API Key with single quotes and no spaces 
        $content = $content -replace "(AMPLIA_API_KEY\s*=\s*)'[^']*'", "`${1}'$AmpliaApiKey'"
        
        # Update expiry date comments
        $content = $content -replace '# This is a TRIAL token\. It will be expired at \d{2}/\d{2}/\d{4}\.', "# This is a TRIAL token. It will be expired at $ExpiryDate."
        $content = $content -replace '# This is a TRIAL API key to use Amplia\. It will expire at \d{2}/\d{2}/\d{4}\.', "# This is a TRIAL API key to use Amplia. It will expire at $ExpiryDate."
        
        Update-FileContent -FilePath $djangoConfigPath -Content $content -FileType "config.py (Django)"
    }

    # Update config.py (Flask)
    $flaskConfigPath = "python/flask/sample/config.py"
    if (Test-Path $flaskConfigPath) {
        $content = Get-Content $flaskConfigPath -Raw
        
        # Updated patterns for Python Flask format - using uppercase variable names
        # REST PKI Access Token with single quotes and no spaces
        $content = $content -replace "(REST_PKI_ACCESS_TOKEN=)'[^']*'", "`${1}'$RestPkiApiKey'"
        
        # Amplia API Key with single quotes and no spaces
        $content = $content -replace "(AMPLIA_API_KEY\s*=\s*)'[^']*'", "`${1}'$AmpliaApiKey'"
        
        # Update expiry date comments
        $content = $content -replace '# This is a TRIAL token\. It will be expired at \d{2}/\d{2}/\d{4}\.', "# This is a TRIAL token. It will be expired at $ExpiryDate."
        $content = $content -replace '# This is a TRIAL API key to use Amplia\. It will expire at \d{2}/\d{2}/\d{4}\.', "# This is a TRIAL API key to use Amplia. It will expire at $ExpiryDate."
        
        Update-FileContent -FilePath $flaskConfigPath -Content $content -FileType "config.py (Flask)"
    }

    # Update lacuna.yml
    $lacunaYmlPath = "ruby/rails/config/lacuna.yml"
    if (Test-Path $lacunaYmlPath) {
        $content = Get-Content $lacunaYmlPath -Raw
        
        # Per commit diff: update the YAML keys
        $content = $content -replace '(rest_pki:[^\n]*\n[^\n]*api_key:)\s*[^\n]*', "`${1} $RestPkiApiKey"
        $content = $content -replace '(rest_pki_core:[^\n]*\n[^\n]*api_key:)\s*[^\n]*', "`${1} $RestPkiCoreApiKey"
        $content = $content -replace '(amplia:[^\n]*\n[^\n]*api_key:)\s*[^\n]*', "`${1} $AmpliaApiKey"
        
        # Skip updating CloudHub API key
        # $content = $content -replace '(cloudhub:[^\n]*\n[^\n]*api_key:)\s*[^\n]*', "`${1} $CloudHubApiKey"
        
        # Update expiry date comments
        $content = $content -replace '<!-- This is a TRIAL API KEY\. It will be expired at \d{2}/\d{2}/\d{4}\. -->', "<!-- This is a TRIAL API KEY. It will be expired at $ExpiryDate. -->"
        $content = $content -replace '<!-- This is a TRIAL key\. It will expire at \d{2}/\d{2}/\d{4} -->', "<!-- This is a TRIAL key. It will expire at $ExpiryDate -->"
        
        Update-FileContent -FilePath $lacunaYmlPath -Content $content -FileType "lacuna.yml"
    }
}

# Main script
Write-Host "Lacuna PKI Suite License and API Key Update Script" -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Cyan

# Get API keys
$restPkiApiKey = Read-Host "Enter REST PKI API Key"
$restPkiCoreApiKey = Read-Host "Enter REST PKI Core API Key"
$ampliaApiKey = Read-Host "Enter Amplia API Key"

# Get expiry date
Write-Host "`nPlease enter the expiry date (format: DD/MM/YYYY):" -ForegroundColor Yellow
$expiryDate = Read-Host "Enter expiry date"

# Get new LacunaPkiLicense.config content
Write-Host "`nPlease paste the new LacunaPkiLicense.config content (press Enter twice when done):" -ForegroundColor Yellow
$licenseContent = ""
$line = Read-Host
while ($line -ne "") {
    $licenseContent += $line + "`n"
    $line = Read-Host
}

# Validate XML content
if (-not (Test-XmlContent -XmlContent $licenseContent)) {
    Write-Host "Exiting due to invalid XML content. Please provide valid XML." -ForegroundColor Red
    exit 1
}

# Initialize counter for license files
$licenseFilesCount = 0

# Find and update all LacunaPkiLicense.config files
$licenseFiles = Get-ChildItem -Path . -Filter "LacunaPkiLicense.config" -Recurse
foreach ($file in $licenseFiles) {
    # Process the license content to ensure no empty lines at the end
    $xmlContent = $licenseContent.TrimEnd()
    
    # Use UTF8 encoding without BOM
    $encoding = New-Object System.Text.UTF8Encoding $false
    
    # Write the content directly without any trailing newlines
    [System.IO.File]::WriteAllText($file.FullName, $xmlContent, $encoding)
    
    $licenseFilesCount++
    Write-Host "Updated license in $($file.FullName)" -ForegroundColor Green
}

# Update API keys and expiry date
Update-ApiKeys -RestPkiApiKey $restPkiApiKey -RestPkiCoreApiKey $restPkiCoreApiKey -AmpliaApiKey $ampliaApiKey -ExpiryDate $expiryDate

Write-Host "`nUpdate completed successfully! Modified $($licenseFilesCount + $modifiedFilesCount) files ($licenseFilesCount license files and $modifiedFilesCount config files)." -ForegroundColor Green 