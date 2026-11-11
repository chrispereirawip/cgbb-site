"""Build the standard page (/standard/) and the About page (/about/) in English, Traditional and Simplified Chinese
(Chris, 11 Nov 2026). Each language's /faq/ page is the template for the head, header, footer and base styles.
The standard page is generated from the worker's baseline.json, so the public text always matches the scoring engine.
Run from the repo root:  python3 tools/make-standard-about.py ../cgbb-diagnosis/baseline.json
New interface text is written in English and Simplified Chinese; Traditional is converted with OpenCC (s2twp).
The Chinese text of the standard itself is kept in Traditional in baseline.json and converted to Simplified (t2s)."""
import html, json, re, sys
from opencc import OpenCC

S2T = OpenCC('s2twp').convert
T2S = OpenCC('t2s').convert
B = json.load(open(sys.argv[1] if len(sys.argv) > 1 else '../cgbb-diagnosis/baseline.json'))
R = B['rules']
VER = B['version']
e = html.escape
LANGS = {'en': ('', 'en'), 'zh': ('/zh', 'zh-Hant'), 'cn': ('/cn', 'zh-Hans')}


def tr(lang, en, sc):
    """Interface text: English, or Simplified Chinese (converted to Traditional for /zh/)."""
    return en if lang == 'en' else (sc if lang == 'cn' else S2T(sc))


def bl(lang, o):
    """Text from baseline.json ({en, zh}); zh is Traditional."""
    return o['en'] if lang == 'en' else (T2S(o['zh']) if lang == 'cn' else o['zh'])


CSS = """
.sd-hero{padding:34px 0 26px}.sd-hero .wrap{display:grid;grid-template-columns:minmax(0,1.25fr) minmax(0,1fr);gap:44px;align-items:start}
.sd-hero h1{font-size:38px;line-height:1.16;font-weight:500;margin:0 0 14px}.sd-hero .lead{font-size:17px;line-height:1.7;margin:0 0 20px;max-width:640px}
.sd-ctas{display:flex;flex-wrap:wrap;gap:12px}.sd-ctas .btn{min-height:44px;padding:0 20px;font-size:14.5px}
.sd-doc{border:1px solid var(--hair);border-top:3px solid var(--red);background:#fff;box-shadow:0 8px 28px rgba(0,0,0,.06);padding:18px 22px}
.sd-doc h2{font-size:13px;letter-spacing:.14em;text-transform:uppercase;color:var(--red);font-weight:600;margin:0 0 8px}
.sd-doc dl{margin:0;display:grid;grid-template-columns:max-content 1fr;font-size:14.5px;line-height:1.55}
.sd-doc dt{color:var(--grey);padding:7px 18px 7px 0;border-top:1px solid var(--hair)}.sd-doc dd{margin:0;padding:7px 0;border-top:1px solid var(--hair)}
.sd-doc dt:first-of-type,.sd-doc dd:first-of-type{border-top:0}
.sd-pill{display:inline-block;font-size:12px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;padding:2px 8px;background:#fdf1f1;color:var(--red);margin-left:6px}
.sd-toc{position:sticky;top:0;z-index:5;background:#fff;border-top:1px solid var(--ink);border-bottom:1px solid var(--hair)}
.sd-toc .wrap{display:flex;flex-wrap:wrap;gap:4px 22px;padding-top:10px;padding-bottom:10px}.sd-toc a{font-size:14px;font-weight:500;color:var(--ink)}.sd-toc a:hover{color:var(--red)}
.sd-sec{padding:30px 0 6px;scroll-margin-top:60px}.sd-sec h2{font-size:26px;line-height:1.25;margin:0 0 12px}.sd-sec h2 .n{color:var(--red);margin-right:10px}
.sd-sec p,.sd-sec li{font-size:16px;line-height:1.7}.sd-sec p{margin:0 0 12px;max-width:820px}.sd-note{font-size:14.5px!important;color:var(--grey)}
.sd-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:0 28px;margin:6px 0 4px}
.sd-grid>div{border-top:2px solid var(--red);padding:12px 0 14px}.sd-grid h3{font-size:17px;font-weight:500;margin:0 0 6px}.sd-grid p{font-size:15px;line-height:1.65;margin:0;color:#222}
.sd-grid.c4{grid-template-columns:repeat(4,minmax(0,1fr))}.sd-grid.c5{grid-template-columns:repeat(5,minmax(0,1fr))}
.sd-grid a.more{display:inline-block;margin-top:8px;font-size:14.5px;font-weight:500}
.sd-s{border:1px solid var(--hair);margin:0 0 14px}.sd-sh{display:flex;gap:14px;align-items:baseline;padding:14px 18px;background:#faf9f8;border-bottom:1px solid var(--hair)}
.sd-sh b{font-size:22px;color:var(--red);font-weight:600;min-width:20px}.sd-sh h3{font-size:18px;font-weight:500;margin:0}.sd-sh span{font-size:14.5px;color:var(--grey);margin-left:auto;text-align:right}
.sd-s details{border-bottom:1px solid var(--hair);padding:0 18px}.sd-s details:last-child{border-bottom:0}
.sd-s summary{list-style:none;cursor:pointer;display:grid;grid-template-columns:44px 1fr auto 22px;gap:10px;align-items:center;padding:12px 0;font-size:16px}
.sd-s summary::-webkit-details-marker{display:none}.sd-s summary .id{font-weight:600;color:var(--red)}.sd-s summary .ty{font-size:13px;color:var(--grey);white-space:nowrap}
.sd-s summary::after{content:"+";font-size:20px;color:var(--red);text-align:right}.sd-s details[open] summary::after{content:"–"}
.sd-s ol{list-style:none;margin:0 0 14px;padding:0 0 0 54px}.sd-s ol li{display:grid;grid-template-columns:52px 1fr;gap:8px;font-size:15px;line-height:1.6;padding:5px 0;border-top:1px dotted #ddd}
.sd-s ol li span{color:var(--grey);font-variant-numeric:tabular-nums}.sd-s ol li em{font-style:normal;font-size:12px;font-weight:600;color:var(--red);margin-left:8px;white-space:nowrap}
.sd-s .how{font-size:14.5px;line-height:1.6;color:#333;margin:0 0 8px;padding-left:54px}
.sd-t{width:100%;border-collapse:collapse;font-size:15px;line-height:1.55;margin:6px 0 14px}.sd-t th{text-align:left;font-weight:600;border-bottom:1px solid var(--ink);padding:8px 14px 8px 0;font-size:14px}
.sd-t td{border-bottom:1px solid var(--hair);padding:9px 14px 9px 0;vertical-align:top}.sd-t td:first-child{white-space:nowrap;font-weight:500}
.sd-scale{display:grid;grid-template-columns:repeat(5,1fr);gap:2px;margin:6px 0 14px}.sd-scale div{padding:10px 12px;background:#f6f4f2;font-size:14px;line-height:1.4}.sd-scale b{display:block;font-size:15px;color:var(--red)}
.sd-rules{margin:0 0 12px;padding:0;list-style:none;max-width:860px}.sd-rules li{padding:9px 0 9px 18px;border-top:1px solid var(--hair);position:relative}.sd-rules li::before{content:"";position:absolute;left:0;top:19px;width:8px;height:2px;background:var(--red)}
.sd-cite{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:13.5px;line-height:1.6;background:#f6f4f2;padding:12px 14px;max-width:860px;word-break:break-word}
.sd-facts{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:0 26px;border-top:1px solid var(--ink);margin-top:18px}
.sd-facts div{padding:12px 0;border-bottom:1px solid var(--hair)}.sd-facts dt{font-size:12.5px;letter-spacing:.12em;text-transform:uppercase;color:var(--grey);margin-bottom:3px}.sd-facts dd{margin:0;font-size:15.5px;line-height:1.5}
.sd-commit{counter-reset:c;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:0 44px;margin:8px 0 0;padding:0;list-style:none}
.sd-commit li{counter-increment:c;border-top:1px solid var(--hair);padding:14px 0 14px 44px;position:relative}.sd-commit li::before{content:counter(c);position:absolute;left:0;top:14px;width:28px;height:28px;background:var(--red);color:#fff;font-weight:600;font-size:14px;display:flex;align-items:center;justify-content:center}
.sd-commit h3{font-size:17px;font-weight:500;margin:0 0 4px}.sd-commit p{font-size:15px;line-height:1.65;margin:0;color:#222}
.sd-road{margin:6px 0 0;padding:0;list-style:none;max-width:860px}.sd-road li{display:grid;grid-template-columns:200px 1fr;gap:16px;padding:10px 0;border-top:1px solid var(--hair);font-size:15.5px;line-height:1.6}.sd-road li b{color:var(--red);font-weight:600}.sd-road li i{font-style:normal;font-size:12px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--grey);margin-left:8px}
.fbk{display:grid;grid-template-columns:1fr 1fr;gap:12px 18px;max-width:860px;margin:10px 0 6px}.fbk label{display:block;font-size:14px;font-weight:500;margin-bottom:5px}.fbk .full{grid-column:1/-1}
.fbk input,.fbk select,.fbk textarea{width:100%;border:1px solid #bdbdbd;padding:11px 12px;font:inherit;font-size:15.5px;background:#fff;border-radius:0}.fbk textarea{min-height:120px;resize:vertical}
.fbk input:focus,.fbk select:focus,.fbk textarea:focus{outline:2px solid var(--red);outline-offset:-1px}.fbk .hp{position:absolute;left:-9999px}
.fbk .row{display:flex;flex-wrap:wrap;gap:14px;align-items:center}.fbk button{border:0;cursor:pointer;font:inherit}.fbk .msg{font-size:15px;line-height:1.5}.fbk .msg.ok{color:#1c6b33}.fbk .msg.err{color:var(--red)}
.fbk .req{color:var(--red)}
.sd-end{padding:26px 0 44px}
@media(max-width:1000px){.sd-grid.c4,.sd-grid.c5{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media(max-width:860px){.sd-grid.c4,.sd-grid.c5{grid-template-columns:1fr}.sd-hero .wrap{grid-template-columns:1fr;gap:22px}.sd-hero h1{font-size:30px}.sd-commit{grid-template-columns:1fr}.sd-scale{grid-template-columns:1fr 1fr}.sd-sh{flex-wrap:wrap}.sd-sh span{margin-left:0;text-align:left;width:100%}
.sd-s summary{grid-template-columns:38px 1fr 22px}.sd-s summary .ty{display:none}.sd-s ol,.sd-s .how{padding-left:0}.fbk{grid-template-columns:1fr}.sd-road li{grid-template-columns:1fr;gap:2px}.sd-toc{position:static}.sd-t{font-size:14px}.sd-t td:first-child{white-space:normal}}
"""


