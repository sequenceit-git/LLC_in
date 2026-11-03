import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../api';

export const DEFAULT_CONTACT = {
  email: 'info@llcpublications.com',
  phone: '(888) 484-2204',
  hours: 'M–F · 8a–6p ET',
  address: 'New York, NY',
  portalUrl: 'https://portal.llcpublicationonline.com/',
  legalName: 'LLC Publications Online',
  notice: 'Customer support inquiries are typically answered within 24 business hours.',
};

const ContactContext = createContext({
  contact: DEFAULT_CONTACT,
  loading: false,
  reloadContact: () => {},
  setContactState: () => {},
});

export function ContactProvider({ children }) {
  const [contact, setContactState] = useState(DEFAULT_CONTACT);
  const [loading, setLoading] = useState(true);

  const reloadContact = () => {
    setLoading(true);
    return api
      .contact()
      .then((item) => {
        if (item) {
          setContactState((prev) => ({ ...prev, ...item }));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    reloadContact();
  }, []);

  return (
    <ContactContext.Provider value={{ contact, loading, reloadContact, setContactState }}>
      {children}
    </ContactContext.Provider>
  );
}

export function useContact() {
  return useContext(ContactContext);
}

