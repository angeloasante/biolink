'use client'

import { motion } from 'framer-motion'
import { ArrowLeft, Shield, Lock, Eye, Database, Users, FileText, Clock, RefreshCw, Mail } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

const sections = [
  {
    icon: Database,
    title: "1. Information We Collect",
    content: `We only collect what's necessary to run the service:`,
    list: [
      "Account information (such as email address)",
      "Profile information (bio text, social media links, usernames)",
      "Usage data (basic, anonymous analytics like page views and interactions)"
    ],
    note: "We do not collect sensitive personal data."
  },
  {
    icon: Eye,
    title: "2. How We Use Your Information",
    content: "We use your information to:",
    list: [
      "Create and manage your Biofolio profile",
      "Display your links and content as requested",
      "Improve the performance and reliability of the service",
      "Communicate with you about your account or important updates"
    ],
    note: "We do not sell your data."
  },
  {
    icon: FileText,
    title: "3. Cookies & Analytics",
    content: "Biofolio.link may use minimal cookies or local storage for:",
    list: [
      "Keeping you logged in",
      "Basic, privacy-friendly analytics"
    ],
    note: "We do not use invasive tracking or advertising cookies."
  },
  {
    icon: Lock,
    title: "4. How Your Data Is Stored",
    content: "Your data is stored securely and protected using industry-standard practices. We take reasonable steps to prevent unauthorized access, loss, or misuse.",
    list: [],
    note: null
  },
  {
    icon: Users,
    title: "5. Sharing of Information",
    content: "We do not share your personal data with third parties, except:",
    list: [
      "When required by law",
      "When necessary to operate the service (e.g., infrastructure providers)"
    ],
    note: null
  },
  {
    icon: Shield,
    title: "6. Your Rights",
    content: "If you are in the UK or EU, you have the right to:",
    list: [
      "Access your data",
      "Correct your data",
      "Request deletion of your account and data"
    ],
    note: "You can request this by contacting us."
  },
  {
    icon: Clock,
    title: "7. Data Retention",
    content: "We keep your data only as long as your account is active or as needed to provide the service. You can delete your account at any time.",
    list: [],
    note: null
  },
  {
    icon: RefreshCw,
    title: "8. Changes to This Policy",
    content: "We may update this Privacy Policy from time to time. Any changes will be posted on this page.",
    list: [],
    note: null
  }
]

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#050505] relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-green-500/5 rounded-full blur-[200px] -z-10"></div>
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[150px] -z-10"></div>
      
      {/* Grid Pattern */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:80px_80px] -z-10"></div>

      {/* Navigation */}
      <motion.nav 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 z-50 bg-[#050505]/80 backdrop-blur-xl border-b border-white/5"
      >
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back to Home</span>
          </Link>
          <Link href="/" className="flex items-center">
            <Image 
              src="/logo-full.png" 
              alt="BioFolio" 
              width={120} 
              height={80} 
              className="h-8 w-auto"
            />
          </Link>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <motion.header 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative pt-20 pb-16 px-6"
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500/20 to-emerald-500/10 rounded-3xl border border-green-500/20 mb-8"
          >
            <Shield className="w-10 h-10 text-green-400" />
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-white mb-4"
          >
            Privacy Policy
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-gray-400 text-lg"
          >
            Biofolio.link
          </motion.p>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-gray-600 text-sm mt-4"
          >
            Last updated: December 18, 2025
          </motion.p>
        </div>
      </motion.header>

      {/* Introduction */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="max-w-4xl mx-auto px-6 pb-12"
      >
        <div className="bg-gradient-to-br from-white/[0.03] to-transparent rounded-2xl border border-white/10 p-8">
          <p className="text-gray-300 leading-relaxed">
            Biofolio.link ("Biofolio", "we", "our") respects your privacy. This Privacy Policy explains what information we collect, why we collect it, and how we handle it when you use our website and services.
          </p>
        </div>
      </motion.section>

      {/* Policy Sections */}
      <motion.main 
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="max-w-4xl mx-auto px-6 pb-20"
      >
        <div className="space-y-6">
          {sections.map((section, index) => (
            <motion.section
              key={index}
              variants={fadeInUp}
              className="group"
            >
              <div className="bg-gradient-to-br from-white/[0.02] to-transparent rounded-2xl border border-white/5 p-8 hover:border-green-500/20 transition-all duration-500">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center group-hover:bg-green-500/20 transition-colors duration-500">
                    <section.icon className="w-6 h-6 text-green-400" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-white mb-4 group-hover:text-green-400 transition-colors duration-300">
                      {section.title}
                    </h2>
                    <p className="text-gray-400 leading-relaxed mb-4">
                      {section.content}
                    </p>
                    {section.list.length > 0 && (
                      <ul className="space-y-2 mb-4">
                        {section.list.map((item, i) => (
                          <motion.li 
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            viewport={{ once: true }}
                            className="flex items-start gap-3 text-gray-400"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 flex-shrink-0"></span>
                            <span>{item}</span>
                          </motion.li>
                        ))}
                      </ul>
                    )}
                    {section.note && (
                      <p className="text-green-400/80 text-sm font-medium bg-green-500/5 px-4 py-2 rounded-lg inline-block">
                        {section.note}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </motion.section>
          ))}

          {/* Contact Section */}
          <motion.section
            variants={fadeInUp}
            className="group"
          >
            <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/5 rounded-2xl border border-green-500/20 p-8">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                  <Mail className="w-6 h-6 text-green-400" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-white mb-4">
                    9. Contact
                  </h2>
                  <p className="text-gray-400 leading-relaxed mb-4">
                    If you have questions about this Privacy Policy or your data, contact us at:
                  </p>
                  <a 
                    href="mailto:support@biofolio.link" 
                    className="inline-flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors font-medium"
                  >
                    <Mail className="w-4 h-4" />
                    support@biofolio.link
                  </a>
                </div>
              </div>
            </div>
          </motion.section>
        </div>
      </motion.main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 text-center">
        <p className="text-gray-600 text-sm">
          © 2025 BioFolio. Developed by{' '}
          <a href="https://angeloasante.com" target="_blank" rel="noopener noreferrer" className="text-green-400 hover:text-green-300 transition-colors">
            Travis Moore (Angelo Asante)
          </a>
        </p>
      </footer>
    </div>
  )
}
