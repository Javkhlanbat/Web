/**
 * FAQ Page Web Component
 * Frequently Asked Questions
 */

class FaqPage extends HTMLElement {
    constructor() {
        super();
        this.openItems = new Set();
    }

    connectedCallback() {
        this.render();
        this.attachEventListeners();
    }

    toggleFaq(index) {
        if (this.openItems.has(index)) {
            this.openItems.delete(index);
        } else {
            this.openItems.add(index);
        }
        this.render();
        this.attachEventListeners();
    }

    attachEventListeners() {
        const faqItems = this.querySelectorAll('.faq-question');
        faqItems.forEach((item, index) => {
            item.addEventListener('click', () => this.toggleFaq(index));
        });
    }

    render() {
        const faqs = [
            {
                category: 'Ерөнхий асуулт',
                questions: [
                    {
                        q: 'OmniCredit гэж юу вэ?',
                        a: 'OmniCredit нь Монголын иргэдэд хялбар, хурдан, найдвартай зээлийн үйлчилгээ үзүүлдэг онлайн платформ юм. Бид 2 төрлийн зээл олгодог: хэрэглээний зээл болон худалдан авалтын зээл.'
                    },
                    {
                        q: 'Яаж бүртгүүлэх вэ?',
                        a: 'Вэбсайт дээр "Бүртгүүлэх" товчийг дарж, өөрийн мэдээллээ оруулна уу. Нэр, овог, и-мэйл, утасны дугаар, регистрийн дугаар болон нууц үг шаардлагатай. Бүртгэл хийснээр та шууд систем рүү нэвтэрч болно.'
                    },
                    {
                        q: 'Зээл авахад ямар баримт бичиг хэрэгтэй вэ?',
                        a: 'Зөвхөн иргэний үнэмлэхний регистрийн дугаар болон утасны дугаар хангалттай. Нэмэлт баримт бичиг шаардахгүй.'
                    },
                    {
                        q: 'Зээл хэр хурдан шийдвэрлэгддэг вэ?',
                        a: 'Зээлийн хүсэлтийг автомат систем шалгаж, ихэнх тохиолдолд 24 цагийн дотор хариу өгдөг. Зарим тохиолдолд нэмэлт шалгалт хийхэд 2-3 хоног шаардагдаж болно.'
                    }
                ]
            },
            {
                category: 'Зээлийн төрөл',
                questions: [
                    {
                        q: 'Хэрэглээний зээл гэж юу вэ?',
                        a: 'Хэрэглээний зээл нь 2-24 сарын хугацаатай, 2% жилийн хүүтэй зээл юм. Энэ нь хувийн хэрэгцээ, төлбөр болон бусад зардалд зориулагдсан.'
                    },
                    {
                        q: 'Худалдан авалтын зээл гэж юу вэ?',
                        a: 'Худалдан авалтын зээл нь 10,000₮-аас 3,000,000₮ хүртэл, 6 сарын хугацаатай, урьдчилгаагүй зээл юм. Энэ нь бараа, үйлчилгээ худалдан авахад зориулагдсан.'
                    },
                    {
                        q: 'Хоёр зээлийн хүү яагаад адилхан вэ?',
                        a: 'Бид үйлчлүүлэгчиддээ ил тод, шударга үйлчилгээ үзүүлэхийг эрхэмлэдэг тул бүх төрлийн зээлд 2% жилийн хүү ногдуулдаг. Энэ нь Монгол дахь хамгийн бага хүүгийн нэг юм.'
                    },
                    {
                        q: 'Хамгийн их хэдий зээл авч болох вэ?',
                        a: 'Хэрэглээний зээлд дээд хязгаар байхгүй бөгөөд таны төлбөрийн чадвараас хамаарна. Худалдан авалтын зээл нь 3,000,000₮ хүртэл байна.'
                    }
                ]
            },
            {
                category: 'Төлбөр болон буцаалт',
                questions: [
                    {
                        q: 'Сарын төлбөрөө яаж төлөх вэ?',
                        a: 'Та эхлээд өөрийн банкны данснаас түрийвч рүү мөнгө шилжүүлэн, дараа нь түрийвчнээс зээлийн төлбөрөө төлнө. Энэ нь автомат тооцоолсон дүн дээр тулгуурлан хийгддэг.'
                    },
                    {
                        q: 'Урьдчилж төлж болох уу?',
                        a: 'Тийм, та зээлээ урьдчилж төлж болно. Ямар ч торгууль, нэмэлт хураамж байхгүй.'
                    },
                    {
                        q: 'Төлбөр хоцорвол яах вэ?',
                        a: 'Төлбөр хоцорвол өдрийн 0.5%-ийн торгууль ногдоно. Та төлбөр төлөхөд хүндрэлтэй байгаа бол манай тусламжийн албатай холбогдоорой.'
                    },
                    {
                        q: 'Түрийвч гэж юу вэ?',
                        a: 'Түрийвч нь таны хувийн санхүүгийн данс юм. Зээл зөвшөөрөгдсөн үед мөнгө түрийвч рүү очино. Та түрийвчнээс банк руугаа мөнгө шилжүүлж болно. Мөн төлбөр төлөхдөө түрийвчнээ ашиглана.'
                    }
                ]
            },
            {
                category: 'Аюулгүй байдал',
                questions: [
                    {
                        q: 'Миний мэдээлэл аюулгүй юу?',
                        a: 'Тийм, бид дэлхийн стандартын шифрлэлт ашигладаг. Таны бүх хувийн мэдээлэл болон санхүүгийн өгөгдөл найдвартай хамгаалагдсан.'
                    },
                    {
                        q: 'Нууц үгээ мартсан бол яах вэ?',
                        a: 'Нэвтрэх хуудас дээр "Нууц үгээ мартсан уу?" гэсэн холбоосыг дарж, и-мэйл хаягаа оруулна уу. Бид танд шинэ нууц үг үүсгэх заавар илгээх болно.'
                    },
                    {
                        q: 'Та миний мэдээллийг гуравдагч этгээдэд өгөх үү?',
                        a: 'Үгүй, бид таны мэдээллийг хуулиар шаардсанаас бусад тохиолдолд гуравдагч этгээдэд өгөхгүй. Таны мэдээлэл зөвхөн зээлийн үнэлгээнд ашиглагдана.'
                    }
                ]
            },
            {
                category: 'Техникийн дэмжлэг',
                questions: [
                    {
                        q: 'Хэрэв асуудал гарвал хэнтэй холбогдох вэ?',
                        a: 'Та +976 7000-0000 утсаар эсвэл info@omnicredit.mn и-мэйл хаягаар манайхтай холбогдож болно. Бид Даваа-Баасан 09:00-18:00 цагт ажилладаг.'
                    },
                    {
                        q: 'Таны мобайл апп байгаа юу?',
                        a: 'Одоогоор бид зөвхөн веб платформоор үйлчилж байна. Гэвч ирээдүйд iOS болон Android апп гаргахаар төлөвлөж байна.'
                    },
                    {
                        q: 'Ямар төлбөрийн аргууд дэмжигддэг вэ?',
                        a: 'Та банкны шилжүүлэг ашиглан түрийвчиндээ мөнгө оруулж болно. Бид бүх үндсэн банкуудыг дэмждэг.'
                    }
                ]
            }
        ];

        this.innerHTML = `
            <div class="faq-page">
                <app-nav></app-nav>

                <div class="faq-container container">
                    <div class="faq-header">
                        <h1 class="page-title">Түгээмэл асуулт хариулт</h1>
                        <p class="page-subtitle">Таны асуултад бидний хариулт</p>
                    </div>

                    <div class="faq-content">
                        ${faqs.map((category, catIndex) => `
                            <div class="faq-category" style="animation-delay: ${catIndex * 0.1}s">
                                <h2 class="category-title">${category.category}</h2>
                                <div class="faq-list">
                                    ${category.questions.map((faq, qIndex) => {
                                        const globalIndex = faqs.slice(0, catIndex).reduce((acc, cat) => acc + cat.questions.length, 0) + qIndex;
                                        const isOpen = this.openItems.has(globalIndex);
                                        return `
                                            <div class="faq-item ${isOpen ? 'active' : ''}">
                                                <div class="faq-question">
                                                    <h3 class="faq-q">${faq.q}</h3>
                                                    <div class="faq-icon">${isOpen ? '−' : '+'}</div>
                                                </div>
                                                <div class="faq-answer ${isOpen ? 'show' : ''}">
                                                    <p class="faq-a">${faq.a}</p>
                                                </div>
                                            </div>
                                        `;
                                    }).join('')}
                                </div>
                            </div>
                        `).join('')}
                    </div>

                    <div class="faq-cta card">
                        <h2 class="cta-title">Асуулт олдсонгүй юу?</h2>
                        <p class="cta-text">Бидэнтэй холбогдож, илүү дэлгэрэнгүй мэдээлэл авна уу</p>
                        <div class="cta-buttons">
                            <a href="tel:+97670000000" class="btn btn-primary">Утасаар холбогдох</a>
                            <a href="mailto:info@omnicredit.mn" class="btn btn-outline">И-мэйл илгээх</a>
                        </div>
                    </div>
                </div>

                <app-footer></app-footer>
            </div>

            <style>
                .faq-page {
                    min-height: 100vh;
                    background: var(--bg);
                }

                .faq-container {
                    padding: 4rem 1rem;
                    max-width: 900px;
                    margin: 0 auto;
                }

                .faq-header {
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

                .faq-content {
                    display: flex;
                    flex-direction: column;
                    gap: 2rem;
                    margin-bottom: 3rem;
                }

                .faq-category {
                    animation: slideInUp 0.5s ease-out;
                    animation-fill-mode: both;
                }

                .category-title {
                    font-size: var(--font-2xl);
                    font-weight: var(--font-bold);
                    color: var(--text);
                    margin-bottom: 1rem;
                    padding-bottom: 0.5rem;
                    border-bottom: 2px solid var(--primary);
                }

                .faq-list {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }

                .faq-item {
                    background: var(--card);
                    border: 1px solid var(--card-border);
                    border-radius: var(--radius-lg);
                    overflow: hidden;
                    transition: all var(--transition);
                }

                .faq-item:hover {
                    box-shadow: var(--shadow-lg);
                }

                .faq-item.active {
                    border-color: var(--primary);
                }

                .faq-question {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1.5rem;
                    cursor: pointer;
                    user-select: none;
                }

                .faq-question:hover {
                    background: var(--bg);
                }

                .faq-q {
                    font-size: var(--font-lg);
                    font-weight: var(--font-semibold);
                    color: var(--text);
                    margin: 0;
                    flex: 1;
                }

                .faq-icon {
                    width: 32px;
                    height: 32px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: var(--primary-light);
                    color: var(--primary);
                    border-radius: var(--radius);
                    font-size: var(--font-2xl);
                    font-weight: var(--font-bold);
                    flex-shrink: 0;
                    margin-left: 1rem;
                    transition: all var(--transition);
                }

                .faq-item.active .faq-icon {
                    background: var(--primary);
                    color: white;
                }

                .faq-answer {
                    max-height: 0;
                    overflow: hidden;
                    transition: max-height 0.3s ease-out;
                }

                .faq-answer.show {
                    max-height: 500px;
                }

                .faq-a {
                    padding: 0 1.5rem 1.5rem 1.5rem;
                    color: var(--text-secondary);
                    line-height: var(--leading-relaxed);
                    margin: 0;
                }

                .faq-cta {
                    text-align: center;
                    padding: 3rem 2rem;
                    background: var(--gradient-primary);
                    color: white;
                    animation: slideInUp 0.5s ease-out 0.3s;
                    animation-fill-mode: both;
                }

                .cta-title {
                    font-size: var(--font-3xl);
                    font-weight: var(--font-bold);
                    margin: 0 0 1rem 0;
                }

                .cta-text {
                    font-size: var(--font-lg);
                    margin: 0 0 2rem 0;
                    opacity: 0.95;
                }

                .cta-buttons {
                    display: flex;
                    gap: 1rem;
                    justify-content: center;
                    flex-wrap: wrap;
                }

                .cta-buttons .btn {
                    min-width: 200px;
                }

                .cta-buttons .btn-outline {
                    background: white;
                    color: var(--primary);
                    border-color: white;
                }

                .cta-buttons .btn-outline:hover {
                    background: rgba(255, 255, 255, 0.9);
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

                @media (max-width: 768px) {
                    .faq-container {
                        padding: 2rem 1rem;
                    }

                    .page-title {
                        font-size: var(--font-3xl);
                    }

                    .category-title {
                        font-size: var(--font-xl);
                    }

                    .faq-question {
                        padding: 1rem;
                    }

                    .faq-q {
                        font-size: var(--font-base);
                    }

                    .faq-a {
                        padding: 0 1rem 1rem 1rem;
                        font-size: var(--font-sm);
                    }

                    .faq-cta {
                        padding: 2rem 1.5rem;
                    }

                    .cta-title {
                        font-size: var(--font-2xl);
                    }

                    .cta-buttons {
                        flex-direction: column;
                    }

                    .cta-buttons .btn {
                        width: 100%;
                    }
                }

                @media (max-width: 640px) {
                    .page-title {
                        font-size: var(--font-2xl);
                    }

                    .faq-icon {
                        width: 28px;
                        height: 28px;
                        font-size: var(--font-xl);
                    }
                }
            </style>
        `;
    }
}

customElements.define('faq-page', FaqPage);
export default FaqPage;
