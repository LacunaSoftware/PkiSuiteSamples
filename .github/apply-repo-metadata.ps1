<#
.SYNOPSIS
    Applies the GitHub description, website and topics recorded in .github/REPO_METADATA.md.

.DESCRIPTION
    REPO_METADATA.md is the single source of truth: this script reads the "Description",
    "Website" and "Topics" sections from it, shows what differs from the repository's current
    settings on GitHub, and applies the difference with the GitHub CLI (`gh repo edit`).

    Requirements: the GitHub CLI (https://cli.github.com/), signed in (`gh auth login`) as a user
    with admin rights on the repository. Works in Windows PowerShell 5.1 and PowerShell 7+.

    Topics are only added by default. Use -RemoveOtherTopics to also remove topics that are on
    GitHub but not listed in REPO_METADATA.md. Use -WhatIf to preview without changing anything.

.PARAMETER Repo
    The repository, as owner/name. Default: LacunaSoftware/PkiSuiteSamples.

.PARAMETER MetadataPath
    Path to the metadata file. Default: REPO_METADATA.md next to this script.

.PARAMETER RemoveOtherTopics
    Also remove topics that are not listed in REPO_METADATA.md.

.EXAMPLE
    ./.github/apply-repo-metadata.ps1 -WhatIf
    Shows the current and target settings and what would change, without changing anything.

.EXAMPLE
    ./.github/apply-repo-metadata.ps1
    Applies the description, website and topics, asking for confirmation first.
#>
[CmdletBinding(SupportsShouldProcess = $true, ConfirmImpact = 'High')]
param(
    [string]$Repo = 'LacunaSoftware/PkiSuiteSamples',
    [string]$MetadataPath,
    [switch]$RemoveOtherTopics
)

$ErrorActionPreference = 'Stop'
# Windows PowerShell 5.1 leaves $PSScriptRoot empty in param() defaults, so default it here.
if (-not $MetadataPath) { $MetadataPath = Join-Path $PSScriptRoot 'REPO_METADATA.md' }

# Returns the lines of the first paragraph under the "## <Heading>" section.
function Get-SectionParagraph {
    param([string[]]$Lines, [string]$Heading)
    $start = -1
    for ($i = 0; $i -lt $Lines.Count; $i++) {
        if ($Lines[$i] -match "^##\s+$([regex]::Escape($Heading))\b") { $start = $i + 1; break }
    }
    if ($start -lt 0) { throw "Section '## $Heading' not found in $MetadataPath." }
    $paragraph = @()
    for ($i = $start; $i -lt $Lines.Count; $i++) {
        $line = $Lines[$i].Trim()
        if ($line -match '^##\s') { break }
        if ($line -eq '') { if ($paragraph.Count -gt 0) { break } else { continue } }
        $paragraph += $line
    }
    if ($paragraph.Count -eq 0) { throw "Section '## $Heading' in $MetadataPath is empty." }
    return , $paragraph
}

# Runs gh and returns its standard output as one string; gh's own messages still reach the console.
function Invoke-Gh {
    $output = & gh @args
    if ($LASTEXITCODE -ne 0) { throw "gh $($args -join ' ') failed with exit code $LASTEXITCODE." }
    return ($output -join "`n")
}

# ---------------------------------------------------------------------------------------------
# Read and check the target settings from REPO_METADATA.md.
# ---------------------------------------------------------------------------------------------
if (-not (Test-Path $MetadataPath)) { throw "Metadata file not found: $MetadataPath" }
$lines = Get-Content -Path $MetadataPath -Encoding UTF8

$descriptionLines = Get-SectionParagraph -Lines $lines -Heading 'Description'
$description = (($descriptionLines | ForEach-Object { $_ -replace '^>\s?', '' }) -join ' ').Trim()

$websiteLine = (Get-SectionParagraph -Lines $lines -Heading 'Website') -join ' '
if ($websiteLine -notmatch '`(https://[^`\s]+)`') { throw "No `https://...` URL found under '## Website'." }
$website = $Matches[1]

# Only the first paragraph under "## Topics" lists topics; later paragraphs are commentary.
$topicsText = (Get-SectionParagraph -Lines $lines -Heading 'Topics') -join ' '
$topics = @([regex]::Matches($topicsText, '`([^`]+)`') | ForEach-Object { $_.Groups[1].Value })

if ($description.Length -eq 0 -or $description.Length -gt 350) {
    throw "The description must have 1 to 350 characters; it has $($description.Length)."
}
if ($topics.Count -eq 0 -or $topics.Count -gt 20) {
    throw "GitHub allows 1 to 20 topics; REPO_METADATA.md lists $($topics.Count)."
}
foreach ($topic in $topics) {
    if ($topic -cnotmatch '^[a-z0-9][a-z0-9-]{0,49}$') {
        throw "Invalid topic '$topic': use lowercase letters, digits and hyphens, at most 50 characters."
    }
}

# ---------------------------------------------------------------------------------------------
# Check the GitHub CLI, sign-in and permissions, then read the current settings.
# ---------------------------------------------------------------------------------------------
if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
    throw 'The GitHub CLI (gh) is not installed. Get it from https://cli.github.com/.'
}
& gh auth status *> $null
if ($LASTEXITCODE -ne 0) { throw 'The GitHub CLI is not signed in. Run: gh auth login' }

