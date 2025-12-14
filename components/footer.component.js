export const Footer = {
  render() {
    return `
      <footer class="footer">
        <div class="container">
          <div class="footer-content">
            <div class="footer-section">
              <div class="footer-brand">OmniCredit</div>
              <p>Монголын хамгийн хялбар бөгөөд найдвартай зээлийн үйлчилгээ.</p>
            </div>

            <div class="footer-section">
              <h4>Үйлчилгээ</h4>
              <ul class="footer-links">
                <li><a href="#/calculator" data-link>Зээл авах</a></li>
                <li><a href="#/purchase-loan" data-link>Худалдан авалтын зээл</a></li>
              </ul>
            </div>

            <div class="footer-section">
              <h4>Тусламж</h4>
              <ul class="footer-links">
                <li><a href="#/about" data-link>Бидний тухай</a></li>
                <li><a href="#/faq" data-link>Түгээмэл асуулт</a></li>
              </ul>
            </div>
          </div>

          <div class="footer-bottom">
            <span>© 2025 OmniCredit. Бүх эрх хуулиар хамгаалагдсан.</span>
          </div>
        </div>
      </footer>
    `;
  },
};
