import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { FiPieChart, FiTrendingUp, FiShield, FiSmartphone, FiCheck } from 'react-icons/fi';
import { IconType } from 'react-icons';

interface Feature {
  icon: IconType;
  title: string;
  description: string;
}

interface Testimonial {
  name: string;
  role: string;
  content: string;
  image: string;
}

interface PricingTier {
  name: string;
  price: string;
  description: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
}

interface FAQItem {
  question: string;
  answer: string;
}

const features: Feature[] = [
  {
    icon: FiPieChart,
    title: 'Smart Budgeting',
    description: 'Intelligent categorization and visualization of your spending patterns'
  },
  {
    icon: FiTrendingUp,
    title: 'Goal Tracking',
    description: 'Set and monitor your financial goals with interactive progress tracking'
  },
  {
    icon: FiShield,
    title: 'Secure Data',
    description: 'Bank-level security to keep your financial information safe'
  },
  {
    icon: FiSmartphone,
    title: 'Mobile Ready',
    description: 'Access your budget anywhere with our responsive design'
  }
];

const testimonials: Testimonial[] = [
  {
    name: 'Rishi Singj',
    role: 'Small Business Owner',
    content: 'This budget tracker has transformed how I manage both personal and business finances.',
    image: '/Rishi.png'
  },
  {
    name: 'Rudrapratap Singh',
    role: 'Freelancer',
    content: 'The goal tracking feature helped me save for my dream vacation in just 6 months!',
    image: '/Rudrapratap Singh.jpg'
  },
  {
    name: 'Durvesh Shelar',
    role: 'Student',
    content: 'Perfect for managing student loans and tracking my monthly expenses.',
    image: '/Durvesh Shelar.jpg'
  }
];

const pricingTiers: PricingTier[] = [
  {
    name: 'Basic',
    price: 'Free',
    description: 'Perfect for getting started with personal budgeting',
    features: [
      'Basic expense tracking',
      'Monthly budget planning',
      'Basic reports and analytics',
      'Mobile access',
    ],
    cta: 'Start Free'
  },
  {
    name: 'Pro',
    price: '₹799/mo',
    description: 'Advanced features for serious budget planners',
    features: [
      'Everything in Basic',
      'Custom categories',
      'Advanced analytics',
      'Goal tracking',
      'Export reports',
    ],
    cta: 'Get Pro',
    highlighted: true
  },
  {
    name: 'Enterprise',
    price: '₹1,499/mo',
    description: 'Complete solution for businesses and teams',
    features: [
      'Everything in Pro',
      'Team collaboration',
      'Role-based access',
      'Priority support',
      'Custom integrations',
      'API access'
    ],
    cta: 'Contact Sales'
  }
];

const faqItems: FAQItem[] = [
  {
    question: 'How secure is my financial data?',
    answer: 'We use bank-level encryption and security measures to protect your data. Your information is encrypted both in transit and at rest.'
  },
  {
    question: 'Can I export my financial reports?',
    answer: 'Yes, Pro and Enterprise users can export their financial reports in various formats including PDF, CSV, and Excel.'
  },
  {
    question: 'Is there a mobile app available?',
    answer: 'Our platform is fully responsive and works great on mobile devices. Native iOS and Android apps are coming soon!'
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards, PayPal, and bank transfers for premium subscriptions.'
  }
];

const FeatureCard: React.FC<{ feature: Feature; index: number }> = ({ feature, index }) => (
  <motion.div
    key={feature.title}
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    whileHover={{ scale: 1.02 }}
    transition={{ duration: 0.3 }}
    className="flex flex-col transform transition-all duration-300 ease-in-out"
  >
    <dt className="text-lg font-semibold leading-7 text-gray-900">
      <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600 text-white transition-colors duration-300 ease-in-out group-hover:bg-indigo-700">
        <feature.icon className="h-6 w-6" />
      </div>
      {feature.title}
    </dt>
    <dd className="mt-1 flex flex-auto flex-col text-base leading-7 text-gray-600">
      <p className="flex-auto">{feature.description}</p>
    </dd>
  </motion.div>
);

