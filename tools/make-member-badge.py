"""Make the CGBB Member badge (assets/badge/cgbb-member*.svg/png) from the Verified Trusted badge (Chris, 7 Nov 2026).
Same layout and brand (seal, Jost, CGBB red); the main line reads "CGBB Member" instead of "Verified Trusted" and the red
accent rule under it is dropped, so the free level looks plainer than the paid one.
Run: python3 tools/make-member-badge.py <path to a Jost 500 font file (.woff/.ttf)>   (PNGs: see the end of this file)"""
import re, sys
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen

SIZE, BASE_X, BASE_Y = 34, 166.0, 88.0  # Jost 500, 34px, measured from the Verified Trusted line
TEXT = 'CGBB Member'

def text_path(font):
    ft = TTFont(font); gs = ft.getGlyphSet(); cmap = ft.getBestCmap(); hm = ft['hmtx']; k = SIZE / ft['head'].unitsPerEm
    pen = SVGPathPen(gs); x = 0
    for c in TEXT:
        g = cmap[ord(c)]
        gs[g].draw(TransformPen(pen, (k, 0, 0, -k, BASE_X + x * k, BASE_Y)))
        x += hm[g][0]
    return pen.getCommands()

def make(src, dst, d):
    s = open(src, encoding='utf-8').read()
    paths = list(re.finditer(r'<path fill="([^"]+)" d="[^"]+"/>', s))
    main = paths[2]  # 0 CGBB, 1 COUNCIL…, 2 Verified Trusted, 3 Website Trust Credential · Verify at cgbb.org
    s = s[:main.start()] + f'<path fill="{main.group(1)}" d="{d}"/>' + s[main.end():]
    s = re.sub(r'<rect x="168" y="100" width="40" height="2" fill="[^"]+"/>', '', s)  # no red accent rule on the Member badge
    s = s.replace('CGBB Verified Trusted: Website Trust Credential', 'CGBB Member: Website Trust Credential').replace('<title>CGBB Verified Trusted</title>', '<title>CGBB Member</title>')
    open(dst, 'w', encoding='utf-8').write(s)

if __name__ == '__main__':
    d = text_path(sys.argv[1])
    for v in ['', '-dark']:
        make(f'assets/badge/cgbb-verified-trust{v}.svg', f'assets/badge/cgbb-member{v}.svg', d)
    print('ok')
# PNGs (1040x300, 2x): render each SVG in a browser at deviceScaleFactor 2, e.g. with Playwright.
