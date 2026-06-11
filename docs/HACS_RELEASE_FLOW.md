# HACS release / update trigger flow

Current checked version: `b42`.

This document captures the manual release flow that was tested with the intermediate `b39` upload/release trigger.
It is meant as a practical checklist for later `v0.1.x` releases.

## What was verified with b39

- A pushed repository change can be published as a GitHub Release.
- HACS can be forced to re-check the repository with **Informationen aktualisieren** / **Update information**.
- The update path is based on the root bundle:

```text
/hacsfiles/tuev-card/tuev-card.js
```

- The dashboard card type remains:

```yaml
type: custom:tuev-card
```

## Manual release flow with GitHub Desktop

1. Copy the new ZIP contents into the local repository folder.
2. Open GitHub Desktop.
3. Review the changed files.
4. Commit to `main`, for example:

```text
b42: v0.1 must-fix audit
```

5. Push origin.
6. Open the repository on GitHub in the browser.
7. Open **Releases**.
8. Choose **Draft a new release**.
9. Create or select the tag for the new version.
10. Set target to `main`.
11. Publish the release.

For the final public version, prefer semantic tags such as:

```text
v0.1.0
v0.1.1
```

For internal test releases, temporary tags such as `b39`, `b42`, ... are acceptable.

## HACS update check in Home Assistant

After publishing the GitHub Release:

1. Open HACS.
2. Use **Informationen aktualisieren** / **Update information** when testing immediately.
3. For normal releases, wait and let HACS discover the update automatically.
4. Check Home Assistant **Settings → Updates**.

## Important repository requirements

`hacs.json` must continue to point to the root bundle:

```json
{
  "filename": "tuev-card.js",
  "content_in_root": true
}
```

The installed HACS folder should contain:

```text
/config/www/community/tuev-card/tuev-card.js
```

It should not require or install these old paths:

```text
tuev-card-test.js
dist/tuev-card.js
/hacsfiles/tuev-card-test/
```

## Later BAT idea

A later helper BAT can automate the local parts:

- run `npm run build`
- run `npm run check`
- optionally stage/commit/push with Git

The GitHub Release itself can still be created in the browser unless GitHub CLI is added later.


## v0.1.0 versioning preparation

See `docs/VERSIONING_AND_RELEASE_PREP.md` before creating the first semantic `v0.1.0` release.
