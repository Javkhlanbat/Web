import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TokenManager, UserManager, AuthAPI } from '../services/api';
import '../styles/hero.css';
import '../styles/home-features.css';
import '../styles/services.css';

const Home = () => {
  const [allRegisteredUsers, setAllRegisteredUsers] = useState([]);
  const [displayedUsers, setDisplayedUsers] = useState([]);
  const [isAdminSectionVisible, setIsAdminSectionVisible] = useState(false);

  useEffect(() => {
    checkAdminAndLoadUsers();
  }, []);

  const checkAdminAndLoadUsers = async () => {
    const currentUser = UserManager.getUser();
    const token = TokenManager.getToken();

    if (currentUser && token) {
      try {
        const response = await fetch('http://localhost:5000/api/auth/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          const user = data.user;

          if (user.is_admin) {
            setIsAdminSectionVisible(true);
            loadAllUsers();
          }
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
      }
    }
  };

  const loadAllUsers = async () => {
    const token = TokenManager.getToken();

    try {
      const response = await fetch('http://localhost:5000/api/auth/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        const users = data.users || [];
        setAllRegisteredUsers(users);
        setDisplayedUsers(users);
      }
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const searchUsers = () => {
    const searchTerm = document.getElementById('adminUserSearch')?.value.toLowerCase().trim();

    if (!searchTerm) {
      setDisplayedUsers(allRegisteredUsers);
      return;
    }

    const filtered = allRegisteredUsers.filter(user => {
      const fullName = `${user.last_name || ''} ${user.first_name || ''}`.toLowerCase();
      const email = (user.email || '').toLowerCase();
      const phone = (user.phone || '').toLowerCase();
      const register = (user.register_number || '').toLowerCase();

      return fullName.includes(searchTerm) ||
        email.includes(searchTerm) ||
        phone.includes(searchTerm) ||
        register.includes(searchTerm);
    });

    setDisplayedUsers(filtered);
  };

  return (
    <>
      <section className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1>Хялбар, Хурдан<br />Зээл Таны<br />Санхүүгийн Хэрэгцээнд</h1>
            <p className="hero-description">

            </p>
            <div className="hero-buttons">
              <Link to="/zeelhuudas" className="btn btn-primary btn-lg">Эхлэх</Link>
            </div>
          </div>

          <div className="hero-image">
            <svg viewBox="0 0 400 400" className="bank-illustration">
              <rect x="100" y="150" width="200" height="180" fill="#E3F2FF" rx="5" />
              <rect x="120" y="120" width="160" height="40" fill="#4A90E2" />
              <rect x="130" y="170" width="20" height="120" fill="#FFF" />
              <rect x="180" y="170" width="20" height="120" fill="#FFF" />
              <rect x="230" y="170" width="20" height="120" fill="#FFF" />
              <rect x="165" y="240" width="50" height="90" fill="#2E5C8A" />
              <circle cx="80" cy="200" r="25" fill="#4A90E2" opacity="0.6" />
              <text x="75" y="210" fontSize="24" fill="#2E5C8A">₮</text>
              <circle cx="320" cy="180" r="20" fill="#4A90E2" opacity="0.6" />
              <text x="315" y="188" fontSize="20" fill="#2E5C8A">₮</text>
            </svg>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">Яагаад OmniCredit-ийг сонгох вэ?</h2>
          <div className="features-grid">
            <div className="feature-box">
              <div className="feature-icon-wrapper">
                <svg viewBox="0 0 100 100" width="50" height="50">
                  <circle cx="50" cy="50" r="40" fill="#E3F2FF" />
                  <path d="M 30 50 L 45 65 L 70 35" stroke="#4A90E2" strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3>Хурдан Зөвшөөрөл</h3>
              <p>24 цагийн дотор зээлийн шийдвэр авна</p>
            </div>

            <div className="feature-box">
              <div className="feature-icon-wrapper">
                <svg viewBox="0 0 100 100" width="50" height="50">
                  <circle cx="50" cy="50" r="40" fill="#E3F2FF" />
                  <rect x="30" y="35" width="40" height="30" fill="none" stroke="#4A90E2" strokeWidth="5" rx="3" />
                  <circle cx="50" cy="50" r="6" fill="#4A90E2" />
                </svg>
              </div>
              <h3>Найдвартай Баталгаа</h3>
              <p>Таны мэдээллийг бүрэн хамгаална</p>
            </div>

            <div className="feature-box">
              <div className="feature-icon-wrapper">
                <svg viewBox="0 0 100 100" width="50" height="50">
                  <circle cx="50" cy="50" r="40" fill="#E3F2FF" />
                  <text x="50" y="65" fontSize="40" fill="#4A90E2" textAnchor="middle" fontWeight="bold">%</text>
                </svg>
              </div>
              <h3>Өрсөлдөхүйц Хүү</h3>
              <p>Зах зээлийн хамгийн сайн нөхцөл</p>
            </div>

            <div className="feature-box">
              <div className="feature-icon-wrapper">
                <svg viewBox="0 0 100 100" width="50" height="50">
                  <circle cx="50" cy="50" r="40" fill="#E3F2FF" />
                  <circle cx="50" cy="35" r="12" fill="#4A90E2" />
                  <path d="M 30 70 Q 50 80, 70 70 L 70 55 Q 50 65, 30 55 Z" fill="#4A90E2" />
                </svg>
              </div>
              <h3>24/7 Дэмжлэг</h3>
              <p>Хэдийд ч тусламж үзүүлнэ</p>
            </div>
          </div>
        </div>
      </section>

      {/* Loan Types Section */}
      <section className="loan-types-section">
        <div className="container">
          <h2 className="section-title">Зээлийн Төрлүүд</h2>
          <div className="loan-types-grid">
            <Link to="/zeelhuudas?type=personal" className="loan-type-card">
              <div className="loan-card-header">
                <div className="loan-icon">
                  <svg viewBox="0 0 100 100" width="40" height="40">
                    <circle cx="50" cy="40" r="18" fill="#4A90E2" />
                    <path d="M 30 70 Q 50 80, 70 70 L 70 60 Q 50 70, 30 60 Z" fill="#4A90E2" />
                  </svg>
                </div>
                <h3>Хэрэглээний Зээл</h3>
              </div>
              <ul className="loan-features-list">
                <li>✓ 500,000₮ - 10,000,000₮ хүртэл</li>
                <li>✓ 12-36 сарын хугацаа</li>
                <li>✓ Уян хатан төлбөрийн нөхцөл</li>
                <li>✓ Ямар ч зориулалтад</li>
              </ul>
              <div className="loan-card-footer">
                <span className="loan-rate">1.5% сараар</span>
                <span className="loan-cta">Дэлгэрэнгүй →</span>
              </div>
            </Link>

            <Link to="/zeelhuudas?type=purchase" className="loan-type-card featured">
              <div className="featured-badge">Эрэлттэй</div>
              <div className="loan-card-header">
                <div className="loan-icon">
                  <svg viewBox="0 0 100 100" width="40" height="40">
                    <rect x="28" y="38" width="44" height="35" fill="white" rx="3" />
                    <rect x="35" y="28" width="30" height="10" fill="white" />
                    <circle cx="50" cy="55" r="7" fill="#4A90E2" />
                  </svg>
                </div>
                <h3>Худалдан Авалтын Зээл</h3>
              </div>
              <ul className="loan-features-list">
                <li>✓ 1,000,000₮ - 20,000,000₮ хүртэл</li>
                <li>✓ 6-24 сарын хугацаа</li>
                <li>✓ Урьдчилгаа шаардлагагүй</li>
                <li>✓ Барааг шууд авна</li>
              </ul>
              <div className="loan-card-footer">
                <span className="loan-rate">1.2% сараар</span>
                <span className="loan-cta">Дэлгэрэнгүй →</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <div className="container">
          <h2 className="section-title">Хэрхэн Ажилладаг Вэ?</h2>
          <p className="section-subtitle">4 хялбар алхамаар зээл авна</p>
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <div className="step-icon">
                <svg viewBox="0 0 100 100" width="60" height="60">
                  <circle cx="50" cy="50" r="35" fill="#E3F2FF" />
                  <rect x="30" y="25" width="40" height="50" fill="none" stroke="#4A90E2" strokeWidth="4" rx="2" />
                  <line x1="38" y1="38" x2="62" y2="38" stroke="#4A90E2" strokeWidth="3" />
                  <line x1="38" y1="48" x2="62" y2="48" stroke="#4A90E2" strokeWidth="3" />
                  <line x1="38" y1="58" x2="50" y2="58" stroke="#4A90E2" strokeWidth="3" />
                </svg>
              </div>
              <h3>Хүсэлт илгээх</h3>
              <p>Онлайн маягтаа 5 минутад бөглөнө үү</p>
            </div>

            <div className="step-card">
              <div className="step-number">2</div>
              <div className="step-icon">
                <svg viewBox="0 0 100 100" width="60" height="60">
                  <circle cx="50" cy="50" r="35" fill="#E3F2FF" />
                  <rect x="30" y="30" width="40" height="40" fill="none" stroke="#4A90E2" strokeWidth="4" rx="2" />
                  <circle cx="50" cy="50" r="8" fill="#4A90E2" />
                </svg>
              </div>
              <h3>Баталгаажуулалт</h3>
              <p>Мэдээллээ баталгаажуулж баримт илгээнэ</p>
            </div>

            <div className="step-card">
              <div className="step-number">3</div>
              <div className="step-icon">
                <svg viewBox="0 0 100 100" width="60" height="60">
                  <circle cx="50" cy="50" r="35" fill="#E3F2FF" />
                  <circle cx="50" cy="50" r="25" fill="#4A90E2" />
                  <path d="M 38 50 L 46 58 L 64 40" stroke="white" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3>Шалгалт хийх</h3>
              <p>24 цагт зээлийн зөвшөөрөл авна</p>
            </div>

            <div className="step-card">
              <div className="step-number">4</div>
              <div className="step-icon">
                <svg viewBox="0 0 100 100" width="60" height="60">
                  <circle cx="50" cy="50" r="35" fill="#E3F2FF" />
                  <text x="50" y="65" fontSize="45" fill="#4A90E2" textAnchor="middle" fontWeight="bold">₮</text>
                </svg>
              </div>
              <h3>Мөнгө авах</h3>
              <p>Таны дансанд шууд орно</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-box">
              <div className="stat-number">10,000+</div>
              <div className="stat-label">Баярлуулсан үйлчлүүлэгч</div>
            </div>
            <div className="stat-box">
              <div className="stat-number">₮5 тэрбум+</div>
              <div className="stat-label">Олгосон зээл</div>
            </div>
            <div className="stat-box">
              <div className="stat-number">98%</div>
              <div className="stat-label">Сэтгэл ханамжийн түвшин</div>
            </div>
            <div className="stat-box">
              <div className="stat-number">24/7</div>
              <div className="stat-label">Үйлчилгээний цаг</div>
            </div>
          </div>
        </div>
      </section>

      <div className="container">

        {isAdminSectionVisible && (
          <section id="registeredUsersSection" style={{ marginTop: '60px' }}>
            <h2 className="section-title">Бүртгэлтэй хэрэглэгчид</h2>
            <div style={{ background: 'var(--card)', padding: '32px', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow)' }}>
              <div style={{ marginBottom: '24px', display: 'flex', gap: '12px', alignItems: 'center' }}>
                <input
                  type="text"
                  id="adminUserSearch"
                  placeholder="Нэр, и-мэйл, утас, регистрээр хайх..."
                  style={{ flex: 1, padding: '12px 16px', border: '2px solid var(--line)', borderRadius: 'var(--radius)', fontSize: '1rem' }}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      searchUsers();
                    }
                  }}
                />
                <button className="btn btn-primary" onClick={searchUsers}>Хайх</button>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: 'var(--bg)', borderBottom: '2px solid var(--line)' }}>
                      <th style={{ padding: '12px', textAlign: 'left', fontWeight: 700 }}>ID</th>
                      <th style={{ padding: '12px', textAlign: 'left', fontWeight: 700 }}>Нэр</th>
                      <th style={{ padding: '12px', textAlign: 'left', fontWeight: 700 }}>И-мэйл</th>
                      <th style={{ padding: '12px', textAlign: 'left', fontWeight: 700 }}>Утас</th>
                      <th style={{ padding: '12px', textAlign: 'left', fontWeight: 700 }}>Регистр</th>
                      <th style={{ padding: '12px', textAlign: 'left', fontWeight: 700 }}>Бүртгүүлсэн</th>
                    </tr>
                  </thead>
                  <tbody id="usersListTable">
                    {displayedUsers.length === 0 ? (
                      <tr>
                        <td colSpan="6" style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                          Бүртгэлтэй хэрэглэгч олдсонгүй
                        </td>
                      </tr>
                    ) : (
                      displayedUsers.map(user => {
                        const date = new Date(user.created_at).toLocaleDateString('mn-MN');
                        const fullName = `${user.last_name || ''} ${user.first_name || ''}`.trim() || '-';

                        return (
                          <tr key={user.id} style={{ borderBottom: '1px solid var(--line)' }}>
                            <td style={{ padding: '12px' }}>#{user.id}</td>
                            <td style={{ padding: '12px', fontWeight: 600 }}>{fullName}</td>
                            <td style={{ padding: '12px' }}>{user.email || '-'}</td>
                            <td style={{ padding: '12px' }}>{user.phone || '-'}</td>
                            <td style={{ padding: '12px' }}>{user.register_number || '-'}</td>
                            <td style={{ padding: '12px', color: 'var(--text-muted)' }}>{date}</td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              <div id="usersCount" style={{ marginTop: '16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                Нийт: {displayedUsers.length} хэрэглэгч
              </div>
            </div>
          </section>
        )}

        <section className="partners" id="partners">
          <h2 className="section-title">Бидэнтэй хамтран ажиллах уу?</h2>
          <p style={{ maxWidth: '700px', margin: 'auto', color: 'var(--text-muted)' }}>
            Хэрэв та онлайн дэлгүүр эсвэл бизнес эрхэлж байгаа бол OmniCredit-тэй хамтарч,
            худалдан авагчиддаа хэсэгчлэн төлөх боломж олгоорой. Энэ нь таны борлуулалтыг нэмэгдүүлнэ.
          </p>
          <div className="partner-grid">
            <div className="partner-card">Дэлгүүр 1</div>
            <div className="partner-card">Дэлгүүр 2</div>
            <div className="partner-card">Дэлгүүр 3</div>
            <div className="partner-card">Дэлгүүр 4</div>
          </div>
          <a href="mailto:info@omnicredit.mn" className="cta">Бидэнтэй холбогдох</a>
        </section>
      </div>
    </>
  );
};

export default Home;
