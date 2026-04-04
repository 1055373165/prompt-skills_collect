---
description: https://github.com/garrytan/gstack
name: gstack
---

https://github.com/garrytan/gstack 

git clone https://github.com/garrytan/gstack.git ~/.claude/skills/gstack && cd ~/.claude/skills/gstack && ./setup



/plan-ceo-review：CEO/Founder
Rethink the problem. Find the 10-star product hiding inside the request. Four modes: Expansion, Selective Expansion, Hold Scope, Reduction.
重新思考问题。找到隐藏在请求中的 10 星产品。四种模式：扩展、选择性扩展、保持范围、缩小。

/plan-eng-review：Eng Manager
Lock in architecture, data flow, diagrams, edge cases, and tests. Forces hidden assumptions into the open.
锁定架构、数据流、图表、边缘情况和测试。将隐藏的假设公开化。

/plan-design-review：Senior Designer
80-item design audit with letter grades. AI Slop detection. Infers your design system. Report only — never touches code.
80项设计审核，以字母等级评分。AI模糊检测。推断您的设计系统。仅报告——永不接触代码。

/design-consultation：Design Partner
Build a complete design system from scratch. Knows the landscape, proposes creative risks, generates realistic product mockups. Design at the heart of all other phases.
从头开始构建一个完整的设计系统。了解行业状况，提出创新风险，生成现实的产品原型。设计是所有其他阶段的中心。

/review：Staff Engineer
Find the bugs that pass CI but blow up in production. Auto-fixes the obvious ones. Flags completeness gaps.
找出通过CI测试但在生产中崩溃的bug。自动修复明显的bug。标记完整性差距。

/ship：Release Engineer
Sync main, run tests, audit coverage, push, open PR. Bootstraps test frameworks if you don't have one. One command.
同步主分支，运行测试，审计覆盖率，推送，打开PR。如果没有测试框架，则自动启动。一个命令。

/browse：QA Engineer
Give the agent eyes. Real Chromium browser, real clicks, real screenshots. ~100ms per command.
给特工一双慧眼。真实的 Chromium 浏览器、真实的点击、真实的屏幕截图。每条命令 ~100ms

/qa：QA Lead
Test your app, find bugs, fix them with atomic commits, re-verify. Auto-generates regression tests for every fix.
测试您的应用，找出错误，通过原子提交修复它们，重新验证。为每个修复自动生成回归测试。


/qa-only：QA Reporter
与/qa相同的方法，但仅报告。当您想要一个纯错误报告而不需要代码更改时使用。

/qa-design-review：Designer Who Codes
Same audit as /plan-design-review, then fixes what it finds. Atomic commits, before/after screenshots.
审核与 /plan-design-review 相同，然后修正发现的问题。原子提交，前后截图。

/setup-browser-cookies：Eng Manager
具有团队意识的每周回顾。每个人的细分、出货连胜、测试健康趋势、增长机会。

/document-release：Technical Writer
Update all project docs to match what you just shipped. Catches stale READMEs automatically.
更新所有项目文档以匹配您刚刚发布的版本。自动捕捉过时的README。


开发工作流
0: enter claude code terminal
swtich to plan mode
1: i want to add photo upload for sellers.

2: /plan-ceo-review

"Photo upload" is not the feature. The real job is helping         sellers create listings that actually sell. What if we         auto-identify the product, pull specs and comps from the         web, and draft the listing automatically? That's 10 stars.         "Upload a photo" is 3 stars. Which are we building?         [8 expansion proposals, you cherry-pick 5, defer 3 to backlog]

3: /plan-design-review

Design Score: B  |  AI Slop Score: C         "Upload flow looks like a default Bootstrap form."         [80-item audit, infers your design system, exports DESIGN.md]         [flags 3 AI slop patterns: gradient hero, icon grid, uniform radius]

4: /plan-eng-review
   [ASCII diagrams for every data flow, state machine, error path]         [14-case test matrix, 6 failure modes mapped, 3 security concerns]

5: Approve plan. Exit plan mode.
[Claude writes 2,400 lines across 11 files — models, services,          controllers, views, migrations, and tests. ~8 minutes.]

6: review
Claude: [AUTO-FIXED] Orphan S3 cleanup on failed upload         [AUTO-FIXED] Missing index on listings.status         [ASK] Race condition on hero image selection → You: yes         [traces every new enum value through all switch statements]         3 issues — 2 auto-fixed, 1 fixed. 

7: /qa https://staging.myapp.com （你的本地服务）
Claude: [opens real browser, logs in, uploads photos, clicks through flows]         Upload → classify → enrich → draft: end to end ✓         Mobile: ✓  |  Slow connection: ✓  |  Bad image: ✓         [finds bug: preview doesn't clear on second upload — fixes it]         Regression test generated.

8：/ship
Claude: Tests: 42 → 51 (+9 new)         Coverage: 14/14 code paths (100%)         PR: github.com/you/app/pull/42

#ai开发工作流