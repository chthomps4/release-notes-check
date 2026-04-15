# release-notes-check
GitHub Action to enforce release note metadata on pull requests
# release-notes-check

GitHub Action to enforce release note metadata on pull requests.

## What it checks

- requires a semver label: `major`, `minor`, or `patch`
- requires a release note section in the PR body
- allows exemptions with labels like `docs`, `internal`, or `no-release-notes`
- requires `breaking change` text in the PR body when a breaking label is present

## Inputs

| Name | Required | Default | Description |
|---|---|---|---|
| `require_semver_label` | No | `true` | Require a semver label such as `major`, `minor`, or `patch` |
| `release_note_heading` | No | `## Release note` | Heading to look for in the pull request body |
| `exempt_labels` | No | `docs,internal,no-release-notes` | Comma-separated labels that skip the check |
| `breaking_labels` | No | `breaking,major` | Comma-separated labels that indicate a breaking change |

## Example workflow

```yaml
name: Release Notes Check

on:
  pull_request:
    types: [opened, edited, synchronize, labeled, unlabeled]

jobs:
  release-notes-check:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pull-requests: read
    steps:
      - uses: chthomps4/release-notes-check@main
        with:
          require_semver_label: "true"
          release_note_heading: "## Release note"
          exempt_labels: "docs,internal,no-release-notes"
          breaking_labels: "breaking,major"