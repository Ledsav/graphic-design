# Danse Macabre: private party invite

- Event: private party, Saturday 31 October 2026, from 20:30, Rue Robert Stumper 16
- Notes for guests: bring something to drink and share; costume not needed but appreciated
- Must read as private and invitation-only; not obviously Halloween (no "Halloween" wording)
- Format: 1080 x 1920 phone story (WhatsApp / Instagram)
- Look: two-ink riso (red + midnight on cream) after the user's reference; blackletter title chosen from thumbnails
- Contrast: midnight ink `#24304f` as a 45% tint for the grey; text prints in both inks (near-black), 6.2:1 on the grey, 3.2:1 on the red (large type only)
- White slivers (asked for after the first version): where the title and date cross the red, the red is knocked out in their shape shifted 7 px right and 6 px up, so paper shows along one edge (`[data-ko]` images, mask built by the script in `invite.html`)
- Image: the client's engraving (burning eyes), inverted into ink layers

## Files
- `danse-macabre-invite.png` final (riso print of the flat design)
- `invite.html` source; `export/invite-invite.png` flat render before the riso step
- `assets/` image layers and the lettering SVG; `drafts/` earlier thumbnails and the first draft

## Rebuild
node .claude/skills/html-graphics/scripts/render.cjs projects/danse-macabre-invite/invite.html
python3 .claude/skills/html-graphics/scripts/treat.py riso projects/danse-macabre-invite/export/invite-invite.png -o projects/danse-macabre-invite/danse-macabre-invite.png --inks '#c63a24,#24304f' --paper '#ece6d8' --grain .45 --offset=-3,2 --uneven .06

## Variants
Five alternative directions in `variants/`, one per image the client supplied later, same copy (start time 20:30):

1. `danse-macabre-jester.png`: Victorian playbill, the Fool in an oval medallion, title arched over and smiling under it (Abril Fatface + IM Fell, black and red on cream)
2. `danse-macabre-tarot.png`: tarot card, arcana XXXI, the sun-mask figure in an arched window, title on a ribbon (Cinzel + Cormorant, umber and oxblood on parchment)
3. `danse-macabre-apple.png`: magazine cover, the masthead behind her head, the apple's red as the only colour (Bodoni Moda + Manrope on black)
4. `danse-macabre-phone.png`: a lock screen, the clock reads 20:30, the invite arrives as notifications, the title rides up the red beam (Inter Tight + Anton lettering)
5. `danse-macabre-heart.png`: Swiss grid, vertical grotesque title, the heart as the only red (Schibsted Grotesk on off-white)

`danse-macabre-variants.jpg` shows all five. Rebuild one with
node .claude/skills/html-graphics/scripts/render.cjs projects/danse-macabre-invite/variants/<name>.html
then copy `variants/export/<name>-<name>.png` to `variants/danse-macabre-<name>.png`.
