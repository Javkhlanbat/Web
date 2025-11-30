// PURPOSE CARD
class OmniPurposeCard extends HTMLElement {
  static get observedAttributes() {
    return ['img', 'title', 'text1', 'text2'];
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  render() {
    const img = this.getAttribute('img') || '';
    const title = this.getAttribute('title') || '';
    const text1 = this.getAttribute('text1') || '';
    const text2 = this.getAttribute('text2') || '';

    this.innerHTML = `
      <article class="first">
        <img src="${img}" alt="${title}">
        <h2>${title}</h2>
        <p>${text1}</p>
        <p>${text2}</p>
      </article>
    `;
  }
}
customElements.define('omni-purpose-card', OmniPurposeCard);

//TIMELINE ITEM
class OmniTimelineItem extends HTMLElement {
  static get observedAttributes() {
    return ['date', 'text'];
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  render() {
    const date = this.getAttribute('date') || '';
    const text = this.getAttribute('text') || '';

    this.innerHTML = `
      <article class="titem">
        <time datetime="${date}">${date}</time>
        <span>${text}</span>
      </article>
    `;
  }
}
customElements.define('omni-timeline-item', OmniTimelineItem);

// TEAM MEMBER
class OmniTeamMember extends HTMLElement {
  static get observedAttributes() {
    return ['img', 'name', 'role', 'desc'];
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  render() {
    const img = this.getAttribute('img') || '';
    const name = this.getAttribute('name') || '';
    const role = this.getAttribute('role') || '';
    const desc = this.getAttribute('desc') || '';

    this.innerHTML = `
      <article class="member">
        <img src="${img}" alt="${name}">
        <div class="infomem">
          <h3>${name}</h3>
          <p>${role}</p>
          <p>${desc}</p>
        </div>
      </article>
    `;
  }
}
customElements.define('omni-team-member', OmniTeamMember);
