
export type Language = 'en' | 'ko';

export const translations = {
    en: {
        nav: {
            home: 'Home',
            series: 'Series',
            films: 'Films',
            new: 'New & Popular',
            mylist: 'My List',
            browse: 'En', // Toggle Label
            signin: 'Sign In',
            dashboard: 'My Page',
            searchPlaceholder: 'Find your next AI masterpiece...',
        },
        hero: {
            play: 'Play',
            moreInfo: 'More Info',
            top10: 'Top 10 in your country',
            trending: 'Trending Now',
        },
        common: {
            live: 'LIVE: Director Q&A',
            myList: 'My List',
            genre: 'Genre',
            title: 'Title',
            description: 'Description',
            videoUrl: 'Video URL',
            thumbnailUrl: 'Thumbnail URL',
            submit: 'Submit for Review',
            processing: 'Processing...',
            success: 'Submission Successful!',
            successDesc: 'Your film is now pending review by administrators.',
            cancel: 'Cancel',
            signOut: 'Sign Out',
            moderation: 'Moderation',
            activity: 'My Activity',
            films: 'Your Films',
            noFilms: "You haven't submitted any films yet.",
            browse: 'Browse Films',
            noResults: 'No films found',
            noResultsDesc: 'Try adjusting your filters or search keywords.',
            clearFilters: 'Clear All Filters',
            comingSoon: 'Coming Soon',
        },
        auth: {
            nicknameGuidance: '4-12 characters, Alphanumeric only. English mandatory.',
            nicknameAvailable: 'Nickname is available!',
            nicknameTaken: 'Nickname is already taken.',
            passwordGuidance: '8-16 characters, must include numbers and special characters.',
            legalAgree: 'I agree to the Terms and Privacy Policy.',
        },
        genres: {
            explore: 'Explore by Genre',
            sciFi: 'Sci-Fi',
            horror: 'Horror',
            drama: 'Drama',
            documentary: 'Documentary',
            experimental: 'Experimental',
            animation: 'Animation',
            musicVideo: 'Music Video',
            comedy: 'Comedy',
            shorts: 'Shorts'
        },
        verify: {
            title: 'Verify Account',
            desc: 'Enter the 6-digit code sent to',
            label: 'Verification Code',
            button: 'Verify Code',
            verifying: 'Verifying...',
            resend: 'Resend Code',
            resendTitle: 'Didn\'t receive the code?',
            codeSent: 'New code sent!',
            wait: 'Please wait'
        }
    },
    ko: {
        nav: {
            home: '홈',
            series: '시리즈',
            films: '영화',
            new: '신작 & 인기',
            mylist: '내가 찜한 콘텐츠',
            browse: 'Ko', // Toggle Label
            signin: '로그인',
            dashboard: '마이페이지',
            searchPlaceholder: 'AI로 만든 작품을 검색하세요...',
        },
        hero: {
            play: '재생',
            moreInfo: '상세 정보',
            top10: '오늘 대한민국의 TOP 10',
            trending: '지금 뜨는 콘텐츠',
        },
        common: {
            live: '라이브: 감독과의 대화',
            myList: '내가 찜한 콘텐츠',
            genre: '장르',
            title: '제목',
            description: '설명',
            videoUrl: '비디오 URL',
            thumbnailUrl: '썸네일 URL',
            submit: '검토 요청하기',
            processing: '처리 중...',
            success: '제출 완료!',
            successDesc: '제출하신 영화는 현재 관리자의 검토를 대기 중입니다.',
            cancel: '취소',
            signOut: '로그아웃',
            moderation: '관리대기',
            activity: '활동 내역',
            films: '내 영화 작품',
            noFilms: "아직 등록된 영화가 없습니다.",
            browse: '영화 둘러보기',
            noResults: '검색 결과가 없습니다',
            noResultsDesc: '필터를 조정하거나 다른 키워드로 검색해 보세요.',
            clearFilters: '필터 초기화',
            comingSoon: '준비 중인 작품입니다',
        },
        auth: {
            nicknameGuidance: '4-12자, 영문 필수, 숫자 선택, 특수문자 금지.',
            nicknameAvailable: '사용 가능한 닉네임입니다!',
            nicknameTaken: '이미 사용 중인 닉네임입니다.',
            passwordGuidance: '8-16자, 숫자 및 특수문자 포함.',
            legalAgree: '이용약관 및 개인정보 보관 정책에 동의합니다.',
        },
        genres: {
            explore: '장르별 탐색',
            sciFi: '공상과학',
            horror: '공포',
            drama: '드라마',
            documentary: '다큐멘터리',
            experimental: '실험 영화',
            animation: '애니메이션',
            musicVideo: '뮤직 비디오',
            comedy: '코미디',
            shorts: '단편 영화'
        },
        verify: {
            title: '계정 인증',
            desc: '이메일로 발송된 6자리 코드를 입력하세요:',
            label: '인증 코드',
            button: '코드 인증',
            verifying: '인증 중...',
            resend: '코드 재전송',
            resendTitle: '코드를 받지 못하셨나요?',
            codeSent: '새 코드가 발송되었습니다!',
            wait: '잠시만 기다려주세요'
        }
    }
};

export const useTranslation = (lang: Language) => {
    return translations[lang];
};
