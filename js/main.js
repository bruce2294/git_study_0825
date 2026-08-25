/**
 * Apple Korea (apple.com/kr) JavaScript Interactive Logic
 * - 모바일 네비게이션 메뉴 토글
 * - 검색창 오버레이 및 키보드 접근성
 * - Apple TV+ 캐러셀 슬라이더 (자동 재생, 터치 스와이프, 인디케이터)
 * - 모바일 푸터 아코디언
 */

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initSearchOverlay();
    initTvSlider();
    initFooterAccordion();
    initColorSwitchers();
});

/**
 * 1. 글로벌 네비게이션 및 모바일 메뉴 제어
 */
function initNavigation() {
    const menuBtn = document.getElementById('mobile-menu-btn');
    const navList = document.getElementById('nav-list');
    const bagBtn = document.getElementById('bag-toggle');

    if (menuBtn && navList) {
        menuBtn.addEventListener('click', () => {
            const isOpen = navList.classList.toggle('active');
            menuBtn.classList.toggle('active');
            
            // 모바일 메뉴 열렸을 때 배경 스크롤 방지
            document.body.style.overflow = isOpen ? 'hidden' : '';
        });

        // 네비게이션 링크 클릭 시 모바일 메뉴 닫기
        const navLinks = navList.querySelectorAll('.globalnav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navList.classList.contains('active')) {
                    navList.classList.remove('active');
                    menuBtn.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        });
    }

    // 장바구니 버튼 클릭 시 피드백
    if (bagBtn) {
        bagBtn.addEventListener('click', () => {
            alert('장바구니가 비어 있습니다.');
        });
    }
}

/**
 * 2. 검색 오버레이 제어
 */
function initSearchOverlay() {
    const searchToggle = document.getElementById('search-toggle');
    const searchOverlay = document.getElementById('search-overlay');
    const searchClose = document.getElementById('search-close');
    const searchInput = document.getElementById('search-input');

    if (searchToggle && searchOverlay && searchClose) {
        searchToggle.addEventListener('click', () => {
            searchOverlay.classList.add('active');
            setTimeout(() => searchInput && searchInput.focus(), 100);
        });

        searchClose.addEventListener('click', () => {
            searchOverlay.classList.remove('active');
        });

        // ESC 키 입력 시 검색창 닫기
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && searchOverlay.classList.contains('active')) {
                searchOverlay.classList.remove('active');
            }
        });
    }
}

/**
 * 3. Apple TV+ 캐러셀 슬라이더
 */
function initTvSlider() {
    const track = document.getElementById('tv-slider-track');
    const cards = document.querySelectorAll('.tv-card');
    const dots = document.querySelectorAll('.slider-dots .dot');
    const prevBtn = document.getElementById('slider-prev');
    const nextBtn = document.getElementById('slider-next');
    const playPauseBtn = document.getElementById('slider-pause-play');

    if (!track || cards.length === 0) return;

    let currentIndex = 0;
    let isPlaying = true;
    let autoPlayTimer = null;
    const cardWidth = 500; // 카드 폭(480) + 갭(20)

    function updateSlider(index) {
        // 인덱스 범위 순환 처리
        if (index < 0) index = cards.length - 1;
        if (index >= cards.length) index = 0;
        currentIndex = index;

        // 트랙 이동
        const offset = -(currentIndex * cardWidth);
        track.style.transform = `translateX(${offset}px)`;

        // 활성 카드 및 닷 업데이트
        cards.forEach((card, i) => {
            card.classList.toggle('active', i === currentIndex);
        });

        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });
    }

    function nextSlide() {
        updateSlider(currentIndex + 1);
    }

    function prevSlide() {
        updateSlider(currentIndex - 1);
    }

    function startAutoPlay() {
        if (autoPlayTimer) clearInterval(autoPlayTimer);
        autoPlayTimer = setInterval(nextSlide, 4500);
    }

    function stopAutoPlay() {
        if (autoPlayTimer) {
            clearInterval(autoPlayTimer);
            autoPlayTimer = null;
        }
    }

    // 버튼 이벤트 리스너
    if (nextBtn) nextBtn.addEventListener('click', () => {
        nextSlide();
        if (isPlaying) startAutoPlay();
    });

    if (prevBtn) prevBtn.addEventListener('click', () => {
        prevSlide();
        if (isPlaying) startAutoPlay();
    });

    if (playPauseBtn) {
        playPauseBtn.addEventListener('click', () => {
            isPlaying = !isPlaying;
            if (isPlaying) {
                playPauseBtn.textContent = '❚❚';
                startAutoPlay();
            } else {
                playPauseBtn.textContent = '▶';
                stopAutoPlay();
            }
        });
    }

    // 닷 클릭 시 해당 슬라이드로 이동
    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => {
            updateSlider(i);
            if (isPlaying) startAutoPlay();
        });
    });

    // 카드 직접 클릭 시 이동
    cards.forEach((card, i) => {
        card.addEventListener('click', () => {
            updateSlider(i);
            if (isPlaying) startAutoPlay();
        });
    });

    // 터치 스와이프 제어
    let startX = 0;
    let endX = 0;

    track.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        stopAutoPlay();
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
        endX = e.changedTouches[0].clientX;
        const diff = startX - endX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) nextSlide();
            else prevSlide();
        }
        if (isPlaying) startAutoPlay();
    }, { passive: true });

    // 초기 자동 재생 시작
    startAutoPlay();
}

/**
 * 4. 모바일 푸터 아코디언 메뉴
 */
function initFooterAccordion() {
    const titles = document.querySelectorAll('.directory-title');

    titles.forEach(title => {
        title.addEventListener('click', () => {
            // 모바일 화면 크기(833px 이하)에서만 아코디언 동작
            if (window.innerWidth <= 833) {
                const list = title.nextElementSibling;
                const isExpanded = title.getAttribute('aria-expanded') === 'true';

                title.setAttribute('aria-expanded', !isExpanded);
                title.classList.toggle('active');
                if (list) {
                    list.classList.toggle('active');
                }
            }
        });
    });
}

/**
 * 5. iPhone 16 색상 팔레트 클릭 인터랙션
 */
function initColorSwitchers() {
    const dots = document.querySelectorAll('.color-circle');
    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            dots.forEach(d => d.style.transform = '');
            dot.style.transform = 'scale(1.25)';
        });
    });
}
