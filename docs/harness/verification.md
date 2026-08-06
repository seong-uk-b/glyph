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

"배포됐냐" 판정 = **push 여부가 아니라 Actions 성공 + 라이브 번들에 변경 내용이 있는지**:

```bash
git status -sb          # ahead 0 인지
gh run list --limit 3   # 최신 실행이 success 인지

# 이번에 바꾼 문자열이 라이브 번들에 있는지 (아래 두 함정 때문에 스크립트로 확인한다)
python3 - <<'EOF'
import urllib.request, re
CHANGED = ['함박스테이크', '고장 나다']          # 이번 변경에서 새로 들어간 값
GONE    = ['함바그']                          # 없어져야 하는 옛 값
esc = lambda s: ''.join(f'\\u{ord(c):04x}' if ord(c) > 127 else c for c in s)
home = urllib.request.urlopen('https://seong-uk-b.github.io/glyph/').read().decode()
js = re.search(r'main\.[a-z0-9]+\.js', home).group()
b = urllib.request.urlopen(f'https://seong-uk-b.github.io/glyph/static/js/{js}').read().decode()
for s in CHANGED: print('신규', s, esc(s) in b)   # 전부 True 여야 함
for s in GONE:    print('구값', s, esc(s) in b)   # 전부 False 여야 함
EOF
```

⚠️ 이 검증에서 틀리기 쉬운 두 가지 (2026-08-06 실측):

1. **라이브 번들 해시는 로컬 `build/` 와 다른 것이 정상이다.** 로컬은 `build:ios`(`PUBLIC_URL=.`),
   CI 는 `npm run build`(homepage 기준 `/glyph/`)로 빌드해 내용이 달라진다.
   해시 불일치를 "배포 안 됨"으로 오판하지 말 것 — **내용으로 판정한다.**
2. **번들의 한글은 `\uXXXX` 로 이스케이프되어 있다** (파일이 ASCII). `grep '함박스테이크'` 는
   반드시 실패하므로, 위처럼 이스케이프로 변환해 찾아야 한다.

mp3 는 파일 단위로 직접 확인한다 (id = `fnv1a(expression|reading)`):

```bash
curl -s -o /dev/null -w '%{http_code} %{size_download}\n' \
  https://seong-uk-b.github.io/glyph/audio/ja/<id>.mp3   # 200 + 실제 크기여야 함
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

## 단어 데이터 정합성 (2026-08-06 전수 검수 기준)

아래는 실제로 오류를 잡아낸 검사들이다. 단어를 추가·수정하면 다시 돌린다.

| 항목 | 절차 | 기대 결과 |
|---|---|---|
| 중복 항목 | 표기+읽기가 같은 항목이 둘 이상인지 | 0건 (2026-08-06: 運転 1건 발견·제거) |
| 필드 복사 산물 | 같은 표기의 **다른 읽기** 항목끼리 en/ko 가 완전히 같은지 | 0건 — 같으면 한쪽이 복사된 것 (上·対·分·綿 실측) |
| 뜻 중복 → 부당 채점 | 같은 뜻을 가진 서로 다른 단어 | 코드가 방어함(`isEquivalent`) — 데이터 자체는 허용 |
| 품사 태그 유출 | `grep -n "(かん)'" src/data/words/*.ts` | 0건 — reading 은 화면 표시·TTS 입력이라 태그가 그대로 노출됨 |
| 비표준 오쿠리가나 | 曲る/代る 류 (JMdict io 태그) | 표준형으로 (曲がる·代わる) |

> 검수는 **구간 병렬 검수 → 지적별 적대적 재검증** 2단계로 한다. 1단계만 하면 오탐이 많다
> (2026-08-06: 지적 44건 중 확정 28건 = 오탐률 36%).

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
| 단독 한자 다독음 오독 | **한자 1글자 표기**를 추가했으면 청취 확인 | 의도한 읽기로 들려야 정상 (다르면 `FORCE_KANA` 등록 후 해당 mp3 삭제·재생성) |
| `～` 접사 입력 충돌 | 아래 명령 — `～X` 와 `X` 가 같은 음성을 공유하지 않는지 | 출력 0건 |

```bash
# 서로 다른 읽기인데 TTS 입력이 같아지는 쌍 (있으면 최소 한쪽이 오독)
python3 - <<'EOF'
import re
from collections import defaultdict
w=[]
for f in ['n5','n4','n3','n2','n1']:
    s=open(f'src/data/words/{f}.ts',encoding='utf-8').read()
    w+=[(m.group(1),m.group(2)) for m in re.finditer(r"\{ expression: '((?:[^'\\]|\\.)*)', reading: '((?:[^'\\]|\\.)*)'",s)]
c=lambda s: re.sub(r'\([^)]*\)','',re.sub(r'[～〜]','',s.split(';')[0])).strip()
rd=defaultdict(set)
for e,r in w: rd[c(e)].add(c(r))
bi=defaultdict(set)
for e,r in w: bi[c(r) if len(rd[c(e)])>1 else c(e)].add(c(r))
print([k for k,v in bi.items() if len(v)>1])
EOF
```