def form(lang, kinds, subject_label, subject_ph, fid):
    """The public message form. kinds: list of kind ids; one kind = fixed, several = a select."""
    K = {'standard': tr(lang, 'Comment on the standard', '对标准的意见'), 'record': tr(lang, 'Report a badge or registry record', '举报徽章或登记记录'), 'concern': tr(lang, 'Correction or complaint', '更正或投诉')}
    kind = (f'<input type="hidden" name="kind" value="{kinds[0]}">' if len(kinds) == 1 else
            '<div class="full"><label for="%s-k">%s <span class="req">*</span></label><select id="%s-k" name="kind" required>%s</select></div>' % (
                fid, tr(lang, 'What is it about?', '事项类别'), fid, ''.join(f'<option value="{k}">{e(K[k])}</option>' for k in kinds)))
    m = dict(ok=tr(lang, 'Thank you. Your message has reached the Secretariat. Reference: {id}. A confirmation is on its way to your email.', '谢谢。您的信息已送达秘书处，参考编号：{id}。确认邮件已发送至您的邮箱。'),
             email=tr(lang, 'Please enter a valid email address.', '请输入有效的邮箱地址。'),
             empty=tr(lang, 'Please write your message (at least a sentence).', '请填写内容（至少一句话）。'),
             bot=tr(lang, 'Please complete the security check, then send again.', '请先完成安全验证，然后再次发送。'),
             rate=tr(lang, 'Too many messages from this address. Please try again later, or email secretariat@cgbb.org.', '发送过于频繁，请稍后再试，或发邮件至 secretariat@cgbb.org。'),
             fail=tr(lang, 'Sorry, the message could not be sent. Please try again, or email secretariat@cgbb.org.', '抱歉，信息未能发送。请重试，或发邮件至 secretariat@cgbb.org。'),
             sending=tr(lang, 'Sending…', '发送中…'))
    data = ' '.join(f'data-m-{k}="{e(v)}"' for k, v in m.items())
    tsl = {'en': 'en', 'zh': 'zh-tw', 'cn': 'zh-cn'}[lang]
    return f'''<form class="fbk" id="{fid}" data-lang="{lang}" {data} novalidate>
{kind}
<div><label for="{fid}-n">{tr(lang, 'Your name', '姓名')}</label><input id="{fid}-n" name="name" autocomplete="name" maxlength="120"></div>
<div><label for="{fid}-e">{tr(lang, 'Email', '邮箱')} <span class="req">*</span></label><input id="{fid}-e" name="email" type="email" autocomplete="email" required maxlength="254" placeholder="name@company.com"></div>
<div><label for="{fid}-o">{tr(lang, 'Organisation (optional)', '机构（选填）')}</label><input id="{fid}-o" name="org" autocomplete="organization" maxlength="160"></div>
<div><label for="{fid}-s">{e(subject_label)}</label><input id="{fid}-s" name="subject" maxlength="200" placeholder="{e(subject_ph)}"></div>
<div class="full"><label for="{fid}-m">{tr(lang, 'Message', '内容')} <span class="req">*</span></label><textarea id="{fid}-m" name="message" required maxlength="4000"></textarea></div>
<div class="hp" aria-hidden="true"><label>Leave this field empty<input name="website2" tabindex="-1" autocomplete="off"></label></div>
<div class="full"><div class="cf-ts" data-action="feedback" data-language="{tsl}"></div></div>
<div class="full row"><button type="submit" class="btn btn-red">{tr(lang, 'Send to the Secretariat', '发送给秘书处')}</button><span class="msg" role="status" aria-live="polite"></span></div>
</form>'''


