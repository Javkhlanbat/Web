
class AboutPage extends HTMLElement {
    connectedCallback() {
        this.render();
    }

    render() {
        this.innerHTML = `
            <div class="about-page">
                <app-nav></app-nav>

                <div class="about-container container">
                    <div class="about-header">
                        <h1 class="page-title">Бидний тухай</h1>
                        <p class="page-subtitle">OmniCredit - Таны итгэлтэй санхүүгийн түнш</p>
                    </div>

                    <div class="about-content">
                        <section class="about-section card">
                            <h2 class="section-title">Бидний эрхэм зорилго</h2>
                            <p class="section-text">
                                OmniCredit нь Монголын иргэдэд хялбар, хурдан, найдвартай зээлийн үйлчилгээг
                                хүргэх зорилготой. Бид санхүүгийн үйлчилгээг хүн бүрт хүртээмжтэй болгож,
                                хүмүүсийн амьдралын чанарыг сайжруулахад туслахыг зорьж байна.
                            </p>
                        </section>

                        <section class="about-section card">
                            <h2 class="section-title">Бидний үнэт зүйлс</h2>
                            <div class="values-grid">
                                <div class="value-item">
                                    <h3 class="value-title">Найдвартай байдал</h3>
                                    <p class="value-text">
                                        Бид үйлчлүүлэгчиддээ үргэлж ил тод, найдвартай байхыг эрхэмлэдэг.
                                    </p>
                                </div>
                                <div class="value-item">
                                    <h3 class="value-title">Хурдан шуурхай</h3>
                                    <p class="value-text">
                                        Зээлийн шийдвэрийг хурдан гаргаж, хугацаанд нь үйлчилдэг.
                                    </p>
                                </div>
                                <div class="value-item">
                                    <h3 class="value-title">Хүртээмжтэй</h3>
                                    <p class="value-text">
                                        Санхүүгийн үйлчилгээг хүн бүрт хялбар, хүртээмжтэй болгодог.
                                    </p>
                                </div>
                                <div class="value-item">
                                    <h3 class="value-title">Үйлчлүүлэгч төвтэй</h3>
                                    <p class="value-text">
                                        Үйлчлүүлэгчийн хэрэгцээ, сэтгэл ханамжийг нэн тэргүүнд тавьдаг.
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section class="about-section card">
                            <h2 class="section-title">Бидний үйлчилгээ</h2>
                            <div class="services-grid">
                                <div class="service-item">
                                    <div class="service-number">01</div>
                                    <h3 class="service-title">Хэрэглээний зээл</h3>
                                    <p class="service-text">
                                        2-24 сарын хугацаатай, 2% жилийн хүүтэй зээл. Хувийн хэрэгцээнд зориулсан.
                                    </p>
                                </div>
                                <div class="service-item">
                                    <div class="service-number">02</div>
                                    <h3 class="service-title">Худалдан авалтын зээл</h3>
                                    <p class="service-text">
                                        10,000₮-3,000,000₮ хүртэл, 6 сарын хугацаатай. Урьдчилгаагүй.
                                    </p>
                                </div>
                                <div class="service-item">
                                    <div class="service-number">03</div>
                                    <h3 class="service-title">Түрийвчний систем</h3>
                                    <p class="service-text">
                                        Хялбар мөнгөн гүйлгээ, орлого оруулах, гаргах боломжтой.
                                    </p>
                                </div>
                                <div class="service-item">
                                    <div class="service-number">04</div>
                                    <h3 class="service-title">Онлайн үйлчилгээ</h3>
                                    <p class="service-text">
                                        24/7 онлайн платформ ашиглан хаанаас ч хүсэлт илгээх боломжтой.
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section class="about-section card stats-section">
                            <h2 class="section-title">Бидний амжилт</h2>
                            <div class="stats-grid">
                                <div class="stat-item">
                                    <div class="stat-value">10,000+</div>
                                    <div class="stat-label">Итгэлтэй үйлчлүүлэгч</div>
                                </div>
                                <div class="stat-item">
                                    <div class="stat-value">50 сая+</div>
                                    <div class="stat-label">Олгосон зээл</div>
                                </div>
                                <div class="stat-item">
                                    <div class="stat-value">98%</div>
                                    <div class="stat-label">Сэтгэл ханамж</div>
                                </div>
                                <div class="stat-item">
                                    <div class="stat-value">24/7</div>
                                    <div class="stat-label">Онлайн үйлчилгээ</div>
                                </div>
                            </div>
                        </section>

                        <section class="about-section card contact-section">
                            <h2 class="section-title">Холбоо барих</h2>
                            <div class="contact-grid">
                                <div class="contact-item">
                                    <div class="contact-label">Утас</div>
                                    <div class="contact-value">+976 7000-0000</div>
                                </div>
                                <div class="contact-item">
                                    <div class="contact-label">И-мэйл</div>
                                    <div class="contact-value">info@omnicredit.mn</div>
                                </div>
                                <div class="contact-item">
                                    <div class="contact-label">Хаяг</div>
                                    <div class="contact-value">Улаанбаатар хот, Сүхбаатар дүүрэг</div>
                                </div>
                                <div class="contact-item">
                                    <div class="contact-label">Цагийн хуваарь</div>
                                    <div class="contact-value">Даваа-Баасан 09:00-18:00</div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>

                <app-footer></app-footer>
            </div>

            <style>
                .about-page {
                    min-height: 100vh;
                    background: var(--bg);
                }

                .about-container {
                    padding: 4rem 1rem;
                    max-width: 1200px;
                    margin: 0 auto;
                }

                .about-header {
                    text-align: center;
                    margin-bottom: 3rem;
                    animation: slideInDown 0.5s ease-out;
                }

                .page-title {
                    font-size: var(--font-4xl);
                    font-weight: var(--font-bold);
                    background: var(--gradient-primary);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    margin-bottom: 0.5rem;
                }

                .page-subtitle {
                    font-size: var(--font-lg);
                    color: var(--text-muted);
                    margin: 0;
                }

                .about-content {
                    display: flex;
                    flex-direction: column;
                    gap: 2rem;
                }

                .about-section {
                    padding: 2rem;
                    animation: slideInUp 0.5s ease-out;
                    animation-fill-mode: both;
                }

                .about-section:nth-child(1) { animation-delay: 0.1s; }
                .about-section:nth-child(2) { animation-delay: 0.2s; }
                .about-section:nth-child(3) { animation-delay: 0.3s; }
                .about-section:nth-child(4) { animation-delay: 0.4s; }
                .about-section:nth-child(5) { animation-delay: 0.5s; }

                .section-title {
                    font-size: var(--font-2xl);
                    font-weight: var(--font-bold);
                    color: var(--text);
                    margin: 0 0 1.5rem 0;
                }

                .section-text {
                    font-size: var(--font-base);
                    line-height: var(--leading-relaxed);
                    color: var(--text-secondary);
                    margin: 0;
                }

                .values-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 1.5rem;
                }

                .value-item {
                    padding: 1.5rem;
                    background: var(--bg);
                    border-radius: var(--radius-lg);
                    border: 1px solid var(--line);
                    transition: all var(--transition);
                }

                .value-item:hover {
                    border-color: var(--primary);
                    transform: translateY(-4px);
                    box-shadow: var(--shadow-lg);
                }

                .value-title {
                    font-size: var(--font-lg);
                    font-weight: var(--font-semibold);
                    color: var(--primary);
                    margin: 0 0 0.5rem 0;
                }

                .value-text {
                    font-size: var(--font-sm);
                    color: var(--text-secondary);
                    margin: 0;
                    line-height: var(--leading-relaxed);
                }

                .services-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 1.5rem;
                }

                .service-item {
                    padding: 1.5rem;
                    background: var(--bg);
                    border-radius: var(--radius-lg);
                    border: 1px solid var(--line);
                }

                .service-number {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: 50px;
                    height: 50px;
                    background: var(--gradient-primary);
                    color: white;
                    font-size: var(--font-2xl);
                    font-weight: var(--font-bold);
                    border-radius: var(--radius-lg);
                    margin-bottom: 1rem;
                }

                .service-title {
                    font-size: var(--font-lg);
                    font-weight: var(--font-semibold);
                    color: var(--text);
                    margin: 0 0 0.5rem 0;
                }

                .service-text {
                    font-size: var(--font-sm);
                    color: var(--text-secondary);
                    margin: 0;
                    line-height: var(--leading-relaxed);
                }

                .stats-section {
                    background: var(--gradient-primary);
                    color: white;
                }

                .stats-section .section-title {
                    color: white;
                    text-align: center;
                }

                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 2rem;
                }

                .stat-item {
                    text-align: center;
                    padding: 1rem;
                }

                .stat-value {
                    font-size: var(--font-4xl);
                    font-weight: var(--font-bold);
                    margin-bottom: 0.5rem;
                }

                .stat-label {
                    font-size: var(--font-sm);
                    opacity: 0.9;
                }

                .contact-section {
                    background: var(--bg-secondary);
                }

                .contact-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 1.5rem;
                }

                .contact-item {
                    padding: 1rem;
                }

                .contact-label {
                    font-size: var(--font-sm);
                    color: var(--text-muted);
                    margin-bottom: 0.5rem;
                }

                .contact-value {
                    font-size: var(--font-base);
                    font-weight: var(--font-semibold);
                    color: var(--text);
                }

                @keyframes slideInDown {
                    from {
                        opacity: 0;
                        transform: translateY(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes slideInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @media (max-width: 1024px) {
                    .values-grid,
                    .services-grid {
                        grid-template-columns: 1fr;
                    }

                    .stats-grid {
                        grid-template-columns: repeat(2, 1fr);
                    }
                }

                @media (max-width: 768px) {
                    .about-container {
                        padding: 2rem 1rem;
                    }

                    .page-title {
                        font-size: var(--font-3xl);
                    }

                    .about-section {
                        padding: 1.5rem;
                    }

                    .contact-grid {
                        grid-template-columns: 1fr;
                    }
                }

                @media (max-width: 640px) {
                    .page-title {
                        font-size: var(--font-2xl);
                    }

                    .stats-grid {
                        grid-template-columns: 1fr;
                        gap: 1rem;
                    }

                    .stat-value {
                        font-size: var(--font-3xl);
                    }
                }
            </style>
        `;
    }
}

customElements.define('about-page', AboutPage);
export default AboutPage;
