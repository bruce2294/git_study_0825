/**
 * Apple Korea (apple.com/kr) JavaScript Interactive Logic
 * - JSON Fetch & Dynamic Rendering (히어로, Bento 타일, Apple TV+ 데이터)
 * - 모바일 네비게이션 메뉴 토글
 * - 검색창 오버레이 및 키보드 접근성
 * - Apple TV+ 캐러셀 슬라이더 (자동 재생, 터치 스와이프, 인디케이터)
 * - 모바일 푸터 아코디언
 */

document.addEventListener('DOMContentLoaded', async () => {
    initNavigation();
    initSearchOverlay();
    initFooterAccordion();
    initColorSwitchers();
    
    // JSON 데이터 비동기 로드 및 동적 렌더링
    await loadProductData();
});

/**
 * 0. JSON 데이터 로드 및 컴포넌트 렌더링
 */
async function loadProductData() {
    try {
        const response = await fetch('./data/products.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        renderHeroes(data.heroes);
        renderBentoGrid(data.bentoTiles);
        renderTvShows(data.tvShows);
        
        // 렌더링 완료 후 TV 슬라이더 인터랙션 초기화
        initTvSlider();
    } catch (error) {
        console.error('Failed to load products.json:', error);
    }
}

/**
 * 히어로 섹션 동적 렌더링
 */
function renderHeroes(heroes) {
    const container = document.getElementById('heroes-container');
    if (!container || !heroes) return;

    container.innerHTML = heroes.map(hero => `
        <section class="hero-section ${hero.theme} ${hero.customClass}" id="${hero.id}">
            <div class="hero-content">
                <h2 class="hero-headline">${hero.headline}</h2>
                <h3 class="hero-subhead">${hero.subhead}</h3>
                ${hero.caption ? `<p class="hero-caption" style="margin-bottom:12px">${hero.caption}</p>` : ''}
                <div class="hero-cta-group" ${hero.id === 'hero-3' ? 'style="margin-top:16px"' : ''}>
                    <a href="${hero.links.learnMore}" class="btn btn-primary">더 알아보기</a>
                    <a href="${hero.links.buy}" class="btn btn-secondary">구입하기</a>
                </div>
            </div>
            <div class="hero-image-box">
                <img src="${hero.image}" alt="${hero.alt}" class="hero-img img-contain">
            </div>
        </section>
    `).join('');
}

/**
 * Bento 그리드 타일 동적 렌더링
 */
function renderBentoGrid(tiles) {
    const container = document.getElementById('bento-grid-container');
    if (!container || !tiles) return;

    const appleSvg = `<svg class="apple-logo-svg" viewBox="0 11 14 18" fill="currentColor" aria-hidden="true"><path d="m13.0729 17.6825a3.61 3.61 0 0 0 -1.7248 3.0365 3.5132 3.5132 0 0 0 2.1379 3.2223 8.394 8.394 0 0 1 -1.0948 2.2618c-.6816.9812-1.3943 1.9623-2.4787 1.9623s-1.3633-.63-2.613-.63c-1.2187 0-1.6525.6507-2.644.6507s-1.6834-.9089-2.4787-2.0243a9.7842 9.7842 0 0 1 -1.6628-5.2776c0-3.0984 2.014-4.7405 3.9969-4.7405 1.0535 0 1.9314.6919 2.5924.6919.63 0 1.6112-.7333 2.8092-.7333a3.7579 3.7579 0 0 1 3.1604 1.5802zm-3.7284-2.8918a3.5615 3.5615 0 0 0 .8469-2.22 1.5353 1.5353 0 0 0 -.031-.32 3.5686 3.5686 0 0 0 -2.3445 1.2084 3.4629 3.4629 0 0 0 -.8779 2.1585 1.419 1.419 0 0 0 .031.2892 1.19 1.19 0 0 0 .2169.0207 3.0935 3.0935 0 0 0 2.1586-1.1368z"></path></svg>`;

    container.innerHTML = tiles.map(tile => {
        let headerContent = '';
        if (tile.hasLogo) {
            headerContent = `<div class="logo-inline">${appleSvg}${tile.logoText}</div>`;
            if (tile.isSeries) {
                headerContent += `<h4 class="tile-series">${tile.seriesName}</h4>`;
            }
        } else {
            headerContent = `<h3 class="tile-headline">${tile.headline}</h3>`;
        }

        let ctaContent = '';
        if (tile.links.learnMoreText) {
            ctaContent = `<a href="${tile.links.learnMore}" class="btn btn-primary">${tile.links.learnMoreText}</a>`;
        } else {
            ctaContent = `
                <a href="${tile.links.learnMore}" class="btn btn-primary">더 알아보기</a>
                <a href="${tile.links.buy}" class="btn btn-secondary">구입하기</a>
            `;
        }

        let imageBoxContent = '';
        if (tile.isGraphic) {
            imageBoxContent = `
                <div class="tile-image-box center-flex">
                    <div class="trade-hero-graphic">
                        <svg viewBox="0 0 24 24" width="80" height="80" fill="none" stroke="currentColor" stroke-width="1.2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
                        </svg>
                    </div>
                </div>
            `;
        } else {
            imageBoxContent = `
                <div class="tile-image-box">
                    <img src="${tile.image}" alt="${tile.alt}" class="tile-img img-contain">
                </div>
            `;
        }

        return `
            <div class="bento-tile ${tile.theme} ${tile.customClass}">
                <div class="tile-content">
                    ${headerContent}
                    <p class="tile-subhead">${tile.subhead}</p>
                    <div class="tile-cta-group">
                        ${ctaContent}
                    </div>
                </div>
                ${imageBoxContent}
            </div>
        `;
    }).join('');
}

/**
 * Apple TV+ 쇼케이스 동적 렌더링
 */
function renderTvShows(shows) {
    const track = document.getElementById('tv-slider-track');
    const dotsContainer = document.getElementById('slider-dots');
    if (!track || !shows) return;

    track.innerHTML = shows.map((show, idx) => `
        <div class="tv-card ${idx === 0 ? 'active' : ''}" data-genre="${show.genre}">
            <img src="${show.image}" alt="Apple TV+ 오리지널" class="tv-card-img">
            <div class="card-overlay">
                <img src="${show.logo}" alt="Show Logo" class="tv-card-logo">
                <span class="genre-badge">${show.genre}</span>
                <p class="card-desc">${show.desc}</p>
                <button class="btn btn-stream">지금 스트리밍하기 <span class="play-icon">▶</span></button>
            </div>
        </div>
    `).join('');

    if (dotsContainer) {
        dotsContainer.innerHTML = shows.map((_, idx) => `
            <span class="dot ${idx === 0 ? 'active' : ''}" data-index="${idx}"></span>
        `).join('');
    }
}

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

    function getCardWidth() {
        if (!cards[0]) return 1004;
        const style = window.getComputedStyle(track);
        const gap = parseFloat(style.gap) || 24;
        return cards[0].offsetWidth + gap;
    }

    function updateSlider(index) {
        // 인덱스 범위 순환 처리
        if (index < 0) index = cards.length - 1;
        if (index >= cards.length) index = 0;
        currentIndex = index;

        // 트랙 이동 (동적 너비 기준)
        const offset = -(currentIndex * getCardWidth());
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

