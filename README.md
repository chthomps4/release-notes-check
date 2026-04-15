# release-notes-check

[![Test Release Notes Check](https://github.com/chthomps4/release-notes-check/actions/workflows/test.yml/badge.svg)](https://github.com/chthomps4/release-notes-check/actions/workflows/test.yml)

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

## Example workflow

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
        uses: chthomps4/release-notes-check@v1.2
        with:
          require_semver_label: "true"
          release_note_heading: "## Release note"
          exempt_labels: "docs,internal,no-release-notes"
          breaking_labels: "breaking,major"
~~~

A copy-paste workflow example is included at:

- `examples/release-notes-check.yml`

## Pull request body example

Use this PR body format:

~~~md
## Release note
Describe the user-facing change in 1 to 3 sentences.
Explain what changed and why it matters.

## Breaking change
None.
~~~

A copy-paste PR template example is included at:

- `examples/pull-request-template.md`

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