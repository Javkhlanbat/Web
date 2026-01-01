import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/purchase-loan.css';
import { LoansAPI, TokenManager } from '../services/api';

export default function PurchaseLoan() {
  const navigate = useNavigate();
  const [invoiceCode, setInvoiceCode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInvoiceCodeChange = (e) => {
    setInvoiceCode(e.target.value.toUpperCase());
  };

  const handlePhoneNumberChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').substring(0, 8);
    setPhoneNumber(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if user is logged in
    if (!TokenManager.isAuthenticated()) {
      if (window.confirm('Зээл авахын тулд нэвтрэх хэрэгтэй. Нэвтрэх хуудас руу шилжих үү?')) {
        navigate('/login');
      }
      return;
    }

    if (!invoiceCode || !phoneNumber) {
      alert('Бүх талбарыг бөглөнө үү');
      return;
    }

    try {
      setIsSubmitting(true);

      await LoansAPI.applyForPurchaseLoan({
        invoice_code: invoiceCode,
        phone: phoneNumber,
        merchant_name: 'Demo Merchant',
        amount: 0
      });

      alert('Амжилттай баталгаажлаа!');
      setTimeout(() => {
        navigate('/my-loans');
      }, 1500);
    } catch (error) {
      console.error('Purchase loan error:', error);
      alert('Алдаа гарлаа: ' + (error.message || ''));
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container">
      <h2 style={{ textAlign: 'center', marginTop: '40px', marginBottom: '24px', fontSize: '28px', fontWeight: '700' }}>
        Зээл тооцоолох
      </h2>
      <div className="loan-type-tabs">
        <Link to="/zeelhuudas" className="btn btn-secondary">Хэрэглээний зээл</Link>
        <Link to="/purchase-loan" className="btn btn-primary">Худалдан авалтын зээл</Link>
      </div>

      <div className="loan-content">
        <div className="info-box">
          <h3>Худалдан авалтын зээл (0% хүү, урьдчилгаагүй)</h3>
          <p>
            Хамтрагч байгууллагаас авсан <strong>нэхэмжлэлийн код</strong>-оо оруулж баталгаажуулна.
          </p>
        </div>

        <div className="validation-form">
          <h3 style={{ marginBottom: '24px', textAlign: 'center' }}>
            Худалдан авалтын зээл (0% хүү, урьдчилгаагүй)
          </h3>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="invoiceCode">Нэхэмжлэлийн код</label>
              <input
                type="text"
                id="invoiceCode"
                value={invoiceCode}
                onChange={handleInvoiceCodeChange}
                placeholder="AA12-BC34-5678"
                pattern="[A-Z0-9\-]+"
                required
              />
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '6px' }}>
                Хамтрагч байгууллагаас авсан нэхэмжлэлийн код шаардлагатай
              </p>
            </div>

            <div className="form-group">
              <label htmlFor="phoneNumber">Утасны дугаар</label>
              <input
                type="tel"
                id="phoneNumber"
                value={phoneNumber}
                onChange={handlePhoneNumberChange}
                placeholder="99xxxxxx"
                pattern="[0-9]{8}"
                maxLength="8"
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              style={{ width: '100%', marginTop: '8px' }}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Баталгаажуулж байна...' : 'Илгээх'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
