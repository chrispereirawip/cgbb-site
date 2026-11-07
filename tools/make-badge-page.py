"""Build the badge placement guide at /badge/, /zh/badge/ and /cn/badge/ (Chris, 7 Nov 2026), using each language's
/upgrade/ page as the template (head, header, footer and styles). Run from the repo root: python3 tools/make-badge-page.py
The Traditional Chinese text is converted from the Simplified text with OpenCC (s2twp)."""
import re
from opencc import OpenCC

T2 = OpenCC('s2twp').convert
EX = [('impact5r.com', 'iMpact 美讯', 'https://www.impact5r.com', 'ex-impact5r.png'),
      ('globalconnect.show', 'Global Connect Show', 'https://www.globalconnect.show', 'ex-gcs.png'),
      ('chrisjpereira.com', 'Chris Pereira 彭家荣', 'https://chrisjpereira.com', 'ex-chrisjpereira.png')]

CODE_IMG = ('<a href="https://cgbb.org/verify/?d=yourdomain.com" target="_blank" rel="noopener" title="Verify at cgbb.org">\n'
            '  <img src="https://cgbb.org/assets/badge/cgbb-member.png" alt="CGBB Member · Website Trust Credential. Verify at cgbb.org"\n'
            '       width="180" height="52" loading="lazy">\n</a>')
CODE_LINE = ('<p>✓ <a href="https://cgbb.org/verify/?d=yourdomain.com" target="_blank" rel="noopener">\n'
             '  CGBB Member: verify this site at cgbb.org</a></p>')
CODE_HEAD = '<link rel="alternate" type="application/json" title="CGBB Website Trust Credential" href="/.well-known/trust.json">'

