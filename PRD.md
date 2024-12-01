현재 코드베이스에서 확인할 수 있는 전체 프로젝트 구조를 그려보겠습니다:
📦 Project Root
├── 📂 frontend
│   ├── 📂 app
│   │   ├── 📂 (admin)
│   │   │   ├── 📄 _layout.js
│   │   │   └── 📄 dashboard.js
│   │   ├── 📂 (auth)
│   │   │   ├── 📄 _layout.js
│   │   │   ├── 📄 login.js
│   │   │   ├── 📄 signup.js
│   │   │   └── 📄 welcome.js
│   │   ├── 📂 (tabs)
│   │   │   ├── 📂 (home,ranking,community,event,setting)
│   │   │   │   ├── 📄 _layout.js
│   │   │   │   ├── 📄 community.js
│   │   │   │   ├── 📄 event.js
│   │   │   │   ├── 📄 home.js
│   │   │   │   ├── 📄 ranking.js
│   │   │   │   ├── 📄 search-results.js
│   │   │   │   ├── 📄 setting.js
│   │   │   │   └── 📄 video-detail.js
│   │   │   └── 📄 _layout.js
│   │   ├── 📂 _components
│   │   │   ├── 📂 admin
│   │   │   │   └── 📄 AdminGuard.js
│   │   │   ├── 📂 common
│   │   │   │   ├── 📄 Button.js
│   │   │   │   ├── 📄 ErrorState.js
│   │   │   │   ├── 📄 Header.js
│   │   │   │   ├── 📄 Input.js
│   │   │   │   └── 📄 LoadingState.js
│   │   │   ├── 📂 main
│   │   │   │   ├── 📄 Banner.js
│   │   │   │   ├── 📄 CategoryButtons.js
│   │   │   │   ├── 📄 SearchBar.js
│   │   │   │   └── 📄 VideoCard.js
│   │   │   └── 📂 video
│   │   │       └── 📄 VideoInfo.js
│   │   ├── 📂 _config
│   │   │   └── 📄 constants.js
│   │   ├── 📂 _context
│   │   │   ├── 📄 AuthContext.js
│   │   │   ├── 📄 PostContext.js
│   │   │   ├── 📄 SearchContext.js
│   │   │   └── 📄 UserContext.js
│   │   ├── 📂 _screens
│   │   │   ├── 📄 BoardScreen.js
│   │   │   ├── 📄 CommunityScreen.js
│   │   │   ├── 📄 CreatePostScreen.js
│   │   │   ├── 📄 EventScreen.js
│   │   │   ├── 📄 MainScreen.js
│   │   │   ├── 📄 PostDetailScreen.js
│   │   │   ├── 📄 ProfileScreen.js
│   │   │   ├── 📄 RankingScreen.js
│   │   │   ├── 📄 SearchResultScreen.js
│   │   │   ├── 📄 SettingScreen.js
│   │   │   └── 📄 VideoDetailScreen.js
│   │   ├── 📂 _styles
│   │   │   ├── 📄 colors.js
│   │   │   ├── 📄 spacing.js
│   │   │   └── 📄 typography.js
│   │   ├── 📂 _utils
│   │   │   ├── 📂 hooks
│   │   │   │   ├── 📄 useAdmin.js
│   │   │   │   ├── 📄 useAuth.js
│   │   │   │   └── 📄 useSearch.js
│   │   │   ├── 📄 api.js
│   │   │   └── 📄 storage.js
│   │   ├── 📂 post
│   │   │   ├── 📄 [id].js
│   │   │   └── 📄 create.js
│   │   └── 📄 _layout.js
│   ├── 📄 app.config.js
│   └── 📄 package.json
│
└── 📂 backend
    ├── 📂 config
    │   ├── 📄 database.js
    │   └── 📄 multer.js
    ├── 📂 controllers
    │   ├── 📄 adminController.js
    │   ├── 📄 authController.js
    │   ├── 📄 communityController.js
    │   ├── 📄 profileController.js
    │   ├── 📄 searchController.js
    │   └── 📄 youtubeController.js
    ├── 📂 middleware
    │   ├── 📄 authMiddleware.js
    │   └── 📄 errorMiddleware.js
    ├── 📂 models
    │   ├── 📄 Comment.js
    │   ├── 📄 Post.js
    │   ├── 📄 Search.js
    │   └── 📄 User.js
    ├── 📂 routes
    │   ├── 📄 admin.js
    │   ├── 📄 auth.js
    │   ├── 📄 community.js
    │   ├── 📄 profile.js
    │   ├── 📄 search.js
    │   └── 📄 youtube.js
    ├── 📂 services
    │   ├── 📄 SearchService.js
    │   └── 📄 StatisticsService.js
    ├── 📂 utils
    │   └── 📄 storage.js
    ├── 📄 app.js
    └── 📄 server.js
    
이 구조는 현재 코드베이스에서 확인할 수 있는 파일들을 기반으로 작성되었습니다. 실제 프로젝트에는 더 많은 파일이나 폴더가 있을 수 있습니다.
주요 구조:
Frontend
app/: Expo Router를 사용한 메인 앱 코드
_components/: 재사용 가능한 컴포넌트들
_context/: React Context 관련 파일들
_screens/: 화면 컴포넌트들
_styles/: 스타일 관련 설정
_utils/: 유틸리티 함수와 훅
Backend
config/: 설정 파일들
controllers/: API 엔드포인트 로직
middleware/: 미들웨어 함수들
models/: 데이터베이스 모델
routes/: API 라우트 정의
services/: 비즈니스 로직
utils/: 유틸리티 함수들