import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const PaymentModal = ({ show, handleClose }) => {
  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        centered
        style={{ fontFamily: 'Arial, sans-serif' }}
      >
        <Modal.Header
          style={{
            borderBottom: '1px solid #e0e0e0',
            padding: '15px 20px',
            backgroundColor: '#fff'
          }}
        >
          <Modal.Title style={{ fontSize: '20px', fontWeight: '600', color: '#212121' }}>
            Choose Payment Method
          </Modal.Title>
          <Button
            variant="link"
            onClick={handleClose}
            style={{
              color: '#878787',
              fontSize: '24px',
              textDecoration: 'none',
              padding: '0'
            }}
          >
            &times;
          </Button>
        </Modal.Header>
        <Modal.Body
          style={{
            padding: '20px',
            backgroundColor: '#f1f3f6'
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '15px'
            }}
          >
            {/* Online Payment Option */}
            <div
              style={{
                backgroundColor: '#fff',
                padding: '15px',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '15px',
                transition: 'box-shadow 0.2s ease'
              }}
              onClick={() => alert('Online Payment Selected')}
              onMouseOver={(e) => (e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)')}
              onMouseOut={(e) => (e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)')}
            >
              <img
                src="https://img.icons8.com/color/48/000000/card-wallet.png"
                alt="Online Payment"
                style={{ width: '40px', height: '40px' }}
              />
              <div>
                <h5 style={{ margin: '0', fontSize: '16px', fontWeight: '500', color: '#212121' }}>
                  Online Payment
                </h5>
                <p style={{ margin: '0', fontSize: '14px', color: '#878787' }}>
                  Credit/Debit Card, UPI, Net Banking
                </p>
              </div>
            </div>

            {/* Offline Payment Option */}
            <div
              style={{
                backgroundColor: '#fff',
                padding: '15px',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '15px',
                transition: 'box-shadow 0.2s ease'
              }}
              onClick={() => alert('Cash on Delivery Selected')}
              onMouseOver={(e) => (e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)')}
              onMouseOut={(e) => (e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)')}
            >
              <img
                src="https://img.icons8.com/color/48/000000/cash-in-hand.png"
                alt="Cash on Delivery"
                style={{ width: '40px', height: '40px' }}
              />
              <div>
                <h5 style={{ margin: '0', fontSize: '16px', fontWeight: '500', color: '#212121' }}>
                  Cash on Delivery
                </h5>
                <p style={{ margin: '0', fontSize: '14px', color: '#878787' }}>
                  Pay when you receive the order
                </p>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer
          style={{
            borderTop: '1px solid #e0e0e0',
            padding: '15px 20px',
            backgroundColor: '#fff'
          }}
        >
          <Button
            variant="secondary"
            onClick={handleClose}
            style={{
              backgroundColor: '#f0f0f0',
              color: '#212121',
              border: 'none',
              padding: '8px 20px',
              borderRadius: '4px',
              fontWeight: '500'
            }}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleClose}
            style={{
              backgroundColor: '#fb641b',
              border: 'none',
              padding: '8px 20px',
              borderRadius: '4px',
              fontWeight: '600'
            }}
          >
            Confirm Payment
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default PaymentModal;