const core = require("@actions/core");
const github = require("@actions/github");

function parseCsv(value) {
  return String(value || "")
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
}

function hasHeading(body, heading) {
  if (!body || !heading) return false;
  return body.toLowerCase().includes(heading.toLowerCase());
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
    const hasReleaseNoteSection = hasHeading(prBody, releaseNoteHeading);

    if (!hasReleaseNoteSection) {
      core.setFailed(
        `Missing release note section in PR body. Add heading: ${releaseNoteHeading}`
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