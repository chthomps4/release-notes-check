# Releasing

This project uses Git tags for stable Action versions.

## Release checklist

1. Make sure `main` is up to date
2. Confirm the test workflow is green
3. Update `README.md` examples if needed
4. Commit all final changes
5. Create an annotated tag
6. Push the tag
7. Publish a GitHub Release

## Commands

```bash
git checkout main
git pull origin main
git tag -a vX.Y -m "Release vX.Y"
git push origin vX.Y