S = {
 'en': dict(
  title='Showing your CGBB badge | Council for Global Brand Building',
  desc='How CGBB members show the CGBB badge on their website: which badge to use, where to place it, the right size, and the code. Every badge links to the live record on cgbb.org.',
  label='Website badge', h1='Show your CGBB badge the right way.',
  lead='The badge tells visitors that your website is on record with CGBB. Every badge links to your live record on cgbb.org, so anyone can check it in one click. Keep it visible, but quiet.',
  cta1='Check a website', cta2='Apply for free membership',
  which='Which badge', mem_t='CGBB Member', mem_p='For members whose membership, website domain and contact are confirmed by the Secretariat. It carries no score.',
  vt_t='CGBB Verified Trusted', vt_p='Only for Advanced members who score 80% or higher in the comprehensive Trust Review.', vt_more='About Verified Trusted →',
  which_note='Show only the badge for the level your record holds. Visitors who click it see your record, so a badge that does not match it will be noticed.',
  where='Where to place it',
  steps=[('Footer, every page', 'The main place for the badge: in the footer, next to your contact details or other recognitions.'),
         ('Next to the decision', 'One short text line by a contact form, checkout or registration button, linking to your record.'),
         ('Optional: About page', 'A sentence about your membership, with the badge, on an About or Trust page.'),
         ('Not front and centre', 'Not in the top banner, navigation, pop-ups or product images. It supports your brand; it is not your brand.')],
  size='Size and style',
  rules=['About 180px wide on desktop; at least 150px on phones, so the words stay readable; never larger than 260px.',
         'Light badge on light backgrounds, dark badge on dark backgrounds.',
         'Keep clear space around it, about the height of the seal.',
         'Do not recolour, crop, stretch, rotate or animate it, and do not add your own text to it.',
         'Always link it to your own record (cgbb.org/verify/?d=your domain), opening in a new tab.',
         'Give it alt text, for screen readers and search engines.'],
  code='The code', code_p='Replace yourdomain.com with your own domain. For a dark background use cgbb-member-dark.png.',
  code1='Badge for the footer', code2='Text line next to a form or button', code3='In your page’s &lt;head&gt;, so AI agents find your credential',
  dl='Download the badge', dl_p='Light and dark versions, as PNG (for websites) and SVG (for print and large sizes).',
  ex='Examples', ex_p='Three CGBB members already show the badge this way. Click a badge on their sites to see how the record opens.', ex_v='Verify →',
  faq='FAQ',
  qa=[('Can we show the Verified Trusted badge?', 'Only after an Advanced membership and a Trust Review score of 80% or higher. Until then, show the CGBB Member badge.'),
      ('Is the badge a certification?', 'No. CGBB Member confirms membership, website domain and contact. It is not a rating or an endorsement of products or services.'),
      ('What if our membership lapses?', 'The record on cgbb.org is withdrawn, so the badge’s link would show that. Remove the badge from your website.'),
      ('Can we use the badge on social media or printed materials?', 'Yes, at a readable size and with the record’s address (cgbb.org/verify/?d=your domain) written next to it, since print cannot link.')]),
 'cn': dict(
  title='网站徽章使用指南 | 全球化品牌信任促进会（品信会）',
  desc='CGBB 会员如何在网站上展示 CGBB 徽章：用哪一款、放在哪里、尺寸多大，以及代码。每个徽章都链接到 cgbb.org 上的实时记录。',
  label='网站徽章', h1='正确展示您的 CGBB 徽章。',
  lead='徽章告诉访客：您的网站已在 CGBB 登记。每个徽章都链接到您在 cgbb.org 上的实时记录，任何人一键即可核验。要看得见，但不喧宾夺主。',
  cta1='核验网站', cta2='免费申请会员',
  which='用哪一款', mem_t='CGBB 会员', mem_p='适用于会员资格、网站域名和联系人已由秘书处确认的会员。不含评分。',
  vt_t='CGBB 认证可信', vt_p='仅适用于在全面信任评审中得分 80% 或以上的进阶会员。', vt_more='了解认证可信 →',
  which_note='只展示与您的记录级别相符的徽章。访客点击后会看到您的记录，不相符的徽章会被发现。',
  where='放在哪里',
  steps=[('每个页面的页脚', '徽章的主要位置：放在页脚，靠近联系方式或其他荣誉。'),
         ('决定之处', '在联系表单、结算或报名按钮旁加一行简短文字，链接到您的记录。'),
         ('可选：关于我们页面', '在“关于我们”或“信任”页面用一句话介绍会员身份，并附上徽章。'),
         ('不要放在最显眼处', '不要放在顶部横幅、导航栏、弹窗或产品图片中。徽章是为品牌加分，不是品牌本身。')],
  size='尺寸与样式',
  rules=['桌面端约 180px 宽；手机端至少 150px，确保文字清晰；最大不超过 260px。',
         '浅色背景用浅色徽章，深色背景用深色徽章。',
         '四周留白，约等于印章的高度。',
         '不要改色、裁剪、拉伸、旋转或加动画，也不要在徽章上添加文字。',
         '务必链接到您自己的记录（cgbb.org/verify/?d=您的域名），在新标签页打开。',
         '为徽章添加替代文字（alt），方便读屏软件和搜索引擎。'],
  code='代码', code_p='把 yourdomain.com 换成您的域名。深色背景请用 cgbb-member-dark.png。',
  code1='页脚徽章', code2='表单或按钮旁的一行文字', code3='放在网页 &lt;head&gt; 中，方便 AI 智能体找到您的凭证',
  dl='下载徽章', dl_p='浅色和深色两款，PNG（网站用）和 SVG（印刷及大尺寸用）。',
  ex='示例', ex_p='以下三家 CGBB 会员已按此方式展示徽章。点击它们网站上的徽章，看看记录如何打开。', ex_v='核验 →',
  faq='常见问题',
  qa=[('我们可以展示“认证可信”徽章吗？', '需先成为进阶会员，并在信任评审中得分 80% 或以上。在此之前，请展示 CGBB 会员徽章。'),
      ('徽章是认证吗？', '不是。CGBB 会员确认的是会员资格、网站域名和联系人，不是对产品或服务的评级或背书。'),
      ('会员资格失效怎么办？', 'cgbb.org 上的记录会被撤回，徽章链接会显示这一点。请从网站上移除徽章。'),
      ('可以在社交媒体或印刷品上使用徽章吗？', '可以，但请保持清晰可读的尺寸，并在旁边写上记录地址（cgbb.org/verify/?d=您的域名），因为印刷品无法点击链接。')]),
}