TYPE = {'fact': ('Fact checks', '事实核查'), 'external': ('External record', '外部记录'), 'maturity': ('Maturity level', '成熟度等级'), 'record': ('Record scale', '记录等级')}


def standard_body(lang):
    P = LANGS[lang][0]
    t = lambda en, sc: tr(lang, en, sc)
    name = bl(lang, B['name'])
    nchecks = sum(len(i['checks']) for i in B['indicators'])
    pct = lambda x: f'{round(x * 100)}%'
    # --- sections and indicators
    blocks = []
    for s in B['sections']:
        inds = [i for i in B['indicators'] if i['s'] == s['id']]
        rows = []
        for i in inds:
            ty = t(*TYPE[i['type']])
            n = len(i['checks'])
            cnt = (t(f'{n} checks', f'{n} 项核查') if n else t('six-level scale', '六级量表'))
            if i['type'] == 'record':
                inner = '<p class="how">%s</p><ol>%s</ol>' % (
                    t('Rated on the record scale: the level that matches the organisation’s legal, regulatory and governance record.', '按记录等级评定：选择与该机构法律、监管及治理记录相符的等级。'),
                    ''.join(f'<li><span>{r["v"]}</span><div>{e(bl(lang, r))}. {e(bl(lang, r["d"]))}</div></li>' for r in B['record']))
            else:
                how = {'fact': t('Score = 5 × the share of checks met.', '得分 = 5 × 达标核查项所占比例。'),
                       'external': t('Score = the average of the overall performance of the records (1–5) and 5 × the share of checks met. Needs enough records to judge.', '得分 = 记录整体表现（1–5）与「5 × 达标核查项比例」的平均值。须有足够记录方可评定。'),
                       'maturity': t('Score = the maturity level (0–5), limited by the share of checks met.', '得分 = 成熟度等级（0–5），并受达标核查项比例限制。')}[i['type']]
                if i.get('event'):
                    how += ' ' + t(f'If no complaint, dispute or major issue arose in the period, the score is limited to {R["eventCapNoEvent"]}: a prepared process has not yet been tested.', f'若评估期内未发生投诉、纠纷或重大事件，得分上限为 {R["eventCapNoEvent"]}：既有机制尚未经实际检验。')
                lis = ''.join('<li><span>%s</span><div>%s%s</div></li>' % (c['id'], e(bl(lang, c)), ('<em>%s</em>' % t('Key check', '关键项') if c.get('key') else '')) for c in i['checks'])
                inner = f'<p class="how">{how}</p><ol>{lis}</ol>'
            rows.append(f'<details id="{i["id"]}"><summary><span class="id">{i["id"]}</span><span>{e(bl(lang, i))}</span><span class="ty">{ty} · {cnt}</span></summary>{inner}</details>')
        blocks.append(f'<div class="sd-s" id="section-{s["id"]}"><div class="sd-sh"><b>{s["id"]}</b><h3>{e(bl(lang, s))}</h3><span>{e(bl(lang, s["q"]))}</span></div>{"".join(rows)}</div>')
    mat = ''.join(f'<tr><td>{m["v"]} · {e(bl(lang, m))}</td><td>{e(bl(lang, m["d"]))}</td></tr>' for m in B['maturity'])
    capt = ''.join(f'<tr><td>{t("at least", "不少于")} {pct(a)}</td><td>{b}</td></tr>' for a, b in R['maturityCap'] if a > 0) + f'<tr><td>{t("under", "低于")} {pct(R["maturityCap"][-2][0])}</td><td>{R["maturityCap"][-1][1]}</td></tr>'
    st = list(reversed(R['status']))
    bounds = [(x['min'], (st[k + 1]['min'] - 1 if k + 1 < len(st) else 100)) for k, x in enumerate(st)]
    scale = ''.join(f'<div><b>{a}–{b}</b>{e(bl(lang, x))}</div>' for x, (a, b) in zip(st, bounds))
    sup = {x['id']: x for x in R['support']}
    toc = [('scope', t('Scope', '适用范围')), ('principles', t('Principles', '原则')), ('indicators', t('Indicators', '指标')), ('rating', t('Rating', '评级')), ('scoring', t('Scoring', '计分')), ('results', t('Results', '结果')), ('versions', t('Versions', '版本')), ('comment', t('Comment', '提出意见'))]
    return f'''<main>
<section class="sd-hero"><div class="wrap"><div><div class="rule"></div><div class="label">{t('CGBB standard', '品信会标准')}</div>
<h1>{e(name) if lang == 'en' else e(name)}</h1>
<p class="lead">{t(f'The CGBB standard for assessing how well a brand’s trust is evidenced: five sections, {len(B["indicators"])} indicators and fixed scoring rules. This page is the full public text of the current draft.', f'品信会用以评估品牌信任是否有据可查的标准：五个部分、{len(B["indicators"])} 项指标，以及固定的计分规则。本页为现行草案的完整公开文本。')}</p>
<div class="sd-ctas"><a class="btn btn-red" href="#comment">{t('Comment on the draft', '对草案提出意见')}</a><a class="btn btn-line" href="https://api.cgbb.org/standard/baseline.json">{t('Machine-readable version (JSON)', '机器可读版本（JSON）')}</a></div></div>
<aside class="sd-doc" aria-label="{t('Document status', '文件状态')}"><h2>{t('Document status', '文件状态')}</h2><dl>
<dt>{t('Document', '文件')}</dt><dd>{e(name)}</dd>
<dt>{t('Version', '版本')}</dt><dd>{VER}<span class="sd-pill">{t('Beta draft', '测试版草案')}</span></dd>
<dt>{t('In use for', '现用于')}</dt><dd>{t('The members’ self-test (indicative). Not yet used for public ratings.', '会员自测（结果仅供参考），尚未用于公开评级。')}</dd>
<dt>{t('Next', '下一版')}</dt><dd>{t('Version 1, published with the CGBB whitepaper in Hong Kong at the end of November 2026.', '第 1 版，将于 2026 年 11 月底随品信会白皮书在香港发布。')}</dd>
<dt>{t('Maintained by', '维护方')}</dt><dd>{t('CGBB Secretariat', '品信会秘书处')}</dd>
<dt>{t('Comments', '意见征集')}</dt><dd><a href="#comment">{t('Open to everyone', '向所有人开放')}</a></dd>
</dl></aside></div></section>
<div class="sd-toc" role="navigation" aria-label="{t('On this page', '本页内容')}"><div class="wrap">{''.join(f'<a href="#{a}">{k + 1}. {b}</a>' for k, (a, b) in enumerate(toc))}</div></div>
<div class="wrap">
<section class="sd-sec" id="scope"><h2><span class="n">1</span>{t('Scope', '适用范围')}</h2>
<p>{t('The Baseline assesses a brand: the organisation behind it and the public record that organisation has built. It applies to companies of any size, industry or market.', '本基线评估的对象是品牌，即品牌背后的机构及其留下的公开记录。适用于任何规模、行业和市场的企业。')}</p>
<p>{t('It measures how well trust is evidenced. It does not test products, audit accounts or give legal opinions, and a result is not a certification, audit or guarantee of a company’s products, quality, financial standing, compliance or conduct.', '它衡量的是信任是否有据可查。它不检测产品、不审计账目，也不提供法律意见；评估结果不构成对企业产品、质量、财务状况、合规或行为的认证、审计或保证。')}</p></section>
<section class="sd-sec" id="principles"><h2><span class="n">2</span>{t('Principles', '原则')}</h2><div class="sd-grid c5">
<div><h3>{t('Evidence, not claims', '看证据，不看说法')}</h3><p>{t('Every indicator is rated from concrete checks. “Not sure” counts as no evidence.', '每项指标都依据具体的核查项评定。「不确定」视为没有证据。')}</p></div>
<div><h3>{t('Same evidence, same result', '同样的证据，同样的结果')}</h3><p>{t('The rules are fixed and versioned. Nobody adjusts a result by hand.', '规则固定并按版本管理，任何人都不能人为调整结果。')}</p></div>
<div><h3>{t('Risks are not averaged away', '风险不会被平均掉')}</h3><p>{t('A major unresolved risk limits the score, however strong the other sections are.', '尚未解决的重大风险会限制总分，无论其他部分表现多好。')}</p></div>
<div><h3>{t('“Not enough information” is a result', '「信息不足」也是一种结果')}</h3><p>{t('Where the evidence is too thin to judge, the Baseline says so and gives no score.', '证据不足以判断时，基线会如实说明，不给出分数。')}</p></div>
<div><h3>{t('Public rules', '规则公开')}</h3><p>{t('This text, the scoring rules and the change log are public, and anyone can comment.', '本文本、计分规则及变更记录全部公开，任何人均可提出意见。')}</p></div>
</div></section>
<section class="sd-sec" id="indicators"><h2><span class="n">3</span>{t(f'Five sections, {len(B["indicators"])} indicators', f'五个部分，{len(B["indicators"])} 项指标')}</h2>
<p>{t(f'Each section asks one question about the brand. Each indicator is rated from the checks listed under it ({nchecks} checks in all). Select an indicator to read its checks.', f'每个部分针对品牌提出一个问题；每项指标依据其下所列核查项评定（共 {nchecks} 项核查）。点击指标可查看核查项。')}</p>
{''.join(blocks)}
<p class="sd-note">{t('Key checks: if a key check is not met, the indicator is limited to 1. Sections A and C each have a key indicator (A1 and C1).', '关键项：关键核查项未达标时，该指标最高为 1 分。A、C 两部分各有一项关键指标（A1 和 C1）。')}</p></section>
<section class="sd-sec" id="rating"><h2><span class="n">4</span>{t('How an indicator is rated', '指标如何评定')}</h2>
<p>{t('Each check is answered Yes, No, Not sure or Not applicable. Checks that do not apply are left out. Every indicator then gets a rating from 0 to 5, or ND (not enough information).', '每项核查的回答为「是」「否」「不确定」或「不适用」；不适用的项目不计入。随后每项指标得到 0 至 5 的评级，或 ND（信息不足）。')}</p>
<table class="sd-t"><thead><tr><th>{t('Type', '类型')}</th><th>{t('Indicators', '指标')}</th><th>{t('How the 0–5 rating is set', '0–5 评级如何得出')}</th></tr></thead><tbody>
<tr><td>{t(*TYPE['fact'])}</td><td>{', '.join(i['id'] for i in B['indicators'] if i['type'] == 'fact')}</td><td>{t(f'5 × the share of answered checks that are met, rounded. At least {pct(R["indicatorMinKnown"])} of the checks must be answered, otherwise ND.', f'5 × 已回答核查项中达标项的比例，四舍五入。至少须回答 {pct(R["indicatorMinKnown"])} 的核查项，否则为 ND。')}</td></tr>
<tr><td>{t(*TYPE['external'])}</td><td>{', '.join(i['id'] for i in B['indicators'] if i['type'] == 'external')}</td><td>{t('The average of two things: the overall performance shown by the records (1–5), and 5 × the share of checks met. ND if there are too few records to judge.', '取两者的平均值：记录显示的整体表现（1–5），以及 5 × 达标核查项比例。记录过少、不足以判断时为 ND。')}</td></tr>
<tr><td>{t(*TYPE['maturity'])}</td><td>{', '.join(i['id'] for i in B['indicators'] if i['type'] == 'maturity')}</td><td>{t('The maturity level (0–5, table below), limited by how much of it the checks support.', '成熟度等级（0–5，见下表），并受核查项支持程度的限制。')}</td></tr>
<tr><td>{t(*TYPE['record'])}</td><td>{', '.join(i['id'] for i in B['indicators'] if i['type'] == 'record')}</td><td>{t('The matching level on the six-level record scale (0–5).', '在六级记录量表（0–5）中选取相符的等级。')}</td></tr>
</tbody></table>
<div class="sd-grid" style="grid-template-columns:minmax(0,1.6fr) minmax(0,1fr)"><div style="border-top:0;padding-top:0"><table class="sd-t"><thead><tr><th>{t('Maturity level', '成熟度等级')}</th><th>{t('Meaning', '含义')}</th></tr></thead><tbody>{mat}</tbody></table></div>
<div style="border-top:0;padding-top:0"><table class="sd-t"><thead><tr><th>{t('Share of checks met', '达标核查项比例')}</th><th>{t('Highest level allowed', '可评最高等级')}</th></tr></thead><tbody>{capt}</tbody></table></div></div></section>
<section class="sd-sec" id="scoring"><h2><span class="n">5</span>{t('Scoring rules', '计分规则')}</h2>
<ul class="sd-rules">
<li><b>{t('Section rating (0–5).', '部分评级（0–5）。')}</b> {t(f'The average of its rated indicators, to the nearest half point. A section needs at least {R["sectionMinValid"]} rated indicators, and its key indicator must be rated; otherwise it is ND.', f'取该部分已评定指标的平均值，精确到 0.5。每个部分至少须有 {R["sectionMinValid"]} 项已评定指标，且关键指标必须已评定，否则为 ND。')}</li>
<li><b>{t('Weak points limit a section.', '短板会限制部分评级。')}</b> {t(f'If any indicator is rated 0, or the key indicator is rated 0–1, the section is limited to {R["sectionWeakCap"]}.', f'任何一项指标为 0，或关键指标为 0–1 时，该部分最高为 {R["sectionWeakCap"]}。')}</li>
<li><b>{t('Score (0–100).', '总分（0–100）。')}</b> {t('20 × the average of the five section ratings.', '20 × 五个部分评级的平均值。')}</li>
<li><b>{t('Major risks limit the score.', '重大风险会限制总分。')}</b> {t(f'An unresolved major risk, or A1 or C1 rated 0–1, limits the score to {R["majorRiskCap"]}. Section A or C rated 0–1 limits it to {R["foundationCap"]}.', f'存在尚未解决的重大风险，或 A1、C1 评级为 0–1 时，总分上限为 {R["majorRiskCap"]}；A 或 C 部分评级为 0–1 时，上限为 {R["foundationCap"]}。')}</li>
<li><b>{t('Not enough information.', '信息不足。')}</b> {t(f'No score is given if section A or C cannot be rated, if fewer than {R["scoreMinSections"]} sections are rated, or if under {pct(R["scoreMinCoverage"])} of the items have an answer.', f'A 或 C 部分无法评定、已评定部分少于 {R["scoreMinSections"]} 个，或已回答项目不足 {pct(R["scoreMinCoverage"])} 时，不给出总分。')}</li>
<li><b>{t('Evidence support.', '证据支持度。')}</b> {t(f'Reported with every result. High: at least {pct(sup["high"]["coverage"])} of items answered and at least {pct(sup["high"]["external"])} confirmed from an independent source. Medium: at least {pct(sup["medium"]["coverage"])} answered. Low: at least {pct(sup["low"]["coverage"])}.', f'随每个结果一并报告。高：已回答项目不少于 {pct(sup["high"]["coverage"])}，且不少于 {pct(sup["high"]["external"])} 经独立来源核实。中：已回答不少于 {pct(sup["medium"]["coverage"])}。低：不少于 {pct(sup["low"]["coverage"])}。')}</li>
<li><b>{t('Rounding.', '取整。')}</b> {t('All rounding is half up, in whole-number arithmetic, so a result never depends on the computer that calculates it.', '所有取整均采用整数运算的四舍五入，结果不因计算设备而异。')}</li>
</ul>
<div class="sd-scale">{scale}</div></section>
<section class="sd-sec" id="results"><h2><span class="n">6</span>{t('How results are used', '结果如何使用')}</h2>
<table class="sd-t"><thead><tr><th>{t('Use', '用途')}</th><th>{t('Who provides the evidence', '证据由谁提供')}</th><th>{t('What is public', '公开内容')}</th></tr></thead><tbody>
<tr><td>{t('Self-test', '会员自测')} <span class="sd-pill">{t('Beta', '测试版')}</span></td><td>{t('The member answers the checks for its own, badge-confirmed brand. A scan of the brand’s website can confirm answers left as “Not sure”; it never lowers a score.', '会员就其已通过徽章确认的自有品牌回答核查项。官网扫描可为「不确定」的项目补充确认，但绝不会拉低分数。')}</td><td>{t('Nothing. The result is indicative and private to the member and the Secretariat.', '不公开。结果仅供参考，仅会员本人及秘书处可见。')}</td></tr>
<tr><td>{t('Trust Review', '信任评审')} <span class="sd-pill">{t('Not open yet', '尚未开放')}</span></td><td>{t('CGBB checks the evidence behind each indicator. Opens with Advanced Membership, after version 1 is published and has completed a beta period with independent expert review.', '由品信会核查每项指标背后的证据。将随进阶会籍开放，时间在第 1 版发布并完成有独立专家评审的测试期之后。')}</td><td>{t('For brands that meet the published standard: the Verified Trusted level, with the score and section profile, in the registry. None has been issued yet.', '达到已公布标准的品牌：在登记册中显示 Verified Trusted 等级、总分及各部分概况。目前尚未签发。')}</td></tr>
</tbody></table>
<p class="sd-note">{t('The requirements for the Verified Trusted level are published with version 1.', 'Verified Trusted 等级的具体要求将随第 1 版公布。')} <a href="{P}/verify/">{t('How to read a registry record →', '如何查看登记记录 →')}</a></p></section>
<section class="sd-sec" id="versions"><h2><span class="n">7</span>{t('Versions and change log', '版本与变更记录')}</h2>
<p>{t('Every result records the version of the rules it was scored under. When the rules change, the version changes, and the change is listed here.', '每个结果都会记录其所依据的规则版本。规则变更时版本随之变更，并在此列出。')}</p>
<table class="sd-t"><thead><tr><th>{t('Version', '版本')}</th><th>{t('Status', '状态')}</th><th>{t('Notes', '说明')}</th></tr></thead><tbody>
<tr><td>{VER}</td><td>{t('Beta draft · November 2026', '测试版草案 · 2026 年 11 月')}</td><td>{t(f'First public draft: five sections, {len(B["indicators"])} indicators, {nchecks} checks. In use for the members’ self-test.', f'首个公开草案：五个部分、{len(B["indicators"])} 项指标、{nchecks} 项核查。现用于会员自测。')}</td></tr>
<tr><td>{t('Version 1', '第 1 版')}</td><td>{t('Planned · end of November 2026', '计划中 · 2026 年 11 月底')}</td><td>{t('Published with the CGBB whitepaper in Hong Kong, followed by a beta period with independent expert review.', '随品信会白皮书在香港发布，其后进入有独立专家评审的测试期。')}</td></tr>
</tbody></table>
<p style="margin-bottom:6px"><b>{t('How to cite', '引用方式')}</b></p>
<p class="sd-cite">Council for Global Brand Building (2026). <i>CGBB Brand Trust Baseline</i>, beta draft {VER}. https://cgbb.org/standard/</p></section>
<section class="sd-sec" id="comment"><h2><span class="n">8</span>{t('Comment on the draft', '对草案提出意见')}</h2>
<p>{t('Anyone can comment: companies, researchers, journalists, buyers. Tell us which indicator or rule you mean and what you would change. The Secretariat reads every comment, and comments are considered for version 1 and later versions.', '任何人均可提出意见：企业、研究者、记者、买家。请说明所指的指标或规则，以及您建议的修改。秘书处会逐一阅读，并在制定第 1 版及后续版本时予以考虑。')}</p>
{form(lang, ['standard'], t('Indicator or rule (optional)', '所指指标或规则（选填）'), t('e.g. C2, or the major-risk rule', '例如 C2，或重大风险规则'), 'fb-standard')}
</section>
</div><div class="sd-end"></div>
</main>'''


