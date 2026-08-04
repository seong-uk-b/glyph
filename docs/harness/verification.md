# Verification

완료를 주장하기 전에 해당 명령을 **이 세션에서 fresh run** 하고 결과를 기록한다.
과거 세션의 실행 결과로 "통과" 를 주장하지 않는다.

루트 CLAUDE.md 의 검증 정책이 정본이다. 이 파일은 그 정책을 실행 가능한
명령과 체크리스트로 풀어쓴 것이며, 기능별 스모크 체크리스트가 머지될 때마다
아래에 **누적**된다 (기능이 제거되면 해당 섹션도 같은 커밋에서 삭제 — 무한 누적 방지).

## 표준 체크

```bash
npx tsc --noEmit                                        # 타입 검사
CI=true npx react-scripts test --watchAll=false          # Jest 전체
npm run build:ios                                        # 프로덕션 빌드 + Capacitor sync
```

iOS 시뮬레이터 검증 (선택 — UI 변경 시):

```bash
cd ios/App && xcodebuild -project App.xcodeproj -scheme App -sdk iphonesimulator \
  -destination 'generic/platform=iOS Simulator' build    # 네이티브 빌드
# 이후 xcrun simctl install/launch 로 실행 확인
```

⚠️ 빌드 통과 ≠ dev 런타임 정상. React StrictMode 는 effect 를 이중 호출한다.
effect / 비동기 로딩 / dedup 로직을 건드린 변경은 보고에
**"dev 클릭 테스트 필요"** 를 명시한다.

### 잔재 grep

리네임/제거 작업 후 옛 심볼·경로가 남지 않았는지 grep 으로 확인하고,
검색 패턴과 0건 결과를 보고에 기록한다.

## 보고 시 수동 테스트 체크리스트

에이전트가 직접 확인할 수 없는 것(TTS 소리·햅틱·실기기 동작 등)은 보고에
**수동 테스트 항목 체크리스트** 섹션을 넣는다. 형식:

```markdown
## 수동 테스트 체크리스트
- [ ] {화면/동선}: {조작} → 기대: {결과}
```

## 배포 검증

**웹 = `main` 에 push 하면 GitHub Actions 가 자동 배포한다** (`.github/workflows/deploy.yml`,
Pages `build_type: workflow`). 이것이 **유일한 웹 배포 경로**다.
iOS 실기기 = Xcode ▶ (수동).

⛔ **`gh-pages` 패키지/브랜치 방식을 다시 도입하지 말 것.** (2026-08-04 제거 — 근거:
`docs/follow-ups/2026-08-04-deploy-v13.md`) Pages 소스가 워크플로우라 gh-pages 브랜치는
읽히지 않는다 — `npm run deploy` 가 "Published" 를 출력해도 사이트는 갱신되지 않아
배포됐다고 착각하게 만든다.

"배포됐냐" 판정 = **push 여부가 아니라 Actions 성공 + 라이브 번들 해시 일치**:

```bash
git status -sb                                   # ahead 0 인지
gh run list --limit 3                            # 최신 실행이 success 인지
curl -s https://seong-uk-b.github.io/glyph/ | grep -o 'main\.[a-z0-9]*\.js'
ls build/static/js/main.*.js                     # 위 결과와 같아야 반영 완료
```

⚠️ Actions 실패 이력: `npm ci` 가 락파일 엄격 검증에 실패해 배포가 조용히 깨진 적이 있다
(로컬 npm 12 ↔ CI npm 10 해석 차이). push 후 성공 여부를 반드시 확인할 것 —
사이트가 200 을 반환해도 **이전 버전을 서빙 중일 수 있다**.

## 완료 증거 기록

- 보고(최종 응답)에 실행한 명령 이름과 결과 요약을 적는다.
- 긴 세션은 해당 트랙 파일(`docs/harness/{트랙}.md`)의 Verification 항목에도 기록한다.

---

# 기능별 스모크 체크리스트 (누적)

새 기능 머지 시 아래 형식으로 섹션을 추가한다.
헤더: `## {기능명} (YYYY-MM-DD)`, 본문: 절차/기대결과 표.

## 단어 데이터 확장 (2026-08-04)

| 항목 | 절차 | 기대 결과 |
|---|---|---|
| 단어 수 정합 | `for f in n5 n4 n3 n2 n1; do grep -c "expression:" src/data/words/$f.ts; done` | 파일 헤더 `Total:` 주석과 일치 |
| mp3 커버리지 | `ls public/audio/ja \| wc -l` | 단어 수 이상 (중복 표기·읽기는 파일 공유로 소폭 적을 수 있음) |
| 레벨 UI | 시뮬레이터 → 일본어 → 단어 설정 | N5~N1 다섯 레벨 모두 단어 수와 함께 표시 |

## 발음 mp3 재생 (2026-08-03)

| 항목 | 절차 | 기대 결과 |
|---|---|---|
| mp3 우선 재생 | 단어 퀴즈에서 스피커 버튼 | Neural 음성(자연스러움) — 기계음이면 TTS 폴백이 뜬 것 |
| 폴백 | mp3 없는 단어(신규 추가 직후) | Web Speech 음성으로라도 재생됨 |
| 가나 단어 어두 조사 오독 | 가나만으로 된 일본어 단어를 추가했으면 `afplay public/audio/ja/<id>.mp3` | 어두 `は` 가 「하」로 들려야 정상 (「와」면 오독 — 대응은 `scripts/pipeline/README.md`) |