const TestimonialCard: React.FC<{ testimonial: Testimonial; index: number }> = ({ testimonial, index }) => (
  <motion.div
    key={testimonial.name}
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    whileHover={{ 
      y: -5,
      transition: { duration: 0.2 }
    }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    className="flex flex-col justify-between bg-white p-6 shadow-lg ring-1 ring-gray-900/5 rounded-2xl transform transition-all duration-300 ease-in-out hover:shadow-xl"
  >
    <div>
      <p className="text-lg leading-6 text-gray-600">{testimonial.content}</p>
    </div>
    <div className="mt-6 flex items-center gap-x-4">
      <img className="h-12 w-12 rounded-full transition-transform duration-300 ease-in-out hover:scale-110" src={testimonial.image} alt={testimonial.name} />
      <div>
        <h3 className="text-sm font-semibold leading-6 text-gray-900">{testimonial.name}</h3>
        <p className="text-sm leading-6 text-gray-600">{testimonial.role}</p>
      </div>
    </div>
  </motion.div>
);

const PricingCard: React.FC<{ tier: PricingTier }> = ({ tier }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    whileHover={{ y: -10 }}
    transition={{ duration: 0.3 }}
    className={`flex flex-col p-8 mx-auto max-w-lg rounded-3xl ring-1 ring-gray-200 ${
      tier.highlighted ? 'bg-indigo-50 ring-indigo-500' : 'bg-white'
    }`}
  >
    <h3 className="text-lg font-semibold leading-8 text-gray-900">{tier.name}</h3>
    <p className="mt-4 text-sm leading-6 text-gray-600">{tier.description}</p>
    <p className="mt-6 flex items-baseline gap-x-1">
      <span className="text-4xl font-bold tracking-tight text-gray-900">{tier.price}</span>
      {tier.price !== 'Free' && <span className="text-sm font-semibold leading-6 text-gray-600">/month</span>}
    </p>
    <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-gray-600">
      {tier.features.map((feature) => (
        <li key={feature} className="flex gap-x-3">
          <FiCheck className="h-6 w-5 flex-none text-indigo-600" aria-hidden="true" />
          {feature}
        </li>
      ))}
    </ul>
    <button
      onClick={() => window.location.href = '/signup'}
      className={`mt-8 block rounded-md px-3 py-2 text-center text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
        tier.highlighted
          ? 'bg-indigo-600 text-white hover:bg-indigo-500 focus-visible:outline-indigo-600'
          : 'bg-white text-indigo-600 ring-1 ring-inset ring-indigo-200 hover:ring-indigo-300'
      }`}
    >
      {tier.cta}
    </button>
  </motion.div>
);

const FAQItem: React.FC<{ item: FAQItem; index: number }> = ({ item, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    className="pt-8 first:pt-0"
  >
    <dt className="text-base font-semibold leading-7 text-gray-900">{item.question}</dt>
    <dd className="mt-2 text-base leading-7 text-gray-600">{item.answer}</dd>
  </motion.div>
);

export function Landing(): JSX.Element {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleDashboardClick = () => {
    if (currentUser?.emailVerified) {
      navigate('/dashboard');
    } else if (currentUser) {
      navigate('/verify-email');
    }
  };

  return (
    <div className="relative bg-gradient-to-b from-indigo-50 to-white">
      {/* Hero Section */}
      <div className="relative isolate overflow-hidden">
        <div className="absolute inset-x-0 -top-40 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
        </div>
        
        <div className="mx-auto max-w-7xl px-6 pt-10 pb-24 sm:pb-32 lg:flex lg:px-8 lg:py-40">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mx-auto max-w-2xl flex-shrink-0 lg:mx-0 lg:max-w-xl lg:pt-8"
          >
            <div className="mb-8 flex gap-x-4 items-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="rounded-full bg-indigo-500/10 px-3 py-1 text-sm font-semibold leading-6 text-indigo-600 ring-1 ring-inset ring-indigo-500/20"
              >
                Latest Update
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="text-sm leading-6 text-gray-600"
              >
                Now with Smart Budget Insights
              </motion.div>
            </div>
            
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                Transform Your Financial Future
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Join thousands who've already taken control of their finances. Our smart budgeting platform helps you track expenses, 
                grow savings, and achieve your financial goals with powerful insights and automated recommendations.
              </p>
            </div>

            <div className="mt-8 flex flex-col space-y-6">
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 rounded-full bg-indigo-100 p-2">
                  <FiShield className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Bank-Grade Security</h3>
                  <p className="text-sm text-gray-600">Your financial data is protected with enterprise-level encryption</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 rounded-full bg-indigo-100 p-2">
                  <FiPieChart className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Smart Analytics</h3>
                  <p className="text-sm text-gray-600">Get instant insights into your spending patterns and habits</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 rounded-full bg-indigo-100 p-2">
                  <FiTrendingUp className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Automated Savings</h3>
                  <p className="text-sm text-gray-600">Reach your financial goals faster with smart saving recommendations</p>
                </div>
              </div>
            </div>

            {/* <div className="mt-10 flex items-center justify-center gap-x-6">
              <button
                onClick={() => window.location.href = '/signup'}
                className="rounded-md bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-all duration-300 hover:scale-105 cursor-pointer"
              >
                Sign up now
              </button>
              <button
                onClick={() => window.location.href = '/login'}
                className="text-sm font-semibold leading-6 text-gray-900 hover:text-indigo-600 transition-colors duration-300 flex items-center cursor-pointer"
              >
                Log in <span aria-hidden="true" className="ml-1">→</span>
              </button>
            </div> */}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden lg:block lg:flex-1 lg:ml-16 relative"
          >
            <div className="w-[110%] relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl blur opacity-30"></div>
              <img
                src="/dashboard.png"
                alt="Budget tracking dashboard"
                className="relative w-full rounded-xl shadow-2xl ring-1 ring-gray-900/10 transform scale-110"
              />
            </div>
          </motion.div>
        </div>

        <div className="absolute inset-x-0 top-[calc(100%-13rem)] transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]" aria-hidden="true">
          <div className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"></div>
        </div>
      </div>

      {/* Features Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="py-24 sm:py-32 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/50 to-white"></div>
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              Everything you need to manage your money
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Powerful features to help you take control of your finances
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-4">
              {features.map((feature, index) => (
                <FeatureCard key={feature.title} feature={feature} index={index} />
              ))}
            </dl>
          </div>
        </div>
      </motion.div>

      {/* Testimonials Section */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="bg-white py-24 sm:py-32"
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Loved by users everywhere
            </h2>
          </div>
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={testimonial.name} testimonial={testimonial} index={index} />
            ))}
          </div>
        </div>
      </motion.div>

      {/* Pricing Section */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="py-24 sm:py-32"
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Simple, transparent pricing
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Choose the plan that works best for you
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {pricingTiers.map((tier) => (
              <PricingCard key={tier.name} tier={tier} />
            ))}
          </div>
        </div>
      </motion.div>

      {/* FAQ Section */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="bg-white py-24 sm:py-32"
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl text-center">
              Frequently asked questions
            </h2>
            <dl className="mt-16 space-y-8 divide-y divide-gray-900/10">
              {faqItems.map((item, index) => (
                <FAQItem key={item.question} item={item} index={index} />
              ))}
            </dl>
          </div>
        </div>
      </motion.div>

      {/* Call to Action Section */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="bg-indigo-50 py-16 sm:py-24"
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Ready to take control of your finances?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-600">
              Join thousands of users who are already managing their money smarter.
              Start your journey to financial freedom today.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <button
                onClick={() => window.location.href = '/signup'}
                className="rounded-md bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-all duration-300 hover:scale-105 cursor-pointer"
              >
                Get started for free
              </button>
              <button
                onClick={() => window.location.href = '/login'}
                className="text-sm font-semibold leading-6 text-gray-900 hover:text-indigo-600 transition-colors"
              >
                Learn more <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Enhanced Footer */}
      <footer className="bg-gray-900 text-gray-300">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Company Info */}
            <div className="col-span-1">
              <h3 className="text-lg font-semibold mb-4 text-white">Budget Tracker</h3>
              <p className="text-sm text-gray-400 mb-4">
                Empowering individuals and businesses to take control of their financial future.
              </p>
              <div className="flex flex-col space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="text-sm">Made with ❤️ in</span>
                  <svg 
                    className="h-4 w-6 inline-block"
                    viewBox="0 0 900 600"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect fill="#FF9933" width="900" height="200"/>
                    <rect fill="#FFFFFF" y="200" width="900" height="200"/>
                    <rect fill="#138808" y="400" width="900" height="200"/>
                    <circle fill="#000080" cx="450" cy="300" r="60"/>
                    <circle fill="#FFFFFF" cx="450" cy="300" r="55"/>
                    <circle fill="#000080" cx="450" cy="300" r="16.5"/>
                    <g fill="#000080">
                      {[...Array(24)].map((_, i) => (
                        <line
                          key={i}
                          x1="450"
                          y1="300"
                          x2={450 + 38 * Math.cos((i * 15 - 90) * Math.PI / 180)}
                          y2={300 + 38 * Math.sin((i * 15 - 90) * Math.PI / 180)}
                          strokeWidth="3"
                          stroke="#000080"
                        />
                      ))}
                    </g>
                  </svg>
                  <span className="text-sm font-semibold bg-gradient-to-r from-orange-500 via-white to-green-500 text-transparent bg-clip-text">
                    India
                  </span>
                </div>
                <div className="text-sm text-gray-400">
                  by <a href="https://github.com/panduthegang" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300 transition-colors">Harsh Rathod</a>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="col-span-1">
              <h3 className="text-lg font-semibold mb-4 text-white">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => window.location.href = '/features'}
                    className="text-sm hover:text-indigo-400 transition-colors"
                  >
                    Features
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => window.location.href = '/pricing'}
                    className="text-sm hover:text-indigo-400 transition-colors"
                  >
                    Pricing
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => window.location.href = '/about'}
                    className="text-sm hover:text-indigo-400 transition-colors"
                  >
                    About Us
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => window.location.href = '/contact'}
                    className="text-sm hover:text-indigo-400 transition-colors"
                  >
                    Contact
                  </button>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div className="col-span-1">
              <h3 className="text-lg font-semibold mb-4 text-white">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => window.location.href = '/blog'}
                    className="text-sm hover:text-indigo-400 transition-colors"
                  >
                    Blog
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => window.location.href = '/help'}
                    className="text-sm hover:text-indigo-400 transition-colors"
                  >
                    Help Center
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => window.location.href = '/guides'}
                    className="text-sm hover:text-indigo-400 transition-colors"
                  >
                    Financial Guides
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => window.location.href = '/api'}
                    className="text-sm hover:text-indigo-400 transition-colors"
                  >
                    API Documentation
                  </button>
                </li>
              </ul>
            </div>

            {/* Connect */}
            <div className="col-span-1">
              <h3 className="text-lg font-semibold mb-4 text-white">Connect</h3>
              <div className="flex space-x-4 mb-4">
                <a href="#" className="text-gray-400 hover:text-gray-300 transition-colors">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-300 transition-colors">
                  <span className="sr-only">GitHub</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-300 transition-colors">
                  <span className="sr-only">LinkedIn</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
              <p className="text-sm text-gray-400">
                Stay updated with our newsletter
              </p>
              <form className="mt-2 flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-gray-800 text-sm rounded-l-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500 flex-1"
                />
                <button
                  type="submit"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-r-md text-sm hover:bg-indigo-700 transition-colors"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800 pt-8 mt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-sm text-gray-400 mb-4 md:mb-0">
                &copy; {new Date().getFullYear()} Budget Tracker. All rights reserved.
              </p>
              <div className="flex space-x-6">
                <button
                  onClick={() => window.location.href = '/privacy'}
                  className="text-sm text-gray-400 hover:text-indigo-400 transition-colors"
                >
                  Privacy Policy
                </button>
                <button
                  onClick={() => window.location.href = '/terms'}
                  className="text-sm text-gray-400 hover:text-indigo-400 transition-colors"
                >
                  Terms of Service
                </button>
                <button
                  onClick={() => window.location.href = '/cookies'}
                  className="text-sm text-gray-400 hover:text-indigo-400 transition-colors"
                >
                  Cookie Policy
                </button>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}