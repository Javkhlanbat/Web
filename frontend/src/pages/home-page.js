
import router from '../router.js';

class HomePage extends HTMLElement {
    connectedCallback() {
        this.render();
        this.attachEventListeners();
    }

    attachEventListeners() {
        this.querySelectorAll('a[href^="#/"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const path = link.getAttribute('href').substring(1);
                router.navigate(path);
            });
        });
    }

    render() {
        this.innerHTML = `
            <div class="home-page">
                <!-- Navigation -->
                <app-nav></app-nav>

                <!-- Hero Section -->
                <section class="hero">
                    <div class="container">
                        <div class="hero-content">
                            <h1 class="hero-title animate-slideInUp">
                                Таны санхүүгийн<br>
                                <span class="gradient-text">найдвартай түнш</span>
                            </h1>
                            <p class="hero-description animate-slideInUp">
                                OmniCredit нь хурдан, найдвартай зээлийн үйлчилгээ үзүүлдэг платформ юм.
                                Та хаанаас ч, хэдийд ч зээл авах боломжтой.
                            </p>
                            <div class="hero-buttons animate-slideInUp">
                                <a href="#/register" class="btn btn-primary btn-lg">Эхлэх</a>
                                <a href="#/zeelhuudas" class="btn btn-outline btn-lg">Зээл тооцоолох</a>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- Features Section -->
                <section class="features">
                    <div class="container">
                        <h2 class="section-title text-center">Яагаад OmniCredit вэ?</h2>

                        <div class="grid grid-cols-3 gap-4">
                            <div class="feature-card card animate-slideInUp">
                                <div class="feature-icon">⚡</div>
                                <h3 class="feature-title">Хурдан шийдвэр</h3>
                                <p class="feature-text">
                                    Зээлийн хүсэлтийг 24 цагийн дотор шалгаж хариулна.
                                </p>
                            </div>

                            <div class="feature-card card animate-slideInUp">
                                <div class="feature-icon">🔒</div>
                                <h3 class="feature-title">Найдвартай</h3>
                                <p class="feature-text">
                                    Таны мэдээллийг бүрэн нууцлалтай хадгална.
                                </p>
                            </div>

                            <div class="feature-card card animate-slideInUp">
                                <div class="feature-icon">💰</div>
                                <h3 class="feature-title">Боломжийн хүү</h3>
                                <p class="feature-text">
                                    Өрсөлдөхүйц хүүтэй, уян хатан төлбөрийн нөхцөл.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- Loan Types Section -->
                <section class="loan-types">
                    <div class="container">
                        <h2 class="section-title text-center">Зээлийн төрлүүд</h2>

                        <div class="grid grid-cols-2">
                            <div class="loan-type-card card card-gradient">
                                <h3 class="loan-type-title">Хэрэглээний зээл</h3>
                                <p class="loan-type-description">
                                    Хувийн хэрэгцээнд зориулсан
                                </p>
                                <ul class="loan-features">
                                    <li>✓ 2-24 сарын хугацаатай</li>
                                    <li>✓ 2% жилийн хүүтэй</li>
                                    <li>✓ Урьдчилгаагүй</li>
                                    <li>✓ Хурдан зөвшөөрөл</li>
                                </ul>
                                <a href="#/loan-application" class="btn btn-secondary btn-block mt-4">Зээл хүсэх</a>
                            </div>

                            <div class="loan-type-card card">
                                <h3 class="loan-type-title">Худалдан авалтын зээл</h3>
                                <p class="loan-type-description">
                                    10,000₮ - 3,000,000₮ хүртэл
                                </p>
                                <ul class="loan-features">
                                    <li>✓ 6 сарын хугацаатай (тогтмол)</li>
                                    <li>✓ 2% жилийн хүүтэй</li>
                                    <li>✓ Урьдчилгаагүй</li>
                                    <li>✓ Бараа, үйлчилгээ худалдан авалт</li>
                                </ul>
                                <a href="#/loan-application" class="btn btn-outline btn-block mt-4">Дэлгэрэнгүй</a>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- Stats Section -->
                <section class="stats">
                    <div class="container">
                        <div class="stats-grid">
                            <div class="stat-item">
                                <div class="stat-number">10,000+</div>
                                <div class="stat-label">Хэрэглэгч</div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-number">₮5B+</div>
                                <div class="stat-label">Олгосон зээл</div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-number">98%</div>
                                <div class="stat-label">Сэтгэл ханамж</div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-number">24/7</div>
                                <div class="stat-label">Дэмжлэг</div>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- CTA Section -->
                <section class="cta">
                    <div class="container">
                        <div class="cta-content">
                            <h2 class="cta-title">Өнөөдөр эхэлцгээе</h2>
                            <p class="cta-description">
                                Та ч гэсэн өөрийн зорилгодоо хүрэхэд бид туслах бэлэн байна.
                            </p>
                            <a href="#/register" class="btn btn-secondary btn-lg">Бүртгүүлэх</a>
                        </div>
                    </div>
                </section>

                <!-- Footer -->
                <app-footer></app-footer>
            </div>

            <style>
                .home-page {
                    min-height: 100vh;
                    background: var(--bg);
                }

                                .hero {
                    padding: 6rem 0;
                    background: var(--gradient-soft);
                }

                .hero-content {
                    max-width: 800px;
                    margin: 0 auto;
                    text-align: center;
                }

                .hero-title {
                    font-size: var(--font-4xl);
                    font-weight: var(--font-bold);
                    color: var(--text);
                    margin-bottom: 1.5rem;
                    line-height: var(--leading-tight);
                }

                .gradient-text {
                    background: var(--gradient-primary);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                .hero-description {
                    font-size: var(--font-xl);
                    color: var(--text-secondary);
                    margin-bottom: 2rem;
                }

                .hero-buttons {
                    display: flex;
                    gap: 1rem;
                    justify-content: center;
                    flex-wrap: wrap;
                }

                                .features {
                    padding: 4rem 0;
                }

                .section-title {
                    font-size: var(--font-3xl);
                    font-weight: var(--font-bold);
                    margin-bottom: 3rem;
                    color: var(--text);
                }

                .feature-card {
                    text-align: center;
                    padding: 2rem;
                }

                .feature-icon {
                    font-size: 3rem;
                    margin-bottom: 1rem;
                }

                .feature-title {
                    font-size: var(--font-xl);
                    font-weight: var(--font-semibold);
                    margin-bottom: 0.5rem;
                    color: var(--text);
                }

                .feature-text {
                    color: var(--text-secondary);
                    line-height: var(--leading-relaxed);
                }

                                .loan-types {
                    padding: 4rem 0;
                    background: var(--bg-secondary);
                }

                .loan-type-card {
                    padding: 2rem;
                }

                .loan-type-title {
                    font-size: var(--font-2xl);
                    font-weight: var(--font-bold);
                    margin-bottom: 0.5rem;
                }

                .card-gradient .loan-type-title {
                    color: var(--white);
                }

                .loan-type-description {
                    font-size: var(--font-xl);
                    margin-bottom: 1.5rem;
                }

                .card-gradient .loan-type-description {
                    color: rgba(255, 255, 255, 0.9);
                }

                .loan-features {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }

                .loan-features li {
                    font-size: var(--font-base);
                }

                .card-gradient .loan-features li {
                    color: var(--white);
                }

                                .stats {
                    padding: 4rem 0;
                }

                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 2rem;
                }

                .stat-item {
                    text-align: center;
                }

                .stat-number {
                    font-size: var(--font-4xl);
                    font-weight: var(--font-bold);
                    background: var(--gradient-primary);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    margin-bottom: 0.5rem;
                }

                .stat-label {
                    font-size: var(--font-lg);
                    color: var(--text-secondary);
                }

                                .cta {
                    padding: 4rem 0;
                    background: var(--gradient-primary);
                }

                .cta-content {
                    text-align: center;
                    max-width: 600px;
                    margin: 0 auto;
                }

                .cta-title {
                    font-size: var(--font-3xl);
                    font-weight: var(--font-bold);
                    color: var(--white);
                    margin-bottom: 1rem;
                }

                .cta-description {
                    font-size: var(--font-xl);
                    color: rgba(255, 255, 255, 0.9);
                    margin-bottom: 2rem;
                }

                                @media (max-width: 768px) {
                    .hero {
                        padding: 4rem 0;
                    }

                    .hero-title {
                        font-size: var(--font-3xl);
                    }

                    .hero-description {
                        font-size: var(--font-lg);
                    }

                    .features,
                    .loan-types,
                    .stats,
                    .cta {
                        padding: 3rem 0;
                    }

                    .section-title {
                        font-size: var(--font-2xl);
                    }
                }
            </style>
        `;
    }
}
customElements.define('home-page', HomePage);

export default HomePage;
