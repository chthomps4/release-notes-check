const core = require("@actions/core");
const github = require("@actions/github");

function parseCsv(value) {
  return String(value || "")
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
}

function getSectionContent(body, heading) {
  if (!body || !heading) return "";

  const escapedHeading = heading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(
    `${escapedHeading}\\s*([\\s\\S]*?)(?=\\n##\\s|$)`,
    "i"
  );

  const match = body.match(regex);
  return match ? match[1].trim() : "";
}

function isMeaningfulReleaseNote(content) {
  if (!content) return false;

  const normalized = content.trim().toLowerCase();
  const invalidValues = [
    "n/a",
    "na",
    "none",
    "no",
    "no release note",
    "no release notes",
    "not applicable",
    "tbd",
    "todo",
    "-"
  ];

  return !invalidValues.includes(normalized);
}

async function run() {
  try {
    const requireSemverLabel =
      core.getInput("require_semver_label") !== "false";
    const releaseNoteHeading = core.getInput("release_note_heading");
    const exemptLabels = parseCsv(core.getInput("exempt_labels"));
    const breakingLabels = parseCsv(core.getInput("breaking_labels"));

    const context = github.context;
    const pr = context.payload.pull_request;

    if (!pr) {
      core.setFailed("This action only works on pull_request events.");
      return;
    }

    const labels = (pr.labels || []).map((label) =>
      String(label.name || "").toLowerCase()
    );

    const isExempt = labels.some((label) => exemptLabels.includes(label));
    if (isExempt) {
      core.info("Pull request is exempt from release note checks.");
      return;
    }

    if (requireSemverLabel) {
      const semverLabels = ["major", "minor", "patch"];
      const hasSemverLabel = labels.some((label) => semverLabels.includes(label));

      if (!hasSemverLabel) {
        core.setFailed("Missing semver label. Add one of: major, minor, patch.");
        return;
      }
    }

    const prBody = pr.body || "";
    const releaseNoteContent = getSectionContent(prBody, releaseNoteHeading);

    if (!releaseNoteContent) {
      core.setFailed(
        `Missing release note section in PR body. Add heading: ${releaseNoteHeading}`
      );
      return;
    }

    if (!isMeaningfulReleaseNote(releaseNoteContent)) {
      core.setFailed(
        "Release note section must contain meaningful content, not a placeholder like 'none' or 'TBD'."
      );
      return;
    }

    const hasBreakingLabel = labels.some((label) => breakingLabels.includes(label));
    if (hasBreakingLabel && !prBody.toLowerCase().includes("breaking change")) {
      core.setFailed(
        'PR has a breaking-change label but the PR body does not mention "breaking change".'
      );
      return;
    }

    core.info("Release note checks passed.");
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();