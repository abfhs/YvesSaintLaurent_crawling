
# Yves Saint Laurent 상품 데이터 엑셀 파일 생성 서비스

이 프로젝트는 Yves Saint Laurent의 API에서 상품 데이터를 가져와 엑셀 파일로 변환 후 다운로드할 수 있는 간단한 Node.js 애플리케이션입니다. 사용자는 애플리케이션의 GET 요청을 통해 생성된 엑셀 파일을 받을 수 있습니다.


---

## 설치 방법

1. **프로젝트 클론**:
   ```bash
   git clone <repository_url>
   cd <repository_folder>
   ```

2. **필수 패키지 설치**:
   프로젝트 루트 디렉토리에서 아래 명령어를 실행합니다:
   ```bash
   npm install
   ```

---

## 애플리케이션 실행 방법

1. 서버를 시작합니다:
   ```bash
   node app.js
   ```

2. 웹 브라우저를 열고 아래 URL로 이동합니다:
   ```
   http://localhost:3000/
   ```

---

## 주요 기능

- **상품 데이터 가져오기**: Yves Saint Laurent API에서 상품명, 이미지 URL, 상품 URL 데이터를 가져옵니다.
- **엑셀 파일 생성**: `xlsx` 라이브러리를 사용해 가져온 데이터를 엑셀 파일로 변환합니다.
- **파일 다운로드**: 사용자가 브라우저를 통해 엑셀 파일을 바로 다운로드할 수 있습니다.

---



---


## 에러 처리

다음과 같은 상황에서 에러가 발생할 경우:

1. **데이터 가져오기 실패**: 서버는 오류 로그를 출력하며 HTTP 상태 코드 `500`과 *"target page change"* 메시지를 반환합니다.
2. **엑셀 파일 생성 실패**: 서버는 오류 로그를 출력하며 HTTP 상태 코드 `500`과 *"Failed to generate Excel file"* 메시지를 반환합니다.


---

## 의존성

이 프로젝트는 다음 Node.js 패키지를 사용합니다:

- **axios**: Yves Saint Laurent API와의 HTTP 요청을 처리합니다.
- **xlsx**: JSON 데이터를 엑셀 파일로 변환합니다.
- **express**: HTTP 요청과 응답을 처리하는 웹 프레임워크입니다.

아래 명령어로 의존성을 설치할 수 있습니다:
```bash
npm install
```