def about_body(lang):
    P = LANGS[lang][0]
    t = lambda en, sc: tr(lang, en, sc)
    commit = [
        (t('One set of rules for everyone', '规则对所有机构一视同仁'), t('Every organisation, including CGBB’s founding institutions, applies in the same way and waits for Secretariat approval before its Website Trust Credential is issued.', '所有机构，包括品信会的创始机构，都以同样方式申请，并须经秘书处批准后才获发网站信任凭证。')),
        (t('A person reviews every application', '每份申请都由人工审核'), t('No application is approved automatically, whether it comes through the website, a partner or an AI agent.', '无论经官网、合作伙伴还是 AI 代理提交，任何申请都不会自动获批。')),
        (t('Results follow published rules', '结果依据公开规则'), t('Baseline results follow the fixed rules in the public standard. The same evidence always gives the same result.', '基线评估结果依据公开标准中的固定规则得出，同样的证据必然得到同样的结果。')),
        (t('Fees do not buy results', '付费不能换取结果'), t('Basic Membership is free. Advanced Membership, when it opens, will pay for the work of a Trust Review, not for its outcome. A brand that does not meet the standard is not listed as Verified Trusted.', '基本会籍免费。进阶会籍开放后，所付费用用于信任评审的工作，而不是评审的结果。未达标准的品牌不会被列为 Verified Trusted。')),
        (t('Membership is not endorsement', '会员资格不等于背书'), t('The Member level confirms who an organisation is and that it controls its website. It is not a certification, rating or endorsement.', 'Member 等级确认的是机构的身份及其对官网的控制权，不构成认证、评级或背书。')),
        (t('Every badge can be checked', '每枚徽章都可核实'), t('A genuine badge links to a live record in the registry. When a membership ends, the record changes at once, and CGBB may act against misuse of its marks.', '真实的徽章会链接到登记册中的实时记录。会籍终止时记录即时变更；对滥用品信会标识的行为，品信会可采取行动。')),
        (t('The standard is open to comment', '标准公开征求意见'), t('Anyone can comment on the draft standard. Changes are versioned and listed in a public change log.', '任何人均可对标准草案提出意见。规则变更按版本管理，并列入公开的变更记录。')),
        (t('Private data stays private', '非公开数据不会公开'), t('Self-test answers and reports are seen only by the member and the Secretariat. The public record shows the organisation, its website, its level and its status.', '自测的回答和报告仅会员本人及秘书处可见。公开记录只显示机构名称、官网、等级及状态。')),
    ]
    road = [
        (t('Sep 2026', '2026 年 9 月'), t('CGBB announced in Geneva, during the WTO Public Forum.', '品信会在日内瓦世贸组织公共论坛期间宣布成立。'), 'done'),
        (t('Nov 2026', '2026 年 11 月'), t('Website Trust Credential and member badge launched. The registry opens to AI agents.', '推出网站信任凭证及会员徽章；登记册向 AI 代理开放。'), 'done'),
        (t('Nov 2026', '2026 年 11 月'), t('Brand Trust Baseline published as a beta draft, open for comment. Members’ self-test in beta.', '品牌可信度基线评估以测试版草案形式公布并公开征求意见；会员自测进入测试阶段。'), 'done'),
        (t('End Nov 2026', '2026 年 11 月底'), t('First whitepaper and version 1 of the standard, released in Hong Kong.', '首份白皮书及标准第 1 版在香港发布。'), 'next'),
        (t('After the beta', '测试期之后'), t('Advanced Membership opens: Trust Reviews and the Verified Trusted level, after independent expert review of the standard.', '进阶会籍开放：在标准经独立专家评审之后，开始信任评审并签发 Verified Trusted 等级。'), 'plan'),
        ('2027', t('Preliminary ranking of reviewed brands; the method refined with first-year results.', '发布经评审品牌的初步排名，并根据首年结果完善方法。'), 'plan'),
    ]
    tag = {'done': t('Done', '已完成'), 'next': t('Next', '下一步'), 'plan': t('Planned', '计划中')}
    return f'''<main>
<section class="sd-hero"><div class="wrap" style="grid-template-columns:1fr"><div><div class="rule"></div><div class="label">{t('About CGBB', '关于品信会')}</div>
<h1 style="max-width:900px">{t('A non-profit council that sets the standards for trust in business.', '为商业信任制定标准的非营利组织。')}</h1>
<p class="lead" style="max-width:860px">{t('The Council for Global Brand Building (CGBB, 品信會) was founded in Hong Kong by a consortium of companies, institutions and media groups, to establish the rules for building trust in global business. It was announced in Geneva in September 2026, during the WTO Public Forum.', '全球化品牌信任促进会（品信会，CGBB）由一批企业、机构及媒体集团在香港共同创立，旨在为全球商业建立信任构建的规则，并于 2026 年 9 月在日内瓦世贸组织公共论坛期间宣布成立。')}</p>
<dl class="sd-facts">
<div><dt>{t('Legal form', '组织形式')}</dt><dd>{t('Non-profit association', '非营利组织')}</dd></div>
<div><dt>{t('Founded in', '创立地')}</dt><dd>{t('Hong Kong', '香港')}</dd></div>
<div><dt>{t('Announced', '宣布成立')}</dt><dd>{t('Geneva, September 2026', '日内瓦，2026 年 9 月')}</dd></div>
<div><dt>{t('Mission', '使命')}</dt><dd>{t('To set the standards for how trust is assessed and rated in business', '建立评估与核实企业及商业信任的标准')}</dd></div>
<div><dt>{t('Contact', '联系')}</dt><dd><a href="mailto:secretariat@cgbb.org">secretariat@cgbb.org</a></dd></div>
</dl></div></div></section>
<div class="wrap">
<section class="sd-sec" id="work"><h2>{t('What CGBB does', '品信会做什么')}</h2><div class="sd-grid c4">
<div><h3>{t('The standard', '标准')}</h3><p>{t('The CGBB Brand Trust Baseline defines how a brand’s trust is assessed: five sections, 15 indicators and fixed scoring rules. The full text is public.', '品牌可信度基线评估界定了如何评估一个品牌的信任：五个部分、15 项指标及固定的计分规则。全文公开。')}</p><a class="more" href="{P}/standard/">{t('Read the standard →', '阅读标准 →')}</a></div>
<div><h3>{t('The registry', '登记册')}</h3><p>{t('The official record of CGBB members and their status. Anyone can check a company’s website, free and without an account. AI agents can check it too.', '品信会会员及其状态的官方记录。任何人都可免费核实一家企业的官网，无需注册；AI 代理同样可以核实。')}</p><a class="more" href="{P}/verify/">{t('Verify a company →', '核实企业 →')}</a></div>
<div><h3>{t('Research', '研究')}</h3><p>{t('Whitepapers, books and papers on how trust is built and measured, written with universities and media partners. The first whitepaper is released in Hong Kong at the end of November 2026.', '与高校及媒体伙伴合作，就信任如何建立与衡量撰写白皮书、著作和论文。首份白皮书将于 2026 年 11 月底在香港发布。')}</p><a class="more" href="{P}/#publications">{t('Publications →', '出版物 →')}</a></div>
<div><h3>{t('Membership', '会籍')}</h3><p>{t('Open to any company, brand or organisation. Basic Membership is free and includes the Website Trust Credential, the member badge and the Baseline self-test.', '向所有企业、品牌及机构开放。基本会籍免费，包含网站信任凭证、会员徽章及基线自测。')}</p><a class="more" href="{P}/apply/">{t('Apply for membership →', '申请会籍 →')}</a></div>
</div></section>
<section class="sd-sec" id="why"><h2>{t('Why trust, and why now', '为什么是信任，为什么是现在')}</h2>
<p>{t('Geopolitics, AI-generated content and automated agents make it harder to know who you are really dealing with. Buyers increasingly ask AI before they ask a person. Trust that can be checked saves everyone time; trust that is only claimed does not travel. CGBB calls the distance between the two the trust gap:', '地缘政治、AI 生成内容和自动化代理，让人越来越难确认交易对象的真实情况；买家也越来越多地先问 AI，再问人。可以核实的信任为各方节省时间，仅靠自述的信任则走不远。品信会把两者之间的距离称为「信任差距」：')}</p>
<div class="sd-grid">
<div><h3>{t('Capability is not perception.', '能力不等于认知。')}</h3><p>{t('Strong products, technology and operations do not automatically shape how a company is seen.', '出色的产品、技术和运营，并不会自动转化为外界对企业的看法。')}</p></div>
<div><h3>{t('Awareness is not trust.', '知名度不等于信任。')}</h3><p>{t('Being known is the start of the work. Being trusted, and being able to show it, is the goal.', '被人知道只是开始；被人信任，并且能够证明，才是目标。')}</p></div>
<div><h3>{t('Entering a market is not belonging to it.', '进入市场不等于融入市场。')}</h3><p>{t('Selling into a market and becoming a trusted part of it call for different capabilities.', '把产品卖进一个市场，与成为这个市场中受信任的一员，需要的是不同的能力。')}</p></div>
</div></section>
<section class="sd-sec" id="integrity"><h2>{t('How CGBB keeps its work impartial', '品信会如何保持公正')}</h2>
<p>{t('A body that sets standards for trust has to be checkable itself. These are the rules CGBB works to.', '为信任制定标准的机构，自身也必须经得起核实。以下是品信会遵循的规则。')}</p>
<ol class="sd-commit">{''.join(f'<li><h3>{e(a)}</h3><p>{e(b)}</p></li>' for a, b in commit)}</ol></section>
<section class="sd-sec" id="roadmap"><h2>{t('Roadmap', '路线图')}</h2>
<ul class="sd-road">{''.join(f'<li><b>{e(a)}<i>{tag[c]}</i></b><span>{e(b)}</span></li>' for a, b, c in road)}</ul>
<p class="sd-note" style="margin-top:12px"><a href="{P}/#leadership">{t('Founders and Expert Committee →', '创始机构与专家委员会 →')}</a></p></section>
<section class="sd-sec" id="concern"><h2>{t('Raise a concern', '提出意见或关切')}</h2>
<p>{t('Use this form to comment on the standard, to report a CGBB badge or registry record that looks wrong, or to ask for a correction or make a complaint about CGBB’s work. No account is needed. The Secretariat reads every message.', '您可通过此表格对标准提出意见、举报可疑的品信会徽章或登记记录，或就品信会的工作要求更正或提出投诉。无需注册。秘书处会逐一阅读。')}</p>
{form(lang, ['concern', 'record', 'standard'], t('Website or subject (optional)', '相关网站或事项（选填）'), t('e.g. brand.com', '例如 brand.com'), 'fb-about')}
</section>
</div><div class="sd-end"></div>
</main>'''


