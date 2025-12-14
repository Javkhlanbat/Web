// pages/about.page.js
import '../omni-aboutus.js'; // custom elements: omni-purpose-card, omni-timeline-item, omni-team-member :contentReference[oaicite:2]{index=2}

export function renderAbout() {
  return /* html */ `
    <div class="container about-wrap">
      <main>
        <!-- INTRO -->
        <section class="intro">
          <h1>Бид санхүүжилтийг <span class="hylbar">хялбар</span> болгоно.</h1>
          <p class="desc">
            OmniCredit нь хэрэглэгчдэд тод, уян хатан санхүүгийн үйлчилгээ хүргэх зорилготой финтек баг.
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
            <omni-timeline-item
              date="2025.01.01"
              text="OmniCredit албан ёсоор байгуулагдаж, платформын хөгжүүлэлт эхэлсэн.">
            </omni-timeline-item>

            <omni-timeline-item
              date="2025.06.01"
              text="Анхны туршилтын хэрэглэгчид зээл авч, бүтээгдэхүүний үндсэн боломжууд нээгдсэн.">
            </omni-timeline-item>

            <omni-timeline-item
              date="2026.01.01"
              text="Хамтрагч байгууллагын сүлжээ өргөжиж, OmniCredit олон сувгаар хүрч эхэлнэ.">
            </omni-timeline-item>
          </div>
        </section>

        <!-- TEAM -->
        <section class="team">
          <h2>Гүйцэтгэх удирдлагын баг</h2>
          <div class="listmem">
            <omni-team-member
              img="images/coworker.webp"
              name="Б. Жавхланбат"
              role="Хөгжүүлэгч"
              desc="Back-end / Front-end хөгжүүлэлт, системийн архитектур дээр ажиллаж байна.">
            </omni-team-member>

            <omni-team-member
              img="images/coworker.webp"
              name="Т. Марал"
              role="Дизайнер"
              desc="Хэрэглэгчийн туршлага, интерфэйсийн дизайн, брэндийн визуал бодлогыг хариуцдаг.">
            </omni-team-member>

            <omni-team-member
              img="images/coworker.webp"
              name="Д. Анар"
              role="Гүйцэтгэх захирал"
              desc="Стратеги, бүтээгдэхүүний чиглэл, багийн зохион байгуулалт, хамтын ажиллагааг удирдана.">
            </omni-team-member>
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

          <!-- FAQ шиг: дархад mail client нээгдэнэ -->
          <a id="openform"
             class="btn btn-primary"
             href="mailto:support@omnicredit.mn">
            Илгээх
          </a>
        </section>
      </main>
    </div>
  `;
}

// mailto ашигласан болохоор тусгай JS хэрэггүй. Ирээдүйд интерактив нэмэх бол энд хийнэ.
export function afterRenderAbout() {}
