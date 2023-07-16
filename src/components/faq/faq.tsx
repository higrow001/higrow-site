"use client";

import React, { useState } from 'react';
import styles from './FAQ.module.css';

const FAQ = ({ faqData }) => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index) => {
    setActiveIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  return (
    <div className={styles.faqContainer}>
      {faqData.map((faq, index) => (
        <div
          key={index}
          className={`${styles.faqItem} ${activeIndex === index ? styles.active : ''}`}
          onClick={() => toggleAccordion(index)}
        >
          <div className={styles.question}>{faq.question}</div>
          <div className={styles.answer}>{faq.answer}</div>
        </div>
      ))}
    </div>
  );
};

export default FAQ;
