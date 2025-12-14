// pages/faq.page.js

export function renderFaq(app) {
  app.innerHTML = `
    <div class="container">

      <section style="text-align: center; margin: 64px 0 32px;">
        <h1>Түгээмэл асуулт хариулт</h1>
        <p style="color: var(--text-muted); font-size: 1.125rem; max-width: 600px; margin: 16px auto 0;">
          Таны асуултын хариултыг эндээс олоорой
        </p>
      </section>

      <div class="search-box">
        <input type="text" id="searchInput" placeholder="Асуулт хайх...">
        <span class="search-icon"></span>
      </div>

      <div class="faq-categories">
        <button class="btn btn-primary category-btn" data-category="general">
          <div class="category-icon"></div>
          <div>Ерөнхий</div>
        </button>
        <button class="btn btn-secondary category-btn" data-category="loan">
          <div class="category-icon"></div>
          <div>Зээлийн тухай</div>
        </button>
        <button class="btn btn-secondary category-btn" data-category="payment">
          <div class="category-icon"></div>
          <div>Төлбөр</div>
        </button>
        <button class="btn btn-secondary category-btn" data-category="account">
          <div class="category-icon"></div>
          <div>Данс</div>
        </button>
      </div>

      <div class="faq-section">
        <!-- GENERAL -->
        <div class="faq-list active" id="general">
          <div class="faq-item">
            <div class="faq-question">
              <span>OmniCredit гэж юу вэ?</span>
              <span class="faq-toggle">+</span>
            </div>
            <div class="faq-answer">
              <div class="faq-answer-content">
                OmniCredit бол Монголд үйл ажиллагаа явуулдаг онлайн зээлийн платформ юм.
                Бид хэрэглэгчдэд хурдан, хялбар, ил тод зээлийн үйлчилгээ үзүүлдэг.
                Та өөрийн гар утас эсвэл компьютероос зээлийн хүсэлт илгээж,
                минутын дотор шийдвэр авах боломжтой.
              </div>
            </div>
          </div>

          <div class="faq-item">
            <div class="faq-question">
              <span>Та нарын үйлчилгээ аюулгүй юу?</span>
              <span class="faq-toggle">+</span>
            </div>
            <div class="faq-answer">
              <div class="faq-answer-content">
                Тийм ээ, бид таны мэдээллийн аюулгүй байдлыг хамгийн чухал зүйл гэж үздэг.
                Бүх мэдээллийг SSL шифрлэлтээр хамгаалж, олон улсын стандартын дагуу
                хадгалдаг. Мөн Санхүүгийн зохицуулах хорооноос бүрэн эрхтэй.
              </div>
            </div>
          </div>

          <div class="faq-item">
            <div class="faq-question">
              <span>Хэрхэн холбоо барих вэ?</span>
              <span class="faq-toggle">+</span>
            </div>
            <div class="faq-answer">
              <div class="faq-answer-content">
                Та 24/7 ажилладаг дэмжлэгийн багтай холбогдож болно:
                <br>• Утас: 7777-7777
                <br>• Имэйл: support@omnicredit.mn
                <br>• Чат: Веб сайтын баруун доод буланд байрлах чат
              </div>
            </div>
          </div>

          <div class="faq-item">
            <div class="faq-question">
              <span>Ажлын цаг хэд вэ?</span>
              <span class="faq-toggle">+</span>
            </div>
            <div class="faq-answer">
              <div class="faq-answer-content">
                Манай онлайн систем 24/7 ажилладаг. Та хүссэн үедээ зээлийн хүсэлт илгээж,
                төлбөр төлж болно. Харин хэрэв танд туслах хэрэгтэй бол, манай дэмжлэгийн
                баг өдрийн 9:00-21:00 цагт бэлэн байдаг.
              </div>
            </div>
          </div>
        </div>

        <!-- LOAN -->
        <div class="faq-list" id="loan">
          <div class="faq-item">
            <div class="faq-question">
              <span>Зээл авахын тулд юу хэрэгтэй вэ?</span>
              <span class="faq-toggle">+</span>
            </div>
            <div class="faq-answer">
              <div class="faq-answer-content">
                Зээл авахад дараах шаардлага хангасан байх хэрэгтэй:
                <br>• 18-65 насны Монгол иргэн
                <br>• Тогтвортой орлоготой
                <br>• Иргэний үнэмлэх
                <br>• Утасны дугаар болон имэйл хаяг
                <br>• Банкны дансны мэдээлэл
              </div>
            </div>
          </div>

          <div class="faq-item">
            <div class="faq-question">
              <span>Хамгийн их хэдий зээл авч болох вэ?</span>
              <span class="faq-toggle">+</span>
            </div>
            <div class="faq-answer">
              <div class="faq-answer-content">
                Анхны зээл авагчид хамгийн ихдээ ₮1,000,000 хүртэл авах боломжтой.
                Зээлийн түүх сайтай бол энэ дээд хязгаарыг ₮3,000,000 хүртэл
                нэмэгдүүлэх боломжтой.
              </div>
            </div>
          </div>

          <div class="faq-item">
            <div class="faq-question">
              <span>Хүү хэд вэ?</span>
              <span class="faq-toggle">+</span>
            </div>
            <div class="faq-answer">
              <div class="faq-answer-content">
                Манай сарын хүү 2.0%-3.3% хооронд байдаг. Хүүгийн хэмжээ таны
                зээлийн түүх, орлого, зээлийн хугацаанаас хамаарна.
                Нэмэлт нууц төлбөр, хураамж байхгүй.
              </div>
            </div>
          </div>

          <div class="faq-item">
            <div class="faq-question">
              <span>Шийдвэр хэдий хугацаанд гарах вэ?</span>
              <span class="faq-toggle">+</span>
            </div>
            <div class="faq-answer">
              <div class="faq-answer-content">
                Урьдчилсан шийдвэр 5 минутын дотор гарна. Баталсны дараа
                зээлийн мөнгө таны данс руу 24 цагийн дотор шилжинэ.
              </div>
            </div>
          </div>

          <div class="faq-item">
            <div class="faq-question">
              <span>Зээлийн хугацааг сунгаж болох уу?</span>
              <span class="faq-toggle">+</span>
            </div>
            <div class="faq-answer">
              <div class="faq-answer-content">
                Тийм, та зээлээ сунгах хүсэлт илгээж болно. Гэхдээ энэ нь
                нэмэлт хүү бодогдох тул төлбөрийн дүн нэмэгдэнэ. Зээлээ цагтаа
                төлөхийг зөвлөж байна.
              </div>
            </div>
          </div>
        </div>

        <!-- PAYMENT -->
        <div class="faq-list" id="payment">
          <div class="faq-item">
            <div class="faq-question">
              <span>Хэрхэн төлбөр төлөх вэ?</span>
              <span class="faq-toggle">+</span>
            </div>
            <div class="faq-answer">
              <div class="faq-answer-content">
                Та дараах аргуудаар төлбөр төлж болно:
                <br>• Дансаас шууд шилжүүлэг
                <br>• Карт (Visa/MasterCard)
                <br>• QPay, SocialPay
                <br>• Банкны салбар
              </div>
            </div>
          </div>

          <div class="faq-item">
            <div class="faq-question">
              <span>Төлбөрийн хугацаа хэтэрвэл яах вэ?</span>
              <span class="faq-toggle">+</span>
            </div>
            <div class="faq-answer">
              <div class="faq-answer-content">
                Төлбөр хугацаа хэтрүүлбэл алданги төлбөр бодогдоно. Хэрэв
                төлбөрт хүндрэлтэй байгаа бол манай дэмжлэгийн багтай холбогдож,
                төлбөрийн төлөвлөгөө дахин зохицуулах хүсэлт илгээнэ үү.
              </div>
            </div>
          </div>

          <div class="faq-item">
            <div class="faq-question">
              <span>Эртнээ төлвөл хөнгөлөлттэй юу?</span>
              <span class="faq-toggle">+</span>
            </div>
            <div class="faq-answer">
              <div class="faq-answer-content">
                Тийм, та зээлээ эрт төлбөл үлдсэн хүүг төлөх шаардлагагүй.
                Зөвхөн үндсэн зээл болон тухайн үед бодогдсон хүүг төлнө.
              </div>
            </div>
          </div>

          <div class="faq-item">
            <div class="faq-question">
              <span>Төлбөрийн баримт авах боломжтой юу?</span>
              <span class="faq-toggle">+</span>
            </div>
            <div class="faq-answer">
              <div class="faq-answer-content">
                Тийм, төлбөр бүрийн дараа та цахим баримт авах боломжтой.
                Баримтыг өөрийн дансны түүхээс татаж авч болно.
              </div>
            </div>
          </div>
        </div>

        <!-- ACCOUNT -->
        <div class="faq-list" id="account">
          <div class="faq-item">
            <div class="faq-question">
              <span>Хэрхэн данс үүсгэх вэ?</span>
              <span class="faq-toggle">+</span>
            </div>
            <div class="faq-answer">
              <div class="faq-answer-content">
                "Бүртгүүлэх" товч дээр дарж, шаардлагатай мэдээллээ оруулаад
                бүртгэлээ баталгаажуулна. Процесс 2-3 минут шаардана.
              </div>
            </div>
          </div>

          <div class="faq-item">
            <div class="faq-question">
              <span>Нууц үгээ мартсан бол?</span>
              <span class="faq-toggle">+</span>
            </div>
            <div class="faq-answer">
              <div class="faq-answer-content">
                Нэвтрэх хуудсан дээрх "Нууц үг мартсан?" холбоос дээр дарж,
                бүртгэлтэй имэйл хаягаа оруулна. Бид танд шинэ нууц үг
                үүсгэх холбоос илгээнэ.
              </div>
            </div>
          </div>

          <div class="faq-item">
            <div class="faq-question">
              <span>Мэдээллээ хэрхэн засах вэ?</span>
              <span class="faq-toggle">+</span>
            </div>
            <div class="faq-answer">
              <div class="faq-answer-content">
                Дансандаа нэвтрээд "Хувийн мэдээлэл" хэсэгт орж,
                мэдээллээ шинэчилж болно. Зарим мэдээлэл өөрчлөхөд
                баталгаажуулалт шаардагдана.
              </div>
            </div>
          </div>

          <div class="faq-item">
            <div class="faq-question">
              <span>Дансаа хэрхэн устгах вэ?</span>
              <span class="faq-toggle">+</span>
            </div>
            <div class="faq-answer">
              <div class="faq-answer-content">
                Та support@omnicredit.mn хаяг руу данс устгах хүсэлт илгээнэ үү.
                Гэхдээ идэвхтэй зээл байгаа бол эхлээд төлбөрөө дуусгах
                шаардлагатай.
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="contact-cta">
        <h3>Хариулт олдсонгүй юу?</h3>
        <p style="color: var(--text-muted); margin-bottom: 24px;">
          Бидэнтэй холбогдоорой, бид танд туслахад таатай байна
        </p>
        <div class="btn-group" style="justify-content: center;">
          <a href="mailto:support@omnicredit.mn" class="btn btn-primary">Имэйл илгээх</a>
          <a href="tel:77777777" class="btn btn-secondary">Утасдах</a>
        </div>
      </div>
    </div>
  `;
}

