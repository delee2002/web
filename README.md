# 2026 안전점검 보고서 검색 사이트

## GitHub Pages 배포
1. 이 ZIP의 파일을 모두 압축 해제합니다.
2. GitHub 저장소의 최상위 경로에 파일을 업로드합니다.
3. 저장소 Settings > Pages에서 Deploy from a branch를 선택합니다.
4. Branch를 main, 폴더를 /(root)로 선택하고 Save를 누릅니다.

## 필수 파일
- index.html
- style.css
- app.js
- 장데이터.json

`index.html`을 파일 탐색기에서 직접 열면 브라우저 보안 정책으로 JSON fetch가 실패할 수 있습니다. GitHub Pages나 로컬 HTTP 서버에서 확인하세요.
