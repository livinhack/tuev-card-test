# b57 Restore b50 confirm overlay baseline

This checkpoint intentionally returns the no-badge confirmation overlay behavior to the confirmed b50/b49 UI baseline.

## Reason

The later b51/b52 attempts introduced a fixed slot / stronger layout behavior for the confirmation area when `show_badge: false`. In testing, that looked worse than the b50 baseline, especially in mixed dashboard layouts.

## Decision

- b50/b49 compact floating overlay behavior is restored.
- b51/b52 fixed-slot behavior is discarded.
- Future improvements should be reconsidered from the b50 visual baseline.
- The tile size must not change because the confirmation overlay is present.

## Future direction

If this is revisited, prefer a lightweight overlay strategy that adapts inside the existing tile without reserving a fixed slot or pushing content.
