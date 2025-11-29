'use client';

import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

const faqs = [
  {
    question: 'Is NadeeTeacher free?',
    answer: 'NadeeTeacher offers a free trial for parents to explore the platform. Teachers can sign up for free access for their classrooms.',
  },
  {
    question: 'What grades does NadeeTeacher cover?',
    answer: 'NadeeTeacher covers Pre-Kindergarten through Grade 5 for Math and Reading.',
  },
  {
    question: "Is NadeeTeacher aligned with school curriculum?",
    answer: "Yes, our content is aligned with Common Core and state standards.",
  },
  {
    question: 'Can I use it on multiple devices?',
    answer: 'Yes, NadeeTeacher is available on iPads, Android tablets, and web browsers on computers.',
  },
  {
    question: 'How do I track my child\'s progress?',
    answer: 'Parents get access to a detailed dashboard and receive weekly email reports on their child\'s activity and progress.',
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
          Frequently Asked Questions
        </h2>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm overflow-hidden">
              <button
                className="w-full flex justify-between items-center p-6 text-left focus:outline-none"
                onClick={() => toggleFAQ(index)}
              >
                <span className="font-bold text-gray-900">{faq.question}</span>
                {openIndex === index ? (
                  <ChevronUp className="text-blue-600" />
                ) : (
                  <ChevronDown className="text-gray-400" />
                )}
              </button>
              
              {openIndex === index && (
                <div className="px-6 pb-6 text-gray-600 animate-fadeIn">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
