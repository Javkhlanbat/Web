// Hero side loan card
class OmniHeroLoanCard extends HTMLElement {
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

    this.innerHTML =`
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

customElements.define('omni-hero-loan-card', OmniHeroLoanCard);

// Stat card
class OmniStatCard extends HTMLElement {
  static get observedAttributes() {
    return ['value', 'label'];
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

    this.innerHTML = `
      <div class="stat-card">
        <div class="stat-value">${value}</div>
        <div class="stat-label">${label}</div>
      </div>
    `;
  }
}

customElements.define('omni-stat-card', OmniStatCard);

// Testimonial card
class ReviewCard extends HTMLElement {
  static get observedAttributes() {
    return ['name', 'role', 'text', 'rating'];
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  renderStars(rating) {
    const r = Number(rating) || 0;
    return '★★★★★'.slice(0, r);
  }

  render() {
    const name = this.getAttribute('name') || '';
    const role = this.getAttribute('role') || '';
    const text = this.getAttribute('text') || '';
    const rating = this.getAttribute('rating') || '5';

    this.innerHTML = `
      <article class="testimonial-card">
        <div>
          <div class="testimonial-name">${name}</div>
          <div class="testimonial-role">${role}</div>
          <p>${text}</p>
        </div>
        <div class="testimonial-stars">${this.renderStars(rating)}</div>
      </article>
    `;
  }
}

customElements.define('omni-testimonial-card', ReviewCard);

// Why-us card
class OmniWhyCard extends HTMLElement {
  static get observedAttributes() {
    return ['icon', 'title', 'text'];
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  render() {
    const icon = this.getAttribute('icon') || '';
    const title = this.getAttribute('title') || '';
    const text = this.getAttribute('text') || '';

    this.innerHTML = `
      <div class="why-card">
        <div class="why-icon">${icon}</div>
        <h3>${title}</h3>
        <p>${text}</p>
      </div>
    `;
  }
}

customElements.define('omni-why-card', OmniWhyCard);

// Partner logo
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
    this.innerHTML = /*html*/`
      <div class="partner-logo">${text}</div>
    `;
  }
}

customElements.define('omni-partner-logo', OmniPartnerLogo);