def esc(s):
    return s.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')


def main_html(L, pre):
    steps = ''.join(f'<div><b>{a}</b><p>{b}</p></div>' for a, b in L['steps'])
    rules = ''.join(f'<li>{r}</li>' for r in L['rules'])
    ex = ''.join(f'<a class="bg-ex" href="{u}" target="_blank" rel="noopener"><img src="/assets/badge/examples/{img}" alt="{n}" loading="lazy" width="560" height="160"><b>{n}</b><span>{d} · <i>{L["ex_v"]}</i></span></a>'.replace(f'{u}" target', f'{u}" target')
                 for d, n, u, img in EX)
    qa = ''.join(f'<details><summary>{q}</summary><div class="ans"><p>{a}</p></div></details>' for q, a in L['qa'])
    pre_ = lambda c: f'<pre class="bg-code">{esc(c)}</pre>'
    return f'''<main>
<section class="bk-hero up-hero"><div class="wrap"><div class="rule"></div><div class="label">{L["label"]}</div><h1>{L["h1"]}</h1><p class="lead">{L["lead"]}</p><div class="bk-cta"><a class="btn btn-red" href="{pre}/verify/">{L["cta1"]}</a><a class="btn btn-line" href="{pre}/apply/">{L["cta2"]}</a></div></div></section>
<section class="bk-sec"><div class="wrap"><div class="rule"></div><h2>{L["which"]}</h2><div class="bg-two"><div><img src="/assets/badge/cgbb-member.svg" width="520" height="150" alt="{L["mem_t"]}"><b>{L["mem_t"]}</b><p>{L["mem_p"]}</p></div><div><img src="/assets/badge/cgbb-verified-trust.svg?v=3" width="520" height="150" alt="{L["vt_t"]}"><b>{L["vt_t"]}</b><p>{L["vt_p"]} <a href="{pre}/upgrade/">{L["vt_more"]}</a></p></div></div><p class="u-note">{L["which_note"]}</p></div></section>
<section class="bk-sec"><div class="wrap"><div class="rule"></div><h2>{L["where"]}</h2><div class="u-steps">{steps}</div></div></section>
<section class="bk-sec"><div class="wrap"><div class="rule"></div><h2>{L["size"]}</h2><ul class="bg-rules">{rules}</ul></div></section>
<section class="bk-sec" id="code"><div class="wrap"><div class="rule"></div><h2>{L["code"]}</h2><p class="u-note" style="margin-top:0">{L["code_p"]}</p><h3 class="bg-h3">{L["code1"]}</h3>{pre_(CODE_IMG)}<h3 class="bg-h3">{L["code2"]}</h3>{pre_(CODE_LINE)}<h3 class="bg-h3">{L["code3"]}</h3>{pre_(CODE_HEAD)}
<h3 class="bg-h3">{L["dl"]}</h3><p class="u-note" style="margin-top:0">{L["dl_p"]}</p><p class="bg-dl"><a href="/assets/badge/cgbb-member.png" download>cgbb-member.png</a><a href="/assets/badge/cgbb-member-dark.png" download>cgbb-member-dark.png</a><a href="/assets/badge/cgbb-member.svg" download>cgbb-member.svg</a><a href="/assets/badge/cgbb-member-dark.svg" download>cgbb-member-dark.svg</a></p></div></section>
<section class="bk-sec" id="examples"><div class="wrap"><div class="rule"></div><h2>{L["ex"]}</h2><p class="u-note" style="margin-top:0">{L["ex_p"]}</p><div class="bg-exs">{ex}</div></div></section>
<section class="bk-sec faq" id="faq"><div class="wrap"><div class="rule"></div><h2>{L["faq"]}</h2><div style="max-width:820px">{qa}</div></div></section>
</main>'''