PAGES = {
    'standard': dict(
        title=('CGBB Brand Trust Baseline: the standard | Council for Global Brand Building', '品牌可信度基线评估：标准全文 | 品信会'),
        desc=('The full public text of the CGBB Brand Trust Baseline (beta draft): five sections, 15 indicators, every check, the rating scales and the scoring rules. Open for comment.',
              '品信会品牌可信度基线评估（测试版草案）完整公开文本：五个部分、15 项指标、全部核查项、评级量表及计分规则，公开征求意见。'),
        body=standard_body),
    'about': dict(
        title=('About CGBB | Council for Global Brand Building', '关于品信会 | 全球化品牌信任促进会'),
        desc=('What the Council for Global Brand Building is, what it does, the rules that keep its work impartial, its roadmap, and how to raise a concern.',
              '全球化品牌信任促进会（品信会）是什么、做什么，保持公正所遵循的规则、路线图，以及如何提出意见或关切。'),
        body=about_body),
}


def ld(page, lang, title, desc):
    url = f'https://cgbb.org{LANGS[lang][0]}/{page}/'
    org = {'@id': 'https://cgbb.org/#organization'}
    if page == 'standard':
        o = {'@context': 'https://schema.org', '@type': ['TechArticle', 'DefinedTermSet'], 'name': 'CGBB Brand Trust Baseline', 'headline': title, 'description': desc, 'version': VER, 'creativeWorkStatus': 'Draft',
             'inLanguage': LANGS[lang][1], 'url': url, 'publisher': org, 'author': org, 'datePublished': '2026-11-11', 'isAccessibleForFree': True,
             'encoding': {'@type': 'MediaObject', 'encodingFormat': 'application/json', 'contentUrl': 'https://api.cgbb.org/standard/baseline.json'},
             'hasDefinedTerm': [{'@type': 'DefinedTerm', 'termCode': i['id'], 'name': i['en'], 'inDefinedTermSet': url} for i in B['indicators']]}
    else:
        o = {'@context': 'https://schema.org', '@type': 'AboutPage', 'name': title, 'description': desc, 'inLanguage': LANGS[lang][1], 'url': url, 'about': org, 'publisher': org}
    return '<script type="application/ld+json">' + json.dumps(o, ensure_ascii=False) + '</script>'


