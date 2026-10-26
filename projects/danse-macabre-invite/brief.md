# Danse Macabre: private party invite

- Event: private party, Saturday 31 October 2026, Rue Robert Stumper
- Notes for guests: bring something to drink and share; costume not needed but appreciated
- Must read as private and invitation-only; not obviously Halloween (no "Halloween" wording)
- Format: 1080 x 1920 phone story (WhatsApp / Instagram)
- Look: two-ink riso (red + slate on cream) after the user's reference; blackletter title chosen from thumbnails
- Image: the client's engraving (burning eyes), inverted into ink layers

## Files
- `danse-macabre-invite.png` final (riso print of the flat design)
- `invite.html` source; `export/invite-invite.png` flat render before the riso step
- `assets/` image layers and the lettering SVG; `drafts/` earlier thumbnails and the first draft

## Rebuild
node .claude/skills/html-graphics/scripts/render.cjs projects/danse-macabre-invite/invite.html
python3 .claude/skills/html-graphics/scripts/treat.py riso projects/danse-macabre-invite/export/invite-invite.png -o projects/danse-macabre-invite/danse-macabre-invite.png --inks '#c63a24,#5b6070' --paper '#ece6d8' --grain .75 --offset 5,-4