CSS = ('.bg-two{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-top:8px}.bg-two>div{border:1px solid #e3e3e3;padding:18px;background:#fff}'
       '.bg-two img{width:100%;max-width:300px;height:auto;display:block;margin-bottom:12px}.bg-two b{display:block;font-size:17px;margin-bottom:4px}.bg-two p{margin:0;font-size:14.5px;line-height:1.6}'
       '.bg-rules{margin:8px 0 0;padding-left:20px;max-width:820px;line-height:1.75;font-size:15px}'
       '.bg-h3{font-size:15px;margin:22px 0 8px}.bg-code{margin:0;white-space:pre-wrap;word-break:break-all;background:#f6f6f6;border:1px solid #e3e3e3;padding:12px 14px;font-size:13px;line-height:1.55}'
       '.bg-dl{display:flex;flex-wrap:wrap;gap:8px 18px;margin:0}.bg-dl a{color:#A40706}'
       '.bg-exs{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-top:8px}.bg-ex{display:block;border:1px solid #e3e3e3;background:#fff;text-decoration:none;color:inherit}'
       '.bg-ex img{width:100%;height:auto;display:block;border-bottom:1px solid #eee}.bg-ex b{display:block;padding:12px 14px 2px;font-size:15px}.bg-ex span{display:block;padding:0 14px 14px;font-size:13.5px;color:#5F5F5F}.bg-ex i{font-style:normal;color:#A40706}'
       '@media (max-width:820px){.bg-two,.bg-exs{grid-template-columns:1fr}}')


def build(lang, src, dst, L, pre):
    s = open(src, encoding='utf-8').read()
    s = re.sub(r'<title>.*?</title>', f'<title>{L["title"]}</title>', s, count=1)
    s = re.sub(r'(<meta name="description" content=")[^"]*', lambda m: m.group(1) + L['desc'], s, count=1)
    s = re.sub(r'(<meta property="og:title" content=")[^"]*', lambda m: m.group(1) + L['title'], s, count=1)
    s = re.sub(r'(<meta property="og:description" content=")[^"]*', lambda m: m.group(1) + L['desc'], s, count=1)
    s = re.sub(r'(<link rel="(?:canonical|alternate)"[^>]*|<meta property="og:url"[^>]*)/upgrade/"', r'\1/badge/"', s)  # head: canonical, hreflang, og:url
    s = re.sub(r'<span class="lang">.*?</span>\s*</span>|<span class="lang">.*?</a></span>', lambda m: m.group(0).replace('/upgrade/"', '/badge/"'), s, count=1, flags=re.S)  # language switcher
    s = s.replace('</style>', CSS + '</style>', 1)
    s = re.sub(r'<script type="application/ld\+json">.*?</script>', '', s, flags=re.S)  # the upgrade page's structured data does not apply here
    s = re.sub(r'<main>.*?</main>', lambda m: main_html(L, pre), s, count=1, flags=re.S)
    open(dst, 'w', encoding='utf-8').write(s)


if __name__ == '__main__':
    import os
    zh = {k: (T2(v) if isinstance(v, str) else [tuple(T2(x) for x in i) if isinstance(i, tuple) else T2(i) for i in v]) for k, v in S['cn'].items()}
    zh['title'] = T2(S['cn']['title'])
    for lang, src, pre, L in [('en', 'upgrade/index.html', '', S['en']), ('cn', 'cn/upgrade/index.html', '/cn', S['cn']), ('zh', 'zh/upgrade/index.html', '/zh', zh)]:
        d = {'en': 'badge', 'cn': 'cn/badge', 'zh': 'zh/badge'}[lang]
        os.makedirs(d, exist_ok=True)
        build(lang, src, d + '/index.html', L, pre)
        print('built', d)