def build(page, lang):
    pre, code = LANGS[lang]
    src = open(f'.{pre}/faq/index.html', encoding='utf-8').read()
    head, rest = src.split('<header>', 1)
    header, rest = rest.split('</header>', 1)
    footer = rest[rest.index('<footer>'):]
    p = PAGES[page]
    title, desc = tr(lang, *p['title']), tr(lang, *p['desc'])
    head = re.sub(r'<title>.*?</title>', f'<title>{e(title)}</title>', head, flags=re.S)
    head = re.sub(r'<meta name="description" content="[^"]*">', f'<meta name="description" content="{e(desc)}">', head)
    head = head.replace('/faq/', f'/{page}/')
    head = re.sub(r'<script type="application/ld\+json">.*?</script>', '', head, flags=re.S)
    og = f'<meta property="og:title" content="{e(title)}"><meta property="og:description" content="{e(desc)}"><meta property="og:type" content="article"><meta property="og:url" content="https://cgbb.org{pre}/{page}/"><meta property="og:image" content="https://cgbb.org/assets/logo-horizontal.png"><meta property="og:site_name" content="Council for Global Brand Building"><meta name="twitter:card" content="summary">'
    extra = ('<link rel="alternate" type="application/json" title="CGBB Brand Trust Baseline (JSON)" href="https://api.cgbb.org/standard/baseline.json">' if page == 'standard' else '')
    head = head.replace('</head>', f'{og}{extra}<style id="sd">{CSS}</style>{ld(page, lang, title, desc)}</head>')
    header = header.replace(' aria-current="page"', '')
    header = header.replace(f'href="{pre}/{page}/"', f'href="{pre}/{page}/" aria-current="page"', 1)
    scripts = '<script src="/assets/js/turnstile.js"></script><script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&amp;onload=cgbbTurnstileReady" async defer></script><script src="/assets/js/feedback.js"></script>'
    footer = footer.replace('</body>', scripts + '\n</body>')
    out = head + '<header>' + header + '</header>\n' + p['body'](lang) + '\n' + footer
    import os
    os.makedirs(f'.{pre}/{page}', exist_ok=True)
    open(f'.{pre}/{page}/index.html', 'w', encoding='utf-8').write(out)
    print('built', f'{pre}/{page}/', len(out))


if __name__ == '__main__':
    for page in PAGES:
        for lang in LANGS:
            build(page, lang)
