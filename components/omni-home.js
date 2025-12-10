// components/omni-home.js

// 1) Hero side loan card (Хэрэглээний / Худалдан авалтын зээл)
class OmniFeatureCard extends HTMLElement {
  static get observedAttributes() {
    return ['title', 'text', 'img', 'href'];
  }

  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  render() {
    const title = this.getAttribute('title') || '';
    const text = this.getAttribute('text') || '';
    const img = this.getAttribute('img') || '';
    const href = this.getAttribute('href') || '#';

    this.innerHTML = /* html */`
      <article class="hero-loan-card">
        <div class="hero-loan-image">
          <img src="${img}" alt="${title}">
        </div>
        <div class="hero-loan-body">
          <h3 class="hero-loan-title">${title}</h3>
          <p class="hero-loan-text">${text}</p>
          <a href="${href}" class="hero-loan-btn">Дэлгэрэнгүй</a>
        </div>
      </article>
    `;
  }
}

customElements.define('omni-feature-card', OmniFeatureCard);

// 2) Stat card (100+, 4.8, 500+)
class OmniStatCard extends HTMLElement {
  static get observedAttributes() {
    return ['value', 'label', 'star'];
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  render() {
    const value = this.getAttribute('value') || '';
    const label = this.getAttribute('label') || '';
    const star = this.hasAttribute('star');

    this.innerHTML = /* html */`
      <div class="stat-card">
        <div class="stat-value">
          ${value}${star ? '<span class="stat-star">★</span>' : ''}
        </div>
        <div class="stat-label">${label}</div>
      </div>
    `;
  }
}

customElements.define('omni-stat-card', OmniStatCard);

// 3) Why-card (Яагаад манайхыг сонгох вэ)
class OmniWhyCard extends HTMLElement {
  static get observedAttributes() {
    return ['title', 'text'];
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  render() {
    const title = this.getAttribute('title') || '';
    const text = this.getAttribute('text') || '';

    this.innerHTML = /* html */`
      <article class="why-card">
        <div class="why-icon">ⓘ</div>
        <h3>${title}</h3>
        <p>${text}</p>
      </article>
    `;
  }
}

customElements.define('omni-why-card', OmniWhyCard);

// 4) Partner logo
class OmniPartnerLogo extends HTMLElement {
  static get observedAttributes() {
    return ['text'];
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  render() {
    const text = this.getAttribute('text') || '';
    this.innerHTML = /* html */`
      <div class="partner-logo">${text}</div>
    `;
  }
}

customElements.define('omni-partner-logo', OmniPartnerLogo);
