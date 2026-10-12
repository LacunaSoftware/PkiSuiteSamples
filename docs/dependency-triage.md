# Dependency alert triage

Snapshot taken on 2026-10-11 against `master` at `b9d75cd`. This is a read-only triage: no pull
request, branch or alert was merged, closed, dismissed or deleted. The cleanup that followed it is
described in [Changes after the snapshot](#changes-after-the-snapshot); the rest of this document
still describes the snapshot.

The ASP.NET Core 3.1 + Angular 8 project in `dotnet/spa` was later removed
([#148](https://github.com/LacunaSoftware/PkiSuiteSamples/issues/148)), so its per-package section
and appendix are gone. The summary and the pull request lists below still count its alerts and PRs.

## Summary

GitHub reports **577 open Dependabot alerts: 45 critical, 260 high, 204 medium and 68 low.** The
count moves as GitHub re-scans; it was 579 a few hours earlier. Every open alert comes from one
of five manifests:

| Project | Manifest GitHub scans | Open alerts (critical / high / medium / low) | Open Dependabot PRs | Recommendation |
|---|---|---|--:|---|
| `dotnet/spa` | `ClientApp/package-lock.json` (npm) | **219** (21 / 108 / 69 / 21) | 11 | **Needs the runtime upgrade first** (Angular 8 and ASP.NET Core 3.1). Two unused packages can be removed now. |
| `ruby/rails` | `yarn.lock` (npm) | **195** (17 / 91 / 67 / 20) | 28 | **Remove Webpacker.** Its only pack holds rails-ujs, which no page uses (see below). Keeping it means upgrading the runtime first. |
| `ruby/rails` | `Gemfile.lock` (RubyGems) | **143** (7 / 50 / 61 / 25) | 8 | **Mixed.** Bumping in place up to the Ruby 2.5 ceiling clears 4 of the 7 critical and 37 of the 50 high alerts. The rest needs Ruby 2.7 or later and Rails 7. |
| `nodejs/expressmvc` | `package.json`, no lockfile (npm) | **16** (0 / 8 / 6 / 2) | 0 | **Bump in place** (low risk). |
| `java/springmvc` | `pom.xml` (Maven) | **4** (0 / 3 / 1 / 0) | 2 | **Bump in place** in both `pom.xml` and `build.gradle`. Spring Boot 1.5 itself needs the runtime upgrade, and the alerts do not count it. |
| `php/plain` | `composer.json`, no lockfile | 0 | 0 | **A library we cannot bump**: Guzzle 6, required by every release of `lacuna/amplia-client`. |
| `python/flask`, `python/django` | `requirements.txt` (`>=` floors only) | 0 | 0 | **A library we cannot bump**: `amplia-client` 1.0.0 pins `requests==2.21.0` (Flask only). |
| `dotnet/mvc` | `packages.config` (NuGet) | 0 | 0 | Nothing to do based on the alerts. |

Main findings:

1. **Most alerts come from build tools, not from code that runs in the app.** 414 of the 577
   alerts are in the two JavaScript build toolchains: Angular CLI 8 with webpack 4, karma and
   protractor in the SPA, and Webpacker 4 with webpack-dev-server 3 in Rails. In the SPA, only
   1 critical and 26 high alerts reach code that the app runs: the `@angular/*` packages, plus
   what two unused dependencies pull in. The other 20 critical and 82 high alerts are in
   tooling.
2. **Dependabot security updates are enabled but paused** (`GET /automated-security-fixes`
   returns `"paused": true`). Its newest pull request is from March 2023
   ([#98](https://github.com/LacunaSoftware/PkiSuiteSamples/pull/98)). Dependabot has opened 80
   pull requests here: 49 are still open, 31 were closed, and none was merged. There is no
   root `.github/dependabot.yml`, so version updates are off. `python/flask/.github/dependabot.yml`
   has no effect, because Dependabot reads its configuration only from the repository root.
3. **All 49 open Dependabot branches still merge into `master` without textual conflicts.** Each
   is 186 to 640 commits behind. However, no CI builds or runs the samples (the only workflow
   validates the catalog), so a clean merge does not tell us whether a sample still builds.
   Several of the branches cannot work on the current stack. They need Ruby 2.6 or 2.7, or they
   mix Angular versions (for example an Angular 14 or 15 build tool with Angular 8).
4. **Zero alerts does not mean zero exposure.** PHP, Python, Node.js and Gradle have no lockfile
   that GitHub can read, so it does not see their transitive packages. Lacuna's own client
   libraries pin old HTTP stacks: Guzzle 6 (PHP), `requests` 2.21.0 (Python), `request` and
   axios 0.19 (npm). Neither do the alerts cover the versions that the Spring Boot 1.5 parent
   manages, or the end-of-life runtimes themselves.
5. **Removing unused dependencies clears more than bumping does:**
   - Webpacker in Rails (195 alerts).
   - The unused Rails frameworks: ActiveRecord, ActiveStorage and ActionCable are installed but
     never loaded.
   - `oidc-client` and `aspnet-prerendering` in the SPA.
   - The Rails test-group gems, for which there are no tests.

## Changes after the snapshot

On 2026-10-12, one commit per project applied the low-risk part of the recommendations. Each
project was built and run in Docker, and its home page and sample pages were compared with a run
of the previous code.

| Project | Change | Alerts before | Cleared | Left |
|---|---|--:|--:|--:|
| `ruby/rails` (`yarn.lock`) | **Removed Webpacker.** The `src:` pack tags became `javascript_include_tag` calls with the same URL, `integrity` and `crossorigin`. The layout now sets the CSRF header on jQuery AJAX requests, which rails-ujs used to do for the batch samples. `package.json`, `yarn.lock` and the Webpack, Babel and PostCSS configs are gone, so the app no longer needs Node.js or Yarn. | 195 | 195 | 0 |
| `ruby/rails` (`Gemfile.lock`) | **Replaced `gem 'rails'`** with the frameworks that `config/application.rb` loads: `actionpack`, `actionview`, `activejob`, `activemodel`, `railties` and `sprockets-rails`. This removes Active Record, Active Storage, Action Cable, Action Mailer, Action Mailbox and Action Text, along with `marcel`, `mimemagic`, `mail`, `nio4r` and `websocket-driver`. No other gem version changed. | 143 | 23 | 120 |
| `dotnet/spa` | **Removed `oidc-client`, `aspnet-prerendering` and `node-sass`.** The production bundle is byte-identical. | 219 | 6 | 213 |
| `nodejs/expressmvc` | **Bumped** multer to ^2.3.0, body-parser to ~1.20.6, morgan to ~1.12.1, pug to ~3.0.3 and uuid to ^11.1.1. The 31 `require('uuid/v4')` calls now read `v4` from the package root. | 16 | 16 | 0 |
| `java/springmvc` | **Bumped** gson to 2.8.9 and commons-io to 2.14.0, in both `pom.xml` and `build.gradle`. | 4 | 3 | 1 |
| **Total** | | **577** | **243** | **334** |

The 243 cleared alerts are 22 critical, 112 high, 86 medium and 23 low. The 334 left are 23
critical, 148 high, 118 medium and 45 low. These numbers are an estimate until the change reaches
`master`, where GitHub re-scans it. They come from checking each open alert's vulnerable range
against the manifests on the branch. GitHub's dependency-graph comparison of the branch with
`master` agrees for Rails, Node.js and Java. That comparison also lists two things that look new
but are not:

- 26 SPA packages show as "added". They are the same versions, now marked development-only because
  nothing at runtime depends on them any more.
- The Gemfile now declares `actionpack` and `actionview` as `~> 6.0.1`, so the graph shows their
  advisories against `Gemfile`. These are the same advisories that are already open against
  `Gemfile.lock`.

Effect on the 36 Dependabot PRs that were still open on 2026-10-12 (the 13 in "Close now" below had
been closed by then):

- **27 are moot:**
  - the 25 Rails `yarn.lock` PRs, because the file is gone: #8, #14, #15, #16, #17, #20, #22, #24,
    #29, #31, #32, #33, #34, #35, #36, #38, #48, #49, #60, #65, #73, #88, #89, #90 and #93
  - #9 (`websocket-extensions`), because the gem is gone
  - #64 (gson 2.8.9), because the same bump is now in both build files
- **4 now conflict** with the new lockfiles, and their packages are still installed: #11 (rack),
  #84 (addressable) and #94 (globalid) in `Gemfile.lock`, and #53 (karma) in the SPA's
  `package-lock.json`.
- **5 still merge cleanly:** #61, #62, #78, #81 and #85 (SPA lockfile only).

Still to do:

- Replacing `com.lowagie:itext:4.2.0` with `com.itextpdf:itextpdf:5.5.13.6` in the Java sample.
- Committing a `package-lock.json` for `nodejs/expressmvc`. The project's `.gitignore` excludes it
  today.
- The runtime upgrades.

## How this was checked

- Alerts: `gh api repos/LacunaSoftware/PkiSuiteSamples/dependabot/alerts --paginate` (open and
  closed). Pull requests and branches: `gh pr list` and `git branch -r`.
- **Direct or transitive.** GitHub's own `relationship` field is `unknown` for 147 alerts, so
  this report uses its own classification. A package is direct when the project's
  `package.json` or `Gemfile` lists it. Otherwise it is transitive. The "pulled in by" column
  walks the lockfile's dependency graph up to the direct dependencies.
- **Would the branch fix it.** Each Dependabot branch was merged into the current `master` in
  memory (`git merge-tree --write-tree`), and the lockfile of the merged tree was parsed. An
  alert counts as fixed when no installed version of its package is still inside the
  advisory's vulnerable range. "n/m" means the branch clears n of the m open alerts on that
  package.
- **Ruby compatibility.** The `required_ruby_version` of each gem version was read from the
  rubygems.org API.
- Nothing was built or run. The verdicts below about whether a branch can build come from
  version requirements, not from test runs.

## ruby/rails: `Gemfile.lock`

143 open alerts (7 critical, 50 high). All of them are transitive. The Gemfile lists only
`rails`, `sass-rails`, `webpacker`, `jbuilder`, `prawn`, the Lacuna gems and the dev and test
tools.

Facts that change the picture:

- **The app does not load most of Rails.** `config/application.rb` requires only
  `active_model`, `active_job`, `action_controller`, `action_view`, `sprockets` and
  `test_unit`. The lines for `active_record`, `active_storage`, `action_cable`, `action_mailer`,
  `action_mailbox` and `action_text` are commented out. Their gems are installed only because
  the Gemfile says `gem 'rails'`. So the `activestorage`, `activerecord`, `websocket-driver`
  and `websocket-extensions` alerts cannot be reached: 4 critical and 7 high. Listing the used
  frameworks instead of `rails` would remove them. It would also remove `marcel` and
  `mimemagic`, which come only from ActiveStorage. `mimemagic` is the gem that broke fresh
  installs in [#124](https://github.com/LacunaSoftware/PkiSuiteSamples/pull/124).
- **The test group is unused.** `test/` contains only the generated scaffolding (`.keep` files
  and `application_system_test_case.rb`). `capybara`, `selenium-webdriver` and `webdrivers` are
  the only source of `rubyzip` (1 high, with no fix that runs on Ruby 2.5) and `addressable`
  (2 high).
- **Ruby 2.5 is the ceiling.** nokogiri 1.13 needs Ruby 2.6, 1.14 needs 2.7, and the release
  that fixes everything (1.19.x) needs 3.2. On Ruby 2.5 the newest nokogiri is 1.12.5, which
  clears 7 of the 35 nokogiri alerts. Rails 7.0 and 7.1 need Ruby 2.7, and 7.2 needs 3.1.

| Package | Critical | High | All alerts | Installed | Fixed in | Best fix on Ruby 2.5 | Loaded by the app? | Dependabot PR |
|---|--:|--:|--:|---|---|---|---|---|
| `activestorage` | 3 | 2 | 10 | 6.0.1 | 7.2.3.2 | 6.0.6.1 clears 1 critical and 1 high | No | none |
| `rack` | 1 | 16 | 35 | 2.0.7 | 2.2.23 | **2.2.23 clears all** (Rails 6.0 accepts rack 2.2) | Yes | [#11](https://github.com/LacunaSoftware/PkiSuiteSamples/pull/11) (10/35) |
| `nokogiri` | 1 | 14 | 35 | 1.10.5 | 1.19.4 (Ruby 3.2) | 1.12.5 clears 4 high and 3 medium | Yes (Action View's sanitizer) | [#91](https://github.com/LacunaSoftware/PkiSuiteSamples/pull/91), [#92](https://github.com/LacunaSoftware/PkiSuiteSamples/pull/92), [#98](https://github.com/LacunaSoftware/PkiSuiteSamples/pull/98) (17/35 each, but they need Ruby 2.6 or 2.7) |
| `activerecord` | 1 | 3 | 5 | 6.0.1 | 7.1.5.2 | 6.0.6.1 clears 1 critical and 2 high. 6.1.7.10 clears all the critical and high alerts | No | none |
| `activesupport` | 1 | | 7 | 6.0.1 | 7.2.3.1 | 6.0.6.1 clears the critical | Yes | none |
| `actionpack` | | 5 | 18 | 6.0.1 | 7.0.8.7 | 6.0.6.1 clears all 5 high (12/18) | Yes | none |
| `addressable` | | 2 | 2 | 2.7.0 | 2.9.0 | 2.9.0 clears all | Test group only | [#84](https://github.com/LacunaSoftware/PkiSuiteSamples/pull/84) (1/2) |
| `loofah` | | 2 | 4 | 2.4.0 | 2.25.2 | 2.25.2 clears all (works with nokogiri 1.12) | Yes | [#91](https://github.com/LacunaSoftware/PkiSuiteSamples/pull/91), [#92](https://github.com/LacunaSoftware/PkiSuiteSamples/pull/92) (3/4) |
| `concurrent-ruby` | | 1 | 3 | 1.1.5 | 1.3.7 | 1.3.7 clears all. Rails versions before 7.1 also need `require "logger"` at the top of `config/boot.rb` from concurrent-ruby 1.3.5 on | Yes | none |
| `rails-html-sanitizer` | | 1 | 6 | 1.3.0 | 1.7.1 (Ruby 2.7) | 1.4.4 clears the high (5/6) | Yes | [#92](https://github.com/LacunaSoftware/PkiSuiteSamples/pull/92) (5/6) |
| `rubyzip` | | 1 | 1 | 2.0.0 | 3.4.0 (Ruby 3.0) | none | Test group only | none |
| `tzinfo` | | 1 | 1 | 1.2.5 | 1.2.10 | 1.2.10 clears all | Yes | [#75](https://github.com/LacunaSoftware/PkiSuiteSamples/pull/75), [#94](https://github.com/LacunaSoftware/PkiSuiteSamples/pull/94) (all) |
| `websocket-driver` | | 1 | 4 | 0.7.1 | 0.8.2 | 0.8.2 clears all | No (ActionCable) | none |
| `websocket-extensions` | | 1 | 1 | 0.1.4 | 0.1.5 | 0.1.5 clears all | No (ActionCable) | [#9](https://github.com/LacunaSoftware/PkiSuiteSamples/pull/9) (all) |

**Recommendation: mixed.** On Ruby 2.5, bump in place:

- `rack` to 2.2.23
- `rails` to 6.0.6.1, the last 6.0 release (or 6.1.7.10, which still runs on Ruby 2.5 but is a
  framework upgrade)
- `nokogiri` to 1.12.5, `loofah` to 2.25.2 and `rails-html-sanitizer` to 1.4.4
- `tzinfo` to 1.2.10, `addressable` to 2.9.0, and `concurrent-ruby` to 1.3.7 together with the
  `logger` line in `config/boot.rb`
- Optionally, replace `gem 'rails'` with the frameworks the app loads, and drop the unused
  test group.

The bumps clear 4 of the 7 critical and 37 of the 50 high alerts (84 of the 143 alerts in
total). Most of what remains sits in gems the app does not load (`activestorage`,
`activerecord`) or in the test group only (`rubyzip`), and the optional step removes those. That
leaves nokogiri with 1 critical and 10 high alerts. Their fixes need Ruby 2.6 to 3.2, so that
part needs the runtime upgrade first.

| PR | Bump | Alerts it clears (critical / high / medium / low) | Verdict |
|---|---|---|---|
| [#98](https://github.com/LacunaSoftware/PkiSuiteSamples/pull/98) | `nokogiri` 1.10.5 → 1.14.2 | 0 / 12 / 5 / 0 | **Close.** nokogiri 1.14 needs Ruby 2.7, so `bundle install` fails on Ruby 2.5.3. It belongs to the runtime upgrade. |
| [#92](https://github.com/LacunaSoftware/PkiSuiteSamples/pull/92) | `rails-html-sanitizer` 1.3.0 → 1.4.4 | 0 / 15 / 10 / 0 | **Close.** The lockfile pins nokogiri 1.13.10, which needs Ruby 2.6. Redo it as `rails-html-sanitizer` 1.4.4, `loofah` 2.25.2 and nokogiri 1.12.5. |
| [#91](https://github.com/LacunaSoftware/PkiSuiteSamples/pull/91) | `loofah` 2.4.0 → 2.19.1 | 0 / 14 / 6 / 0 | **Close.** It has the same nokogiri 1.13.10 problem, and #92 contains the same change. |
| [#75](https://github.com/LacunaSoftware/PkiSuiteSamples/pull/75) | `tzinfo` 1.2.5 → 1.2.10 | 0 / 1 / 0 / 0 | **Close (duplicate).** #94 makes the same `tzinfo` bump. |
| [#11](https://github.com/LacunaSoftware/PkiSuiteSamples/pull/11) | `rack` 2.0.7 → 2.2.3 | 1 / 5 / 1 / 3 | **Close when replaced.** It leaves 11 high alerts on rack. Bump to 2.2.23 instead. |
| [#84](https://github.com/LacunaSoftware/PkiSuiteSamples/pull/84) | `addressable` 2.7.0 → 2.8.1 | 0 / 1 / 0 / 0 | **Close when replaced.** It leaves 1 high alert. Bump to 2.9.0, or drop `capybara`. |
| [#94](https://github.com/LacunaSoftware/PkiSuiteSamples/pull/94) | `globalid` 0.4.2 → 1.0.1 (also `tzinfo` 1.2.10, `concurrent-ruby` 1.1.10, `i18n`, `minitest`, `zeitwerk`) | 0 / 1 / 0 / 1 | Still valid. Every gem in it supports Ruby 2.5. |
| [#9](https://github.com/LacunaSoftware/PkiSuiteSamples/pull/9) | `websocket-extensions` 0.1.4 → 0.1.5 | 0 / 1 / 0 / 0 | Still valid, but the app does not load the gem (ActionCable). |

Side effect to know about: Dependabot resolved these lockfiles on Linux. Each branch adds a
platform (`x86_64-linux` or `ruby`) next to the existing `x64-mingw32`, plus generic entries for
`ffi`, `msgpack`, `nokogiri`, `sassc` and similar gems. #124 deliberately kept the lockfile
Windows-only.

## ruby/rails: `yarn.lock`

195 open alerts (17 critical, 91 high). All of them are transitive, and all come from
`@rails/webpacker` 4.2 (webpack 4, node-sass 4, Babel 7.7) or from `webpack-dev-server` 3. That
is the asset build toolchain; none of these packages reaches the browser. The full table is in
the [appendix](#appendix-a-rubyrails-yarnlock).

**Webpacker does almost nothing in this app:**

- `app/javascript/packs/application.js` contains only `require("@rails/ujs").start()`. The
  layout loads it, but no view uses a rails-ujs feature: there is no `data-remote`,
  `data-method` or `data-confirm`.
- The other 22 `javascript_pack_tag :application, src: 'https://get.webpkiplugin.com/...'`
  calls pass a `src:` option. In Rails 6.0 that option replaces the pack's path, so those tags
  load Web PKI from the CDN. Webpacker only has to find `application.js` in its manifest.

**Recommendation: remove Webpacker.** The steps are:

1. Turn those 22 tags into `javascript_include_tag` calls with the same URL, `integrity` and
   `crossorigin`.
2. Drop the layout's pack tag.
3. Delete `package.json`, `yarn.lock`, `config/webpacker.yml`, `config/webpack/`,
   `bin/webpack*` and the `webpacker` gem.

This clears all 195 alerts. It also removes the Node.js 14 and Yarn prerequisites from the run
instructions. Keeping Webpacker means waiting for the runtime upgrade: Webpacker is retired, and
its successors need a newer Ruby, Rails and Node.js.

If Webpacker is removed, all 28 PRs below become obsolete. If it is kept:

| Verdict | PRs |
|---|---|
| **Close (obsolete): fixes no open alert** | [#10](https://github.com/LacunaSoftware/PkiSuiteSamples/pull/10) `websocket-extensions` 0.1.4. Its only alert was auto-dismissed as development-only on 2025-07-24. |
| **Close (duplicate): another open PR makes the same bump** | [#52](https://github.com/LacunaSoftware/PkiSuiteSamples/pull/52) `url-parse` 1.5.10, also in [#65](https://github.com/LacunaSoftware/PkiSuiteSamples/pull/65). [#27](https://github.com/LacunaSoftware/PkiSuiteSamples/pull/27) `lodash` 4.17.21, also in [#60](https://github.com/LacunaSoftware/PkiSuiteSamples/pull/60). |
| **Close when replaced: alerts remain on the same package** | [#14](https://github.com/LacunaSoftware/PkiSuiteSamples/pull/14) node-sass, [#20](https://github.com/LacunaSoftware/PkiSuiteSamples/pull/20) elliptic, [#22](https://github.com/LacunaSoftware/PkiSuiteSamples/pull/22) y18n, [#24](https://github.com/LacunaSoftware/PkiSuiteSamples/pull/24) ssri, [#31](https://github.com/LacunaSoftware/PkiSuiteSamples/pull/31) browserslist, [#33](https://github.com/LacunaSoftware/PkiSuiteSamples/pull/33) ws, [#34](https://github.com/LacunaSoftware/PkiSuiteSamples/pull/34) postcss, [#36](https://github.com/LacunaSoftware/PkiSuiteSamples/pull/36) yargs-parser, [#48](https://github.com/LacunaSoftware/PkiSuiteSamples/pull/48) ajv, [#49](https://github.com/LacunaSoftware/PkiSuiteSamples/pull/49) follow-redirects, [#88](https://github.com/LacunaSoftware/PkiSuiteSamples/pull/88) decode-uri-component, [#89](https://github.com/LacunaSoftware/PkiSuiteSamples/pull/89) qs, [#90](https://github.com/LacunaSoftware/PkiSuiteSamples/pull/90) express, [#93](https://github.com/LacunaSoftware/PkiSuiteSamples/pull/93) json5 |
| **Still valid: clears every open alert on its package; lockfile only** | [#8](https://github.com/LacunaSoftware/PkiSuiteSamples/pull/8) acorn, [#15](https://github.com/LacunaSoftware/PkiSuiteSamples/pull/15) http-proxy, [#16](https://github.com/LacunaSoftware/PkiSuiteSamples/pull/16) dot-prop, [#17](https://github.com/LacunaSoftware/PkiSuiteSamples/pull/17) ini, [#29](https://github.com/LacunaSoftware/PkiSuiteSamples/pull/29) hosted-git-info, [#32](https://github.com/LacunaSoftware/PkiSuiteSamples/pull/32) dns-packet, [#35](https://github.com/LacunaSoftware/PkiSuiteSamples/pull/35) color-string, [#38](https://github.com/LacunaSoftware/PkiSuiteSamples/pull/38) path-parse, [#60](https://github.com/LacunaSoftware/PkiSuiteSamples/pull/60) async (also lodash), [#65](https://github.com/LacunaSoftware/PkiSuiteSamples/pull/65) eventsource (also url-parse), [#73](https://github.com/LacunaSoftware/PkiSuiteSamples/pull/73) terser |

## nodejs/expressmvc: `package.json`

16 open alerts (8 high), all on direct dependencies. There are no Dependabot PRs. The project
has no `package-lock.json`, so GitHub sees only the dependencies that `package.json` declares.
Every flagged package has a version range that cannot reach the fixed release. Caret ranges
such as `express ^4.16.4` resolve to a fixed release on a fresh install, and are not flagged.

| Package | Range in `package.json` | Critical / high / medium / low | Fixed in | Notes |
|---|---|---|---|---|
| `multer` | `^1.4.1` | 0 / 7 / 0 / 1 | 2.3.0 | Used only in `routes/upload.js` (`multer().single('userfile')`). Multer 2 keeps that API. |
| `body-parser` | `~1.18.3` | 0 / 1 / 0 / 1 | 1.20.6 | Used in `app.js`. Express 4.16 and later include `express.json()` and `express.urlencoded()`, so body-parser can be dropped. |
| `morgan` | `~1.9.1` | 0 / 0 / 3 / 0 | 1.12.1 | |
| `pug` | `~2.0.3` | 0 / 0 / 2 / 0 | 3.0.3 | Pug 3 has breaking changes. Render each view once. |
| `uuid` | `^3.3.2` | 0 / 0 / 1 / 0 | 11.1.1 | 33 files call `require('uuid/v4')`, which uuid 8 removed. The advisory affects only v3, v5 and v6 with a `buf` argument, which the samples do not use. `crypto.randomUUID()` (Node.js 14.17 and later) can replace the package. |

GitHub cannot see Lacuna's npm clients pulling in old HTTP libraries:

- `restpki-client` 2.3.8 depends on axios `^0.19.2`.
- `restpki-core-client` 1.0.2 and `amplia-client` 1.3.3 depend on `request` `^2.88`, which is
  deprecated and unmaintained.
- `pki-express` 1.16.2 depends on `tmp` `^0.0.33`.

**Recommendation: bump in place (low risk).** Also commit a `package-lock.json`, so that
Dependabot can see the transitive dependencies. The client-library issues have to be fixed in
the libraries themselves.

## java/springmvc: `pom.xml`

4 open alerts:

| Package | Declared | Severity | Fixed in | Dependabot PR |
|---|---|---|---|---|
| `com.google.code.gson:gson` | 2.8.5 | high | 2.8.9 | [#64](https://github.com/LacunaSoftware/PkiSuiteSamples/pull/64) → 2.8.9 (clears it) |
| `com.lowagie:itext` | 4.2.0 | high | no fix | none |
| `commons-io:commons-io` | 2.4 | high (`< 2.14.0`), medium (`< 2.7`) | 2.14.0 | [#26](https://github.com/LacunaSoftware/PkiSuiteSamples/pull/26) → 2.7 (clears the medium only) |

All three packages are direct dependencies, and the following points apply to them:

- **GitHub flags `pom.xml` only, but the documented run path is Gradle.** `build.gradle`
  declares the same three dependencies at the same versions, and GitHub raises no alert from it.
  Both Dependabot PRs edit only `pom.xml`.
- **`com.lowagie:itext:4.2.0` is a relocation.** Its POM on Maven Central relocates it to
  `com.itextpdf:itextpdf:5.5.6`, which is the library the code imports (`com.itextpdf.text.*`
  in `ReceitaSimplesExpressController`, `ReceitaSimplesRestController` and
  `prescricao/PdfGeneration`). Declare `com.itextpdf:itextpdf` directly at the latest 5.5.x
  (5.5.13.6). It has the same API and the same AGPL license, and it removes this unfixable
  alert.
- **The alerts do not include the Spring Boot 1.5.18 parent.** That parent manages Spring
  Framework 4.3, embedded Tomcat 8.5 and the other framework versions, and GitHub reads only
  explicit versions. Spring Boot 1.5 has been out of support since 2019, so that part needs the
  runtime upgrade.

**Recommendation: bump in place (low risk)**, in both build files:

- gson to 2.8.9 or later
- commons-io to 2.14.0 or later (check that the chosen version still supports Java 8)
- iText to `com.itextpdf:itextpdf:5.5.13.6`

Close #26 now, because commons-io 2.7 does not clear the high alert. Close #64 once a combined
change replaces it.

## php/plain: `composer.json`

There are no open alerts. GitHub closed 7 `tecnickcom/tcpdf` alerts as fixed on 2025-12-19,
although `composer.json` still says `^6.3.5`. A fresh install gets the latest 6.x release,
which is fixed. There is no `composer.lock`, so GitHub cannot tell which version is installed,
and it does not see transitive packages.

The real problem is upstream. Every release of `lacuna/amplia-client` (the latest is 1.3.0)
requires `guzzlehttp/guzzle ^6.0`:

- Guzzle 6.5.8, the last 6.x release, is affected by advisories that have no 6.x fix. Examples
  are CVE-2026-55767 and CVE-2026-55568, fixed in 7.12.1.
- `guzzlehttp/psr7` 1.9.1 is affected by CVE-2026-55766, fixed in 2.12.1.
- Composer's advisory blocking refuses to install these releases. That is why the README now
  says to run `composer config policy.advisories.block false`, as added in #124.
- `lacuna/cloudhub-client` 2.0.2 accepts Guzzle 7 and 8, but it cannot be bumped while
  `amplia-client` holds Guzzle at 6.

**Recommendation: a library we cannot bump.** This needs an `amplia-client` release that accepts
Guzzle 7. Meanwhile, raising the floor to `tecnickcom/tcpdf: ^6.8` is a trivial and
low-risk change.

## python/flask and python/django: `requirements.txt`

There are no open alerts. GitHub closed three alerts as fixed in 2022: two on Django and one
on PyPDF2. Every requirement is a `>=` floor with no lockfile, so GitHub cannot tell which
version gets installed.

The real problem is upstream again. `amplia-client` 1.0.0, the latest release on PyPI and used
by Flask only, pins `requests==2.21.0`, `six==1.12.0` and `simplejson==3.16.0`:

- `requests` 2.21.0 and the urllib3 1.24 release it pulls in both have published advisories.
- The pin also keeps the Flask sample from starting on Python 3.12 and later, because urllib3
  1.24 cannot be imported there. The `distutils` import in `pkiexpress` 1.10.4 has the same
  effect.

**Recommendation: a library we cannot bump.** This needs a new `amplia-client` release. Django
does not use `amplia-client`.

## dotnet/mvc: `packages.config`

There are no open alerts. Two `System.Text.Encodings.Web` alerts were fixed in 2022. GitHub does
scan this file, and nothing else is flagged. **Nothing to do based on the alerts.**

## Dependabot PRs that are safe to close

There are 49 open Dependabot PRs, with one branch each and no orphans on either side, so
closing a PR is all it takes (Dependabot deletes its own branch). Dependabot does not reopen a
closed PR for the same version. Once it is unpaused, it opens new PRs for the versions that fix
today's alerts.

**Close now: 13 PRs, which are obsolete, cannot build on the current stack, or duplicate
another PR.**

| PR | Project | Reason |
|---|---|---|
| [#10](https://github.com/LacunaSoftware/PkiSuiteSamples/pull/10) | Rails yarn | Obsolete. No open alert is left on `websocket-extensions` (npm). |
| [#79](https://github.com/LacunaSoftware/PkiSuiteSamples/pull/79) | SPA | Obsolete. No open alert is left on `engine.io`. |
| [#67](https://github.com/LacunaSoftware/PkiSuiteSamples/pull/67) | SPA | Cannot build: Angular core 11 with the rest of Angular on 8. |
| [#80](https://github.com/LacunaSoftware/PkiSuiteSamples/pull/80) | SPA | Cannot build: Angular 14 builder on Angular 8. #86 also supersedes it. |
| [#86](https://github.com/LacunaSoftware/PkiSuiteSamples/pull/86) | SPA | Cannot build: Angular 15 builder on Angular 8. |
| [#82](https://github.com/LacunaSoftware/PkiSuiteSamples/pull/82) | SPA | Bumps `node-sass`, which is deprecated and has no Sass sources to compile. Remove it instead. |
| [#98](https://github.com/LacunaSoftware/PkiSuiteSamples/pull/98) | Rails gems | Needs Ruby 2.7 (nokogiri 1.14). |
| [#92](https://github.com/LacunaSoftware/PkiSuiteSamples/pull/92) | Rails gems | Needs Ruby 2.6 (nokogiri 1.13.10). |
| [#91](https://github.com/LacunaSoftware/PkiSuiteSamples/pull/91) | Rails gems | Needs Ruby 2.6 (nokogiri 1.13.10). #92 also includes it. |
| [#75](https://github.com/LacunaSoftware/PkiSuiteSamples/pull/75) | Rails gems | Duplicate of the `tzinfo` 1.2.10 bump in #94. |
| [#52](https://github.com/LacunaSoftware/PkiSuiteSamples/pull/52) | Rails yarn | Duplicate of the `url-parse` 1.5.10 bump in #65. |
| [#27](https://github.com/LacunaSoftware/PkiSuiteSamples/pull/27) | Rails yarn | Duplicate of the `lodash` 4.17.21 bump in #60. |
| [#26](https://github.com/LacunaSoftware/PkiSuiteSamples/pull/26) | Java | Bumps commons-io to 2.7, but the high alert needs 2.14.0. It also edits `pom.xml` only. |

**Close when a fresh bump replaces them: 18 PRs.**

- #64 (Java) clears the gson alert, but only in `pom.xml`.
- The other 17 clear some alerts but leave others open on the same package: #11 and #84 (Rails
  gems), #85 (SPA), and #14, #20, #22, #24, #31, #33, #34, #36, #48, #49, #88, #89, #90 and #93
  (Rails yarn).

**Still valid as they are: 18 PRs.** They clear every open alert on their package, and all of
them except #53 change only a lockfile:

- SPA: #61, #62, #78 and #81, plus #53 if `ng test` passes.
- Rails gems: #9 and #94.
- Rails yarn: #8, #15, #16, #17, #29, #32, #35, #38, #60, #65 and #73.

All 11 Rails yarn PRs become obsolete if Webpacker is removed, and the SPA ones become obsolete
with the Angular upgrade.

## Appendix A: ruby/rails `yarn.lock`

Critical and high alerts, grouped by package. "Fixed in" is the lowest version that clears every
open alert on the package. "One has no fix" means that one of the package's advisories has no
patched version at all.

| Package | Critical | High | All alerts | Installed | Fixed in | Direct or pulled in by | Dependabot PR (alerts it clears) |
|---|--:|--:|--:|---|---|---|---|
| `minimist` | 2 |  | 4 | 0.0.8, 1.2.0 | 1.2.6 | via `@rails/webpacker`, `webpack-dev-server` | [#14](https://github.com/LacunaSoftware/PkiSuiteSamples/pull/14) (2/4), [#93](https://github.com/LacunaSoftware/PkiSuiteSamples/pull/93) (2/4) |
| `pbkdf2` | 2 |  | 3 | 3.0.17 | 3.1.7 | via `@rails/webpacker` | - |
| `tar` | 1 | 14 | 19 | 2.2.2, 4.4.13 | 7.5.21 | via `@rails/webpacker`, `webpack-dev-server` | - |
| `loader-utils` | 1 | 2 | 3 | 1.2.3 | 1.4.2 | via `@rails/webpacker` | - |
| `elliptic` | 1 | 1 | 9 | 6.5.2 | 6.6.1 (one has no fix) | via `@rails/webpacker` | [#20](https://github.com/LacunaSoftware/PkiSuiteSamples/pull/20) (2/9) |
| `form-data` | 1 | 1 | 2 | 2.3.3 | 2.5.6 | via `@rails/webpacker` | - |
| `@babel/traverse` | 1 |  | 1 | 7.7.4 | 7.23.2 | via `@rails/webpacker` | - |
| `cipher-base` | 1 |  | 1 | 1.0.4 | 1.0.5 | via `@rails/webpacker` | - |
| `eventsource` | 1 |  | 1 | 1.0.7 | 1.1.1 | via `webpack-dev-server` | [#65](https://github.com/LacunaSoftware/PkiSuiteSamples/pull/65) (all) |
| `fsevents` | 1 |  | 1 | 1.2.9 | 1.2.11 | via `@rails/webpacker`, `webpack-dev-server` | - |
| `json-schema` | 1 |  | 1 | 0.2.3 | 0.4.0 | via `@rails/webpacker` | - |
| `proxy-addr` | 1 |  | 1 | 2.0.5 | 2.0.8 | via `webpack-dev-server` | - |
| `sha.js` | 1 |  | 1 | 2.4.11 | 2.4.12 | via `@rails/webpacker` | - |
| `url-parse` | 1 |  | 6 | 1.4.7 | 1.5.9 | via `webpack-dev-server` | [#52](https://github.com/LacunaSoftware/PkiSuiteSamples/pull/52) (all), [#65](https://github.com/LacunaSoftware/PkiSuiteSamples/pull/65) (all) |
| `websocket-driver` | 1 |  | 1 | 0.7.3 | 0.7.5 | via `webpack-dev-server` | - |
| `node-forge` |  | 8 | 14 | 0.9.0 | 1.4.0 (one has no fix) | via `webpack-dev-server` | - |
| `brace-expansion` |  | 5 | 8 | 1.1.11 | 1.1.21 | via `@rails/webpacker`, `webpack-dev-server` | - |
| `minimatch` |  | 4 | 4 | 3.0.4 | 3.1.4 | via `@rails/webpacker`, `webpack-dev-server` | - |
| `js-yaml` |  | 3 | 5 | 3.13.1 | 3.15.2 | via `@rails/webpacker` | - |
| `lodash` |  | 3 | 6 | 4.17.15 | 4.18.0 | via `@rails/webpacker`, `webpack-dev-server` | [#14](https://github.com/LacunaSoftware/PkiSuiteSamples/pull/14) (3/6), [#27](https://github.com/LacunaSoftware/PkiSuiteSamples/pull/27) (3/6), [#60](https://github.com/LacunaSoftware/PkiSuiteSamples/pull/60) (3/6) |
| `ansi-regex` |  | 2 | 2 | 2.1.1, 3.0.0, 4.1.0 | 4.1.1 | via `@rails/webpacker`, `webpack-dev-server` | - |
| `braces` |  | 2 | 2 | 2.3.2 | 3.0.3 (one has no fix) | via `@rails/webpacker`, `webpack-dev-server` | - |
| `browserslist` |  | 2 | 3 | 4.8.0 | 4.28.7 | via `@rails/webpacker` | [#31](https://github.com/LacunaSoftware/PkiSuiteSamples/pull/31) (1/3) |
| `flatted` |  | 2 | 2 | 2.0.1 | 3.4.2 | via `@rails/webpacker` | - |
| `is-svg` |  | 2 | 2 | 3.0.0 | 4.3.0 | via `@rails/webpacker` | - |
| `json5` |  | 2 | 2 | 1.0.1, 2.1.1 | 2.2.2 | via `@rails/webpacker` | [#93](https://github.com/LacunaSoftware/PkiSuiteSamples/pull/93) (1/2) |
| `lodash.template` |  | 2 | 2 | 4.5.0 | 4.18.0 (one has no fix) | via `@rails/webpacker` | - |
| `postcss` |  | 2 | 7 | 7.0.23 | 8.5.23 | via `@rails/webpacker` | [#34](https://github.com/LacunaSoftware/PkiSuiteSamples/pull/34) (2/7) |
| `qs` |  | 2 | 5 | 6.5.2, 6.7.0 | 6.16.0 | via `@rails/webpacker`, `webpack-dev-server` | [#89](https://github.com/LacunaSoftware/PkiSuiteSamples/pull/89) (1/5), [#90](https://github.com/LacunaSoftware/PkiSuiteSamples/pull/90) (1/5) |
| `semver` |  | 2 | 2 | 5.3.0, 5.7.1, 6.3.0 | 6.3.1 | via `@rails/webpacker`, `webpack-dev-server` | - |
| `serialize-javascript` |  | 2 | 3 | 1.9.1, 2.1.0 | 7.0.3 | via `@rails/webpacker` | - |
| `ssri` |  | 2 | 2 | 6.0.1, 7.1.0 | 7.1.1 | via `@rails/webpacker` | [#24](https://github.com/LacunaSoftware/PkiSuiteSamples/pull/24) (1/2) |
| `svgo` |  | 2 | 3 | 1.3.2 | 2.8.4 | via `@rails/webpacker` | - |
| `webpack-dev-middleware` |  | 2 | 2 | 3.7.2 | 7.4.6 | via `webpack-dev-server` | - |
| `ws` |  | 2 | 3 | 6.2.1 | 6.2.4 | via `webpack-dev-server` | [#33](https://github.com/LacunaSoftware/PkiSuiteSamples/pull/33) (1/3) |
| `y18n` |  | 2 | 2 | 3.2.1, 4.0.0 | 4.0.1 | via `@rails/webpacker`, `webpack-dev-server` | [#14](https://github.com/LacunaSoftware/PkiSuiteSamples/pull/14) (1/2), [#22](https://github.com/LacunaSoftware/PkiSuiteSamples/pull/22) (1/2) |
| `acorn` |  | 1 | 1 | 6.4.0 | 6.4.1 | via `@rails/webpacker` | [#8](https://github.com/LacunaSoftware/PkiSuiteSamples/pull/8) (all) |
| `async` |  | 1 | 1 | 2.6.3 | 2.6.4 | via `webpack-dev-server` | [#60](https://github.com/LacunaSoftware/PkiSuiteSamples/pull/60) (all) |
| `body-parser` |  | 1 | 1 | 1.19.0 | 1.20.3 | via `webpack-dev-server` | - |
| `browserify-sign` |  | 1 | 1 | 4.0.4 | 4.2.2 | via `@rails/webpacker` | - |
| `compression` |  | 1 | 1 | 1.7.4 | 1.8.2 | via `webpack-dev-server` | - |
| `cross-spawn` |  | 1 | 1 | 3.0.1, 6.0.5 | 6.0.6 | via `@rails/webpacker`, `webpack-dev-server` | - |
| `decode-uri-component` |  | 1 | 2 | 0.2.0 | 0.5.0 | via `@rails/webpacker`, `webpack-dev-server` | [#88](https://github.com/LacunaSoftware/PkiSuiteSamples/pull/88) (1/2) |
| `dns-packet` |  | 1 | 1 | 1.3.1 | 1.3.2 | via `webpack-dev-server` | [#32](https://github.com/LacunaSoftware/PkiSuiteSamples/pull/32) (all) |
| `dot-prop` |  | 1 | 1 | 4.2.0 | 4.2.1 | via `@rails/webpacker` | [#16](https://github.com/LacunaSoftware/PkiSuiteSamples/pull/16) (all) |
| `follow-redirects` |  | 1 | 5 | 1.9.0 | 1.16.0 | via `webpack-dev-server` | [#49](https://github.com/LacunaSoftware/PkiSuiteSamples/pull/49) (2/5) |
| `http-proxy` |  | 1 | 1 | 1.18.0 | 1.18.1 | via `webpack-dev-server` | [#15](https://github.com/LacunaSoftware/PkiSuiteSamples/pull/15) (all) |
| `ini` |  | 1 | 1 | 1.3.5 | 1.3.6 | via `@rails/webpacker`, `webpack-dev-server` | [#17](https://github.com/LacunaSoftware/PkiSuiteSamples/pull/17) (all) |
| `ip` |  | 1 | 2 | 1.1.5 | 1.1.9 (one has no fix) | via `webpack-dev-server` | - |
| `kind-of` |  | 1 | 1 | 3.2.2, 4.0.0, 5.1.0, 6.0.2 | 6.0.3 | via `@rails/webpacker`, `webpack-dev-server` | - |
| `nth-check` |  | 1 | 1 | 1.0.2 | 2.0.1 | via `@rails/webpacker` | - |
| `scss-tokenizer` |  | 1 | 1 | 0.2.3 | 0.4.3 | via `@rails/webpacker` | - |
| `terser` |  | 1 | 1 | 4.4.2 | 4.8.1 | via `@rails/webpacker` | [#73](https://github.com/LacunaSoftware/PkiSuiteSamples/pull/73) (all) |
| `trim-newlines` |  | 1 | 1 | 1.0.0 | 3.0.1 | via `@rails/webpacker` | - |