export function afterRenderFaq() {
  if (window.__faqAbort) window.__faqAbort.abort();
  const ac = new AbortController();
  window.__faqAbort = ac;
  const on = (el, ev, fn) => el && el.addEventListener(ev, fn, { signal: ac.signal });

  const categoryBtns = document.querySelectorAll('.category-btn');
  const faqLists = document.querySelectorAll('.faq-list');
  const faqItems = document.querySelectorAll('.faq-item');

  categoryBtns.forEach(btn => {
    on(btn, 'click', () => {
      const category = btn.dataset.category;

      categoryBtns.forEach(b => {
        b.classList.remove('btn-primary');
        b.classList.add('btn-secondary');
      });
      btn.classList.remove('btn-secondary');
      btn.classList.add('btn-primary');

      faqLists.forEach(list => list.classList.remove('active'));
      document.getElementById(category)?.classList.add('active');
    });
  });

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    on(question, 'click', () => item.classList.toggle('open'));
  });

  const searchInput = document.getElementById('searchInput');
  on(searchInput, 'input', (e) => {
    const query = (e.target.value || '').toLowerCase();
    faqItems.forEach(item => {
      const text = item.textContent.toLowerCase();
      item.style.display = text.includes(query) ? 'block' : 'none';
    });
  });
}
