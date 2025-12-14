// pages/home.page.js
import '../omni-home.js';
import { UserManager } from '../mock-api.component.js';

export function renderHome(app) {
  const user = UserManager.getUser();

  app.innerHTML = `
    <div class="hero-wrapper">
      <div class="container">
        <section class="hero">
          <!-- Зүүн талын том карт -->
          <div class="hero-main-card">
            <div class="hero-kicker">Таны зээлд тусална</div>
            <h1 class="hero-title">
              Танд тохирох зээлийн<br>
              <span>төрлөө сонгоорой</span>
            </h1>
            <p class="hero-description">
              OmniCredit-оор дамжуулан хэрэглээний болон худалдан авалтын зээлээ
              хялбархан авч, төлөлтийн уян хатан нөхцөлөөр санхүүгийн хэрэгцээгээ
              шийдээрэй.
            </p>
            <a href="#/calculator" data-link class="btn btn-primary">
              Зээл тооцоолох
            </a>
          </div>

          <!-- Баруун талын 2 карт -->
          <div class="hero-side">
            <omni-feature-card
              title="ХЭРЭГЛЭЭНИЙ ЗЭЭЛ"
              text="Өдөр тутмын хэрэгцээг санхүүгийн дарамтгүйгээр хангах хурдан, уян хатан нөхцөлтэй зээл."
              img="images/consumer-loan.svg"
              href="#/calculator">
            </omni-feature-card>

            <omni-feature-card
              title="ХУДАЛДАН АВАЛТЫН ЗЭЭЛ"
              text="Бараа бүтээгдэхүүнээ урьдчилгаа бага эсвэл урьдчилгаагүйгээр худалдан авах ухаалаг санхүүжилт."
              img="images/purchase-loan.svg"
              href="#/purchase-loan">
            </omni-feature-card>
          </div>
        </section>

        <!-- STATS -->
        <section class="stats-section">
          <div class="stats-grid">
            <omni-stat-card value="100+" label="Зээл олгосон"></omni-stat-card>
            <omni-stat-card value="4.8" label="Үнэлгээ" star></omni-stat-card>
            <omni-stat-card value="500+" label="Харилцагч"></omni-stat-card>
          </div>
        </section>
      </div>
    </div>

    <!-- TESTIMONIALS -->
    <section class="testimonials">
      <div class="container">
        <h2 class="section-title">Манай хэрэглэгчдийн туршлагаас</h2>
        <div class="testimonial-row">
          <div class="testimonial-arrow">‹</div>

          <div class="testimonial-list">
            <article class="testimonial-card">
              <div>
                <div class="testimonial-name">Саруул</div>
                <div class="testimonial-role">Жижиг бизнес эрхлэгч</div>
                <p>
                  Эргэлтийн хөрөнгөө богино хугацаанд шийдэж чадсан.
                  Төлөлтийн уян хатан хуваарь нь их таалагдсан.
                </p>
              </div>
              <div class="testimonial-stars">★★★★★</div>
            </article>

            <article class="testimonial-card">
              <div>
                <div class="testimonial-name">Бат-Эрдэнэ</div>
                <div class="testimonial-role">Инженер</div>
                <p>
                  Аппаар хүсэлт илгээж 5 минутын дотор баталгаажуулсан.
                  Нөхцөл нь ойлгомжтой, нууц шимтгэлгүй.
                </p>
              </div>
              <div class="testimonial-stars">★★★★★</div>
            </article>

            <article class="testimonial-card">
              <div>
                <div class="testimonial-name">Ундраа</div>
                <div class="testimonial-role">Гэрийн эзэгтэй</div>
                <p>
                  Гэнэтийн эмчилгээний зардлаа санаа зоволгүй шийдэхэд тус болсон.
                </p>
              </div>
              <div class="testimonial-stars">★★★★★</div>
            </article>
          </div>

          <div class="testimonial-arrow">›</div>
        </div>
      </div>
    </section>

    <!-- WHY US -->
    <section class="why-section">
      <div class="container">
        <h2 class="section-title">Яагаад манайхыг сонгох вэ</h2>
        <div class="why-grid">
          <omni-why-card
            title="ИЛ ТОД ҮЙЛЧИЛГЭЭ"
            text="Нууц шимтгэлгүй, бүх нөхцөл ил тод.">
          </omni-why-card>

          <omni-why-card
            title="ШУУРХАЙ ШИЙДВЭР"
            text="Хэдхэн минутын дотор урьдчилсан шийдвэр.">
          </omni-why-card>

          <omni-why-card
            title="УЯН ХАТАН ТӨЛӨЛТ"
            text="2–24 сарын уян хатан хугацаа.">
          </omni-why-card>

          <omni-why-card
            title="АЮУЛГҮЙ, НАЙДВАРТАЙ"
            text="Банкны түвшний аюулгүй байдал.">
          </omni-why-card>
        </div>
      </div>
    </section>

    <!-- PARTNERS -->
    <section class="partners">
      <div class="container">
        <h2 class="section-title">Хамтрагч байгууллагууд</h2>
        <p class="partners-text">
          OmniCredit-оор BNPL шийдлийг ашигласнаар таны борлуулалт өснө.
        </p>
        <div class="partner-logos">
          <omni-partner-logo text="Logoplsum"></omni-partner-logo>
          <omni-partner-logo text="Logoplsum"></omni-partner-logo>
          <omni-partner-logo text="Logoplsum"></omni-partner-logo>
          <omni-partner-logo text="Logoplsum"></omni-partner-logo>
        </div>
      </div>
    </section>

  `;
}
