
import '../omni-aboutus.js';
import { Utils } from '../utils.component.js';

export function renderAbout() {
 
  return /* html */ `
    <div class="container about-wrap">
      <main>
        <!-- INTRO -->
        <section class="intro">
          <h1>Бид <span class="hylbar">хялбар</span>, ил тод зээлийг бүтээнэ</h1>
          <p class="desc">
            OmniCredit бол Монгол хэрэглэгчдэд хурдан, ойлгомжтой, уян хатан санхүүгийн үйлчилгээ хүргэх зорилготой финтек баг.
            Бидний түүх, үнэт зүйлтэй танилцаарай.
          </p>
        </section>

        <!-- PURPOSE -->
        <section class="purpose">
          <omni-purpose-card
            img="images/workspace.jpg"
            title="Эрхэм зорилго"
            text1="Санхүүжилтийг хүн бүрт хүртээмжтэй, хурдан, хялбар олгох."
            text2="Тодорхой нөхцөл, ил тод, шуурхай шийдвэр дээр төвлөрнө.">
          </omni-purpose-card>

          <omni-purpose-card
            img="images/workspace.jpg"
            title="Алсын хараа"
            text1="Монголын тэргүүлэх дижитал зээл олгох платформ болох."
            text2="Харилцагчдад үнэ цэнийг бүтээж, санхүүгийн олон төрлийн үйлчилгээг багтаахад төвлөрнө.">
          </omni-purpose-card>
        </section>

        <!-- TIMELINE -->
        <section class="timeline">
          <h2>Түүхэн товчоо</h2>
          <div class="timeline-list">
            <omni-timeline-item date="2025.01.01" text="OmniCredit албан ёсоор байгуулагдаж, платформын хөгжүүлэлт эхэлсэн."></omni-timeline-item>
            <omni-timeline-item date="2025.06.01" text="Анхны туршилтын хэрэглэгчид зээл авч, бүтээгдэхүүний үндсэн боломжууд нээгдсэн."></omni-timeline-item>
            <omni-timeline-item date="2026.01.01" text="Хамтрагч байгууллагын сүлжээ өргөжиж, OmniCredit олон сувгаар хүрч эхэлнэ."></omni-timeline-item>
          </div>
        </section>

        <!-- TEAM -->
        <section class="team">
          <h2>Гүйцэтгэх удирдлагын баг</h2>
          <div class="listmem">
            <omni-team-member img="images/coworker.webp" name="Б. Жавхланбат" role="Хөгжүүлэгч"
              desc="Back-end / Front-end хөгжүүлэлт, системийн архитектур дээр ажиллаж байна."></omni-team-member>

            <omni-team-member img="images/coworker.webp" name="Т. Марал" role="Дизайнер"
              desc="Хэрэглэгчийн туршлага, интерфэйсийн дизайн, брэндийн визуал бодлогыг хариуцдаг."></omni-team-member>

            <omni-team-member img="images/coworker.webp" name="Д. Анар" role="Гүйцэтгэх захирал"
              desc="Стратеги, бүтээгдэхүүний чиглэл, багийн зохион байгуулалт, хамтын ажиллагааг удирдана."></omni-team-member>
          </div>
        </section>

        <!-- REQUEST -->
        <section class="request">
          <span>Хамтрах хүсэлт илгээх</span>
          <h2>Бидэнтэй хамт өсөе</h2>
          <p>
            OmniCredit танай бизнесийн <strong>борлуулалтыг</strong> өсгөхөд тусална.
            Богино маягт илгээвэл бид тантай холбогдож, хамтын ажиллагааны боломжийг танилцуулах болно.
          </p>
          <button id="openform">Илгээх</button>
        </section>

        <!-- MODAL -->
        <div class="about-modal" id="aboutModal" aria-hidden="true">
          <div class="card">
            <div class="card-header">
              <h3 style="margin:0;">Хамтрах хүсэлт</h3>
              <button class="xbtn" id="closeAboutModal" aria-label="Close">&times;</button>
            </div>
            <div class="card-body">
              <form id="partnerForm">
                <div class="form-group">
                  <label class="form-label">Байгууллагын нэр</label>
                  <input class="form-control" name="company" required placeholder="Жишээ: ABC LLC" />
                </div>

                <div class="form-group">
                  <label class="form-label">Утас</label>
                  <input class="form-control" name="phone" required placeholder="99112233" />
                </div>

                <div class="form-group">
                  <label class="form-label">Имэйл</label>
                  <input class="form-control" type="email" name="email" required placeholder="you@company.mn" />
                </div>

                <div class="form-group">
                  <label class="form-label">Товч тайлбар</label>
                  <textarea class="form-control" name="message" rows="4" placeholder="Юун дээр хамтармаар байна?"></textarea>
                </div>

                <button class="btn btn-primary btn-block" type="submit">Илгээх</button>
              </form>
              <p style="margin:12px 0 0; font-size:12px; color: var(--text-muted);">
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  `;
}

// Router render-ийн дараа заавал дууд (router.js чинь afterRender дэмждэг бол түүгээр, үгүй бол render дараа шууд)
export function afterRenderAbout() {
  const openBtn = document.getElementById('openform');
  const modal = document.getElementById('aboutModal');
  const closeBtn = document.getElementById('closeAboutModal');
  const form = document.getElementById('partnerForm');

  if (!openBtn || !modal || !closeBtn || !form) return;

  const open = () => {
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const close = () => {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  openBtn.addEventListener('click', open);
  closeBtn.addEventListener('click', close);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) close();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    // demo submit
    Utils?.showToast?.('Хүсэлт амжилттай. Бид удахгүй холбогдоно!', 'success');
    form.reset();
    close();
  });
}