$isAdmin = (Invoke-Gh api "repos/$Repo" --jq '.permissions.admin') -eq 'true'
if (-not $isAdmin) {
    $message = "Your GitHub account does not have admin rights on $Repo, so the settings cannot be changed."
    if ($WhatIfPreference) { Write-Warning $message } else { throw $message }
}

$current = Invoke-Gh repo view $Repo --json 'description,homepageUrl,repositoryTopics' | ConvertFrom-Json
$currentTopics = @()
if ($current.repositoryTopics) { $currentTopics = @($current.repositoryTopics | ForEach-Object { $_.name }) }

$topicsToAdd = @($topics | Where-Object { $currentTopics -notcontains $_ })
$topicsToRemove = @()
if ($RemoveOtherTopics) { $topicsToRemove = @($currentTopics | Where-Object { $topics -notcontains $_ }) }
$descriptionChanges = $current.description -cne $description
$websiteChanges = $current.homepageUrl -cne $website

Write-Host "Repository: $Repo"
Write-Host ''
Write-Host 'Description'
Write-Host "  current: $($current.description)"
Write-Host "  target:  $description"
Write-Host 'Website'
Write-Host "  current: $($current.homepageUrl)"
Write-Host "  target:  $website"
Write-Host 'Topics'
Write-Host "  current: $(if ($currentTopics.Count) { $currentTopics -join ', ' } else { '(none)' })"
Write-Host "  target:  $($topics -join ', ')"
if ($topicsToAdd.Count) { Write-Host "  add:     $($topicsToAdd -join ', ')" }
if ($topicsToRemove.Count) { Write-Host "  remove:  $($topicsToRemove -join ', ')" }
if (-not $RemoveOtherTopics) {
    $extra = @($currentTopics | Where-Object { $topics -notcontains $_ })
    if ($extra.Count) { Write-Host "  kept (not listed; use -RemoveOtherTopics to remove): $($extra -join ', ')" }
}
Write-Host ''

if (-not ($descriptionChanges -or $websiteChanges -or $topicsToAdd.Count -or $topicsToRemove.Count)) {
    Write-Host 'Nothing to change: GitHub already matches REPO_METADATA.md.'
    return
}

# ---------------------------------------------------------------------------------------------
# Apply.
# ---------------------------------------------------------------------------------------------
$ghArgs = @('repo', 'edit', $Repo)
if ($descriptionChanges) { $ghArgs += @('--description', $description) }
if ($websiteChanges) { $ghArgs += @('--homepage', $website) }
if ($topicsToAdd.Count) { $ghArgs += @('--add-topic', ($topicsToAdd -join ',')) }
if ($topicsToRemove.Count) { $ghArgs += @('--remove-topic', ($topicsToRemove -join ',')) }

if ($PSCmdlet.ShouldProcess($Repo, 'Update the GitHub description, website and topics')) {
    Invoke-Gh @ghArgs | Out-Null
    $after = Invoke-Gh repo view $Repo --json 'description,homepageUrl,repositoryTopics' | ConvertFrom-Json
    $afterTopics = @()
    if ($after.repositoryTopics) { $afterTopics = @($after.repositoryTopics | ForEach-Object { $_.name }) }
    $missing = @($topics | Where-Object { $afterTopics -notcontains $_ })
    if ($after.description -cne $description -or $after.homepageUrl -cne $website -or $missing.Count) {
        throw 'gh reported success, but GitHub does not show all the new settings yet. Run the script again to compare.'
    }
    Write-Host "Done: $Repo now matches REPO_METADATA.md."
}
