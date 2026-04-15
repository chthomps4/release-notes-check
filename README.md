# release-notes-check

GitHub Action to enforce release note metadata on pull requests.

## What it checks

- requires a semver label: `major`, `minor`, or `patch`
- requires a release note section in the PR body
- requires meaningful release note content, not placeholders like `None`, `TBD`, or `N/A`
- allows exemptions with labels like `docs`, `internal`, or `no-release-notes`
- requires `breaking change` text in the PR body when a breaking label is present

## Required labels

Create these labels in your repository before using the action:

### Semver labels

- `major`
- `minor`
- `patch`

### Exemption labels

- `docs`
- `internal`
- `no-release-notes`

### Breaking-change label

- `breaking`

## Inputs

| Name | Required | Default | Description |
|---|---|---|---|
| `require_semver_label` | No | `true` | Require a semver label such as `major`, `minor`, or `patch` |
| `release_note_heading` | No | `## Release note` | Heading to look for in the pull request body |
| `exempt_labels` | No | `docs,internal,no-release-notes` | Comma-separated labels that skip the check |
| `breaking_labels` | No | `breaking,major` | Comma-separated labels that indicate a breaking change |

## Example workflow for this repository

~~~yaml
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
      - uses: chthomps4/release-notes-check@v1.1
        with:
          require_semver_label: "true"
          release_note_heading: "## Release note"
          exempt_labels: "docs,internal,no-release-notes"
          breaking_labels: "breaking,major"
~~~

## Example workflow for another repository

Create `.github/workflows/release-notes-check.yml` in the repository that wants to use this action:

~~~yaml
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
      - name: Run release notes check
        uses: chthomps4/release-notes-check@v1.1
        with:
          require_semver_label: "true"
          release_note_heading: "## Release note"
          exempt_labels: "docs,internal,no-release-notes"
          breaking_labels: "breaking,major"
~~~

## Pull request body example

~~~md
## Release note
Adds validation for PR release metadata and blocks placeholder release notes.

## Breaking change
None.
~~~

## This will fail

These values are treated as placeholders and will fail the check when used as the release note content:

- `None`
- `TBD`
- `N/A`
- `No release notes`
- `-`

## Exempt PRs

Add one of these labels to skip the check:

- `docs`
- `internal`
- `no-release-notes`

## Notes

This action currently runs on pull requests only.